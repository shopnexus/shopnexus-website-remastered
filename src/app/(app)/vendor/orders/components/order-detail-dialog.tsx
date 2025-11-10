"use client"

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "../../components/status-badge"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { MockOrder } from "../../components/mock-data"
import { AlertTriangle, CheckCircle } from "lucide-react"

interface OrderDetailDialogProps {
	order: MockOrder
	onConfirmItem: (orderId: number, itemId: number) => void
	onUpdateItemStatus: (
		orderId: number,
		itemId: number,
		status: MockOrder["items"][0]["status"]
	) => void
	onClose: () => void
}

export function OrderDetailDialog({
	order,
	onConfirmItem,
	onUpdateItemStatus,
	onClose,
}: OrderDetailDialogProps) {
	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Order Details - #{order.id}</DialogTitle>
					<DialogDescription>
						Review order information and manage item fulfillment
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Order Information */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label className="text-sm font-medium text-muted-foreground">
								Customer
							</Label>
							<p className="text-sm">{order.customer_name}</p>
						</div>
						<div>
							<Label className="text-sm font-medium text-muted-foreground">
								Payment Status
							</Label>
							<div className="mt-1">
								<StatusBadge status={order.payment_status} />
							</div>
						</div>
						<div>
							<Label className="text-sm font-medium text-muted-foreground">
								Total Items
							</Label>
							<p className="text-sm">{order.total_items}</p>
						</div>
						<div>
							<Label className="text-sm font-medium text-muted-foreground">
								Total Amount
							</Label>
							<p className="text-sm font-medium">
								${order.total_amount.toLocaleString()}
							</p>
						</div>
						<div>
							<Label className="text-sm font-medium text-muted-foreground">
								Order Date
							</Label>
							<p className="text-sm">
								{new Date(order.date_created).toLocaleDateString()}
							</p>
						</div>
					</div>

					{/* Order Items */}
					<div>
						<h3 className="text-lg font-medium mb-4">Order Items</h3>
						<div className="space-y-3">
							{order.items.map((item) => (
								<div key={item.id} className="border rounded-lg p-4">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<h4 className="font-medium">{item.sku_name}</h4>
											<div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
												<span>Quantity: {item.quantity}</span>
												<span>Price: ${item.price.toLocaleString()}</span>
												<span>
													Total: $
													{(item.price * item.quantity).toLocaleString()}
												</span>
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
										</div>
									</div>

									{item.confirmed_by_id && (
										<div className="mt-2 text-xs text-muted-foreground">
											Confirmed by vendor #{item.confirmed_by_id}
										</div>
									)}
								</div>
							))}
						</div>
					</div>

					{/* Order Summary */}
					<div className="border-t pt-4">
						<div className="flex justify-between items-center">
							<span className="text-lg font-medium">Order Total</span>
							<span className="text-xl font-bold">
								${order.total_amount.toLocaleString()}
							</span>
						</div>
					</div>
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
