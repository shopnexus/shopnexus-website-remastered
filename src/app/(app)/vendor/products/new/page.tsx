"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import {
	ArrowLeft,
	Save,
	Eye,
	EyeOff,
	Image as ImageIcon,
	Tag,
	Plus,
	Trash2,
} from "lucide-react"
import FileUpload from "@/components/shared/file-upload"
import { TagInput } from "@/components/shared/tag-input"
import { useCreateProductSPU } from "@/core/catalog/product.vendor"
import {
	BrandSelect,
	CategorySelect,
} from "@/components/shared/brand-category-select"
import ProductDescriptionCard from "@/components/product/product-description-card"

export default function NewProductPage() {
	const router = useRouter()
	const [isPreview, setIsPreview] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [resources, setResources] = useState<{ id: string; url: string }[]>([])
	const { mutateAsync: mutateCreateProductSPU } = useCreateProductSPU()
	// brand and category are selected via searchable dropdowns

	const [product, setProduct] = useState({
		name: "",
		description: "",
		brand_id: "",
		category_id: "",
		is_active: true,
		tags: [] as string[],
		specifications: [
			{
				name: "",
				value: "",
			},
		],
	})

	const handleUploadComplete = (urls: { id: string; url: string }[]) => {
		setResources([...resources, ...urls])
	}

	const handleRemoveImage = (index: number) => {
		setResources((prev) => prev.filter((_, i) => i !== index))
	}

	const handleSave = async () => {
		if (!product.name) {
			toast.error("Please fill in required fields")
			return
		}

		setIsLoading(true)
		try {
			await mutateCreateProductSPU({
				category_id: Number(product.category_id),
				brand_id: Number(product.brand_id),
				name: product.name,
				description: product.description,
				is_active: product.is_active,
				tags: product.tags,
				resource_ids: resources.map((r) => r.id),
				specifications: product.specifications.filter(
					(spec) => spec.name.trim() && spec.value.trim()
				),
			})
			toast.success("Product created successfully")
			router.push("/vendor/products")
		} catch {
			toast.error("Failed to create product")
		} finally {
			setIsLoading(false)
		}
	}

	const handleTagsChange = (tags: string[]) => {
		setProduct({
			...product,
			tags,
		})
	}

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 py-8 mx-auto">
				<div className="container max-w-6xl">
					{/* Header */}
					<div className="flex items-center justify-between mb-8">
						<div className="flex items-center gap-4">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => router.back()}
								className="flex items-center gap-2"
							>
								<ArrowLeft className="h-4 w-4" />
								Back
							</Button>
							<div>
								<h1 className="text-3xl font-bold">Create New Product</h1>
								<p className="text-muted-foreground">
									Add a new product to your catalog
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								onClick={() => setIsPreview(!isPreview)}
								className="flex items-center gap-2"
							>
								{isPreview ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
								{isPreview ? "Edit" : "Preview"}
							</Button>
							<Button
								onClick={handleSave}
								disabled={isLoading}
								className="flex items-center gap-2"
							>
								<Save className="h-4 w-4" />
								{isLoading ? "Creating..." : "Create Product"}
							</Button>
						</div>
					</div>

					<div className="grid gap-6 lg:grid-cols-3">
						{/* Main Content */}
						<div className="lg:col-span-2 space-y-6">
							{/* Basic Information */}
							<Card>
								<CardHeader>
									<CardTitle>Basic Information</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid gap-4 md:grid-cols-1">
										{/* <div className="space-y-2">
											<Label htmlFor="code">Product Code *</Label>
											<Input
												id="code"
												value={product.code}
												onChange={(e) =>
													setProduct({ ...product, code: e.target.value })
												}
												placeholder="Enter product code"
												required
											/>
										</div> */}
										<div className="space-y-2">
											<Label htmlFor="name">Product Name *</Label>
											<Input
												id="name"
												value={product.name}
												onChange={(e) =>
													setProduct({ ...product, name: e.target.value })
												}
												placeholder="Enter product name"
												required
												className=""
											/>
										</div>
									</div>

									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="brand">Brand</Label>
											<BrandSelect
												valueId={
													product.brand_id ? Number(product.brand_id) : null
												}
												onChange={(b) =>
													setProduct({ ...product, brand_id: String(b.id) })
												}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="category">Category</Label>
											<CategorySelect
												valueId={
													product.category_id
														? Number(product.category_id)
														: null
												}
												onChange={(c) =>
													setProduct({ ...product, category_id: String(c.id) })
												}
											/>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Description */}
							<ProductDescriptionCard
								value={product.description}
								isPreview={isPreview}
								onChange={(next) =>
									setProduct({ ...product, description: next })
								}
							/>

							{/* Specifications */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Plus className="h-5 w-5" />
										Product Specifications
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<p className="text-sm text-muted-foreground">
										Add key product specifications such as material, origin, or
										warranty information.
									</p>
									<div className="space-y-4">
										{product.specifications.map((spec, index) => (
											<div
												key={`spec-${index}`}
												className="grid gap-2 md:grid-cols-[1fr,1fr,auto]"
											>
												<div className="space-y-2">
													<Label htmlFor={`spec-name-${index}`}>Name</Label>
													<Input
														id={`spec-name-${index}`}
														value={spec.name}
														onChange={(e) =>
															setProduct((prev) => {
																const nextSpecs = [...prev.specifications]
																nextSpecs[index] = {
																	...nextSpecs[index],
																	name: e.target.value,
																}
																return { ...prev, specifications: nextSpecs }
															})
														}
														placeholder="e.g. Material"
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor={`spec-value-${index}`}>Value</Label>
													<Input
														id={`spec-value-${index}`}
														value={spec.value}
														onChange={(e) =>
															setProduct((prev) => {
																const nextSpecs = [...prev.specifications]
																nextSpecs[index] = {
																	...nextSpecs[index],
																	value: e.target.value,
																}
																return { ...prev, specifications: nextSpecs }
															})
														}
														placeholder="e.g. 100% Cotton"
													/>
												</div>
												<div className="flex items-end">
													<Button
														type="button"
														variant="ghost"
														size="icon"
														onClick={() =>
															setProduct((prev) => ({
																...prev,
																specifications: prev.specifications.filter(
																	(_, i) => i !== index
																),
															}))
														}
														disabled={product.specifications.length === 1}
														aria-label="Remove specification"
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</div>
										))}
									</div>
									<Button
										type="button"
										variant="outline"
										size="sm"
										className="flex items-center gap-2"
										onClick={() =>
											setProduct((prev) => ({
												...prev,
												specifications: [
													...prev.specifications,
													{ name: "", value: "" },
												],
											}))
										}
									>
										<Plus className="h-4 w-4" />
										Add Specification
									</Button>
								</CardContent>
							</Card>

							{/* Images */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<ImageIcon className="h-5 w-5" />
										Product Images
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{/* <div className="flex gap-2">
										<Input
											value={newImage}
											onChange={(e) => setNewImage(e.target.value)}
											placeholder="Enter image URL"
											className="flex-1"
										/>
										<Button onClick={handleAddImage} size="sm">
											<Plus className="h-4 w-4" />
										</Button>
									</div>

									{product.images.length > 0 && (
										<div className="grid gap-4 md:grid-cols-2">
											{product.images.map((image, index) => (
												<div key={index} className="relative group">
													<img
														src={image}
														alt={`Product image ${index + 1}`}
														className="w-full h-32 object-cover rounded-lg border"
													/>
													<Button
														size="sm"
														variant="destructive"
														className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
														onClick={() => handleRemoveImage(image)}
													>
														<X className="h-4 w-4" />
													</Button>
												</div>
											))}
										</div>
									)} */}
									<FileUpload
										onUploadComplete={handleUploadComplete}
										onRemoveImage={handleRemoveImage}
										resources={resources}
									/>
								</CardContent>
							</Card>
						</div>

						{/* Sidebar */}
						<div className="space-y-6">
							{/* Status */}
							<Card>
								<CardHeader>
									<CardTitle>Status</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex items-center justify-between">
										<div>
											<Label htmlFor="active">Active</Label>
											<p className="text-sm text-muted-foreground">
												Product is visible to customers
											</p>
										</div>
										<Switch
											id="active"
											checked={product.is_active}
											onCheckedChange={(checked) =>
												setProduct({ ...product, is_active: checked })
											}
										/>
									</div>
								</CardContent>
							</Card>

							{/* Tags */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Tag className="h-5 w-5" />
										Tags
									</CardTitle>
								</CardHeader>
								<CardContent>
									<TagInput
										tags={product.tags}
										onTagsChange={handleTagsChange}
										placeholder="Add tags (separate multiple with spaces)"
									/>
								</CardContent>
							</Card>

							{/* Next Steps */}
							<Card>
								<CardHeader>
									<CardTitle>Next Steps</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2 text-sm text-muted-foreground">
									<p>After creating the product, you can:</p>
									<ul className="list-disc list-inside space-y-1 ml-2">
										<li>Add product variants (SKUs)</li>
										<li>Set up inventory tracking</li>
										<li>Configure pricing and discounts</li>
										<li>Add product to categories</li>
									</ul>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}
