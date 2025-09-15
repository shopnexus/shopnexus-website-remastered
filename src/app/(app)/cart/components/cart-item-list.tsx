"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
	onToggleSelect,
	onSelectAll,
}: CartItemListProps) {
	const getTotalItems = () =>
		items.reduce((sum, item) => sum + item.quantity, 0)

	const getSelectedItems = () => items.filter((item) => item.selected).length

	const isAllSelected = items.length > 0 && items.every((item) => item.selected)
	const isIndeterminate = items.some((item) => item.selected) && !isAllSelected

	const handleSelectAll = (checked: boolean) => {
		if (onSelectAll) {
			onSelectAll(checked)
		}
	}

	return (
		<Card className="shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
				<div className="flex items-center space-x-4">
					{onToggleSelect && (
						<Checkbox
							className="border-gray-300"
							checked={isAllSelected}
							onCheckedChange={handleSelectAll}
							ref={(el) => {
								if (el) el.indeterminate = isIndeterminate
							}}
						/>
					)}
					<CardTitle className="flex items-center space-x-2">
						<ShoppingBag className="h-5 w-5" />
						<span>
							Cart Items ({getTotalItems()} items)
							{onToggleSelect && (
								<span className="text-sm text-muted-foreground ml-2">
									({getSelectedItems()} selected)
								</span>
							)}
						</span>
					</CardTitle>
				</div>

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
					<div key={item.sku_id}>
						<CartItemCard
							item={item}
							onUpdateQuantity={onUpdateQuantity}
							onRemoveItem={onRemoveItem}
							onToggleSelect={onToggleSelect}
						/>
						{index < items.length - 1 && <div className="border-t mt-4 pt-4" />}
					</div>
				))}
			</CardContent>
		</Card>
	)
}
