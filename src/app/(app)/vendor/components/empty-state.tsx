"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search, Filter, RefreshCw } from "lucide-react"

interface EmptyStateProps {
	title: string
	description: string
	actionLabel?: string
	onAction?: () => void
	icon?: React.ReactNode
	variant?: "default" | "search" | "filter" | "error"
	secondaryAction?: {
		label: string
		onClick: () => void
		icon?: React.ReactNode
	}
}

export function EmptyState({
	title,
	description,
	actionLabel,
	onAction,
	icon,
	variant = "default",
	secondaryAction,
}: EmptyStateProps) {
	const getIcon = () => {
		if (icon) return icon

		switch (variant) {
			case "search":
				return <Search className="h-12 w-12 text-muted-foreground" />
			case "filter":
				return <Filter className="h-12 w-12 text-muted-foreground" />
			case "error":
				return <RefreshCw className="h-12 w-12 text-muted-foreground" />
			default:
				return <Plus className="h-12 w-12 text-muted-foreground" />
		}
	}

	return (
		<Card className="border-dashed">
			<CardContent className="flex flex-col items-center justify-center py-12">
				<div className="mb-4">{getIcon()}</div>
				<h3 className="text-lg font-semibold mb-2">{title}</h3>
				<p className="text-muted-foreground text-center mb-6 max-w-md">
					{description}
				</p>
				<div className="flex gap-2">
					{actionLabel && onAction && (
						<Button onClick={onAction} className="flex items-center gap-2">
							<Plus className="h-4 w-4" />
							{actionLabel}
						</Button>
					)}
					{secondaryAction && (
						<Button
							variant="outline"
							onClick={secondaryAction.onClick}
							className="flex items-center gap-2"
						>
							{secondaryAction.icon}
							{secondaryAction.label}
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
