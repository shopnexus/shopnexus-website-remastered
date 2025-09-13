"use client"

import { use, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProductCard } from "@/components/product/product-card"
import { ProductImageGallery } from "@/components/product/product-image-gallery"
import {
	ShoppingCart,
	Star,
	Heart,
	Share2,
	Truck,
	Shield,
	Clock,
	ChevronRight,
	MessageCircle,
	ThumbsUp,
	ThumbsDown,
	MoreHorizontal,
} from "lucide-react"
import { useGetProductDetail } from "@/core/product/product.customer"
import { cn } from "@/lib/utils"
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel"

interface Resource {
	id: number
	mime: string
	url: string
	file_size: number
	width: number
	height: number
	duration: number
}

interface Product {
	id: number
	name: string
	description: string
	resources: Resource[]
	category: string
	rating: RatingDetail
	sold: number
	promo_id?: number
	skus: SkuDetail[]
	specifications: Record<string, string>
	// Optional fields that might not be in API response
	reviews?: Review[]
	seller?: Seller
	relatedProducts?: RelatedProduct[]
	sameShopProducts?: RelatedProduct[]
}

interface RatingDetail {
	score: number
	total: number
	breakdown: Record<string, number>
}

interface SkuDetail {
	id: number
	price: number
	original_price: number
	attributes: Record<string, string>
}

interface Review {
	id: number
	user: string
	avatar: string
	rating: number
	date: string
	title: string
	comment: string
	helpful: number
	verified: boolean
	images: string[]
}

interface Seller {
	name: string
	rating: number
	responseRate: number
	joinedYears: number
	totalProducts: number
	followers: number
	avatar: string
}

interface RelatedProduct {
	id: string
	name: string
	description: string
	price: number
	original_price: number
	image: string
	category: string
	rating: {
		score: number
		total: number
	}
	// minOrderQuantity: number
}

// Mock data for fields not provided by API
const mockReviews: Review[] = [
	{
		id: 1,
		user: "Sarah Chen",
		avatar: "/placeholder-user.jpg",
		rating: 5,
		date: "2024-10-15",
		title: "Excellent product",
		comment: "Great quality and fast delivery. Highly recommended!",
		helpful: 24,
		verified: true,
		images: [],
	},
	{
		id: 2,
		user: "Michael Rodriguez",
		avatar: "/placeholder-user.jpg",
		rating: 4,
		date: "2024-10-12",
		title: "Good value for money",
		comment: "Solid build quality. Assembly was straightforward.",
		helpful: 18,
		verified: true,
		images: [],
	},
]

const mockSeller: Seller = {
	name: "TechStore Pro",
	rating: 4.8,
	responseRate: 98,
	joinedYears: 5,
	totalProducts: 156,
	followers: 12500,
	avatar: "/placeholder-logo.png",
}

const mockRelatedProducts: RelatedProduct[] = [
	{
		id: "2",
		name: "Related Product 1",
		description: "Similar product description",
		price: 199.99,
		original_price: 249.99,
		image: "/placeholder.jpg",
		category: "Electronics",
		rating: {
			score: 4.5,
			total: 74,
		},
	},
	{
		id: "3",
		name: "Related Product 2",
		description: "Another similar product",
		price: 299.99,
		original_price: 399.99,
		image: "/placeholder.jpg",
		category: "Electronics",
		rating: {
			score: 4.6,
			total: 45,
		},
	},
]

export default function ProductDetailPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = use(params)
	const { data: productData, isLoading, error } = useGetProductDetail(id)
	const [selectedSku, setSelectedSku] = useState<SkuDetail | null>(null)
	const [quantity, setQuantity] = useState(1)
	// const { data: promo } = useGetPromotion(productData?.promo_id)

	// Set default selected SKU when product data loads
	useEffect(() => {
		if (productData?.skus && productData.skus.length > 0 && !selectedSku) {
			setSelectedSku(productData.skus[0])
		}
	}, [productData, selectedSku])

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading product details...</p>
				</div>
			</div>
		)
	}

	if (error || !productData) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-2">
						Product Not Found
					</h1>
					<p className="text-gray-600 mb-4">
						The product you&apos;re looking for doesn&apos;t exist.
					</p>
					<Link href="/" className="text-blue-600 hover:underline">
						Return to Home
					</Link>
				</div>
			</div>
		)
	}

	// Combine API data with mock data for missing fields
	const product: Product = {
		...productData,
		reviews: mockReviews,
		seller: mockSeller,
		relatedProducts: mockRelatedProducts,
		sameShopProducts: mockRelatedProducts,
	}

	const discount = selectedSku?.original_price
		? Math.round(
				((selectedSku.original_price - selectedSku.price) /
					selectedSku.original_price) *
					100
		  )
		: 0

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Breadcrumb */}
			<div className="bg-white border-b">
				<div className="container mx-auto px-4 py-3">
					<div className="flex items-center space-x-2 text-sm">
						<Link href="/" className="text-blue-600 hover:underline">
							B2B Store
						</Link>
						<ChevronRight className="h-4 w-4 text-gray-400" />
						<Link
							href="/categories/office"
							className="text-blue-600 hover:underline"
						>
							Office & Business
						</Link>
						<ChevronRight className="h-4 w-4 text-gray-400" />
						<Link
							href="/categories/furniture"
							className="text-blue-600 hover:underline"
						>
							Furniture
						</Link>
						<ChevronRight className="h-4 w-4 text-gray-400" />
						<span className="text-gray-600 truncate">{product.name}</span>
					</div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-6 space-y-6">
				{/* Main Product Section */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg p-6">
					{/* Product Images */}
					<ProductImageGallery
						resources={product.resources}
						productName={product.name}
						promoId={product.promo_id}
					/>

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

				{/* Product Details */}
				<div className="space-y-4">
					<div>
						<div className="flex items-center space-x-2 mb-2">
							<Badge className="bg-red-600 text-white">Preferred</Badge>
						</div>
						<h1 className="text-2xl font-semibold text-gray-800 leading-tight">
							{product.name}
						</h1>
					</div>

					<div className="flex items-center space-x-4">
						<div className="flex items-center space-x-1">
							<span className="text-lg font-medium">
								{product.rating.score}
							</span>
							<div className="flex">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={`h-4 w-4 ${
											i < Math.floor(product.rating.score)
												? "fill-yellow-400 text-yellow-400"
												: "text-gray-300"
										}`}
									/>
								))}
							</div>
						</div>
						<span className="text-gray-600">
							{product.rating.total.toLocaleString()} Ratings
						</span>
						<span className="text-gray-600">
							{product.sold.toLocaleString()}+ Sold
						</span>
					</div>

					{product.promo_id && (
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
						<div className="flex items-center space-x-2 text-sm">
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
						</div>
					</div>

					<div className="space-y-3">
						<span className="text-sm text-gray-600">Available Options</span>
						<div className="grid grid-cols-1 gap-2">
							{product.skus.map((sku) => (
								<button
									key={sku.id}
									onClick={() => setSelectedSku(sku)}
									className={`p-3 border rounded-lg text-left transition-colors ${
										selectedSku?.id === sku.id
											? "border-blue-600 bg-blue-50"
											: "border-gray-200 hover:border-gray-300"
									}`}
								>
									<div className="flex items-center justify-between">
										<div className="flex flex-col">
											<span className="text-sm font-medium">
												{Object.entries(sku.attributes)
													.map(([key, value]) => `${key}: ${value}`)
													.join(", ")}
											</span>
											<span className="text-sm text-gray-600">
												${(sku.price / 100).toFixed(2)}
												{sku.original_price !== sku.price && (
													<span className="ml-2 text-xs text-gray-500 line-through">
														${(sku.original_price / 100).toFixed(2)}
													</span>
												)}
											</span>
										</div>
									</div>
								</button>
							))}
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<span className="text-sm text-gray-600">Quantity</span>
							<div className="flex items-center border rounded">
								<button
									onClick={() => setQuantity(Math.max(1, quantity - 1))}
									className="px-3 py-1 hover:bg-gray-100"
								>
									-
								</button>
								<span className="px-4 py-1 border-x">{quantity}</span>
								<button
									onClick={() => setQuantity(quantity + 1)}
									className="px-3 py-1 hover:bg-gray-100"
								>
									+
								</button>
							</div>
						</div>
						<span className="text-sm text-gray-600">IN STOCK</span>
					</div>

					<div className="grid grid-cols-2 gap-3 pt-4">
						<Button
							variant="outline"
							className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
						>
							<ShoppingCart className="h-4 w-4 mr-2" />
							Add To Cart
						</Button>
						<Button className="bg-red-600 hover:bg-red-700">Buy Now</Button>
					</div>
				</div>
			</div>

			{/* Seller Information */}
			{product.seller && (
				<Card>
					<CardContent className="p-6">
						<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
							<div className="flex items-center space-x-4">
								<Avatar className="w-12 h-12">
									<AvatarImage src={product.seller.avatar} />
									<AvatarFallback className="bg-blue-600 text-white">
										{product.seller.name.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div>
									<div className="flex items-center space-x-2">
										<h3 className="font-medium">{product.seller.name}</h3>
										<Badge className="bg-red-600 text-white text-xs">
											Preferred
										</Badge>
									</div>
									<p className="text-sm text-gray-600">Active 3 Minutes Ago</p>
								</div>
							</div>

							<div className="grid grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-8 text-center">
								<div>
									<div className="text-sm text-gray-600">Ratings</div>
									<div className="font-medium text-red-600">
										{(product.seller.rating * 5.7).toFixed(1)}k
									</div>
								</div>
								<div>
									<div className="text-sm text-gray-600">Response Rate</div>
									<div className="font-medium text-red-600">
										{product.seller.responseRate}%
									</div>
								</div>
								<div>
									<div className="text-sm text-gray-600">Joined</div>
									<div className="font-medium">
										{product.seller.joinedYears} years ago
									</div>
								</div>
								<div>
									<div className="text-sm text-gray-600">Products</div>
									<div className="font-medium">
										{product.seller.totalProducts}
									</div>
								</div>
								<div>
									<div className="text-sm text-gray-600">Response Time</div>
									<div className="font-medium text-red-600">within hours</div>
								</div>
								<div>
									<div className="text-sm text-gray-600">Follower</div>
									<div className="font-medium">
										{(product.seller.followers / 1000).toFixed(1)}k
									</div>
								</div>
							</div>

							<div className="flex lg:flex-row flex-col gap-2">
								<Button variant="outline" size="sm" className="lg:w-fit w-full">
									<MessageCircle className="h-4 w-4 mr-2 hidden lg:block" />
									Chat Now
								</Button>
								<Button variant="outline" size="sm" className="lg:w-fit w-full">
									View Shop
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Product Description & Specifications */}
			<Card className="px-4 py-10">
				{/* <CardHeader>
						<CardTitle>Product Description & Specifications</CardTitle>
					</CardHeader> */}
				<CardContent className="space-y-4">
					{/* Compact Specifications */}
					<div className="space-y-2">
						<h4 className="font-semibold text-gray-900">
							Product Specifications
						</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
							{Object.entries(product.specifications ?? {}).map(
								([key, value]) => (
									<div key={key} className="bg-gray-50 p-3 rounded-lg">
										<div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
											{key}
										</div>
										<div className="font-medium text-gray-900">{value}</div>
									</div>
								)
							)}
						</div>
					</div>
					<Separator />
					{/* Description */}
					<div>
						<h4 className="font-semibold text-gray-900">Product Description</h4>
						<div className="whitespace-pre-line text-gray-700 leading-relaxed">
							{product.description}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Customer Reviews */}
			<Card>
				<CardHeader>
					<CardTitle>
						Customer Reviews ({product.rating.total.toLocaleString()})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						{/* Rating Summary */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="text-center">
								<div className="text-4xl font-bold text-gray-900 mb-2">
									{product.rating.score}
								</div>
								<div className="flex justify-center mb-2">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`h-5 w-5 ${
												i < Math.floor(product.rating.score)
													? "fill-yellow-400 text-yellow-400"
													: "text-gray-300"
											}`}
										/>
									))}
								</div>
								<p className="text-gray-600">
									{product.rating.total.toLocaleString()} reviews
								</p>
							</div>

							<div className="space-y-2">
								{[5, 4, 3, 2, 1].map((rating) => (
									<div key={rating} className="flex items-center space-x-2">
										<span className="text-sm w-3">{rating}</span>
										<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
										<Progress
											value={
												((product.rating.breakdown[rating.toString()] || 0) /
													product.rating.total) *
												100
											}
											className="flex-1 h-2"
										/>
										<span className="text-sm text-gray-600 w-12">
											{product.rating.breakdown[rating.toString()] || 0}
										</span>
									</div>
								))}
							</div>
						</div>

						<Separator />

						{/* Individual Reviews */}
						<div className="space-y-6">
							{product.reviews?.map((review) => (
								<div
									key={review.id}
									className="border-b border-gray-100 pb-6 last:border-b-0"
								>
									<div className="flex items-start space-x-4">
										<Avatar>
											<AvatarImage src={review.avatar} />
											<AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<div className="flex items-center justify-between mb-2">
												<div>
													<div className="flex items-center space-x-2">
														<h4 className="font-medium">{review.user}</h4>
														{review.verified && (
															<Badge variant="secondary" className="text-xs">
																Verified Purchase
															</Badge>
														)}
													</div>
													<div className="flex items-center space-x-2 mt-1">
														<div className="flex">
															{[...Array(5)].map((_, i) => (
																<Star
																	key={i}
																	className={`h-3 w-3 ${
																		i < review.rating
																			? "fill-yellow-400 text-yellow-400"
																			: "text-gray-300"
																	}`}
																/>
															))}
														</div>
														<span className="text-sm text-gray-600">
															{new Date(review.date).toLocaleDateString()}
														</span>
													</div>
												</div>
												<Button variant="ghost" size="sm">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</div>

											<h5 className="font-medium mb-2">{review.title}</h5>
											<p className="text-gray-700 mb-3">{review.comment}</p>

											{review.images.length > 0 && (
												<div className="flex space-x-2 mb-3">
													{review.images.map((img, idx) => (
														<div
															key={idx}
															className="w-16 h-16 rounded border overflow-hidden"
														>
															<Image
																src={img}
																alt={`Review image ${idx + 1}`}
																width={64}
																height={64}
																className="object-cover"
															/>
														</div>
													))}
												</div>
											)}

											<div className="flex items-center space-x-4">
												<Button variant="ghost" size="sm">
													<ThumbsUp className="h-4 w-4 mr-1" />
													Helpful ({review.helpful})
												</Button>
												<Button variant="ghost" size="sm">
													<ThumbsDown className="h-4 w-4 mr-1" />
													Not helpful
												</Button>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* From Same Shop */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span>From the Same Shop</span>
						<Link href="#" className="text-sm text-blue-600 hover:underline">
							View All
						</Link>
					</CardTitle>
				</CardHeader>
				<CardContent>
					{/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{product.sameShopProducts.map((p) => (
								<ProductCard key={p.id} product={p} />
							))}
						</div> */}
					<Carousel
						className={cn("w-full")}
						opts={{ loop: false, dragFree: true }}
					>
						<CarouselContent>
							{product.sameShopProducts?.map((p) => (
								<CarouselItem
									key={p.id}
									className="h-[380px] basis-1/2 md:basis-1/3 lg:basis-1/5"
								>
									<div className="h-full p-1">
										<ProductCard key={p.id} product={p} />
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						{/* <CarouselPrevious />
							<CarouselNext /> */}
					</Carousel>
				</CardContent>
			</Card>

			{/* You May Also Like */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span>You May Also Like</span>
						<Link href="#" className="text-sm text-blue-600 hover:underline">
							View All
						</Link>
					</CardTitle>
				</CardHeader>
				<CardContent>
					{/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{product.relatedProducts.map((p) => (
								<ProductCard key={p.id} product={p} />
							))}
						</div> */}
					<Carousel
						className={cn("w-full")}
						opts={{ loop: false, dragFree: true }}
					>
						<CarouselContent>
							{product.relatedProducts?.map((p) => (
								<CarouselItem
									key={p.id}
									className="h-[380px] basis-1/2 md:basis-1/3 lg:basis-1/5"
								>
									<div className="h-full p-1">
										<ProductCard key={p.id} product={p} />
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						{/* <CarouselPrevious />
							<CarouselNext /> */}
					</Carousel>
				</CardContent>
			</Card>
		</div>
	)
}
