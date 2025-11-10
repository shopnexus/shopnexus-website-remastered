"use client"

import { useState, useEffect, useMemo, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useListProductCards } from "@/core/catalog/product.customer"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import {
	SearchHeader,
	SearchBar,
	FiltersSidebar,
	SortControls,
	ResultsSection,
} from "./components"

const categories = ["All", "Furniture", "Office Supplies", "Technology"]
const sortOptions = [
	{ value: "relevance", label: "Relevance" },
	{ value: "price-low", label: "Price: Low to High" },
	{ value: "price-high", label: "Price: High to Low" },
	{ value: "rating", label: "Customer Rating" },
	{ value: "newest", label: "Newest First" },
]

export default function SearchPage() {
	return (
		<Suspense>
			<Search></Search>
		</Suspense>
	)
}

function Search() {
	const searchParams = useSearchParams()
	const router = useRouter()

	const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(
		searchParams.get("q") || ""
	)
	const [selectedCategory, setSelectedCategory] = useState(
		searchParams.get("category") || "All"
	)
	const [sortBy, setSortBy] = useState("relevance")
	const [priceRange, setPriceRange] = useState({ min: "", max: "" })
	const [showFilters, setShowFilters] = useState(false)

	// Debounce search query to prevent excessive API calls
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery)
		}, 300)

		return () => clearTimeout(timer)
	}, [searchQuery])

	// Update state when URL params change
	useEffect(() => {
		const categoryParam = searchParams.get("category")
		const queryParam = searchParams.get("q")

		if (categoryParam && categoryParam !== selectedCategory) {
			setSelectedCategory(categoryParam)
		}
		if (queryParam && queryParam !== searchQuery) {
			setSearchQuery(queryParam)
			setDebouncedSearchQuery(queryParam)
		}
	}, [searchParams])

	// Memoize API parameters to prevent unnecessary re-renders
	const apiParams = useMemo(
		() => ({
			search: debouncedSearchQuery,
			limit: 12,
			...(selectedCategory !== "All" && { category: selectedCategory }),
			...(priceRange.min && { min_price: Number(priceRange.min) }),
			...(priceRange.max && { max_price: Number(priceRange.max) }),
			...(sortBy !== "relevance" && { sort: sortBy as any }),
		}),
		[
			debouncedSearchQuery,
			selectedCategory,
			priceRange.min,
			priceRange.max,
			sortBy,
		]
	)

	// Use API to fetch products
	const infiniteProductCards = useListProductCards(apiParams)
	const { ref, items: products } = useInfiniteScroll(infiniteProductCards)

	const handleSearch = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault()
			if (searchQuery.trim()) {
				router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
			}
		},
		[searchQuery, router]
	)

	const clearFilters = useCallback(() => {
		setSelectedCategory("All")
		setSortBy("relevance")
		setPriceRange({ min: "", max: "" })
	}, [])

	const handleCategoryChange = useCallback((category: string) => {
		setSelectedCategory(category)
	}, [])

	const handleSortChange = useCallback((sort: string) => {
		setSortBy(sort)
	}, [])

	const handlePriceRangeChange = useCallback(
		(field: "min" | "max", value: string) => {
			setPriceRange((prev) => ({
				...prev,
				[field]: value,
			}))
		},
		[]
	)

	const toggleFilters = useCallback(() => {
		setShowFilters((prev) => !prev)
	}, [])

	return (
		<div className="container mx-auto px-4 py-6">
			{/* Search Header */}
			<SearchHeader
				searchQuery={debouncedSearchQuery}
				productsCount={products.length}
				hasNextPage={infiniteProductCards.hasNextPage}
			/>

			{/* Search Bar */}
			<SearchBar
				searchQuery={searchQuery}
				onSearchQueryChange={setSearchQuery}
				onSubmit={handleSearch}
			/>

			<div className="flex flex-col lg:flex-row gap-6">
				{/* Filters Sidebar */}
				<FiltersSidebar
					categories={categories}
					selectedCategory={selectedCategory}
					priceRange={priceRange}
					showFilters={showFilters}
					onCategoryChange={handleCategoryChange}
					onPriceRangeChange={handlePriceRangeChange}
					onToggleFilters={toggleFilters}
					onClearFilters={clearFilters}
				/>

				{/* Results */}
				<div className="flex-1">
					{/* Sort Options */}
					<SortControls
						sortBy={sortBy}
						sortOptions={sortOptions}
						onSortChange={handleSortChange}
					/>

					{/* Results Grid */}
					<ResultsSection
						products={products}
						ref={ref}
						onClearFilters={clearFilters}
					/>
				</div>
			</div>
		</div>
	)
}
