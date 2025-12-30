"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, TrendingUp, TrendingDown } from "lucide-react"

interface Stat {
	label: string
	value: string | number
	change?: number
	trend?: "up" | "down"
}

interface SecondaryAction {
	label: string
	icon?: React.ReactNode
	onClick: () => void
	variant?:
		| "default"
		| "outline"
		| "secondary"
		| "ghost"
		| "link"
		| "destructive"
}

interface PageHeaderProps {
	title: string
	description?: string
	actionLabel?: string
	onAction?: () => void
	children?: React.ReactNode
	stats?: Stat[]
	secondaryActions?: SecondaryAction[]
}

export function PageHeader({
	title,
	description,
	actionLabel,
	onAction,
	children,
	stats,
	secondaryActions,
}: PageHeaderProps) {
	return (
		<div className="space-y-6 mb-8">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-balance">{title}</h1>
					{description && (
						<p className="text-muted-foreground text-pretty mt-1">
							{description}
						</p>
					)}
				</div>

				<div className="flex items-center gap-2">
					{children}
					{secondaryActions?.map((action, index) => (
						<Button
							key={index}
							variant={action.variant || "outline"}
							size="sm"
							onClick={action.onClick}
							className="flex items-center gap-2"
						>
							{action.icon}
							{action.label}
						</Button>
					))}
					{actionLabel && onAction && (
						<Button onClick={onAction} className="flex items-center gap-2">
							<Plus className="h-4 w-4" />
							{actionLabel}
						</Button>
					)}
				</div>
			</div>

			{stats && stats.length > 0 && (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{stats.map((stat, index) => (
						<Card key={index} className="relative overflow-hidden">
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium text-muted-foreground">
											{stat.label}
										</p>
										<p className="text-2xl font-bold">{stat.value}</p>
									</div>
									{stat.change !== undefined && stat.trend && (
										<div className="flex items-center space-x-1">
											{stat.trend === "up" ? (
												<TrendingUp className="h-4 w-4 text-green-500" />
											) : (
												<TrendingDown className="h-4 w-4 text-red-500" />
											)}
											<span
												className={`text-xs ${
													stat.trend === "up"
														? "text-green-500"
														: "text-red-500"
												}`}
											>
												{stat.change > 0 ? "+" : ""}
												{stat.change}%
											</span>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	)
}

