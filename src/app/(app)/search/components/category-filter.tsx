"use client"

import { memo } from "react"

interface CategoryFilterProps {
	categories: string[]
	selectedCategory: string
	onCategoryChange: (category: string) => void
}

export const CategoryFilter = memo(
	({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => (
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
							onChange={(e) => onCategoryChange(e.target.value)}
							className="rounded"
						/>
						<span className="text-sm">{category}</span>
					</label>
				))}
			</div>
		</div>
	)
)

CategoryFilter.displayName = "CategoryFilter"
