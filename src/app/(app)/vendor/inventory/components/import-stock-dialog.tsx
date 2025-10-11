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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { mockSpus } from "../../components/mock-data"

interface ImportStockDialogProps {
	onImport: (skuId: number, quantity: number) => void
	onCancel: () => void
}

export function ImportStockDialog({
	onImport,
	onCancel,
}: ImportStockDialogProps) {
	const [selectedSkuId, setSelectedSkuId] = useState<string>("")
	const [quantity, setQuantity] = useState<number>(0)

	// Flatten all SKUs from all SPUs for selection
	const allSkus = mockSpus.flatMap((spu) =>
		spu.skus.map((sku) => ({
			id: sku.id,
			name: `${spu.name} - ${Object.entries(sku.attributes)
				.map(([k, v]) => `${k}: ${v}`)
				.join(", ")}`,
			spuName: spu.name,
		}))
	)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (selectedSkuId && quantity > 0) {
			onImport(parseInt(selectedSkuId), quantity)
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
					<div className="space-y-2">
						<Label htmlFor="sku">Select SKU</Label>
						<Select value={selectedSkuId} onValueChange={setSelectedSkuId}>
							<SelectTrigger>
								<SelectValue placeholder="Choose a SKU to import" />
							</SelectTrigger>
							<SelectContent>
								{allSkus.map((sku) => (
									<SelectItem key={sku.id} value={sku.id.toString()}>
										{sku.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

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
						<Button type="submit" disabled={!selectedSkuId || quantity <= 0}>
							Import Stock
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
