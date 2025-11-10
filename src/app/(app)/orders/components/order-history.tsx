"use client"

import { useState, useMemo } from "react"
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
import { Search, Eye, Download, Filter, Package } from "lucide-react"
import { OrderItem, useListOrders } from "@/core/order/order.customer"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import {
	useGetProductSPU,
	useListProductSPU,
} from "@/core/catalog/product.vendor"

export function OrderHistory() {
	const [searchTerm, setSearchTerm] = useState("")
	const [statusFilter, setStatusFilter] = useState("all")

	const infiniteOrders = useListOrders({
		limit: 20,
		page: 1,
		...(statusFilter !== "all" && { status: statusFilter }),
	})

	const {
		ref: loadMoreRef,
		items: orders,
		isFetching,
		isLoading,
		hasNextPage,
	} = useInfiniteScroll(infiniteOrders)

	const filteredOrders = useMemo(() => {
		return orders.filter((order) => {
			const matchesSearch = order.id
				.toString()
				.toLowerCase()
				.includes(searchTerm.toLowerCase())

			return matchesSearch
		})
	}, [orders, searchTerm])

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString()
	}

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
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
									<TableHead>Payment Status</TableHead>
									<TableHead>Order Status</TableHead>
									<TableHead>Total</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoading ? (
									<TableRow>
										<TableCell colSpan={6} className="text-center py-8">
											<p className="text-muted-foreground">Loading orders...</p>
										</TableCell>
									</TableRow>
								) : filteredOrders.length === 0 ? (
									<TableRow>
										<TableCell colSpan={6} className="text-center py-8">
											<p className="text-muted-foreground">
												No orders found matching your criteria.
											</p>
										</TableCell>
									</TableRow>
								) : (
									<>
										{filteredOrders.map((order) => (
											<TableRow key={order.id}>
												<TableCell className="font-medium">
													#{order.id}
												</TableCell>
												<TableCell>{formatDate(order.date_created)}</TableCell>
												<TableCell className="max-w-md">
													<div className="space-y-2">
														{order.items.slice(0, 2).map((item) => (
															<ItemRow key={item.id} item={item} />
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
														{order.payment_status || "pending"}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge variant="secondary" className="capitalize">
														{order.items[0]?.status || "pending"}
													</Badge>
												</TableCell>
												<TableCell className="font-medium">
													{/* TODO: use invoice api */}-
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
										{hasNextPage && (
											<TableRow ref={loadMoreRef}>
												<TableCell colSpan={6} className="text-center py-4">
													{isFetching ? (
														<p className="text-muted-foreground">
															Loading more...
														</p>
													) : null}
												</TableCell>
											</TableRow>
										)}
									</>
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

function ItemRow({ item }: { item: OrderItem }) {
	// const {data: sku} = useGetProductSKU(item.sku_id)
	// const { data: spu } = useGetProductSPU(item.sku_id)

	return (
		<div key={item.id} className="flex items-center space-x-2">
			<div className="relative h-10 w-10 overflow-hidden rounded border flex-shrink-0 bg-muted flex items-center justify-center">
				<Package className="h-5 w-5 text-muted-foreground" />
			</div>
			<div className="flex-1 min-w-0">
				<p className="text-xs font-medium truncate">SKU #{item.sku_id}</p>
				<p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
			</div>
		</div>
	)
}
