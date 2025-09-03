"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Trash2, Calculator, FileText } from "lucide-react"

interface BulkOrderItem {
	id: string
	productName: string
	quantity: number
	estimatedPrice?: number
	specifications?: string
}

export function BulkOrderForm() {
	const [isLoading, setIsLoading] = useState(false)
	const [orderItems, setOrderItems] = useState<BulkOrderItem[]>([
		{ id: "1", productName: "", quantity: 1 },
	])
	const [formData, setFormData] = useState({
		companyName: "",
		contactName: "",
		email: "",
		phoneNumber: "",
		deliveryDate: "",
		deliveryAddress: "",
		additionalRequirements: "",
		urgency: "",
	})

	const addOrderItem = () => {
		const newItem: BulkOrderItem = {
			id: Date.now().toString(),
			productName: "",
			quantity: 1,
		}
		setOrderItems([...orderItems, newItem])
	}

	const removeOrderItem = (id: string) => {
		if (orderItems.length > 1) {
			setOrderItems(orderItems.filter((item) => item.id !== id))
		}
	}

	const updateOrderItem = (
		id: string,
		field: keyof BulkOrderItem,
		value: string | number
	) => {
		setOrderItems(
			orderItems.map((item) =>
				item.id === id ? { ...item, [field]: value } : item
			)
		)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 2000))
		setIsLoading(false)
		console.log("Bulk order request:", { formData, orderItems })
	}

	const getTotalEstimatedValue = () => {
		return orderItems.reduce((sum, item) => {
			return sum + (item.estimatedPrice || 0) * item.quantity
		}, 0)
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold text-balance">Bulk Order Request</h1>
				<p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
					Request a custom quote for large quantity orders. Our team will
					provide competitive pricing and personalized service.
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Company Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<FileText className="h-5 w-5" />
							<span>Company Information</span>
						</CardTitle>
						<CardDescription>
							Provide your company details for accurate pricing and delivery
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="companyName">Company Name *</Label>
								<Input
									id="companyName"
									placeholder="Acme Corporation"
									value={formData.companyName}
									onChange={(e) =>
										setFormData({ ...formData, companyName: e.target.value })
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="contactName">Contact Name *</Label>
								<Input
									id="contactName"
									placeholder="John Doe"
									value={formData.contactName}
									onChange={(e) =>
										setFormData({ ...formData, contactName: e.target.value })
									}
									required
								/>
							</div>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="email">Business Email *</Label>
								<Input
									id="email"
									type="email"
									placeholder="john@acmecorp.com"
									value={formData.email}
									onChange={(e) =>
										setFormData({ ...formData, email: e.target.value })
									}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="phoneNumber">Phone Number *</Label>
								<Input
									id="phoneNumber"
									type="tel"
									placeholder="+1 (555) 123-4567"
									value={formData.phoneNumber}
									onChange={(e) =>
										setFormData({ ...formData, phoneNumber: e.target.value })
									}
									required
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Order Items */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Calculator className="h-5 w-5" />
								<span>Order Items</span>
							</div>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={addOrderItem}
							>
								<Plus className="h-4 w-4 mr-2" />
								Add Item
							</Button>
						</CardTitle>
						<CardDescription>
							Specify the products and quantities you need
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{orderItems.map((item, index) => (
							<div key={item.id} className="space-y-4 p-4 border rounded-lg">
								<div className="flex items-center justify-between">
									<Badge variant="outline">Item {index + 1}</Badge>
									{orderItems.length > 1 && (
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => removeOrderItem(item.id)}
											className="text-destructive hover:text-destructive"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									)}
								</div>

								<div className="grid gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label>Product Name *</Label>
										<Input
											placeholder="e.g., Professional Office Chair"
											value={item.productName}
											onChange={(e) =>
												updateOrderItem(item.id, "productName", e.target.value)
											}
											required
										/>
									</div>
									<div className="space-y-2">
										<Label>Quantity *</Label>
										<div className="flex items-center space-x-2">
											<Button
												type="button"
												variant="outline"
												size="icon"
												onClick={() =>
													updateOrderItem(
														item.id,
														"quantity",
														Math.max(1, item.quantity - 1)
													)
												}
											>
												<Minus className="h-4 w-4" />
											</Button>
											<Input
												type="number"
												value={item.quantity}
												onChange={(e) =>
													updateOrderItem(
														item.id,
														"quantity",
														Number.parseInt(e.target.value) || 1
													)
												}
												className="text-center"
												min="1"
												required
											/>
											<Button
												type="button"
												variant="outline"
												size="icon"
												onClick={() =>
													updateOrderItem(
														item.id,
														"quantity",
														item.quantity + 1
													)
												}
											>
												<Plus className="h-4 w-4" />
											</Button>
										</div>
									</div>
								</div>

								<div className="space-y-2">
									<Label>Specifications (Optional)</Label>
									<Textarea
										placeholder="Any specific requirements, colors, models, etc."
										value={item.specifications || ""}
										onChange={(e) =>
											updateOrderItem(item.id, "specifications", e.target.value)
										}
										rows={2}
									/>
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Delivery & Requirements */}
				<Card>
					<CardHeader>
						<CardTitle>Delivery & Additional Requirements</CardTitle>
						<CardDescription>
							Help us provide the best service for your order
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="deliveryDate">Preferred Delivery Date</Label>
								<Input
									id="deliveryDate"
									type="date"
									value={formData.deliveryDate}
									onChange={(e) =>
										setFormData({ ...formData, deliveryDate: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="urgency">Urgency Level</Label>
								<Select
									onValueChange={(value) =>
										setFormData({ ...formData, urgency: value })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select urgency" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="standard">
											Standard (2-3 weeks)
										</SelectItem>
										<SelectItem value="expedited">
											Expedited (1-2 weeks)
										</SelectItem>
										<SelectItem value="urgent">Urgent (3-5 days)</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="deliveryAddress">Delivery Address *</Label>
							<Textarea
								id="deliveryAddress"
								placeholder="Full delivery address including city, state, and zip code"
								value={formData.deliveryAddress}
								onChange={(e) =>
									setFormData({ ...formData, deliveryAddress: e.target.value })
								}
								rows={3}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="additionalRequirements">
								Additional Requirements
							</Label>
							<Textarea
								id="additionalRequirements"
								placeholder="Any special instructions, installation requirements, or other details"
								value={formData.additionalRequirements}
								onChange={(e) =>
									setFormData({
										...formData,
										additionalRequirements: e.target.value,
									})
								}
								rows={3}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Summary */}
				<Card>
					<CardHeader>
						<CardTitle>Order Summary</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex justify-between">
								<span>Total Items:</span>
								<span className="font-medium">{orderItems.length}</span>
							</div>
							<div className="flex justify-between">
								<span>Total Quantity:</span>
								<span className="font-medium">
									{orderItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
									units
								</span>
							</div>
							<Separator />
							<div className="text-sm text-muted-foreground">
								Our team will review your request and provide a detailed quote
								within 24 hours.
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Submit */}
				<div className="flex justify-center">
					<Button type="submit" size="lg" disabled={isLoading} className="px-8">
						{isLoading ? "Submitting Request..." : "Submit Bulk Order Request"}
					</Button>
				</div>
			</form>
		</div>
	)
}
