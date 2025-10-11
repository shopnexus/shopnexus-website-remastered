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
import { MockOrder } from "../../components/mock-data"
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
		{
			key: "shipping_address",
			label: "Shipping",
			render: (address: MockOrder["shipping_address"]) => (
				<div className="space-y-1">
					<div className="text-sm font-medium">
						{address.city}, {address.state}
					</div>
					<div className="text-xs text-muted-foreground flex items-center gap-1">
						<MapPin className="h-3 w-3" />
						{address.zip}
					</div>
				</div>
			),
		},
		{
			key: "total_amount",
			label: "Total",
			render: (value: number, order: MockOrder) => (
				<div className="space-y-1">
					<div className="font-medium">${value.toLocaleString()}</div>
					<div className="text-xs text-muted-foreground flex items-center gap-1">
						<Package className="h-3 w-3" />
						{order.total_items} items
					</div>
				</div>
			),
			sortable: true,
		},
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

	const renderExpandedRow = (order: MockOrder) => (
		<Card className="m-4">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg">
						Order Details - {order.order_number}
					</CardTitle>
					<div className="flex items-center gap-2">
						{order.tracking_number && (
							<Button
								size="sm"
								variant="outline"
								onClick={() => {
									/* Mock track order */
								}}
							>
								<Truck className="h-4 w-4 mr-2" />
								Track Order
							</Button>
						)}
						<Button
							size="sm"
							variant="outline"
							onClick={() => {
								/* Mock copy order number */
							}}
						>
							<Copy className="h-4 w-4 mr-2" />
							Copy Order #
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Order Items */}
				<div>
					<h4 className="font-medium mb-3">Order Items</h4>
					<div className="space-y-3">
						{order.items.map((item) => (
							<div
								key={item.id}
								className="flex items-center justify-between p-4 border rounded-lg"
							>
								<div className="flex items-center gap-4 flex-1">
									{item.product_image && (
										<Avatar className="h-12 w-12">
											<AvatarImage
												src={item.product_image}
												alt={item.sku_name}
											/>
											<AvatarFallback>
												<Package className="h-4 w-4" />
											</AvatarFallback>
										</Avatar>
									)}
									<div className="flex-1">
										<div className="font-medium">{item.sku_name}</div>
										<div className="text-sm text-muted-foreground">
											SKU #{item.sku_id}
										</div>
										<div className="flex items-center gap-4 mt-1">
											<Badge variant="outline">Qty: {item.quantity}</Badge>
											<span className="text-sm">
												${item.price.toLocaleString()} each
											</span>
											{item.weight && (
												<span className="text-xs text-muted-foreground">
													Weight: {item.weight}kg
												</span>
											)}
										</div>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<StatusBadge status={item.status} />

									{item.status === "Pending" && !item.confirmed_by_id && (
										<Button
											size="sm"
											onClick={() => onConfirmItem(order.id, item.id)}
											className="flex items-center gap-1"
										>
											<CheckCircle className="h-4 w-4" />
											Confirm
										</Button>
									)}

									{item.status !== "Success" && item.status !== "Canceled" && (
										<Select
											value=""
											onValueChange={(value) =>
												onUpdateItemStatus(
													order.id,
													item.id,
													value as MockOrder["items"][0]["status"]
												)
											}
										>
											<SelectTrigger className="w-32 h-8">
												<SelectValue placeholder="Update" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="Processing">Processing</SelectItem>
												<SelectItem value="Success">Complete</SelectItem>
												<SelectItem value="Canceled">Cancel</SelectItem>
											</SelectContent>
										</Select>
									)}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Order Timeline */}
				<div>
					<h4 className="font-medium mb-3">Order Timeline</h4>
					<div className="space-y-2">
						<div className="flex items-center gap-3 text-sm">
							<Clock className="h-4 w-4 text-blue-500" />
							<span>
								Order placed on {new Date(order.date_created).toLocaleString()}
							</span>
						</div>
						{order.items.some((item) => item.confirmed_at) && (
							<div className="flex items-center gap-3 text-sm">
								<CheckCircle className="h-4 w-4 text-green-500" />
								<span>
									Items confirmed on{" "}
									{new Date(
										order.items.find((item) => item.confirmed_at)
											?.confirmed_at || ""
									).toLocaleString()}
								</span>
							</div>
						)}
						{order.items.some((item) => item.shipped_at) && (
							<div className="flex items-center gap-3 text-sm">
								<Truck className="h-4 w-4 text-orange-500" />
								<span>
									Items shipped on{" "}
									{new Date(
										order.items.find((item) => item.shipped_at)?.shipped_at ||
											""
									).toLocaleString()}
								</span>
							</div>
						)}
						{order.items.some((item) => item.delivered_at) && (
							<div className="flex items-center gap-3 text-sm">
								<CheckCircle className="h-4 w-4 text-green-600" />
								<span>
									Items delivered on{" "}
									{new Date(
										order.items.find((item) => item.delivered_at)
											?.delivered_at || ""
									).toLocaleString()}
								</span>
							</div>
						)}
					</div>
				</div>

				{/* Notes */}
				{order.notes && (
					<div>
						<h4 className="font-medium mb-2">Order Notes</h4>
						<div className="p-3 bg-muted rounded-lg text-sm">{order.notes}</div>
					</div>
				)}
			</CardContent>
		</Card>
	)

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

				<div className="flex items-center gap-2">
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
				</div>

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
				data={filteredOrders}
				columns={orderColumns}
				searchKey="customer_name"
				searchPlaceholder="Search by customer name..."
				expandable
				renderExpandedRow={renderExpandedRow}
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
						<Button
							size="sm"
							variant="ghost"
							onClick={() => {
								/* Mock duplicate order */
							}}
							title="Duplicate Order"
						>
							<Copy className="h-4 w-4" />
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
