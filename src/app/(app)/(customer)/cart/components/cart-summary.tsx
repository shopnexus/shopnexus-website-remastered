"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, CreditCard, Truck, Shield } from "lucide-react"
import Link from "next/link"
import { CartSummaryProps } from "./cart-types"
import { useCurrency } from "@/components/currency/currency-context"

export function CartSummary({ items, selectedItems }: CartSummaryProps) {
	const { formatCurrency } = useCurrency()

	// Use selectedItems if provided, otherwise use all items
	const itemsToCalculate =
		selectedItems && selectedItems.length > 0 ? selectedItems : items

	const getTotalItems = () =>
		itemsToCalculate.reduce((sum, item) => sum + item.quantity, 0)

	const getSubtotal = () =>
		itemsToCalculate.reduce((sum, item) => sum + item.sku.price * item.quantity, 0)

	const totalItems = getTotalItems()
	const subtotal = getSubtotal()

	// Show message if no items are selected
	if (selectedItems && selectedItems.length === 0) {
		return (
			<div className="space-y-4">
				<Card className="shadow-sm">
					<CardContent className="p-6 text-center">
						<ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
						<h3 className="text-lg font-medium mb-2">No Items Selected</h3>
						<p className="text-muted-foreground">
							Please select items from your cart to proceed with checkout.
						</p>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="space-y-4">
			{/* Order Summary */}
			<Card className="shadow-sm">
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<ShoppingCart className="h-5 w-5" />
						<span>
							Order Summary
							{selectedItems && (
								<span className="text-sm text-muted-foreground ml-2">
									({selectedItems.length} selected)
								</span>
							)}
						</span>
					</CardTitle>
				</CardHeader>

				<CardContent className="space-y-4">
					{/* Items Count */}
					<div className="flex justify-between text-sm">
						<span>Items ({totalItems})</span>
						<span>{formatCurrency(subtotal)}</span>
					</div>

					<Separator />

					<div className="flex justify-between text-sm">
						<span>Subtotal</span>
						<span>{formatCurrency(subtotal)}</span>
					</div>

					{/* Shipping */}
					<div className="flex justify-between text-sm">
						<span className="flex items-center gap-1">
							<Truck className="h-3 w-3" />
							Shipping
						</span>
						<span className="text-muted-foreground">
							Calculated at checkout
						</span>
					</div>

					<Separator />

					<div className="flex justify-between text-lg font-semibold">
						<span>Estimated Total</span>
						<span className="text-primary">{formatCurrency(subtotal)}</span>
					</div>
					<p className="text-xs text-muted-foreground">
						Shipping costs will be calculated based on your delivery address
					</p>
				</CardContent>
			</Card>

			{/* Action Buttons */}
			<div className="space-y-3">
				<Button
					className="w-full h-12 text-lg font-medium"
					asChild
					disabled={selectedItems && selectedItems.length === 0}
				>
					<Link
						href={`/checkout${selectedItems && selectedItems.length > 0
								? `?selected=${selectedItems
									.map((item) => item.sku.id)
									.join(",")}`
								: ""
							}`}
					>
						<CreditCard className="h-5 w-5 mr-2" />
						Checkout
						{selectedItems && selectedItems.length > 0 && (
							<span className="text-sm">({selectedItems.length} items)</span>
						)}
					</Link>
				</Button>

				{/* <Button variant="outline" className="w-full" asChild>
					<Link href="/bulk-orders">
						<FileText className="h-4 w-4 mr-2" />
						Request Bulk Quote
					</Link>
				</Button> */}
			</div>

			{/* Security Badge */}
			<div className="flex items-center justify-center gap-2 text-xs text-muted-foreground p-3 bg-muted/30 rounded-md">
				<Shield className="h-4 w-4" />
				<span>Secure & Safe Payment</span>
			</div>
		</div>
	)
}
