"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductCard } from "@/components/product/product-card"
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import { TProductCard } from "@/core/catalog/product.customer"

interface RelatedProduct {
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
	category: string
	rating: {
		score: number
		total: number
	}
}

interface RelatedProductsProps {
	products: TProductCard[]
	title: string
	viewAllLink?: string
}

export function RelatedProducts({
	products,
	title,
	viewAllLink = "#",
}: RelatedProductsProps) {
	return (
		<Card className="bg-white shadow-sm border border-gray-100 mx-4">
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>{title}</span>
					<Link
						href={viewAllLink}
						className="text-sm text-blue-600 hover:underline"
					>
						View All
					</Link>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Carousel
					className={cn("w-full")}
					opts={{ loop: false, dragFree: true }}
				>
					<CarouselContent>
						{products?.map((product) => (
							<CarouselItem
								key={product.id}
								className="basis-1/2 md:basis-1/3 lg:basis-1/5"
							>
								<div className="h-full p-1">
									<ProductCard key={product.id} product={product} />
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
				</Carousel>
			</CardContent>
		</Card>
	)
}
