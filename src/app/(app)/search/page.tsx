"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Search, Filter, SortAsc, SortDesc } from "lucide-react"
import { ProductCard } from "@/components/product/product-card"
import { ProductGrid } from "@/components/product/product-grid"
import { Pagination } from "@/components/ui/pagination"
// Mock data for search results
const mockProducts = [
	{
		id: "1",
		name: "Professional Office Chair",
		price: 299.99,
		originalPrice: 399.99,
		image: "/professional-office-chair.jpg",
		category: "Furniture",
		rating: 4.5,
		reviews: 128,
		description:
			"Ergonomic office chair with lumbar support and adjustable height",
		inStock: true,
	},
	{
		id: "2",
		name: "Standing Desk Converter",
		price: 199.99,
		originalPrice: 249.99,
		image: "/standing-desk-converter.png",
		category: "Furniture",
		rating: 4.2,
		reviews: 89,
		description:
			"Adjustable standing desk converter for better posture and health",
		inStock: true,
	},
	{
		id: "3",
		name: "Office Supplies Kit",
		price: 49.99,
		originalPrice: 69.99,
		image: "/office-supplies-kit.png",
		category: "Office Supplies",
		rating: 4.7,
		reviews: 256,
		description:
			"Complete office supplies starter kit with pens, notebooks, and folders",
		inStock: true,
	},
	{
		id: "4",
		name: "Modern Office Furniture Set",
		price: 1299.99,
		originalPrice: 1599.99,
		image: "/modern-office-furniture.png",
		category: "Furniture",
		rating: 4.8,
		reviews: 67,
		description:
			"Complete modern office furniture set including desk, chair, and storage",
		inStock: false,
	},
	{
		id: "5",
		name: "Business Laptop Computer",
		price: 899.99,
		originalPrice: 1099.99,
		image: "/business-laptop-computer.jpg",
		category: "Technology",
		rating: 4.6,
		reviews: 143,
		description:
			"High-performance business laptop with Intel i7 processor and 16GB RAM",
		inStock: true,
	},
	{
		id: "6",
		name: "Wireless Mouse",
		price: 29.99,
		originalPrice: 39.99,
		image: "/placeholder.svg",
		category: "Technology",
		rating: 4.3,
		reviews: 89,
		description:
			"Ergonomic wireless mouse with precision tracking and long battery life",
		inStock: true,
	},
	{
		id: "7",
		name: "Mechanical Keyboard",
		price: 129.99,
		originalPrice: 159.99,
		image: "/placeholder.svg",
		category: "Technology",
		rating: 4.4,
		reviews: 112,
		description:
			"RGB mechanical keyboard with Cherry MX switches and customizable lighting",
		inStock: true,
	},
	{
		id: "8",
		name: "Monitor Stand",
		price: 79.99,
		originalPrice: 99.99,
		image: "/placeholder.svg",
		category: "Furniture",
		rating: 4.1,
		reviews: 45,
		description:
			"Adjustable monitor stand to improve ergonomics and desk organization",
		inStock: true,
	},
	{
		id: "9",
		name: "Desk Lamp",
		price: 59.99,
		originalPrice: 79.99,
		image: "/placeholder.svg",
		category: "Office Supplies",
		rating: 4.2,
		reviews: 78,
		description:
			"LED desk lamp with adjustable brightness and color temperature",
		inStock: true,
	},
	{
		id: "10",
		name: "File Cabinet",
		price: 199.99,
		originalPrice: 249.99,
		image: "/placeholder.svg",
		category: "Furniture",
		rating: 4.0,
		reviews: 34,
		description:
			"2-drawer metal file cabinet for document storage and organization",
		inStock: true,
	},
	{
		id: "11",
		name: "Printer Paper",
		price: 24.99,
		originalPrice: 29.99,
		image: "/office-paper-stack.jpg",
		category: "Office Supplies",
		rating: 4.5,
		reviews: 156,
		description: "High-quality white printer paper, 500 sheets, 20lb weight",
		inStock: true,
	},
	{
		id: "12",
		name: "Conference Room System",
		price: 2499.99,
		originalPrice: 2999.99,
		image: "/conference-room-system.jpg",
		category: "Technology",
		rating: 4.7,
		reviews: 23,
		description:
			"Complete conference room AV system with display, camera, and microphone",
		inStock: true,
	},
	{
		id: "13",
		name: "Whiteboard",
		price: 89.99,
		originalPrice: 119.99,
		image: "/placeholder.svg",
		category: "Office Supplies",
		rating: 4.3,
		reviews: 67,
		description:
			"Large magnetic whiteboard for meetings and brainstorming sessions",
		inStock: true,
	},
	{
		id: "14",
		name: "Office Desk",
		price: 399.99,
		originalPrice: 499.99,
		image: "/placeholder.svg",
		category: "Furniture",
		rating: 4.4,
		reviews: 89,
		description:
			"Spacious office desk with drawers and cable management system",
		inStock: true,
	},
	{
		id: "15",
		name: "Webcam",
		price: 79.99,
		originalPrice: 99.99,
		image: "/placeholder.svg",
		category: "Technology",
		rating: 4.2,
		reviews: 134,
		description:
			"HD webcam with autofocus and built-in microphone for video calls",
		inStock: true,
	},
	{
		id: "16",
		name: "Desk Organizer",
		price: 34.99,
		originalPrice: 44.99,
		image: "/placeholder.svg",
		category: "Office Supplies",
		rating: 4.1,
		reviews: 92,
		description:
			"Multi-compartment desk organizer for pens, clips, and small items",
		inStock: true,
	},
	{
		id: "17",
		name: "Gaming Chair",
		price: 449.99,
		originalPrice: 599.99,
		image: "/placeholder.svg",
		category: "Furniture",
		rating: 4.6,
		reviews: 78,
		description:
			"Ergonomic gaming chair with lumbar support and adjustable armrests",
		inStock: false,
	},
	{
		id: "18",
		name: "USB Hub",
		price: 19.99,
		originalPrice: 29.99,
		image: "/placeholder.svg",
		category: "Technology",
		rating: 4.0,
		reviews: 145,
		description:
			"4-port USB 3.0 hub with power adapter for multiple device connections",
		inStock: true,
	},
	{
		id: "19",
		name: "Stapler",
		price: 12.99,
		originalPrice: 16.99,
		image: "/placeholder.svg",
		category: "Office Supplies",
		rating: 4.2,
		reviews: 203,
		description:
			"Heavy-duty stapler with staple remover and 1000 staples included",
		inStock: true,
	},
	{
		id: "20",
		name: "Industrial Equipment",
		price: 1999.99,
		originalPrice: 2499.99,
		image: "/industrial-equipment-warehouse.jpg",
		category: "Technology",
		rating: 4.8,
		reviews: 12,
		description:
			"Heavy-duty industrial equipment for warehouse and manufacturing",
		inStock: true,
	},
]

const categories = ["All", "Furniture", "Office Supplies", "Technology"]
const sortOptions = [
	{ value: "relevance", label: "Relevance" },
	{ value: "price-low", label: "Price: Low to High" },
	{ value: "price-high", label: "Price: High to Low" },
	{ value: "rating", label: "Customer Rating" },
	{ value: "newest", label: "Newest First" },
]

export default function SearchPage() {
	const searchParams = useSearchParams()
	const router = useRouter()

	const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
	const [selectedCategory, setSelectedCategory] = useState(
		searchParams.get("category") || "All"
	)
	const [sortBy, setSortBy] = useState("relevance")
	const [priceRange, setPriceRange] = useState({ min: "", max: "" })
	const [showFilters, setShowFilters] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 6

	// Update state when URL params change
	useEffect(() => {
		const categoryParam = searchParams.get("category")
		if (categoryParam && categoryParam !== selectedCategory) {
			setSelectedCategory(categoryParam)
		}
		const queryParam = searchParams.get("q")
		if (queryParam && queryParam !== searchQuery) {
			setSearchQuery(queryParam)
		}
	}, [searchParams, selectedCategory, searchQuery])

	// Filter products based on search query and filters
	const filteredProducts = mockProducts.filter((product) => {
		const matchesQuery =
			product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			product.category.toLowerCase().includes(searchQuery.toLowerCase())

		const matchesCategory =
			selectedCategory === "All" || product.category === selectedCategory

		const matchesPrice =
			(!priceRange.min || product.price >= Number(priceRange.min)) &&
			(!priceRange.max || product.price <= Number(priceRange.max))

		return matchesQuery && matchesCategory && matchesPrice
	})

	// Sort products
	const sortedProducts = [...filteredProducts].sort((a, b) => {
		switch (sortBy) {
			case "price-low":
				return a.price - b.price
			case "price-high":
				return b.price - a.price
			case "rating":
				return b.rating - a.rating
			case "newest":
				return b.id.localeCompare(a.id)
			default:
				return 0
		}
	})

	// Pagination logic
	const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const paginatedProducts = sortedProducts.slice(startIndex, endIndex)

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
		// Scroll to top when page changes
		window.scrollTo({ top: 0, behavior: "smooth" })
	}

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchQuery.trim()) {
			router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
		}
	}

	const clearFilters = () => {
		setSelectedCategory("All")
		setSortBy("relevance")
		setPriceRange({ min: "", max: "" })
		setCurrentPage(1) // Reset to first page when clearing filters
	}

	return (
		<div className="container mx-auto px-4 py-6">
			{/* Search Header */}
			<div className="mb-6">
				<h1 className="text-2xl font-bold mb-2">
					{searchQuery
						? `Search results for "${searchQuery}"`
						: "Search Products"}
				</h1>
				<p className="text-muted-foreground">
					{filteredProducts.length} products found
					{totalPages > 1 && (
						<span className="ml-2">
							(Page {currentPage} of {totalPages})
						</span>
					)}
				</p>
			</div>

			{/* Search Bar */}
			<form onSubmit={handleSearch} className="mb-6">
				<div className="relative max-w-2xl">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search products, categories..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 pr-4"
					/>
				</div>
			</form>

			<div className="flex flex-col lg:flex-row gap-6">
				{/* Filters Sidebar */}
				<div className="lg:w-64 flex-shrink-0">
					<Card>
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="text-lg">Filters</CardTitle>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setShowFilters(!showFilters)}
									className="lg:hidden"
								>
									<Filter className="h-4 w-4" />
								</Button>
							</div>
						</CardHeader>
						<CardContent
							className={`space-y-4 ${
								showFilters ? "block" : "hidden lg:block"
							}`}
						>
							{/* Category Filter */}
							<div>
								<h3 className="font-medium mb-2">Category</h3>
								<div className="space-y-2">
									{categories.map((category) => (
										<label
											key={category}
											className="flex items-center space-x-2 cursor-pointer"
										>
											<input
												type="radio"
												name="category"
												value={category}
												checked={selectedCategory === category}
												onChange={(e) => setSelectedCategory(e.target.value)}
												className="rounded"
											/>
											<span className="text-sm">{category}</span>
										</label>
									))}
								</div>
							</div>

							<Separator />

							{/* Price Range Filter */}
							<div>
								<h3 className="font-medium mb-2">Price Range</h3>
								<div className="space-y-2">
									<div className="flex space-x-2">
										<Input
											placeholder="Min"
											type="number"
											value={priceRange.min}
											onChange={(e) =>
												setPriceRange((prev) => ({
													...prev,
													min: e.target.value,
												}))
											}
											className="text-sm"
										/>
										<Input
											placeholder="Max"
											type="number"
											value={priceRange.max}
											onChange={(e) =>
												setPriceRange((prev) => ({
													...prev,
													max: e.target.value,
												}))
											}
											className="text-sm"
										/>
									</div>
								</div>
							</div>

							<Separator />

							{/* Clear Filters */}
							<Button
								variant="outline"
								size="sm"
								onClick={clearFilters}
								className="w-full"
							>
								Clear Filters
							</Button>
						</CardContent>
					</Card>
				</div>

				{/* Results */}
				<div className="flex-1">
					{/* Sort Options */}
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center space-x-2">
							<SortAsc className="h-4 w-4 text-muted-foreground" />
							<span className="text-sm text-muted-foreground">Sort by:</span>
						</div>
						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-48">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{sortOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Results Grid */}
					{sortedProducts.length > 0 ? (
						<>
							<ProductGrid products={paginatedProducts}>
								{paginatedProducts.map((product) => (
									<ProductCard
										key={product.id}
										product={{
											id: product.id,
											name: product.name,
											price: product.price,
											originalPrice: product.originalPrice,
											resource: product.image,
											category: product.category,
											rating: product.rating,
											reviews: product.reviews,
											inStock: product.inStock,
										}}
									/>
								))}
							</ProductGrid>

							{/* Pagination */}
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
							/>
						</>
					) : (
						<div className="text-center py-12">
							<Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-medium mb-2">No products found</h3>
							<p className="text-muted-foreground mb-4">
								Try adjusting your search terms or filters
							</p>
							<Button onClick={clearFilters} variant="outline">
								Clear Filters
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
