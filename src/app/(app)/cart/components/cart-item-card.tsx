"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Plus, Minus, Trash2, Heart, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CartItemProps } from "./cart-types"
import { useCurrency } from "@/components/currency/currency-context"

export function CartItemCard({
	item,
	onUpdateQuantity,
	onRemoveItem,
	onToggleSelect,
}: CartItemProps) {
	const [isRemoving, setIsRemoving] = useState(false)
	const { formatCurrency } = useCurrency()

	const getItemPrice = () => {
		if (
			item.bulk_price &&
			item.bulk_threshold &&
			item.quantity >= item.bulk_threshold
		) {
			return item.bulk_price
		}
		return item.price
	}

	const currentPrice = getItemPrice()
	const isDiscounted = currentPrice < item.price
	const totalPrice = currentPrice * item.quantity
	const savings = isDiscounted ? (item.price - currentPrice) * item.quantity : 0

	const handleRemove = () => {
		setIsRemoving(true)
		setTimeout(() => {
			onRemoveItem(item.sku_id)
		}, 200)
	}

	return (
		<div
			className={`transition-all duration-200 ${
				isRemoving ? "opacity-0 scale-95" : "opacity-100 scale-100"
			}`}
		>
			<div className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg hover:bg-muted/30 transition-colors">
				{/* Checkbox */}
				{onToggleSelect && (
					<div className="flex items-start pt-2">
						<Checkbox
							checked={item.selected || false}
							onCheckedChange={(checked) =>
								onToggleSelect(item.sku_id, checked as boolean)
							}
							className="mt-1 border-gray-300"
						/>
					</div>
				)}

				{/* Product Image */}
				<div className="relative h-32 w-full sm:h-24 sm:w-24 lg:h-28 lg:w-28 overflow-hidden rounded-md border bg-muted/20 flex-shrink-0">
					<Image
						src={item.resource.url || "/placeholder.svg"}
						alt={item.name}
						fill
						className="object-cover hover:scale-105 transition-transform duration-200"
					/>
					{isDiscounted && (
						<Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs px-1 py-0">
							DISCOUNT
						</Badge>
					)}
				</div>

				{/* Product Details */}
				<div className="flex-1 space-y-3">
					<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
						<div className="space-y-2">
							<div className="flex items-start gap-2">
								<h3 className="font-medium text-base line-clamp-2 leading-tight">
									{item.name}
								</h3>
								<Link
									href={`/products/${item.spu_id}`}
									className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
								>
									<ExternalLink className="h-4 w-4" />
								</Link>
							</div>
							<div className="text-sm text-muted-foreground">
								{item.sku_name}
							</div>

							<div className="flex items-center gap-2">
								<Badge variant="outline" className="text-xs">
									{item.category}
								</Badge>
								{/* <span className="text-xs text-muted-foreground">
									Min order: {item.minOrderQuantity} items
								</span> */}
							</div>
						</div>

						{/* Actions - Mobile/Desktop */}
						<div className="flex items-center gap-2 sm:flex-col sm:items-end">
							<Button
								variant="ghost"
								size="sm"
								className="text-muted-foreground hover:text-primary"
							>
								<Heart className="h-4 w-4" />
							</Button>

							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="text-destructive hover:text-destructive hover:bg-destructive/10"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Remove Item</AlertDialogTitle>
										<AlertDialogDescription>
											Are you sure you want to remove &quot;{item.name} (
											{item.sku_name})&quot; from your cart?
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={handleRemove}
											className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
										>
											Remove
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</div>

					{/* Pricing and Quantity */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						{/* Price Info */}
						<div className="space-y-1">
							<div className="flex items-center gap-3">
								<span className="text-lg font-semibold text-primary">
									{formatCurrency(currentPrice)}
								</span>
								{isDiscounted && (
									<span className="text-sm text-muted-foreground line-through">
										{formatCurrency(item.price)}
									</span>
								)}
							</div>
							{isDiscounted && (
								<Badge
									variant="secondary"
									className="text-xs bg-green-100 text-green-700"
								>
									Bulk Discount Applied
								</Badge>
							)}
						</div>

						{/* Quantity Controls */}
						<div className="flex items-center gap-3">
							<div className="flex items-center border rounded-md">
								<Button
									variant="ghost"
									size="sm"
									className="h-9 w-9 p-0 hover:bg-muted"
									onClick={() =>
										onUpdateQuantity(item.sku_id, item.quantity - 1)
									}
									// disabled={item.quantity <= item.minOrderQuantity}
								>
									<Minus className="h-3 w-3" />
								</Button>
								<Input
									type="number"
									value={item.quantity}
									onChange={(e) =>
										onUpdateQuantity(
											item.sku_id,
											Number.parseInt(e.target.value)
										)
									}
									className="w-16 h-9 text-center border-0 focus-visible:ring-0"
									// min={item.minOrderQuantity}
								/>
								<Button
									variant="ghost"
									size="sm"
									className="h-9 w-9 p-0 hover:bg-muted"
									onClick={() =>
										onUpdateQuantity(item.sku_id, item.quantity + 1)
									}
								>
									<Plus className="h-3 w-3" />
								</Button>
							</div>

							<div className="text-right min-w-[80px]">
								<div className="font-semibold text-lg">
									{formatCurrency(totalPrice)}
								</div>
								{savings > 0 && (
									<div className="text-xs text-green-600">
										Save {formatCurrency(savings)}
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Bulk Discount Info */}
					{item.bulk_price &&
						item.bulk_threshold &&
						item.quantity < item.bulk_threshold && (
							<div className="bg-blue-50 border border-blue-200 rounded-md p-3">
								<p className="text-sm text-blue-700">
									💡 Buy {item.bulk_threshold - item.quantity} more items to get{" "}
									<span className="font-semibold">
										{formatCurrency(item.bulk_price)}
									</span>{" "}
									per item!
								</p>
							</div>
						)}
				</div>
			</div>
		</div>
	)
}
