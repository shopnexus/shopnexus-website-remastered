"use client"

import { useEffect, useMemo, useState } from "react"
import { PageHeader } from "../components/page-header"
import { OrderTable } from "./components/order-table"
import { OrderDetailDialog } from "./components/order-detail-dialog"
import { MockOrder } from "../components/mock-data"
import { toast } from "sonner"
import { Download, RefreshCw, BarChart3, Settings } from "lucide-react"
import {
	useConfirmOrder,
	useListVendorOrders,
	TOrder,
} from "@/core/order/order.vendor"
import { Status } from "@/core/shared/status.type"

export default function OrdersPage() {
	const { data, refetch } = useListVendorOrders({ limit: 20 })
	const [orders, setOrders] = useState<MockOrder[]>([])
	const [selectedOrder, setSelectedOrder] = useState<MockOrder | null>(null)
	const [showDetailDialog, setShowDetailDialog] = useState(false)
	const confirmMutation = useConfirmOrder()

	// Transform BE data -> UI mock shape expected by table/dialog
	const transformedOrders = useMemo(() => {
		const pages = data?.pages ?? []
		const flat: TOrder[] = pages.flatMap((p) => p.data)
		const byOrderId = new Map<number, MockOrder>()

		for (const item of flat) {
			const orderId = item.order_id
			if (!byOrderId.has(orderId)) {
				byOrderId.set(orderId, {
					id: orderId,
					order_number: `ORD-${orderId}`,
					customer_name: `Customer #${orderId}`,
					customer_email: "",
					payment_status: item.status,
					shipping_status: Status.Pending,
					total_items: 0,
					total_amount: 0,
					shipping_address: {
						street: "",
						city: "",
						state: "",
						zip: "",
						country: "",
					},
					date_created: new Date().toISOString(),
					date_updated: new Date().toISOString(),
					items: [],
					priority: "Normal",
				})
			}

			const current = byOrderId.get(orderId)!
			current.items.push({
				id: item.id,
				sku_name: `SKU #${item.sku_id}`,
				sku_id: item.sku_id,
				quantity: item.quantity,
				price: 0,
				status: item.status,
				confirmed_by_id: item.confirmed_by_id ?? undefined,
			})
		}

		// finalize totals
		for (const order of byOrderId.values()) {
			order.total_items = order.items.reduce((s, it) => s + it.quantity, 0)
			order.total_amount = order.items.reduce(
				(s, it) => s + it.quantity * it.price,
				0
			)
		}

		return Array.from(byOrderId.values())
	}, [data])

	// keep local UI state in sync for components expecting stateful array
	useEffect(() => {
		setOrders(transformedOrders)
	}, [transformedOrders])

	// Calculate stats
	const stats = useMemo(() => {
		const totalOrders = orders.length
		const pendingOrders = orders.filter(
			(order) => order.payment_status === "Pending"
		).length
		const totalRevenue = orders.reduce(
			(sum, order) => sum + order.total_amount,
			0
		)
		const avgOrderValue = totalRevenue / totalOrders

		return [
			{
				label: "Total Orders",
				value: totalOrders,
				change: 15,
				trend: "up" as const,
			},
			{
				label: "Pending Orders",
				value: pendingOrders,
				change: -5,
				trend: "down" as const,
			},
			{
				label: "Total Revenue",
				value: `$${totalRevenue.toLocaleString()}`,
				change: 22,
				trend: "up" as const,
			},
			{
				label: "Avg Order Value",
				value: `$${avgOrderValue.toFixed(0)}`,
				change: 8,
				trend: "up" as const,
			},
		]
	}, [orders])

	const handleViewDetails = (order: MockOrder) => {
		setSelectedOrder(order)
		setShowDetailDialog(true)
	}

	const handleConfirmItem = async (orderId: number, itemId: number) => {
		try {
			const theOrder = orders.find((o) => o.id === orderId)
			const theItem = theOrder?.items.find((i) => i.id === itemId)
			if (!theItem) throw new Error("Item not found")

			await confirmMutation.mutateAsync({
				order_item_id: theItem.id,
				weight_grams: theItem.weight ? Math.round(theItem.weight * 1000) : 1000,
				length_cm: theItem.dimensions?.length ?? 10,
				width_cm: theItem.dimensions?.width ?? 10,
				height_cm: theItem.dimensions?.height ?? 10,
			})

			toast.success("Order item confirmed")
			await refetch()
		} catch {
			toast.error("Failed to confirm order item")
		}
	}

	const handleUpdateItemStatus = (
		orderId: number,
		itemId: number,
		newStatus: MockOrder["items"][0]["status"]
	) => {
		void orderId
		void itemId
		void newStatus
		// Optional: implement status update via BE when endpoint is ready
		toast.info(`Order item status update is not yet supported`)
	}

	const handleExport = () => {
		toast.info("Export functionality would be implemented")
	}

	// const handleImport = () => {}

	const handleRefresh = () => {
		toast.info("Data refreshed")
	}

	const handleViewAnalytics = () => {
		toast.info("Analytics view would be implemented")
	}

	const handleSettings = () => {
		toast.info("Settings would be implemented")
	}

	// const handleBulkAction = (action: string) => {}

	const secondaryActions = [
		{
			label: "Export",
			icon: <Download className="h-4 w-4" />,
			onClick: handleExport,
			variant: "outline" as const,
		},
		{
			label: "Analytics",
			icon: <BarChart3 className="h-4 w-4" />,
			onClick: handleViewAnalytics,
			variant: "outline" as const,
		},
		{
			label: "Refresh",
			icon: <RefreshCw className="h-4 w-4" />,
			onClick: handleRefresh,
			variant: "ghost" as const,
		},
		{
			label: "Settings",
			icon: <Settings className="h-4 w-4" />,
			onClick: handleSettings,
			variant: "ghost" as const,
		},
	]

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 py-8 mx-auto">
				<div className="container max-w-7xl">
					<PageHeader
						title="Order Management"
						description="Manage customer orders and track fulfillment"
						stats={stats}
						secondaryActions={secondaryActions}
					/>

					<OrderTable
						orders={orders}
						onViewDetails={handleViewDetails}
						onConfirmItem={handleConfirmItem}
						onUpdateItemStatus={handleUpdateItemStatus}
					/>

					{showDetailDialog && selectedOrder && (
						<OrderDetailDialog
							order={selectedOrder}
							onConfirmItem={handleConfirmItem}
							onUpdateItemStatus={handleUpdateItemStatus}
							onClose={() => {
								setShowDetailDialog(false)
								setSelectedOrder(null)
							}}
						/>
					)}
				</div>
			</main>
		</div>
	)
}
