"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { PageHeader } from "../components/page-header"
import { InventoryTable } from "./components/inventory-table"
import { ImportStockDialog } from "./components/import-stock-dialog"
import { toast } from "sonner"
import { useListStock, useImportStock } from "@/core/inventory/inventory.vendor"

export default function InventoryPage() {
	const searchParams = useSearchParams()
	const [showImportDialog, setShowImportDialog] = useState(false)
	const [selectedSkuId, setSelectedSkuId] = useState<number | null>(null)

	// Load stock data from API
	const { data: stockData = [], isLoading: stockLoading } = useListStock()
	const importStock = useImportStock()

	// Handle URL parameter for SKU filtering
	useEffect(() => {
		const skuParam = searchParams.get("sku")
		if (skuParam) {
			setSelectedSkuId(parseInt(skuParam))
		}
	}, [searchParams])

	const handleImportStock = (skuId: number, quantity: number) => {
		importStock.mutate(
			{
				ref_id: skuId,
				change: quantity,
				ref_type: "ProductSku",
				serial_ids: [],
			},
			{
				onSuccess: (data) => {
					toast.success(`Successfully imported ${quantity} units.`)
					setShowImportDialog(false)
				},
				onError: () => {
					toast.error("Failed to import stock. Please try again.")
				},
			}
		)
	}

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 py-8 mx-auto">
				<div className="container max-w-7xl">
					<PageHeader
						title="Inventory Management"
						description="Manage stock levels and track product serials"
						actionLabel="Import Stock"
						onAction={() => setShowImportDialog(true)}
					/>

					<InventoryTable
						stock={[]}
						selectedSkuId={selectedSkuId}
						onSkuChange={setSelectedSkuId}
					/>

					{showImportDialog && (
						<ImportStockDialog
							onImport={handleImportStock}
							onCancel={() => setShowImportDialog(false)}
						/>
					)}
				</div>
			</main>
		</div>
	)
}
