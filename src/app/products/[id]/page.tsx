"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProductCard } from "@/components/products/product-card"
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

const getProduct = (id: string) => ({
	id,
	name: "Professional Office Chair - Ergonomic Design with Lumbar Support",
	description:
		"Premium ergonomic office chair designed for all-day comfort and productivity",
	detailedDescription: `
		This professional office chair combines cutting-edge ergonomic design with premium materials to deliver exceptional comfort and support for long working hours. 
		
		**Key Features:**
		- Advanced lumbar support system that adjusts to your spine's natural curve
		- Breathable mesh backrest for optimal air circulation
		- High-density foam cushioning for lasting comfort
		- 360-degree swivel with smooth-rolling casters
		- Height-adjustable seat with pneumatic lift
		- Armrests with multiple adjustment options
		
		**Perfect for:**
		- Office professionals spending 8+ hours at desk
		- Home office setups
		- Executive offices and conference rooms
		- Co-working spaces
		
		**Quality Assurance:**
		- Tested for 40+ hours of continuous use
		- Weight capacity up to 300 lbs
		- 5-year manufacturer warranty
		- BIFMA certified for safety and durability
	`,
	price: 299.99,
	originalPrice: 399.99,
	images: [
		"/professional-office-chair.jpg",
		"/office-chair-side-view.png",
		"/office-chair-back-view.png",
		"/office-chair-detail-view.jpg",
		"/office-chair-assembly.jpg",
	],
	category: "Office Furniture",
	rating: 4.7,
	reviewCount: 2847,
	soldCount: 8432,
	inStock: true,
	isFlashSale: true,
	flashSaleEndTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
	variants: [
		{ id: "single", name: "1 Chair", price: 299.99, popular: false },
		{ id: "set-3", name: "3 Chairs", price: 249.99, popular: true },
		{ id: "set-5", name: "5 Chairs", price: 229.99, popular: false },
		{ id: "bulk-10", name: "10+ Chairs", price: 199.99, popular: false },
	],
	specifications: {
		dimensions: {
			"Overall Height": "42-46 inches",
			"Seat Width": "20 inches",
			"Seat Depth": "20 inches",
			"Seat Height": "17-21 inches (adjustable)",
			"Backrest Height": "26 inches",
		},
		materials: {
			Frame: "Heavy-duty steel",
			Upholstery: "Premium mesh and fabric",
			Base: "Reinforced nylon with chrome finish",
			Casters: "Smooth-rolling polyurethane",
			Cushioning: "High-density foam",
		},
		features: {
			"Weight Capacity": "300 lbs",
			Adjustments: "Height, tilt, lumbar, armrests",
			Warranty: "5 years manufacturer",
			Assembly: "30 minutes (tools included)",
			Certification: "BIFMA approved",
		},
	},
	reviews: [
		{
			id: 1,
			user: "Sarah Chen",
			avatar: "/placeholder-user.jpg",
			rating: 5,
			date: "2024-10-15",
			title: "Excellent chair for long work hours",
			comment:
				"I've been using this chair for 6 months now and it's been a game-changer for my back pain. The lumbar support is fantastic and the mesh keeps me cool during long meetings.",
			helpful: 24,
			verified: true,
			images: ["/review-1-1.jpg", "/review-1-2.jpg"],
		},
		{
			id: 2,
			user: "Michael Rodriguez",
			avatar: "/placeholder-user.jpg",
			rating: 4,
			date: "2024-10-12",
			title: "Good value for money",
			comment:
				"Solid build quality and comfortable. Assembly was straightforward. Only minor complaint is that the armrests could be a bit more padded.",
			helpful: 18,
			verified: true,
			images: [],
		},
		{
			id: 3,
			user: "Jennifer Kim",
			avatar: "/placeholder-user.jpg",
			rating: 5,
			date: "2024-10-08",
			title: "Perfect for my home office",
			comment:
				"Bought this for my home office setup. The chair looks professional and feels premium. The height adjustment is smooth and the tilt mechanism works perfectly.",
			helpful: 31,
			verified: true,
			images: ["/review-3-1.jpg"],
		},
		{
			id: 4,
			user: "David Thompson",
			avatar: "/placeholder-user.jpg",
			rating: 4,
			date: "2024-10-05",
			title: "Great ergonomics",
			comment:
				"As someone who works 10+ hours a day, this chair has been a lifesaver. The ergonomic design really helps with posture. Highly recommend for office workers.",
			helpful: 15,
			verified: true,
			images: [],
		},
	],
	ratingBreakdown: {
		"5": 1456,
		"4": 892,
		"3": 298,
		"2": 124,
		"1": 77,
	} as Record<string, number>,
	seller: {
		name: "OfficePro Solutions",
		rating: 4.8,
		responseRate: 98,
		joinedYears: 5,
		totalProducts: 156,
		followers: 12500,
		avatar: "/placeholder-logo.png",
	},
	relatedProducts: [
		{
			id: "2",
			name: "Standing Desk Converter",
			description:
				"Adjustable standing desk converter for healthier work habits",
			price: 199.99,
			originalPrice: 249.99,
			image: "/standing-desk-converter.png",
			category: "Furniture",
			rating: 4.5,
			reviewCount: 74,
			inStock: true,
			minOrderQuantity: 2,
		},
		{
			id: "3",
			name: "Modern Office Furniture Set",
			description:
				"Complete modern office furniture set for professional environments",
			price: 899.99,
			originalPrice: 1199.99,
			image: "/modern-office-furniture.png",
			category: "Furniture",
			rating: 4.6,
			reviewCount: 45,
			inStock: true,
			minOrderQuantity: 1,
		},
		{
			id: "4",
			name: "Office Supplies Kit",
			description:
				"Complete starter kit with pens, notebooks, and essential supplies",
			price: 49.99,
			originalPrice: 69.99,
			image: "/office-supplies-kit.png",
			category: "Office Supplies",
			rating: 4.3,
			reviewCount: 167,
			inStock: true,
			minOrderQuantity: 5,
		},
		{
			id: "5",
			name: "Business Laptop Computer",
			description: "High-performance laptop perfect for business applications",
			price: 1299.99,
			originalPrice: 1499.99,
			image: "/business-laptop-computer.jpg",
			category: "Technology",
			rating: 4.7,
			reviewCount: 89,
			inStock: true,
			minOrderQuantity: 1,
		},
	],
	sameShopProducts: [
		{
			id: "6",
			name: "Executive Desk Lamp",
			description: "Premium LED desk lamp with adjustable brightness",
			price: 89.99,
			originalPrice: 119.99,
			image: "/placeholder.jpg",
			category: "Office Supplies",
			rating: 4.4,
			reviewCount: 93,
			inStock: true,
			minOrderQuantity: 3,
		},
		{
			id: "7",
			name: "Conference Room System",
			description: "Professional wireless conference system for meeting rooms",
			price: 2499.99,
			originalPrice: 2999.99,
			image: "/conference-room-system.jpg",
			category: "Technology",
			rating: 4.8,
			reviewCount: 28,
			inStock: true,
			minOrderQuantity: 1,
		},
		{
			id: "8",
			name: "Office Paper Stack Organizer",
			description: "Stackable paper organizer for office document management",
			price: 24.99,
			originalPrice: 34.99,
			image: "/office-paper-stack.jpg",
			category: "Office Supplies",
			rating: 4.2,
			reviewCount: 156,
			inStock: true,
			minOrderQuantity: 10,
		},
		{
			id: "9",
			name: "Technology Office Equipment",
			description: "Essential technology equipment bundle for modern offices",
			price: 599.99,
			originalPrice: 799.99,
			image: "/technology-office-equipment.jpg",
			category: "Technology",
			rating: 4.6,
			reviewCount: 67,
			inStock: true,
			minOrderQuantity: 1,
		},
	],
})

export default function ProductDetailPage({
	params,
}: {
	params: { id: string }
}) {
	const product = getProduct(params.id)
	const [selectedImage, setSelectedImage] = useState(0)
	const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
	const [quantity, setQuantity] = useState(1)

	const discount = product.originalPrice
		? Math.round(
				((product.originalPrice - selectedVariant.price) /
					product.originalPrice) *
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
					<div className="space-y-4">
						<div className="relative aspect-square bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg overflow-hidden">
							<Image
								src={product.images[selectedImage] || "/placeholder.svg"}
								alt={product.name}
								fill
								className="object-cover"
							/>
							{product.isFlashSale && (
								<div className="absolute top-4 left-4">
									<Badge className="bg-red-600 text-white px-3 py-1 text-sm font-bold">
										FLASH SALE
									</Badge>
								</div>
							)}
						</div>

						<div className="flex space-x-2 overflow-x-auto">
							{product.images.map((image, index) => (
								<button
									key={index}
									onClick={() => setSelectedImage(index)}
									className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
										selectedImage === index
											? "border-blue-600"
											: "border-gray-200"
									}`}
								>
									<Image
										src={image || "/placeholder.svg"}
										alt={`View ${index + 1}`}
										width={64}
										height={64}
										className="object-cover"
									/>
								</button>
							))}
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
								<span className="text-lg font-medium">{product.rating}</span>
								<div className="flex">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`h-4 w-4 ${
												i < Math.floor(product.rating)
													? "fill-yellow-400 text-yellow-400"
													: "text-gray-300"
											}`}
										/>
									))}
								</div>
							</div>
							<span className="text-gray-600">
								{product.reviewCount.toLocaleString()} Ratings
							</span>
							<span className="text-gray-600">
								{product.soldCount.toLocaleString()}+ Sold
							</span>
						</div>

						{product.isFlashSale && (
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
									${selectedVariant.price.toFixed(2)}
								</span>
								{product.originalPrice && (
									<>
										<span className="text-lg text-gray-500 line-through">
											${product.originalPrice.toFixed(2)}
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
								<span className="font-medium">
									Business Protection Insurance
								</span>
								<ChevronRight className="h-4 w-4 text-gray-400" />
							</div>
						</div>

						<div className="space-y-3">
							<span className="text-sm text-gray-600">Quantity Options</span>
							<div className="grid grid-cols-2 gap-2">
								{product.variants.map((variant) => (
									<button
										key={variant.id}
										onClick={() => setSelectedVariant(variant)}
										className={`p-3 border rounded-lg text-left transition-colors ${
											selectedVariant.id === variant.id
												? "border-blue-600 bg-blue-50"
												: "border-gray-200 hover:border-gray-300"
										}`}
									>
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium">
												{variant.name}
											</span>
											{variant.popular && (
												<Badge variant="secondary" className="text-xs">
													Popular
												</Badge>
											)}
										</div>
										<div className="text-sm text-gray-600">
											${variant.price}
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

							<div className="flex space-x-2">
								<Button variant="outline" size="sm">
									<MessageCircle className="h-4 w-4 mr-2" />
									Chat Now
								</Button>
								<Button variant="outline" size="sm">
									View Shop
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

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
								{Object.entries(product.specifications).map(
									([category, specs]) =>
										Object.entries(specs as Record<string, string>).map(
											([key, value]) => (
												<div
													key={`${category}-${key}`}
													className="bg-gray-50 p-3 rounded-lg"
												>
													<div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
														{key}
													</div>
													<div className="font-medium text-gray-900">
														{value}
													</div>
												</div>
											)
										)
								)}
							</div>
						</div>
						<Separator />
						{/* Description */}
						<div>
							<h4 className="font-semibold text-gray-900">
								Product Description
							</h4>
							<div className="whitespace-pre-line text-gray-700 leading-relaxed">
								{product.detailedDescription}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Customer Reviews */}
				<Card>
					<CardHeader>
						<CardTitle>
							Customer Reviews ({product.reviewCount.toLocaleString()})
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{/* Rating Summary */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="text-center">
									<div className="text-4xl font-bold text-gray-900 mb-2">
										{product.rating}
									</div>
									<div className="flex justify-center mb-2">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className={`h-5 w-5 ${
													i < Math.floor(product.rating)
														? "fill-yellow-400 text-yellow-400"
														: "text-gray-300"
												}`}
											/>
										))}
									</div>
									<p className="text-gray-600">
										{product.reviewCount.toLocaleString()} reviews
									</p>
								</div>

								<div className="space-y-2">
									{[5, 4, 3, 2, 1].map((rating) => (
										<div key={rating} className="flex items-center space-x-2">
											<span className="text-sm w-3">{rating}</span>
											<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
											<Progress
												value={
													(product.ratingBreakdown[rating.toString()] /
														product.reviewCount) *
													100
												}
												className="flex-1 h-2"
											/>
											<span className="text-sm text-gray-600 w-12">
												{product.ratingBreakdown[rating.toString()]}
											</span>
										</div>
									))}
								</div>
							</div>

							<Separator />

							{/* Individual Reviews */}
							<div className="space-y-6">
								{product.reviews.map((review) => (
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
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{product.sameShopProducts.map((p) => (
								<ProductCard key={p.id} product={p} />
							))}
						</div>
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
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{product.relatedProducts.map((p) => (
								<ProductCard key={p.id} product={p} />
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
