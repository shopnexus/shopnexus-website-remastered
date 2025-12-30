"use client"

import { DataTable, Column } from "@/components/shared/data-table"
import { StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Stock, StockHistory } from "@/core/inventory/inventory.vendor"

interface StockTableProps {
	stock: Stock[]
}

export function StockTable({ stock }: StockTableProps) {
	const stockColumns: Column<Stock>[] = [
		{
			key: "ref_id",
			label: "SKU ID",
			render: (value: string) => `SKU #${value}`,
			sortable: true,
		},
		{
			key: "stock",
			label: "Current Stock",
			render: (value: number) => (
				<Badge variant={value > 0 ? "default" : "destructive"}>{value}</Badge>
			),
			sortable: true,
		},
		{
			key: "taken",
			label: "Sold",
			render: (value: number) => <Badge variant="secondary">{value}</Badge>,
			sortable: true,
		},
		{
			key: "date_created",
			label: "Last Updated",
			render: (value: string) => new Date(value).toLocaleDateString(),
			sortable: true,
		},
	]

	const historyColumns: Column<StockHistory>[] = [
		{
			key: "change",
			label: "Change",
			render: (value: number) => (
				<Badge variant={value > 0 ? "default" : "destructive"}>
					{value > 0 ? `+${value}` : value}
				</Badge>
			),
		},
		{
			key: "date_created",
			label: "Date",
			render: (value: string) => new Date(value).toLocaleDateString(),
		},
	]

	// Note: Stock history would need to be fetched separately for each expanded row
	// For now, showing basic info. In a real implementation, you'd fetch history
	// when a row is expanded using a state-based approach
	const renderExpandedRow = (item: Stock) => (
		<div className="space-y-4">
			<h4 className="font-medium">Stock History for {item.ref_id}</h4>
			<p className="text-sm text-muted-foreground">
				Stock: {item.stock} | Sold: {item.taken}
			</p>
			<p className="text-xs text-muted-foreground">
				Note: Detailed history can be fetched when row is expanded
			</p>
		</div>
	)

	return (
		<DataTable
			data={stock}
			columns={stockColumns}
			searchKey="ref_id"
			searchPlaceholder="Search by SKU ID..."
			expandable
			renderExpandedRow={renderExpandedRow}
		/>
	)
}
