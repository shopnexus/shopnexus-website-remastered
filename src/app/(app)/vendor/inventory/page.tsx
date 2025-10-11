"use client"

import { useState } from "react"
import { PageHeader } from "../components/page-header"
import { StockTable } from "./components/stock-table"
import { ImportStockDialog } from "./components/import-stock-dialog"
import { mockStock, MockStock } from "../components/mock-data"
import { toast } from "sonner"

export default function InventoryPage() {
	const [stock, setStock] = useState<MockStock[]>(mockStock)
	const [showImportDialog, setShowImportDialog] = useState(false)

	const handleImportStock = (skuId: number, quantity: number) => {
		// In real implementation, this would call the server
		// Server would generate serial numbers and update stock

		setStock((prev) =>
			prev.map((item) =>
				item.sku_id === skuId
					? {
							...item,
							current_stock: item.current_stock + quantity,
							last_updated: new Date().toISOString().split("T")[0],
							history: [
								...item.history,
								{
									id: Math.max(...item.history.map((h) => h.id)) + 1,
									change: quantity,
									date_created: new Date().toISOString().split("T")[0],
								},
							],
					  }
					: item
			)
		)

		toast.success(
			`Successfully imported ${quantity} units. Serial numbers generated automatically.`
		)
		setShowImportDialog(false)
	}

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 py-8 mx-auto">
				<div className="container max-w-7xl">
					<PageHeader
						title="Inventory Management"
						description="Manage stock levels and import new inventory"
						actionLabel="Import Stock"
						onAction={() => setShowImportDialog(true)}
					/>

					<StockTable stock={stock} />

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
