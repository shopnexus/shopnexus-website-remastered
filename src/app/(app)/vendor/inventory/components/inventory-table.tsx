"use client"

import { DataTable, Column } from "../../components/data-table"
import { StatusBadge } from "../../components/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Eye, MoreHorizontal, Edit } from "lucide-react"
import {
	Serial,
	StockHistory,
	useListProductSerials,
	useListStockHistory,
	useUpdateSkuSerial,
} from "@/core/inventory/inventory.vendor"
import { useListProductSPU } from "@/core/catalog/product.vendor"
import { Pagination } from "@/components/ui/pagination"
import { useMemo, useState } from "react"
import { useInfiniteMerge } from "@/hooks/use-infinite-merge"

interface InventoryTableProps {
	selectedSkuId: number
}

export function InventoryTable({ selectedSkuId }: InventoryTableProps) {
	// Local pagination state for each tab
	const [serialPage, setSerialPage] = useState(1)
	const [historyPage, setHistoryPage] = useState(1)
	const SERIAL_LIMIT = 20
	const HISTORY_LIMIT = 20
	// Fetch SPUs for display names only
	const { data: spusData } = useListProductSPU({
		limit: 100,
	})

	// Fetch serials for selected SKU (page-based)
	const infiniteSerials = useListProductSerials({
		sku_id: selectedSkuId,
		limit: SERIAL_LIMIT,
		page: serialPage,
	})
	const serials = useInfiniteMerge(infiniteSerials)
	const serialPages = Math.ceil(
		(infiniteSerials.data?.pages[0].pagination.total ?? 0) / SERIAL_LIMIT
	)

	// Fetch stock history for selected SKU (page-based)
	const infiniteHistoryStocks = useListStockHistory({
		ref_id: selectedSkuId,
		ref_type: "ProductSku",
		limit: HISTORY_LIMIT,
		page: historyPage,
	})
	const historyStocks = useInfiniteMerge(infiniteHistoryStocks)
	const historyPages = Math.ceil(
		(infiniteHistoryStocks.data?.pages[0].pagination.total ?? 0) / HISTORY_LIMIT
	)

	// Mutation for updating serial status
	const updateSerialStatusMutation = useUpdateSkuSerial()

	// Create a map of SPU ID to SPU info for display
	const spuMap = new Map()
	spusData?.pages
		.flatMap((page) => page.data)
		.forEach((spu) => {
			spuMap.set(spu.id, spu.name)
		})

	const serialColumns: Column<Serial & { productName: string }>[] = [
		{
			key: "serial_id",
			label: "Serial Number",
			render: (value: string) => (
				<div className="font-mono text-sm">{value}</div>
			),
			sortable: true,
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

	return (
		<div className="space-y-6 min-w-3xl">
			<Tabs defaultValue="serials" className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="serials">Product Serials</TabsTrigger>
					<TabsTrigger value="history">Stock History</TabsTrigger>
				</TabsList>

				<TabsContent value="serials" className="space-y-4">
					<DataTable
						data={serials.map((serial) => ({
							...serial,
							productName: `SKU ${serial.sku_id}`,
						}))}
						columns={serialColumns}
						searchKey="serial_id"
						searchPlaceholder="Search by serial number..."
						actions={(serial) => (
							<div className="flex items-center gap-1">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											size="sm"
											variant="ghost"
											title="Update Status"
											disabled={updateSerialStatusMutation.isPending}
										>
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										{(["Active", "Inactive", "Sold", "Damaged"] as const).map(
											(status) => (
												<DropdownMenuItem
													key={status}
													onClick={() => {
														updateSerialStatusMutation.mutate({
															serial_ids: [serial.serial_id],
															status,
														})
													}}
													disabled={
														updateSerialStatusMutation.isPending ||
														serial.status === status
													}
													className="cursor-pointer"
												>
													<Edit className="h-4 w-4 mr-2" />
													Set as {status}
												</DropdownMenuItem>
											)
										)}
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						)}
					/>
					<Pagination
						currentPage={serialPage}
						totalPages={serialPages}
						onPageChange={(p) =>
							setSerialPage(Math.min(Math.max(1, p), serialPages ?? 0))
						}
					/>
				</TabsContent>

				<TabsContent value="history" className="space-y-4">
					<Card>
						<CardContent>
							<DataTable
								data={historyStocks}
								columns={historyColumns}
								className="max-h-60 overflow-y-auto"
							/>
							<Pagination
								currentPage={historyPage}
								totalPages={historyPages}
								onPageChange={(p) =>
									setHistoryPage(Math.min(Math.max(1, p), historyPages ?? 0))
								}
							/>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
