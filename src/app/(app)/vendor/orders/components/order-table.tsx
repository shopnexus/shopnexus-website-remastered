"use client"

import { useState } from "react"
import { DataTable, Column } from "../../components/data-table"
import { StatusBadge } from "../../components/status-badge"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { MockOrder } from "@/lib/mocks/mock-data"
import {
	Eye,
	CheckCircle,
	Truck,
	Clock,
	MapPin,
	Phone,
	Mail,
	AlertTriangle,
	Package,
	Copy,
	ExternalLink,
	Calendar,
} from "lucide-react"

interface OrderTableProps {
	orders: MockOrder[]
	onViewDetails: (order: MockOrder) => void
	onConfirmItem: (orderId: number, itemId: number) => void
	onUpdateItemStatus: (
		orderId: number,
		itemId: number,
		status: MockOrder["items"][0]["status"]
	) => void
}

export function OrderTable({
	orders,
	onViewDetails,
	onConfirmItem,
	onUpdateItemStatus,
}: OrderTableProps) {
	const [statusFilter, setStatusFilter] = useState<string>("all")

	const filteredOrders = orders.filter(
		(order) => statusFilter === "all" || order.payment_status === statusFilter
	)

	const orderColumns: Column<MockOrder>[] = [
		{
			key: "order_number",
			label: "Order",
			render: (value: string, order: MockOrder) => (
				<div className="space-y-1">
					<div className="font-medium">{value}</div>
					<div className="text-xs text-muted-foreground">#{order.id}</div>
					{order.priority !== "Normal" && (
						<Badge
							variant={
								order.priority === "Urgent"
									? "destructive"
									: order.priority === "High"
									? "default"
									: "secondary"
							}
							className="text-xs"
						>
							{order.priority}
						</Badge>
					)}
				</div>
			),
			className: "w-32",
		},
		{
			key: "customer_name",
			label: "Customer",
			render: (value: string, order: MockOrder) => (
				<div className="space-y-1">
					<div className="font-medium">{value}</div>
					<div className="text-xs text-muted-foreground flex items-center gap-1">
						<Mail className="h-3 w-3" />
						{order.customer_email}
					</div>
					{order.customer_phone && (
						<div className="text-xs text-muted-foreground flex items-center gap-1">
							<Phone className="h-3 w-3" />
							{order.customer_phone}
						</div>
					)}
				</div>
			),
			sortable: true,
		},
		{
			key: "shipping_status",
			label: "Status",
			render: (shippingStatus: string, order: MockOrder) => (
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<StatusBadge status={order.payment_status} />
						{order.payment_status === "Success" && (
							<StatusBadge status={shippingStatus} />
						)}
					</div>
					{order.tracking_number && (
						<div className="text-xs text-muted-foreground flex items-center gap-1">
							<Truck className="h-3 w-3" />
							{order.tracking_number}
						</div>
					)}
				</div>
			),
		},
		// {
		// 	key: "shipping_address",
		// 	label: "Shipping",
		// 	render: (address: MockOrder["shipping_address"]) => (
		// 		<div className="space-y-1">
		// 			<div className="text-sm font-medium">
		// 				{address.city}, {address.state}
		// 			</div>
		// 			<div className="text-xs text-muted-foreground flex items-center gap-1">
		// 				<MapPin className="h-3 w-3" />
		// 				{address.zip}
		// 			</div>
		// 		</div>
		// 	),
		// },
		{
			key: "date_created",
			label: "Date",
			render: (value: string, order: MockOrder) => (
				<div className="space-y-1">
					<div className="text-sm">{new Date(value).toLocaleDateString()}</div>
					{order.estimated_delivery && (
						<div className="text-xs text-muted-foreground flex items-center gap-1">
							<Calendar className="h-3 w-3" />
							Est: {new Date(order.estimated_delivery).toLocaleDateString()}
						</div>
					)}
				</div>
			),
			sortable: true,
		},
	]

	return (
		<div className="space-y-4">
			{/* Filters */}
			<div className="flex items-center gap-4 flex-wrap">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium">Payment Status:</span>
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="Pending">Pending</SelectItem>
							<SelectItem value="Processing">Processing</SelectItem>
							<SelectItem value="Success">Paid</SelectItem>
							<SelectItem value="Canceled">Canceled</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* <div className="flex items-center gap-2">
					<span className="text-sm font-medium">Priority:</span>
					<Select defaultValue="all">
						<SelectTrigger className="w-32">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All</SelectItem>
							<SelectItem value="Urgent">Urgent</SelectItem>
							<SelectItem value="High">High</SelectItem>
							<SelectItem value="Normal">Normal</SelectItem>
							<SelectItem value="Low">Low</SelectItem>
						</SelectContent>
					</Select>
				</div> */}

				<div className="flex items-center gap-2">
					<span className="text-sm font-medium">Shipping:</span>
					<Select defaultValue="all">
						<SelectTrigger className="w-32">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All</SelectItem>
							<SelectItem value="Pending">Pending</SelectItem>
							<SelectItem value="Processing">Processing</SelectItem>
							<SelectItem value="Shipped">Shipped</SelectItem>
							<SelectItem value="Delivered">Delivered</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<DataTable
				className="min-w-3xl"
				data={filteredOrders}
				columns={orderColumns}
				searchKey="customer_name"
				searchPlaceholder="Search by customer name..."
				actions={(order) => (
					<div className="flex items-center gap-1">
						<Button
							size="sm"
							variant="ghost"
							onClick={() => onViewDetails(order)}
							title="View Details"
						>
							<Eye className="h-4 w-4" />
						</Button>
						{order.tracking_number && (
							<Button
								size="sm"
								variant="ghost"
								onClick={() => {
									/* Mock track order */
								}}
								title="Track Order"
							>
								<Truck className="h-4 w-4" />
							</Button>
						)}
					</div>
				)}
			/>
		</div>
	)
}
