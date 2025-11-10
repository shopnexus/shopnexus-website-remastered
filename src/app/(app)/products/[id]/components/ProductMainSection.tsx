"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProductImageGallery } from "@/components/product/product-image-gallery"
import { ProductOptions } from "@/components/product/product-options"
import { ShoppingCart, Star, Heart, Share2, Clock } from "lucide-react"
import { useUpdateCart } from "@/core/account/cart"
import { ButtonLoading } from "@/components/ui/button-loading"
import { toast } from "sonner"
import { Resource } from "@/core/common/resource.type"

interface RatingDetail {
	score: number
	total: number
	breakdown: Record<string, number>
}

interface SkuDetail {
	id: number
	price: number
	original_price: number
	attributes: { name: string; value: string }[]
}

interface ProductMainSectionProps {
	name: string
	resources: Resource[]
	promoId?: number
	rating: RatingDetail
	sold: number
	skus: SkuDetail[]
	selectedSku: SkuDetail | null
	onSelectSku: (sku: SkuDetail | null) => void
}

export function ProductMainSection({
	name,
	resources,
	promoId,
	rating,
	skus,
	selectedSku,
	onSelectSku,
}: ProductMainSectionProps) {
	const [quantity, setQuantity] = useState(1)
	const router = useRouter()
	const { mutateAsync: mutateUpdateCart } = useUpdateCart()

	const discount = selectedSku?.original_price
		? Math.round(
				((selectedSku.original_price - selectedSku.price) /
					selectedSku.original_price) *
					100
		  )
		: 0

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-lg p-6 bg-white shadow-sm border border-gray-100">
			{/* Product Images */}
			<ProductImageGallery
				resources={resources}
				productName={name}
				promoId={promoId}
			/>

			{/* Product Details */}
			<div className="space-y-4">
				<div>
					<div className="flex items-center space-x-2 mb-2">
						<Badge className="bg-red-600 text-white">Preferred</Badge>
					</div>
					<h1 className="text-2xl font-semibold text-gray-800 leading-tight">
						{name}
					</h1>
				</div>

				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-1">
						<span className="text-lg font-medium">
							{rating.score.toFixed(1)}
						</span>
						<div className="flex">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className={`h-4 w-4 ${
										i < Math.floor(rating.score)
											? "fill-yellow-400 text-yellow-400"
											: "text-gray-300"
									}`}
								/>
							))}
						</div>
					</div>
					<span className="text-gray-600">
						{rating.total.toLocaleString()} Ratings
					</span>
					<span className="text-gray-600">{0}+ Sold</span>
				</div>

				{promoId && (
					<div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-3 rounded flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<span className="font-bold">FLASH SALE</span>
						</div>
						<div className="flex items-center space-x-2">
							<Clock className="h-4 w-4" />
							<span className="text-sm">ENDS IN</span>
							<div className="flex space-x-1">
								<span className="bg-white text-red-600 px-2 py-1 rounded text-xs font-bold">
									2
								</span>
								<span className="bg-white text-red-600 px-2 py-1 rounded text-xs font-bold">
									14
								</span>
								<span className="bg-white text-red-600 px-2 py-1 rounded text-xs font-bold">
									35
								</span>
							</div>
						</div>
					</div>
				)}

				<div className="space-y-2">
					<div className="flex items-center space-x-3">
						<span className="text-3xl font-bold text-red-600">
							$
							{selectedSku?.price
								? (selectedSku.price / 100).toFixed(2)
								: "0.00"}
						</span>
						{selectedSku?.original_price &&
							selectedSku.original_price !== selectedSku.price && (
								<>
									<span className="text-lg text-gray-500 line-through">
										${(selectedSku.original_price / 100).toFixed(2)}
									</span>
									<Badge variant="destructive" className="text-sm">
										-{discount}%
									</Badge>
								</>
							)}
					</div>
				</div>

				<div className="space-y-3">
					{/* <div className="flex items-center space-x-2 text-sm">
						<Truck className="h-4 w-4 text-green-600" />
						<span className="text-gray-600">Shipping</span>
						<span className="font-medium">Get by 6 Nov to 7 Nov</span>
						<ChevronRight className="h-4 w-4 text-gray-400" />
					</div>
					<div className="flex items-center space-x-2 text-sm">
						<Shield className="h-4 w-4 text-blue-600" />
						<span className="text-gray-600">Shopping Guarantee</span>
						<span className="font-medium">Business Protection Insurance</span>
						<ChevronRight className="h-4 w-4 text-gray-400" />
					</div> */}
				</div>

				<ProductOptions
					skus={skus}
					selectedSku={selectedSku}
					onSelectSku={onSelectSku}
					productImages={resources.map((r) => r.url)}
				/>

				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<span className="text-sm text-gray-600">Quantity</span>
						<div className="flex items-center border rounded-lg shadow-sm border-gray-200">
							<button
								onClick={() => setQuantity(Math.max(1, quantity - 1))}
								className="px-3 py-1 hover:bg-gray-100 transition-colors duration-200"
							>
								-
							</button>
							<span className="px-4 py-1 border-x border-gray-200">
								{quantity}
							</span>
							<button
								onClick={() => setQuantity(quantity + 1)}
								className="px-3 py-1 hover:bg-gray-100 transition-colors duration-200"
							>
								+
							</button>
						</div>
					</div>
					<span className="text-sm text-gray-600">IN STOCK</span>
				</div>

				<div className="grid grid-cols-2 gap-3 pt-4">
					<ButtonLoading
						variant="outline"
						className="border-red-600 text-red-600 hover:bg-red-50  bg-transparent cursor-pointer hover:text-red-600"
						minDurationMs={1000}
						onClick={async () => {
							if (!selectedSku?.id) return
							try {
								await mutateUpdateCart({
									sku_id: selectedSku.id,
									delta_quantity: quantity,
								})
								toast.success("Đã thêm vào giỏ hàng", {
									description: `${quantity} x ${name}`,
								})
								if (typeof window !== "undefined") {
									window.dispatchEvent(new CustomEvent("cart:added"))
								}
							} catch {
								toast.error("Thêm vào giỏ hàng thất bại")
							}
						}}
						disabled={!selectedSku}
					>
						<ShoppingCart className="h-4 w-4 mr-2" />
						Add To Cart
					</ButtonLoading>
					<ButtonLoading
						className="bg-red-600 hover:bg-red-700"
						minDurationMs={1000}
						onClick={async () => {
							if (!selectedSku?.id) return
							// Navigate to checkout with buy_now=true, passing sku_id and quantity
							router.push(
								`/checkout?sku_id=${selectedSku.id}&quantity=${quantity}&buy_now=true`
							)
						}}
						disabled={!selectedSku}
					>
						Buy Now
					</ButtonLoading>
				</div>

				<div className="flex items-center justify-between pt-4">
					<div className="flex items-center space-x-2">
						<span className="text-sm text-gray-600">Share:</span>
						<Button
							variant="outline"
							size="sm"
							className="h-8 w-8 p-0 bg-transparent"
						>
							<Share2 className="h-4 w-4" />
						</Button>
					</div>
					<Button
						variant="outline"
						size="sm"
						className="flex items-center space-x-2 bg-transparent"
					>
						<Heart className="h-4 w-4" />
						<span className="text-sm">Favorite (114)</span>
					</Button>
				</div>
			</div>
		</div>
	)
}
