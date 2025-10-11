"use client"

import { useState, useMemo } from "react"
import { PageHeader } from "../components/page-header"
import { OrderTable } from "./components/order-table"
import { OrderDetailDialog } from "./components/order-detail-dialog"
import { mockOrders, MockOrder } from "../components/mock-data"
import { toast } from "sonner"
import {
	Download,
	Upload,
	Filter,
	RefreshCw,
	BarChart3,
	Settings,
	Eye,
	Copy,
	Truck,
	Clock,
	CheckCircle,
	AlertTriangle,
} from "lucide-react"

export default function OrdersPage() {
	const [orders, setOrders] = useState<MockOrder[]>(mockOrders)
	const [selectedOrder, setSelectedOrder] = useState<MockOrder | null>(null)
	const [showDetailDialog, setShowDetailDialog] = useState(false)

	// Calculate stats
	const stats = useMemo(() => {
		const totalOrders = orders.length
		const pendingOrders = orders.filter(
			(order) => order.payment_status === "Pending"
		).length
		const processingOrders = orders.filter(
			(order) => order.payment_status === "Processing"
		).length
		const completedOrders = orders.filter(
			(order) => order.payment_status === "Success"
		).length
		const totalRevenue = orders.reduce(
			(sum, order) => sum + order.total_amount,
			0
		)
		const avgOrderValue = totalRevenue / totalOrders
		const urgentOrders = orders.filter(
			(order) => order.priority === "Urgent" || order.priority === "High"
		).length

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

	const handleConfirmItem = (orderId: number, itemId: number) => {
		setOrders((prev) =>
			prev.map((order) =>
				order.id === orderId
					? {
							...order,
							items: order.items.map((item) =>
								item.id === itemId
									? {
											...item,
											confirmed_by_id: 1,
											status: "Processing" as const,
									  }
									: item
							),
					  }
					: order
			)
		)
		toast.success("Order item confirmed")
	}

	const handleUpdateItemStatus = (
		orderId: number,
		itemId: number,
		newStatus: MockOrder["items"][0]["status"]
	) => {
		setOrders((prev) =>
			prev.map((order) =>
				order.id === orderId
					? {
							...order,
							items: order.items.map((item) =>
								item.id === itemId ? { ...item, status: newStatus } : item
							),
					  }
					: order
			)
		)
		toast.success(`Order item status updated to ${newStatus}`)
	}

	const handleExport = () => {
		toast.info("Export functionality would be implemented")
	}

	const handleImport = () => {
		toast.info("Import functionality would be implemented")
	}

	const handleRefresh = () => {
		toast.info("Data refreshed")
	}

	const handleViewAnalytics = () => {
		toast.info("Analytics view would be implemented")
	}

	const handleSettings = () => {
		toast.info("Settings would be implemented")
	}

	const handleBulkAction = (action: string) => {
		toast.info(`Bulk ${action} action would be implemented`)
	}

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
