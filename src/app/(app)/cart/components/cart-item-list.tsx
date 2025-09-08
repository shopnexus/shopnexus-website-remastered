"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, ShoppingBag } from "lucide-react"
import { CartItemCard } from "./cart-item-card"
import { CartItemListProps } from "./cart-types"

export function CartItemList({
	items,
	onUpdateQuantity,
	onRemoveItem,
	onClearCart,
}: CartItemListProps) {
	const getTotalItems = () =>
		items.reduce((sum, item) => sum + item.quantity, 0)

	return (
		<Card className="shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
				<CardTitle className="flex items-center space-x-2">
					<ShoppingBag className="h-5 w-5" />
					<span>Cart Items ({getTotalItems()} items)</span>
				</CardTitle>

				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="text-destructive hover:text-destructive"
						>
							<Trash2 className="h-4 w-4 mr-2" />
							Clear All
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Clear Shopping Cart</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to remove all items from your cart? This
								action cannot be undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={onClearCart}
								className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							>
								Clear All
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</CardHeader>

			<CardContent className="space-y-4">
				{items.map((item, index) => (
					<div key={item.id}>
						<CartItemCard
							item={item}
							onUpdateQuantity={onUpdateQuantity}
							onRemoveItem={onRemoveItem}
						/>
						{index < items.length - 1 && <div className="border-t mt-4 pt-4" />}
					</div>
				))}
			</CardContent>
		</Card>
	)
}
