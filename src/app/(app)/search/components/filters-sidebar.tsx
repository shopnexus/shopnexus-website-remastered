"use client"

import { memo } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CategoryFilter } from "./category-filter"
import { PriceRangeFilter } from "./price-range-filter"

interface FiltersSidebarProps {
	categories: string[]
	selectedCategory: string
	priceRange: { min: string; max: string }
	showFilters: boolean
	onCategoryChange: (category: string) => void
	onPriceRangeChange: (field: "min" | "max", value: string) => void
	onToggleFilters: () => void
	onClearFilters: () => void
}

export const FiltersSidebar = memo(
	({
		categories,
		selectedCategory,
		priceRange,
		showFilters,
		onCategoryChange,
		onPriceRangeChange,
		onToggleFilters,
		onClearFilters,
	}: FiltersSidebarProps) => (
		<div className="lg:w-64 flex-shrink-0">
			<Card>
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<CardTitle className="text-lg">Filters</CardTitle>
						<Button
							variant="ghost"
							size="sm"
							onClick={onToggleFilters}
							className="lg:hidden"
						>
							<Filter className="h-4 w-4" />
						</Button>
					</div>
				</CardHeader>
				<CardContent
					className={`space-y-4 ${showFilters ? "block" : "hidden lg:block"}`}
				>
					{/* Category Filter */}
					{/* <CategoryFilter
						categories={categories}
						selectedCategory={selectedCategory}
						onCategoryChange={onCategoryChange}
					/> */}

					<Separator />

					{/* Price Range Filter */}
					<PriceRangeFilter
						priceRange={priceRange}
						onPriceRangeChange={onPriceRangeChange}
					/>

					<Separator />

					{/* Clear Filters */}
					<Button
						variant="outline"
						size="sm"
						onClick={onClearFilters}
						className="w-full"
					>
						Clear Filters
					</Button>
				</CardContent>
			</Card>
		</div>
	)
)

FiltersSidebar.displayName = "FiltersSidebar"
