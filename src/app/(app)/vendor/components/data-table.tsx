"use client"

import { useState } from "react"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { ChevronDown, ChevronRight, Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Column<T> {
	key: keyof T | string
	label: string
	sortable?: boolean
	render?: (value: any, row: T) => React.ReactNode
	className?: string
}

export interface DataTableProps<T> {
	data: T[]
	columns: Column<T>[]
	searchKey?: keyof T
	searchPlaceholder?: string
	expandable?: boolean
	renderExpandedRow?: (row: T) => React.ReactNode
	actions?: (row: T) => React.ReactNode
	className?: string
}

export function DataTable<T extends Record<string, any>>({
	data,
	columns,
	searchKey,
	searchPlaceholder = "Search...",
	expandable = false,
	renderExpandedRow,
	actions,
	className,
}: DataTableProps<T>) {
	const [searchTerm, setSearchTerm] = useState("")
	const [sortKey, setSortKey] = useState<keyof T | null>(null)
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
	const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

	// Filter data
	const filteredData = data.filter((item) => {
		if (!searchTerm || !searchKey) return true
		const value = item[searchKey]
		return String(value).toLowerCase().includes(searchTerm.toLowerCase())
	})

	// Sort data
	const sortedData = [...filteredData].sort((a, b) => {
		if (!sortKey) return 0

		const aVal = a[sortKey]
		const bVal = b[sortKey]

		if (aVal < bVal) return sortDirection === "asc" ? -1 : 1
		if (aVal > bVal) return sortDirection === "asc" ? 1 : -1
		return 0
	})

	const handleSort = (key: keyof T) => {
		if (sortKey === key) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc")
		} else {
			setSortKey(key)
			setSortDirection("asc")
		}
	}

	const toggleExpanded = (index: number) => {
		const newExpanded = new Set(expandedRows)
		if (newExpanded.has(index)) {
			newExpanded.delete(index)
		} else {
			newExpanded.add(index)
		}
		setExpandedRows(newExpanded)
	}

	return (
		<div className={cn("space-y-4", className)}>
			{/* Search and Filters */}
			{(searchKey || actions) && (
				<div className="flex items-center gap-4">
					{searchKey && (
						<div className="relative flex-1 max-w-sm">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder={searchPlaceholder}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
					)}
				</div>
			)}

			{/* Table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							{expandable && <TableHead className="w-12"></TableHead>}
							{columns.map((column) => (
								<TableHead
									key={String(column.key)}
									className={cn(
										column.sortable && "cursor-pointer hover:bg-muted/50",
										column.className
									)}
									onClick={() =>
										column.sortable && handleSort(column.key as keyof T)
									}
								>
									<div className="flex items-center gap-2">
										{column.label}
										{column.sortable && sortKey === column.key && (
											<span className="text-xs">
												{sortDirection === "asc" ? "↑" : "↓"}
											</span>
										)}
									</div>
								</TableHead>
							))}
							{actions && <TableHead className="w-20">Actions</TableHead>}
						</TableRow>
					</TableHeader>
					<TableBody>
						{sortedData.map((row, index) => (
							<>
								<TableRow key={index}>
									{expandable && (
										<TableCell>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => toggleExpanded(index)}
												className="h-8 w-8 p-0"
											>
												{expandedRows.has(index) ? (
													<ChevronDown className="h-4 w-4" />
												) : (
													<ChevronRight className="h-4 w-4" />
												)}
											</Button>
										</TableCell>
									)}
									{columns.map((column) => (
										<TableCell
											key={String(column.key)}
											className={column.className}
										>
											{column.render
												? column.render(row[column.key], row)
												: String(row[column.key] || "")}
										</TableCell>
									))}
									{actions && <TableCell>{actions(row)}</TableCell>}
								</TableRow>
								{expandable && expandedRows.has(index) && renderExpandedRow && (
									<TableRow>
										<TableCell
											colSpan={columns.length + (actions ? 2 : 1)}
											className="p-0"
										>
											<div className="p-4 bg-muted/30">
												{renderExpandedRow(row)}
											</div>
										</TableCell>
									</TableRow>
								)}
							</>
						))}
					</TableBody>
				</Table>
			</div>

			{sortedData.length === 0 && (
				<div className="text-center py-8 text-muted-foreground">
					No data found
				</div>
			)}
		</div>
	)
}
