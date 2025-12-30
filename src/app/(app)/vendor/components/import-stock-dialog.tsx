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

interface ImportStockDialogProps {
	skuId: number
	skuName?: string
	onImport: (skuId: number, quantity: number) => void
	onCancel: () => void
}

export function ImportStockDialog({
	skuId,
	skuName,
	onImport,
	onCancel,
}: ImportStockDialogProps) {
	const [quantity, setQuantity] = useState<number>(0)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (quantity > 0) {
			onImport(skuId, quantity)
		}
	}

	const description = skuName
		? `Import new inventory for ${skuName}. Serial numbers will be generated automatically by the server.`
		: `Import new inventory. Serial numbers will be generated automatically by the server.`

	return (
		<Dialog open onOpenChange={onCancel}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Import Stock</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
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

