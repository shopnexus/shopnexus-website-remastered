"use client"

import { useState, useEffect } from "react"
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
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { MockSKU, MockSPU } from "../../components/mock-data"

interface SKUFormProps {
	sku: MockSKU | null
	spu: MockSPU
	onSave: (skuData: Partial<MockSKU>) => void
	onCancel: () => void
}

export function SKUForm({ sku, spu, onSave, onCancel }: SKUFormProps) {
	const [formData, setFormData] = useState({
		price: 0,
		stock: 0,
		can_combine: true,
		attributes: {} as Record<string, string>,
	})

	const [newAttribute, setNewAttribute] = useState({ key: "", value: "" })

	useEffect(() => {
		if (sku) {
			setFormData({
				price: sku.price,
				stock: sku.stock,
				can_combine: sku.can_combine,
				attributes: { ...sku.attributes },
			})
		} else {
			setFormData({
				price: 0,
				stock: 0,
				can_combine: true,
				attributes: {},
			})
		}
	}, [sku])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSave(formData)
	}

	const handleChange = (field: string, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
	}

	const addAttribute = () => {
		if (newAttribute.key && newAttribute.value) {
			setFormData((prev) => ({
				...prev,
				attributes: {
					...prev.attributes,
					[newAttribute.key]: newAttribute.value,
				},
			}))
			setNewAttribute({ key: "", value: "" })
		}
	}

	const removeAttribute = (key: string) => {
		setFormData((prev) => {
			const newAttributes = { ...prev.attributes }
			delete newAttributes[key]
			return { ...prev, attributes: newAttributes }
		})
	}

	return (
		<Dialog open onOpenChange={onCancel}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{sku ? "Edit SKU" : "Create New SKU"}</DialogTitle>
					<DialogDescription>
						{sku ? "Update SKU information" : `Add a new SKU for ${spu.name}`}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="price">Price ($)</Label>
						<Input
							id="price"
							type="number"
							min="0"
							step="0.01"
							value={formData.price}
							onChange={(e) =>
								handleChange("price", parseFloat(e.target.value) || 0)
							}
							placeholder="0.00"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="stock">Initial Stock</Label>
						<Input
							id="stock"
							type="number"
							min="0"
							value={formData.stock}
							onChange={(e) =>
								handleChange("stock", parseInt(e.target.value) || 0)
							}
							placeholder="0"
							required
						/>
					</div>

					<div className="flex items-center space-x-2">
						<Switch
							id="can_combine"
							checked={formData.can_combine}
							onCheckedChange={(checked) =>
								handleChange("can_combine", checked)
							}
						/>
						<Label htmlFor="can_combine">Can Combine</Label>
					</div>

					<div className="space-y-2">
						<Label>Attributes</Label>
						<div className="space-y-2">
							{Object.entries(formData.attributes).map(([key, value]) => (
								<div key={key} className="flex items-center gap-2">
									<Badge
										variant="secondary"
										className="flex items-center gap-1"
									>
										{key}: {value}
										<Button
											type="button"
											size="sm"
											variant="ghost"
											className="h-4 w-4 p-0 hover:bg-transparent"
											onClick={() => removeAttribute(key)}
										>
											<X className="h-3 w-3" />
										</Button>
									</Badge>
								</div>
							))}

							<div className="flex gap-2">
								<Input
									placeholder="Attribute name"
									value={newAttribute.key}
									onChange={(e) =>
										setNewAttribute((prev) => ({
											...prev,
											key: e.target.value,
										}))
									}
									className="flex-1"
								/>
								<Input
									placeholder="Value"
									value={newAttribute.value}
									onChange={(e) =>
										setNewAttribute((prev) => ({
											...prev,
											value: e.target.value,
										}))
									}
									className="flex-1"
								/>
								<Button
									type="button"
									size="sm"
									onClick={addAttribute}
									disabled={!newAttribute.key || !newAttribute.value}
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={onCancel}>
							Cancel
						</Button>
						<Button type="submit">{sku ? "Update SKU" : "Create SKU"}</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
