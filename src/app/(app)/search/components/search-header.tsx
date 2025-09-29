"use client"

import { memo } from "react"

interface SearchHeaderProps {
	searchQuery: string
	productsCount: number
	hasNextPage: boolean
}

export const SearchHeader = memo(
	({ searchQuery, productsCount, hasNextPage }: SearchHeaderProps) => (
		<div className="mb-6">
			<h1 className="text-2xl font-bold mb-2">
				{searchQuery
					? `Search results for "${searchQuery}"`
					: "Search Products"}
			</h1>
			<p className="text-muted-foreground">
				{productsCount} products{" "}
				{hasNextPage ? "(scroll to load more...)" : "found"}
			</p>
		</div>
	)
)

SearchHeader.displayName = "SearchHeader"
