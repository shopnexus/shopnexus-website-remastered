"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { useEffect, useRef } from "react"
import { TippyGroup } from "@/lib/tippy/tippy-group"
import { Tippy } from "@/lib/tippy/tippy"

interface ProductCardProps {
	product: {
		id: string
		name: string
		description: string
		price: number
		original_price: number
		resource: {
			id: number
			mime: string
			url: string
			file_size: number
			width: number
			height: number
			duration: number
		}

		rating: {
			score: number
			total: number
		}
		promo?: {
			id: string
			title: string
			description: string
		}
		// reviewCount: number
		// inStock: boolean
		// minOrderQuantity: number
		// bulkPrice?: number
		// bulkThreshold?: number
	}
}

export function ProductCard({ product }: ProductCardProps) {
	// const {data: }
	const ref = useRef<HTMLElement>(null)

	const discountPercent = product.original_price
		? Math.round(
				((product.original_price - product.price) / product.original_price) *
					100
		  )
		: 0

	return (
		<Link href={`/products/${product.id}`}>
			<Card className="group overflow-hidden transition-all hover:shadow-md cursor-pointer h-full py-0 gap-y-2 ">
				<div className="relative aspect-square overflow-hidden">
					<Image
						src={product.resource.url || "/placeholder.svg"}
						alt={product.name}
						fill
						className="object-cover transition-transform group-hover:scale-105"
					/>
					{discountPercent > 0 && (
						<Badge className="absolute left-2 top-2 bg-destructive text-xs">
							-{discountPercent}%
						</Badge>
					)}
					{/* {!product.inStock && (
						<Badge
							variant="secondary"
							className="absolute right-2 top-2 text-xs"
						>
							Out of Stock
						</Badge>
					)} */}
					{/* {product.bulkPrice && product.bulkThreshold && (
						<Badge className="absolute right-2 bottom-2 bg-green-600 text-xs">
							Bulk
						</Badge>
					)} */}
				</div>

				<CardContent className="p-3">
					<div className="space-y-2">
						{product.promo && (
							<Badge variant="outline" className="text-xs h-5">
								{product.promo.title}{" "}
								{discountPercent > 0 && `- ${discountPercent}%`}
							</Badge>
						)}
						<h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
							{product.name}
						</h3>

						<div className="flex items-center space-x-1">
							<div className="flex items-center">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={`h-3 w-3 ${
											i < Math.floor(product.rating.score)
												? "fill-yellow-400 text-yellow-400"
												: "text-gray-300"
										}`}
									/>
								))}
							</div>
							<span className="text-xs text-muted-foreground">
								({product.rating.total})
							</span>
						</div>

						<div className="space-y-1">
							<div className="flex items-center space-x-2">
								<span className="text-base font-bold">
									${product.price.toFixed(2)}
								</span>
								{product.original_price > product.price && (
									<span className="text-xs text-muted-foreground line-through">
										${product.original_price.toFixed(2)}
									</span>
								)}
							</div>

							{/* {product.bulkPrice && product.bulkThreshold && (
								<p className="text-xs text-green-600">
									${product.bulkPrice.toFixed(2)} for {product.bulkThreshold}+
								</p>
							)} */}

							{/* <p className="text-xs text-muted-foreground">Min: {product.minOrderQuantity}</p> */}
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	)
}
