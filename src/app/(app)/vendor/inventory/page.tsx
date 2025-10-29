"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { PageHeader } from "../components/page-header"
import { InventoryTable } from "./components/inventory-table"
import { ImportStockDialog } from "./components/import-stock-dialog"
import { toast } from "sonner"
import { useImportStock } from "@/core/inventory/inventory.vendor"

export default function InventoryPage() {
	const searchParams = useSearchParams()
	const [showImportDialog, setShowImportDialog] = useState(false)

	const importStock = useImportStock()

	// Get SKU from URL parameters
	const selectedSkuId = searchParams.get("sku")
		? parseInt(searchParams.get("sku")!)
		: null

	const handleImportStock = (skuId: number, quantity: number) => {
		importStock.mutate(
			{
				ref_id: skuId,
				change: quantity,
				ref_type: "ProductSku",
				serial_ids: [],
			},
			{
				onSuccess: () => {
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

					{selectedSkuId ? (
						<InventoryTable selectedSkuId={selectedSkuId} />
					) : (
						<div className="flex justify-center py-8">
							<div className="text-muted-foreground">
								Please provide a SKU ID in the URL to view inventory
							</div>
						</div>
					)}

					{showImportDialog && selectedSkuId && (
						<ImportStockDialog
							selectedSkuId={selectedSkuId}
							onImport={handleImportStock}
							onCancel={() => setShowImportDialog(false)}
						/>
					)}
				</div>
			</main>
		</div>
	)
}
