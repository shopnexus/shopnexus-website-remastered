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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { MockSPU } from "@/lib/mocks/mock-data"

interface SPUFormProps {
	spu: MockSPU | null
	onSave: (spuData: Partial<MockSPU>) => void
	onCancel: () => void
}

export function SPUForm({ spu, onSave, onCancel }: SPUFormProps) {
	const [formData, setFormData] = useState({
		code: "",
		name: "",
		description: "",
		brand: "",
		category: "",
		is_active: true,
	})

	useEffect(() => {
		if (spu) {
			setFormData({
				code: spu.code,
				name: spu.name,
				description: spu.description,
				brand: spu.brand,
				category: spu.category,
				is_active: spu.is_active,
			})
		} else {
			setFormData({
				code: "",
				name: "",
				description: "",
				brand: "",
				category: "",
				is_active: true,
			})
		}
	}, [spu])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSave(formData)
	}

	const handleChange = (field: string, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
	}

	return (
		<Dialog open onOpenChange={onCancel}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{spu ? "Edit Product" : "Create New Product"}
					</DialogTitle>
					<DialogDescription>
						{spu
							? "Update product information"
							: "Add a new product to your catalog"}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="code">Product Code</Label>
						<Input
							id="code"
							value={formData.code}
							onChange={(e) => handleChange("code", e.target.value)}
							placeholder="e.g., LAPTOP-001"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="name">Product Name</Label>
						<Input
							id="name"
							value={formData.name}
							onChange={(e) => handleChange("name", e.target.value)}
							placeholder="e.g., Business Laptop Pro"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							value={formData.description}
							onChange={(e) => handleChange("description", e.target.value)}
							placeholder="Product description..."
							rows={3}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="brand">Brand</Label>
						<Input
							id="brand"
							value={formData.brand}
							onChange={(e) => handleChange("brand", e.target.value)}
							placeholder="e.g., TechCorp"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="category">Category</Label>
						<Input
							id="category"
							value={formData.category}
							onChange={(e) => handleChange("category", e.target.value)}
							placeholder="e.g., Electronics"
							required
						/>
					</div>

					<div className="flex items-center space-x-2">
						<Switch
							id="is_active"
							checked={formData.is_active}
							onCheckedChange={(checked) => handleChange("is_active", checked)}
						/>
						<Label htmlFor="is_active">Active</Label>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={onCancel}>
							Cancel
						</Button>
						<Button type="submit">
							{spu ? "Update Product" : "Create Product"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
