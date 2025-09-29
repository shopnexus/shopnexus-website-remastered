"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
	ShoppingCart,
	CreditCard,
	FileText,
	Tag,
	Truck,
	Shield,
} from "lucide-react"
import Link from "next/link"
import { CartSummaryProps, CartItem } from "./cart-types"
import { useCurrency } from "@/components/currency/currency-context"
import { useState } from "react"

export function CartSummary({ items, selectedItems }: CartSummaryProps) {
	const [couponCode, setCouponCode] = useState("")
	const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
	const { formatCurrency, convertFromUSDT } = useCurrency()

	const getItemPrice = (item: CartItem) => {
		if (
			item.bulk_price &&
			item.bulk_threshold &&
			item.quantity >= item.bulk_threshold
		) {
			return item.bulk_price
		}
		return item.price
	}

	// Use selectedItems if provided, otherwise use all items
	const itemsToCalculate =
		selectedItems && selectedItems.length > 0 ? selectedItems : items

	const getTotalItems = () =>
		itemsToCalculate.reduce((sum, item) => sum + item.quantity, 0)

	const getSubtotal = () =>
		itemsToCalculate.reduce((sum, item) => sum + item.price * item.quantity, 0)

	const getBulkSavings = () =>
		itemsToCalculate.reduce((sum, item) => {
			if (
				item.bulk_price &&
				item.bulk_threshold &&
				item.quantity >= item.bulk_threshold
			) {
				return sum + (item.price - item.bulk_price) * item.quantity
			}
			return sum
		}, 0)

	const getTotal = () =>
		itemsToCalculate.reduce(
			(sum, item) => sum + getItemPrice(item) * item.quantity,
			0
		)

	const getCouponDiscount = () => {
		if (appliedCoupon === "SAVE10") return getTotal() * 0.1
		if (appliedCoupon === "BULK20") return getTotal() * 0.2
		return 0
	}

	const getFinalTotal = () => getTotal() - getCouponDiscount()

	const getEstimatedShipping = () => {
		const total = getFinalTotal()
		if (total >= 42) return 0 // Free shipping over 42 USDT (≈1M VND)
		return 2.08 // 2.08 USDT shipping (≈50k VND)
	}

	const handleApplyCoupon = () => {
		if (
			couponCode.toUpperCase() === "SAVE10" ||
			couponCode.toUpperCase() === "BULK20"
		) {
			setAppliedCoupon(couponCode.toUpperCase())
			setCouponCode("")
		} else {
			// Handle invalid coupon
			alert("Invalid coupon code!")
		}
	}

	const totalItems = getTotalItems()
	const subtotal = getSubtotal()
	const bulkSavings = getBulkSavings()
	const couponDiscount = getCouponDiscount()
	const estimatedShipping = getEstimatedShipping()
	const finalTotal = getFinalTotal() + estimatedShipping

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

					{/* Bulk Savings */}
					{bulkSavings > 0 && (
						<div className="flex justify-between text-sm text-green-600">
							<span className="flex items-center gap-1">
								<Tag className="h-3 w-3" />
								Bulk Discount
							</span>
							<span>-{formatCurrency(bulkSavings)}</span>
						</div>
					)}

					{/* Coupon Discount */}
					{couponDiscount > 0 && (
						<div className="flex justify-between text-sm text-green-600">
							<span className="flex items-center gap-1">
								<Tag className="h-3 w-3" />
								Coupon ({appliedCoupon})
							</span>
							<span>-{formatCurrency(couponDiscount)}</span>
						</div>
					)}

					<Separator />

					<div className="flex justify-between text-sm">
						<span>Subtotal</span>
						<span>
							{formatCurrency(subtotal - bulkSavings - couponDiscount)}
						</span>
					</div>

					{/* Shipping */}
					<div className="flex justify-between text-sm">
						<span className="flex items-center gap-1">
							<Truck className="h-3 w-3" />
							Shipping
						</span>
						<span className={estimatedShipping === 0 ? "text-green-600" : ""}>
							{estimatedShipping === 0
								? "Free"
								: formatCurrency(estimatedShipping)}
						</span>
					</div>

					{estimatedShipping > 0 && (
						<div className="text-xs text-muted-foreground bg-blue-50 p-2 rounded">
							💡 Spend{" "}
							{formatCurrency(42 - (subtotal - bulkSavings - couponDiscount))}{" "}
							more for free shipping
						</div>
					)}

					<Separator />

					<div className="flex justify-between text-lg font-semibold">
						<span>Total</span>
						<span className="text-primary">{formatCurrency(finalTotal)}</span>
					</div>
				</CardContent>
			</Card>

			{/* Coupon Code */}
			<Card className="shadow-sm">
				<CardHeader>
					<CardTitle className="text-base">Coupon Code</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					{appliedCoupon ? (
						<div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
							<span className="text-sm text-green-700 font-medium">
								Applied: {appliedCoupon}
							</span>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setAppliedCoupon(null)}
								className="text-green-700 hover:text-green-800"
							>
								Remove
							</Button>
						</div>
					) : (
						<div className="flex gap-2">
							<Input
								placeholder="Enter coupon code"
								value={couponCode}
								onChange={(e) => setCouponCode(e.target.value)}
								className="flex-1"
							/>
							<Button
								variant="outline"
								onClick={handleApplyCoupon}
								disabled={!couponCode.trim()}
							>
								Apply
							</Button>
						</div>
					)}

					<div className="text-xs text-muted-foreground">
						Available codes: SAVE10 (10%), BULK20 (20%)
					</div>
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
						href={`/checkout${
							selectedItems && selectedItems.length > 0
								? `?selected=${selectedItems
										.map((item) => item.sku_id)
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
