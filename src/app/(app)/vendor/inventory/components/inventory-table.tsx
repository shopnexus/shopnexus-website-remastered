"use client"

import { DataTable, Column } from "../../components/data-table"
import { StatusBadge } from "../../components/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	MockStock,
	MockStockHistory,
	MockProductSerial,
} from "../../components/mock-data"
import { useState } from "react"
import { Package, Search, Filter, Eye } from "lucide-react"
import { useListProductSerials } from "@/core/inventory/inventory.vendor"

// Mock data for product serials - in real app this would come from API
const mockProductSerials: MockProductSerial[] = [
	{
		id: 1,
		serial_number: "BLP-001-SILVER-512",
		sku_id: 1,
		status: "Active",
		date_created: "2024-01-15",
		sku_name: "Business Laptop Pro - Silver 512GB",
	},
	{
		id: 2,
		serial_number: "BLP-002-SILVER-512",
		sku_id: 1,
		status: "Sold",
		date_created: "2024-01-15",
		sku_name: "Business Laptop Pro - Silver 512GB",
	},
	{
		id: 3,
		serial_number: "BLP-003-SILVER-512",
		sku_id: 1,
		status: "Damaged",
		date_created: "2024-01-15",
		sku_name: "Business Laptop Pro - Silver 512GB",
	},
	{
		id: 4,
		serial_number: "BLP-004-BLACK-1TB",
		sku_id: 2,
		status: "Active",
		date_created: "2024-01-16",
		sku_name: "Business Laptop Pro - Black 1TB",
	},
	{
		id: 5,
		serial_number: "BLP-005-BLACK-1TB",
		sku_id: 2,
		status: "Sold",
		date_created: "2024-01-16",
		sku_name: "Business Laptop Pro - Black 1TB",
	},
]

interface InventoryTableProps {
	stock: MockStock[]
	selectedSkuId?: number | null
	onSkuChange?: (skuId: number | null) => void
}

export function InventoryTable({
	stock,
	selectedSkuId,
	onSkuChange,
}: InventoryTableProps) {
	// Filter serials by selected SKU
	const filteredSerials = selectedSkuId
		? mockProductSerials.filter((serial) => serial.sku_id === selectedSkuId)
		: mockProductSerials

	// Group serials by status for summary
	const statusCounts = filteredSerials.reduce((acc, serial) => {
		acc[serial.status] = (acc[serial.status] || 0) + 1
		return acc
	}, {} as Record<string, number>)

	const serialColumns: Column<MockProductSerial>[] = [
		{
			key: "serial_number",
			label: "Serial Number",
			render: (value: string) => (
				<div className="font-mono text-sm">{value}</div>
			),
			sortable: true,
		},
		{
			key: "sku_name",
			label: "Product",
			render: (value: string) => (
				<div className="max-w-48 truncate">{value}</div>
			),
		},
		{
			key: "status",
			label: "Status",
			render: (status: string) => {
				const variants = {
					Active: "default",
					Sold: "secondary",
					Damaged: "destructive",
					Inactive: "outline",
				} as const
				return (
					<StatusBadge
						status={status}
						variant={variants[status as keyof typeof variants] || "outline"}
					/>
				)
			},
			sortable: true,
		},
		{
			key: "date_created",
			label: "Created",
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

	return (
		<div className="space-y-6">
			<Tabs defaultValue="serials" className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="serials">Product Serials</TabsTrigger>
					<TabsTrigger value="history">Stock History</TabsTrigger>
				</TabsList>

				<TabsContent value="serials" className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							{/* <div className="flex items-center gap-2">
								<Search className="h-4 w-4" />
								<span className="text-sm font-medium">Filter by SKU:</span>
							</div> */}
							{/* <select
								value={selectedSkuId || ""}
								onChange={(e) =>
									handleSkuChange(
										e.target.value ? parseInt(e.target.value) : null
									)
								}
								className="px-3 py-1 border rounded-md text-sm"
							>
								<option value="">All SKUs</option>
								{Array.from(
									new Set(mockProductSerials.map((s) => s.sku_id))
								).map((skuId) => {
									const serial = mockProductSerials.find(
										(s) => s.sku_id === skuId
									)
									return (
										<option key={skuId} value={skuId}>
											{serial?.sku_name}
										</option>
									)
								})}
							</select> */}
						</div>

						{/* Status Summary */}
						<div className="flex items-center gap-2">
							{Object.entries(statusCounts).map(([status, count]) => {
								const variants = {
									Active: "default",
									Sold: "secondary",
									Damaged: "destructive",
									Inactive: "outline",
								} as const
								return (
									<Badge
										key={status}
										variant={
											variants[status as keyof typeof variants] || "outline"
										}
									>
										{status}: {count}
									</Badge>
								)
							})}
						</div>
					</div>

					<DataTable
						data={filteredSerials}
						columns={serialColumns}
						searchKey="serial_number"
						searchPlaceholder="Search by serial number..."
						actions={(serial) => (
							<div className="flex items-center gap-1">
								<Button
									size="sm"
									variant="ghost"
									onClick={() => {
										// View serial details
										console.log("View serial:", serial.serial_number)
									}}
									title="View Details"
								>
									<Eye className="h-4 w-4" />
								</Button>
							</div>
						)}
					/>
				</TabsContent>

				<TabsContent value="history" className="space-y-4">
					{stock.length > 0 ? (
						<div className="space-y-4">
							{stock.map((item) => (
								<Card key={item.id}>
									<CardHeader>
										<CardTitle className="text-base">{item.sku_name}</CardTitle>
									</CardHeader>
									<CardContent>
										<DataTable
											data={item.history}
											columns={historyColumns}
											className="max-h-60 overflow-y-auto"
										/>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<Card>
							<CardContent className="flex flex-col items-center justify-center py-12">
								<Package className="h-12 w-12 text-muted-foreground mb-4" />
								<h3 className="text-lg font-semibold mb-2">No History Data</h3>
								<p className="text-muted-foreground text-center">
									Stock history will appear here after importing inventory
								</p>
							</CardContent>
						</Card>
					)}
				</TabsContent>
			</Tabs>
		</div>
	)
}
