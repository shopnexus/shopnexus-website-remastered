"use client"

import { useState } from "react"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	useListProductSPU,
	useListProductSKU,
} from "@/core/catalog/product.vendor"

interface ImportStockDialogProps {
	selectedSkuId: number
	onImport: (skuId: number, quantity: number) => void
	onCancel: () => void
}

export function ImportStockDialog({
	selectedSkuId,
	onImport,
	onCancel,
}: ImportStockDialogProps) {
	const [quantity, setQuantity] = useState<number>(0)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (quantity > 0) {
			onImport(selectedSkuId, quantity)
		}
	}

	return (
		<Dialog open onOpenChange={onCancel}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Import Stock</DialogTitle>
					<DialogDescription>
						Import new inventory. Serial numbers will be generated automatically
						by the server.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* <div className="space-y-2">
						<Label>Selected SKU</Label>
						<div className="p-3 bg-muted rounded-md">
							<div className="font-medium">
								{selectedSpu?.name || `SPU ${selectedSku?.spu_id}`}
							</div>
							<div className="text-sm text-muted-foreground">
								SKU {selectedSkuId} -{" "}
								{selectedSku?.attributes
									?.map(
										(attr: { name: string; value: string }) =>
											`${attr.name}: ${attr.value}`
									)
									.join(", ")}
							</div>
						</div>
					</div> */}

					<div className="space-y-2">
						<Label htmlFor="quantity">Quantity to Import</Label>
						<Input
							id="quantity"
							type="number"
							min="1"
							value={quantity}
							onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
							placeholder="Enter quantity"
							required
						/>
						<p className="text-sm text-muted-foreground">
							The server will automatically generate{" "}
							{quantity > 0 ? quantity : "X"} unique serial numbers for this
							import.
						</p>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={onCancel}>
							Cancel
						</Button>
						<Button type="submit" disabled={quantity <= 0}>
							Import Stock
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
