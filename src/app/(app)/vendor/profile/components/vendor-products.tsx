"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, Heart } from "lucide-react"
import { ProductCard } from "@/components/product/product-card"
import { Pagination } from "@/components/ui/pagination"

export function VendorProducts() {
	const [currentPage, setCurrentPage] = useState(1)
	const productsPerPage = 6
	// Mock products data
	const products = [
		{
			id: "1",
			name: "Professional Office Chair",
			price: 299.99,
			originalPrice: 399.99,
			image: "/professional-office-chair.jpg",
			rating: 4.8,
			reviews: 124,
			category: "Furniture",
			badge: "Best Seller",
			inStock: true,
		},
		{
			id: "2",
			name: "Standing Desk Converter",
			price: 199.99,
			originalPrice: 249.99,
			image: "/standing-desk-converter.png",
			rating: 4.6,
			reviews: 89,
			category: "Furniture",
			badge: "Sale",
			inStock: true,
		},
		{
			id: "3",
			name: "Office Supplies Kit",
			price: 49.99,
			originalPrice: 69.99,
			image: "/office-supplies-kit.png",
			rating: 4.7,
			reviews: 203,
			category: "Supplies",
			badge: "Popular",
			inStock: true,
		},
		{
			id: "4",
			name: "Modern Office Furniture Set",
			price: 1299.99,
			originalPrice: 1599.99,
			image: "/modern-office-furniture.png",
			rating: 4.9,
			reviews: 67,
			category: "Furniture",
			badge: "Premium",
			inStock: false,
		},
		{
			id: "5",
			name: "Business Laptop Computer",
			price: 899.99,
			originalPrice: 1099.99,
			image: "/business-laptop-computer.jpg",
			rating: 4.5,
			reviews: 156,
			category: "Electronics",
			badge: "New",
			inStock: true,
		},
		{
			id: "6",
			name: "Conference Room System",
			price: 2499.99,
			originalPrice: 2999.99,
			image: "/conference-room-system.jpg",
			rating: 4.8,
			reviews: 34,
			category: "Electronics",
			badge: "Featured",
			inStock: true,
		},
		{
			id: "7",
			name: "Industrial Equipment Warehouse",
			price: 1599.99,
			originalPrice: 1999.99,
			image: "/industrial-equipment-warehouse.jpg",
			rating: 4.7,
			reviews: 89,
			category: "Industrial",
			badge: "Featured",
			inStock: true,
		},
		{
			id: "8",
			name: "Modern Business Office Workspace",
			price: 899.99,
			originalPrice: 1199.99,
			image: "/modern-business-office-workspace.jpg",
			rating: 4.9,
			reviews: 156,
			category: "Furniture",
			badge: "Premium",
			inStock: true,
		},
		{
			id: "9",
			name: "Office Paper Stack",
			price: 29.99,
			originalPrice: 39.99,
			image: "/office-paper-stack.jpg",
			rating: 4.3,
			reviews: 234,
			category: "Supplies",
			badge: "Sale",
			inStock: true,
		},
		{
			id: "10",
			name: "Office Supplies Desk",
			price: 199.99,
			originalPrice: 249.99,
			image: "/office-supplies-desk.jpg",
			rating: 4.6,
			reviews: 78,
			category: "Furniture",
			badge: "Popular",
			inStock: true,
		},
		{
			id: "11",
			name: "Technology Office Equipment",
			price: 1299.99,
			originalPrice: 1599.99,
			image: "/technology-office-equipment.jpg",
			rating: 4.8,
			reviews: 45,
			category: "Electronics",
			badge: "New",
			inStock: true,
		},
		{
			id: "12",
			name: "Modern Office Furniture Premium",
			price: 2299.99,
			originalPrice: 2799.99,
			image: "/modern-office-furniture.png",
			rating: 4.9,
			reviews: 23,
			category: "Furniture",
			badge: "Premium",
			inStock: false,
		},
	]

	// Calculate pagination
	const totalPages = Math.ceil(products.length / productsPerPage)
	const startIndex = (currentPage - 1) * productsPerPage
	const endIndex = startIndex + productsPerPage
	const currentProducts = products.slice(startIndex, endIndex)

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
		window.scrollTo({ top: 0, behavior: "smooth" })
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">Our Products</h2>
					<p className="text-gray-600">
						High-quality office equipment and business solutions
					</p>
				</div>
				<div className="flex space-x-2">
					<Button variant="outline" size="sm">
						Filter
					</Button>
					<Button variant="outline" size="sm">
						Sort
					</Button>
				</div>
			</div>

			{/* Product Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{currentProducts.map((product) => (
					<Card
						key={product.id}
						className="group hover:shadow-lg transition-shadow"
					>
						<CardContent className="p-0">
							<div className="relative">
								<img
									src={product.image}
									alt={product.name}
									className="w-full h-48 object-cover rounded-t-lg"
								/>
								<div className="absolute top-2 left-2">
									<Badge
										className={`${
											product.badge === "Best Seller"
												? "bg-red-600"
												: product.badge === "Sale"
												? "bg-orange-600"
												: product.badge === "Popular"
												? "bg-blue-600"
												: product.badge === "Premium"
												? "bg-purple-600"
												: product.badge === "New"
												? "bg-green-600"
												: "bg-gray-600"
										} text-white`}
									>
										{product.badge}
									</Badge>
								</div>
								<div className="absolute top-2 right-2">
									<Button
										size="sm"
										variant="ghost"
										className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
									>
										<Heart className="h-4 w-4" />
									</Button>
								</div>
								{!product.inStock && (
									<div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
										<Badge variant="secondary" className="bg-white text-black">
											Out of Stock
										</Badge>
									</div>
								)}
							</div>

							<div className="p-4">
								<div className="mb-2">
									<Badge variant="outline" className="text-xs">
										{product.category}
									</Badge>
								</div>

								<h3 className="font-semibold text-lg mb-2 line-clamp-2">
									{product.name}
								</h3>

								<div className="flex items-center space-x-1 mb-2">
									<div className="flex items-center">
										{Array.from({ length: 5 }).map((_, i) => (
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
									<span className="text-sm text-gray-600">
										{product.rating} ({product.reviews})
									</span>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<span className="text-xl font-bold text-red-600">
											${product.price}
										</span>
										<span className="text-sm text-gray-500 line-through">
											${product.originalPrice}
										</span>
									</div>
									<Button
										size="sm"
										disabled={!product.inStock}
										className="bg-red-600 hover:bg-red-700"
									>
										<ShoppingCart className="h-4 w-4 mr-1" />
										Add
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Pagination */}
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={handlePageChange}
			/>

			{/* Pagination Info */}
			<div className="text-center text-sm text-gray-600 pt-2">
				Showing {startIndex + 1}-{Math.min(endIndex, products.length)} of{" "}
				{products.length} products
			</div>
		</div>
	)
}
