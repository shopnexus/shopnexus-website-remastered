"use client"

import { memo } from "react"
import { Input } from "@/components/ui/input"

interface PriceRangeFilterProps {
	priceRange: { min: string; max: string }
	onPriceRangeChange: (field: "min" | "max", value: string) => void
}

export const PriceRangeFilter = memo(
	({ priceRange, onPriceRangeChange }: PriceRangeFilterProps) => (
		<div>
			<h3 className="font-medium mb-2">Price Range</h3>
			<div className="space-y-2">
				<div className="flex space-x-2">
					<Input
						placeholder="Min"
						type="number"
						value={priceRange.min}
						onChange={(e) => onPriceRangeChange("min", e.target.value)}
						className="text-sm"
					/>
					<Input
						placeholder="Max"
						type="number"
						value={priceRange.max}
						onChange={(e) => onPriceRangeChange("max", e.target.value)}
						className="text-sm"
					/>
				</div>
			</div>
		</div>
	)
)

PriceRangeFilter.displayName = "PriceRangeFilter"
