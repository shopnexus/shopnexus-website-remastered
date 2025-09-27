"use client"

import { memo } from "react"
import { SortAsc } from "lucide-react"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

interface SortOption {
	value: string
	label: string
}

interface SortControlsProps {
	sortBy: string
	sortOptions: SortOption[]
	onSortChange: (sort: string) => void
}

export const SortControls = memo(
	({ sortBy, sortOptions, onSortChange }: SortControlsProps) => (
		<div className="flex items-center justify-between mb-4">
			<div className="flex items-center space-x-2">
				<SortAsc className="h-4 w-4 text-muted-foreground" />
				<span className="text-sm text-muted-foreground">Sort by:</span>
			</div>
			<Select value={sortBy} onValueChange={onSortChange}>
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
	)
)

SortControls.displayName = "SortControls"
