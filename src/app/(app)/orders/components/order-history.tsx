"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Search, Eye, Download, Filter } from "lucide-react"

interface OrderItem {
	sku_id: string
	name: string
	sku_name: string
	price: number
	quantity: number
	resource: {
		url: string
	}
}

interface Order {
	id: string
	date: string
	status: "processing" | "shipped" | "delivered" | "cancelled"
	total: number
	items: OrderItem[]
	purchaseOrder?: string
}

const sampleOrders: Order[] = [
	{
		id: "ORD-2024-001",
		date: "2024-01-15",
		status: "delivered",
		total: 2599.75,
		items: [
			{
				sku_id: "SKU-001",
				name: "Professional Office Chair - Ergonomic Design",
				sku_name: "Black Leather, Adjustable Height",
				price: 249.99,
				quantity: 8,
				resource: { url: "/professional-office-chair.jpg" },
			},
			{
				sku_id: "SKU-002",
				name: "Premium Paper Pack - 5000 Sheets",
				sku_name: "A4 White, 80gsm",
				price: 39.99,
				quantity: 25,
				resource: { url: "/office-paper-stack.jpg" },
			},
		],
		purchaseOrder: "PO-2024-001",
	},
	{
		id: "ORD-2024-002",
		date: "2024-01-18",
		status: "shipped",
		total: 1299.99,
		items: [
			{
				sku_id: "SKU-003",
				name: "Standing Desk Converter - Electric",
				sku_name: "Black, 32-48 inch width",
				price: 1299.99,
				quantity: 1,
				resource: { url: "/standing-desk-converter.png" },
			},
		],
	},
	{
		id: "ORD-2024-003",
		date: "2024-01-20",
		status: "processing",
		total: 899.5,
		items: [
			{
				sku_id: "SKU-004",
				name: "Office Supplies Starter Kit",
				sku_name: "Complete bundle with pens, notebooks, folders",
				price: 59.97,
				quantity: 15,
				resource: { url: "/office-supplies-kit.png" },
			},
		],
		purchaseOrder: "PO-2024-002",
	},
	{
		id: "ORD-2024-004",
		date: "2024-01-22",
		status: "delivered",
		total: 3299.99,
		items: [
			{
				sku_id: "SKU-005",
				name: "Modern Office Furniture Set",
				sku_name: "Desk + Chair + Storage combo",
				price: 412.5,
				quantity: 8,
				resource: { url: "/modern-office-furniture.png" },
			},
		],
	},
]

export function OrderHistory() {
	const [orders] = useState<Order[]>(sampleOrders)
	const [searchTerm, setSearchTerm] = useState("")
	const [statusFilter, setStatusFilter] = useState("all")

	const filteredOrders = orders.filter((order) => {
		const matchesSearch =
			order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(order.purchaseOrder &&
				order.purchaseOrder.toLowerCase().includes(searchTerm.toLowerCase()))

		const matchesStatus =
			statusFilter === "all" || order.status === statusFilter

		return matchesSearch && matchesStatus
	})

	const getStatusColor = (status: Order["status"]) => {
		switch (status) {
			case "processing":
				return "bg-blue-500"
			case "shipped":
				return "bg-orange-500"
			case "delivered":
				return "bg-green-500"
			case "cancelled":
				return "bg-red-500"
			default:
				return "bg-gray-500"
		}
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold text-balance">Order History</h1>
				<p className="text-muted-foreground text-pretty">
					View and manage all your business orders
				</p>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Filter className="h-5 w-5" />
						<span>Filter Orders</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search by order ID or PO number..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-full sm:w-48">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Orders</SelectItem>
								<SelectItem value="processing">Processing</SelectItem>
								<SelectItem value="shipped">Shipped</SelectItem>
								<SelectItem value="delivered">Delivered</SelectItem>
								<SelectItem value="cancelled">Cancelled</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Orders Table */}
			<Card>
				<CardHeader>
					<CardTitle>Your Orders ({filteredOrders.length})</CardTitle>
					<CardDescription>
						{filteredOrders.length === orders.length
							? "Showing all orders"
							: `Showing ${filteredOrders.length} of ${orders.length} orders`}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Order ID</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Items</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Total</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredOrders.map((order) => (
									<TableRow key={order.id}>
										<TableCell className="font-medium">{order.id}</TableCell>
										<TableCell>
											{new Date(order.date).toLocaleDateString()}
										</TableCell>
										<TableCell className="max-w-md">
											<div className="space-y-2">
												{order.items.slice(0, 2).map((item) => (
													<div
														key={item.sku_id}
														className="flex items-center space-x-2"
													>
														<div className="relative h-10 w-10 overflow-hidden rounded border flex-shrink-0">
															<img
																src={item.resource.url || "/placeholder.svg"}
																alt={item.name}
																className="h-full w-full object-cover"
															/>
														</div>
														<div className="flex-1 min-w-0">
															<p className="text-xs font-medium truncate">
																{item.name}
															</p>
															<p className="text-xs text-muted-foreground">
																Qty: {item.quantity} • $
																{(item.price * item.quantity).toFixed(2)}
															</p>
														</div>
													</div>
												))}
												{order.items.length > 2 && (
													<p className="text-xs text-muted-foreground">
														+{order.items.length - 2} more items
													</p>
												)}
											</div>
										</TableCell>
										<TableCell>
											<Badge variant="secondary" className="capitalize">
												{order.status}
											</Badge>
										</TableCell>
										<TableCell className="font-medium">
											${order.total.toFixed(2)}
										</TableCell>
										<TableCell>
											<div className="flex items-center space-x-2">
												<Button variant="ghost" size="sm" asChild>
													<Link href={`/orders/${order.id}`}>
														<Eye className="h-4 w-4" />
													</Link>
												</Button>
												<Button variant="ghost" size="sm">
													<Download className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					{filteredOrders.length === 0 && (
						<div className="text-center py-8">
							<p className="text-muted-foreground">
								No orders found matching your criteria.
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
