"use client"

import { DataTable, Column } from "../../components/data-table"
import { StatusBadge } from "../../components/status-badge"
import { Badge } from "@/components/ui/badge"
import { MockStock, MockStockHistory } from "@/lib/mocks/mock-data"
import { useState } from "react"

interface StockTableProps {
	stock: MockStock[]
}

export function StockTable({ stock }: StockTableProps) {
	const stockColumns: Column<MockStock>[] = [
		{
			key: "sku_name",
			label: "Product SKU",
			sortable: true,
		},
		{
			key: "current_stock",
			label: "Current Stock",
			render: (value: number) => (
				<Badge variant={value > 0 ? "default" : "destructive"}>{value}</Badge>
			),
			sortable: true,
		},
		{
			key: "sold",
			label: "Sold",
			render: (value: number) => <Badge variant="secondary">{value}</Badge>,
			sortable: true,
		},
		{
			key: "last_updated",
			label: "Last Updated",
			render: (value: string) => new Date(value).toLocaleDateString(),
			sortable: true,
		},
	]

	const historyColumns: Column<MockStockHistory>[] = [
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

	const renderExpandedRow = (item: MockStock) => (
		<div className="space-y-4">
			<h4 className="font-medium">Stock History for {item.sku_name}</h4>

			<DataTable
				data={item.history}
				columns={historyColumns}
				className="max-h-60 overflow-y-auto"
			/>
		</div>
	)

	return (
		<DataTable
			data={stock}
			columns={stockColumns}
			searchKey="sku_name"
			searchPlaceholder="Search by SKU name..."
			expandable
			renderExpandedRow={renderExpandedRow}
		/>
	)
}
