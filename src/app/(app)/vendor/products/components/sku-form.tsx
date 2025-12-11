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
import { ProductSku, ProductSPU } from "@/core/catalog/product.vendor"

interface SKUFormProps {
	sku: ProductSku | null
	spu: ProductSPU
	onSave: (
		skuData: Partial<ProductSku> & {
			price?: number
			can_combine?: boolean
			attributes?: { name: string; value: string }[]
			stock?: number
			package_details?: {
				weight_grams: number
				length_cm: number
				width_cm: number
				height_cm: number
			}
		}
	) => void
	onCancel: () => void
}

export function SKUForm({ sku, spu, onSave, onCancel }: SKUFormProps) {
	const [formData, setFormData] = useState({
		price: 0,
		stock: 0,
		can_combine: true,
		attributes: [] as { name: string; value: string }[],
		package_details: {
			weight_grams: 0,
			length_cm: 0,
			width_cm: 0,
			height_cm: 0,
		},
	})

	const [newAttribute, setNewAttribute] = useState({ name: "", value: "" })

	useEffect(() => {
		if (sku) {
			setFormData({
				price: sku.price,
				stock: sku.stock,
				can_combine: sku.can_combine,
				attributes: sku.attributes,
				package_details: {
					weight_grams: sku.package_details?.weight_grams ?? 0,
					length_cm: sku.package_details?.length_cm ?? 0,
					width_cm: sku.package_details?.width_cm ?? 0,
					height_cm: sku.package_details?.height_cm ?? 0,
				},
			})
		} else {
			setFormData({
				price: 0,
				stock: 0,
				can_combine: true,
				attributes: [],
				package_details: {
					weight_grams: 0,
					length_cm: 0,
					width_cm: 0,
					height_cm: 0,
				},
			})
		}
	}, [sku])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSave(formData)
	}

	const handleChange = (field: string, value: unknown) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
	}
	const handlePackageChange = (
		field: "weight_grams" | "length_cm" | "width_cm" | "height_cm",
		value: number
	) => {
		setFormData((prev) => ({
			...prev,
			package_details: {
				...prev.package_details,
				[field]: value,
			},
		}))
	}

	const addAttribute = () => {
		if (newAttribute.name && newAttribute.value) {
			setFormData((prev) => ({
				...prev,
				attributes: [
					...prev.attributes,
					{ name: newAttribute.name, value: newAttribute.value },
				],
			}))
			setNewAttribute({ name: "", value: "" })
		}
	}

	const removeAttribute = (key: string) => {
		setFormData((prev) => ({
			...prev,
			attributes: prev.attributes.filter((attr) => attr.name !== key),
		}))
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

					{/* <div className="space-y-2">
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
					</div> */}

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
						<Label>Package Details</Label>
						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1">
								<Label htmlFor="weight_grams">Weight (g)</Label>
								<Input
									id="weight_grams"
									type="number"
									min="0"
									step="1"
									value={formData.package_details.weight_grams}
									onChange={(e) =>
										handlePackageChange(
											"weight_grams",
											parseInt(e.target.value) || 0
										)
									}
									placeholder="e.g. 500"
									required
								/>
							</div>
							<div className="space-y-1">
								<Label htmlFor="length_cm">Length (cm)</Label>
								<Input
									id="length_cm"
									type="number"
									min="0"
									step="0.1"
									value={formData.package_details.length_cm}
									onChange={(e) =>
										handlePackageChange(
											"length_cm",
											parseFloat(e.target.value) || 0
										)
									}
									placeholder="e.g. 20"
									required
								/>
							</div>
							<div className="space-y-1">
								<Label htmlFor="width_cm">Width (cm)</Label>
								<Input
									id="width_cm"
									type="number"
									min="0"
									step="0.1"
									value={formData.package_details.width_cm}
									onChange={(e) =>
										handlePackageChange(
											"width_cm",
											parseFloat(e.target.value) || 0
										)
									}
									placeholder="e.g. 10"
									required
								/>
							</div>
							<div className="space-y-1">
								<Label htmlFor="height_cm">Height (cm)</Label>
								<Input
									id="height_cm"
									type="number"
									min="0"
									step="0.1"
									value={formData.package_details.height_cm}
									onChange={(e) =>
										handlePackageChange(
											"height_cm",
											parseFloat(e.target.value) || 0
										)
									}
									placeholder="e.g. 5"
									required
								/>
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<Label>Attributes</Label>
						<div className="space-y-2">
							{formData.attributes.map(({ name, value }) => (
								<div key={name} className="flex items-center gap-2">
									<Badge
										variant="secondary"
										className="flex items-center gap-1"
									>
										{name}: {value}
										<Button
											type="button"
											size="sm"
											variant="ghost"
											className="h-4 w-4 p-0 hover:bg-transparent"
											onClick={() => removeAttribute(name)}
										>
											<X className="h-3 w-3" />
										</Button>
									</Badge>
								</div>
							))}

							<div className="flex gap-2">
								<Input
									placeholder="Attribute name"
									value={newAttribute.name}
									onChange={(e) =>
										setNewAttribute((prev) => ({
											...prev,
											name: e.target.value,
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
									disabled={!newAttribute.name || !newAttribute.value}
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
