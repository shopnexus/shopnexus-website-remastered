"use client"

import { memo } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
	searchQuery: string
	onSearchQueryChange: (query: string) => void
	onSubmit: (e: React.FormEvent) => void
}

export const SearchBar = memo(
	({ searchQuery, onSearchQueryChange, onSubmit }: SearchBarProps) => (
		<form onSubmit={onSubmit} className="mb-6">
			<div className="relative max-w-2xl">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					placeholder="Search products, categories..."
					defaultValue={searchQuery}
					onChange={(e) => onSearchQueryChange(e.target.value)}
					className="pl-10 pr-4"
				/>
			</div>
		</form>
	)
)

SearchBar.displayName = "SearchBar"
