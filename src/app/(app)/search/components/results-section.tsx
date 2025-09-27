"use client"

import { memo } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductGrid } from "@/components/product/product-grid"

interface ResultsSectionProps {
	products: any[]
	ref: React.RefObject<HTMLDivElement>
	onClearFilters: () => void
}

export const ResultsSection = memo(
	({ products, ref, onClearFilters }: ResultsSectionProps) => {
		if (products.length > 0) {
			return <ProductGrid products={products} ref={ref} />
		}

		return (
			<div className="text-center py-12">
				<Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
				<h3 className="text-lg font-medium mb-2">No products found</h3>
				<p className="text-muted-foreground mb-4">
					Try adjusting your search terms or filters
				</p>
				<Button onClick={onClearFilters} variant="outline">
					Clear Filters
				</Button>
			</div>
		)
	}
)

ResultsSection.displayName = "ResultsSection"
