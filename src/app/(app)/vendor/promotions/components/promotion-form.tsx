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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { MockPromotion } from "../../components/mock-data"

interface PromotionFormProps {
	promotion: MockPromotion | null
	onSave: (promotionData: Partial<MockPromotion>) => void
	onCancel: () => void
}

export function PromotionForm({
	promotion,
	onSave,
	onCancel,
}: PromotionFormProps) {
	const [formData, setFormData] = useState({
		code: "",
		title: "",
		description: "",
		type: "Discount" as MockPromotion["type"],
		ref_type: "All" as MockPromotion["ref_type"],
		ref_id: "",
		is_active: true,
		auto_apply: false,
		date_started: "",
		date_ended: "",
		discount: {
			min_spend: 0,
			max_discount: 0,
			discount_percent: 0,
			discount_price: 0,
		},
	})

	useEffect(() => {
		if (promotion) {
			setFormData({
				code: promotion.code,
				title: promotion.title,
				description: promotion.description || "",
				type: promotion.type,
				ref_type: promotion.ref_type,
				ref_id: promotion.ref_id?.toString() || "",
				is_active: promotion.is_active,
				auto_apply: promotion.auto_apply,
				date_started: promotion.date_started,
				date_ended: promotion.date_ended || "",
				discount: { ...promotion.discount },
			})
		} else {
			setFormData({
				code: "",
				title: "",
				description: "",
				type: "Discount",
				ref_type: "All",
				ref_id: "",
				is_active: true,
				auto_apply: false,
				date_started: new Date().toISOString().split("T")[0],
				date_ended: "",
				discount: {
					min_spend: 0,
					max_discount: 0,
					discount_percent: 0,
					discount_price: 0,
				},
			})
		}
	}, [promotion])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		const promotionData = {
			...formData,
			ref_id: formData.ref_id ? parseInt(formData.ref_id) : undefined,
			date_ended: formData.date_ended || undefined,
			discount: {
				...formData.discount,
				discount_percent:
					formData.type === "Discount" && formData.discount.discount_percent > 0
						? formData.discount.discount_percent
						: undefined,
				discount_price:
					formData.type === "Discount" && formData.discount.discount_price > 0
						? formData.discount.discount_price
						: undefined,
			},
		}

		onSave(promotionData)
	}

	const handleChange = (field: string, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
	}

	const handleDiscountChange = (field: string, value: any) => {
		setFormData((prev) => ({
			...prev,
			discount: { ...prev.discount, [field]: value },
		}))
	}

	return (
		<Dialog open onOpenChange={onCancel}>
			<DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{promotion ? "Edit Promotion" : "Create New Promotion"}
					</DialogTitle>
					<DialogDescription>
						{promotion
							? "Update promotion details"
							: "Create a new promotional campaign"}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Basic Information */}
					<div className="space-y-4">
						<h3 className="text-lg font-medium">Basic Information</h3>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="code">Promotion Code</Label>
								<Input
									id="code"
									value={formData.code}
									onChange={(e) => handleChange("code", e.target.value)}
									placeholder="e.g., SAVE20"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="title">Title</Label>
								<Input
									id="title"
									value={formData.title}
									onChange={(e) => handleChange("title", e.target.value)}
									placeholder="e.g., 20% Off Electronics"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								value={formData.description}
								onChange={(e) => handleChange("description", e.target.value)}
								placeholder="Promotion description..."
								rows={3}
							/>
						</div>
					</div>

					{/* Promotion Type and Target */}
					<div className="space-y-4">
						<h3 className="text-lg font-medium">Promotion Settings</h3>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="type">Promotion Type</Label>
								<Select
									value={formData.type}
									onValueChange={(value) => handleChange("type", value)}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Discount">Discount</SelectItem>
										<SelectItem value="Bundle">Bundle</SelectItem>
										<SelectItem value="BuyXGetY">Buy X Get Y</SelectItem>
										<SelectItem value="Cashback">Cashback</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="ref_type">Target</Label>
								<Select
									value={formData.ref_type}
									onValueChange={(value) => handleChange("ref_type", value)}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="All">All Products</SelectItem>
										<SelectItem value="ProductSpu">Specific Product</SelectItem>
										<SelectItem value="ProductSku">Specific SKU</SelectItem>
										<SelectItem value="Category">Category</SelectItem>
										<SelectItem value="Brand">Brand</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{formData.ref_type !== "All" && (
							<div className="space-y-2">
								<Label htmlFor="ref_id">Reference ID</Label>
								<Input
									id="ref_id"
									type="number"
									value={formData.ref_id}
									onChange={(e) => handleChange("ref_id", e.target.value)}
									placeholder="Enter reference ID"
								/>
							</div>
						)}
					</div>

					{/* Discount Settings */}
					{formData.type === "Discount" && (
						<div className="space-y-4">
							<h3 className="text-lg font-medium">Discount Settings</h3>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="min_spend">Minimum Spend ($)</Label>
									<Input
										id="min_spend"
										type="number"
										min="0"
										value={formData.discount.min_spend}
										onChange={(e) =>
											handleDiscountChange(
												"min_spend",
												parseFloat(e.target.value) || 0
											)
										}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="max_discount">Maximum Discount ($)</Label>
									<Input
										id="max_discount"
										type="number"
										min="0"
										value={formData.discount.max_discount}
										onChange={(e) =>
											handleDiscountChange(
												"max_discount",
												parseFloat(e.target.value) || 0
											)
										}
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="discount_percent">
										Discount Percentage (%)
									</Label>
									<Input
										id="discount_percent"
										type="number"
										min="0"
										max="100"
										value={formData.discount.discount_percent}
										onChange={(e) =>
											handleDiscountChange(
												"discount_percent",
												parseFloat(e.target.value) || 0
											)
										}
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="discount_price">Fixed Discount ($)</Label>
									<Input
										id="discount_price"
										type="number"
										min="0"
										value={formData.discount.discount_price}
										onChange={(e) =>
											handleDiscountChange(
												"discount_price",
												parseFloat(e.target.value) || 0
											)
										}
									/>
								</div>
							</div>
						</div>
					)}

					{/* Schedule */}
					<div className="space-y-4">
						<h3 className="text-lg font-medium">Schedule</h3>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="date_started">Start Date</Label>
								<Input
									id="date_started"
									type="date"
									value={formData.date_started}
									onChange={(e) => handleChange("date_started", e.target.value)}
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="date_ended">End Date (Optional)</Label>
								<Input
									id="date_ended"
									type="date"
									value={formData.date_ended}
									onChange={(e) => handleChange("date_ended", e.target.value)}
								/>
							</div>
						</div>
					</div>

					{/* Options */}
					<div className="space-y-4">
						<h3 className="text-lg font-medium">Options</h3>

						<div className="space-y-4">
							<div className="flex items-center space-x-2">
								<Switch
									id="is_active"
									checked={formData.is_active}
									onCheckedChange={(checked) =>
										handleChange("is_active", checked)
									}
								/>
								<Label htmlFor="is_active">Active</Label>
							</div>

							<div className="flex items-center space-x-2">
								<Switch
									id="auto_apply"
									checked={formData.auto_apply}
									onCheckedChange={(checked) =>
										handleChange("auto_apply", checked)
									}
								/>
								<Label htmlFor="auto_apply">
									Auto Apply (No code required)
								</Label>
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={onCancel}>
							Cancel
						</Button>
						<Button type="submit">
							{promotion ? "Update Promotion" : "Create Promotion"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
