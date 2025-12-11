"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import ProductDescriptionCard from "@/components/product/product-description-card"
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
import {
	useGetProductSPU,
	useUpdateProductSPU,
	ProductSPU,
} from "@/core/catalog/product.vendor"
import FileUpload from "@/components/shared/file-upload"
import { TagInput } from "@/components/shared/tag-input"
import { Resource } from "@/core/common/resource.type"
import {
	BrandSelect,
	CategorySelect,
} from "@/components/shared/brand-category-select"

interface ProductEditPageProps {
	params: Promise<{
		id: string
	}>
}

export default function ProductEditPage(props: ProductEditPageProps) {
	const params = use(props.params)
	const router = useRouter()
	const [product, setProduct] = useState<ProductSPU | null>(null)
	const [isPreview, setIsPreview] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [resources, setResources] = useState<Resource[]>([])

	const productId = Number.parseInt(params.id)
	const { data: apiProduct, isLoading: isLoadingProduct } = useGetProductSPU(
		Number.isFinite(productId) ? productId : undefined
	)
	const updateSpu = useUpdateProductSPU()

	useEffect(() => {
		if (!apiProduct) return
		setProduct({
			...apiProduct,
			specifications:
				apiProduct.specifications && apiProduct.specifications.length > 0
					? apiProduct.specifications
					: [
							{
								name: "",
								value: "",
							},
					  ],
		})
		// Map resources to file-upload format
		setResources(apiProduct.resources)
	}, [apiProduct])

	const handleSave = async () => {
		if (!product) return

		setIsLoading(true)
		try {
			await new Promise<void>((resolve, reject) => {
				updateSpu.mutate(
					{
						id: product.id,
						brand_id: product.brand.id,
						category_id: product.category.id,
						name: product.name,
						description: product.description,
						is_active: product.is_active,
						specifications:
							product.specifications?.filter(
								(spec) => spec.name.trim() && spec.value.trim()
							),
					},
					{
						onSuccess: () => resolve(),
						onError: () => reject(new Error("update failed")),
					}
				)
			})
			toast.success("Product updated successfully")
			// router.push("/vendor/products")
		} catch {
			toast.error("Failed to update product")
		} finally {
			setIsLoading(false)
		}
	}

	const handleTagsChange = (tags: string[]) => {
		if (product) {
			setProduct({
				...product,
				tags,
			})
		}
	}

	const handleUploadComplete = (urls: { id: string; url: string }[]) => {
		setResources([
			...resources,
			...urls.map((url) => ({
				id: url.id,
				url: url.url,
				size: 0,
			})),
		])
	}

	const handleRemoveImage = (index: number) => {
		setResources((prev) => prev.filter((_, i) => i !== index))
		if (product) {
			setProduct({
				...product,
				resources: product.resources.filter((_, i) => i !== index),
			})
		}
	}

	if (isLoadingProduct || !product) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">Loading product...</p>
				</div>
			</div>
		)
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
								<h1 className="text-3xl font-bold">Edit Product</h1>
								<p className="text-muted-foreground">
									Edit product details, description, and settings
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
								{isLoading ? "Saving..." : "Save Changes"}
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
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="code">Product Code</Label>
											<Input
												id="code"
												value={product.code}
												onChange={(e) =>
													setProduct({ ...product, code: e.target.value })
												}
												placeholder="Enter product code"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="name">Product Name</Label>
											<Input
												id="name"
												value={product.name}
												onChange={(e) =>
													setProduct({ ...product, name: e.target.value })
												}
												placeholder="Enter product name"
											/>
										</div>
									</div>

									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="brand">Brand</Label>
											<BrandSelect
												valueId={product.brand.id}
												onChange={(b) =>
													setProduct({
														...product,
														brand: {
															id: b.id,
															code: b.code,
															name: b.name,
															description: b.description,
														},
													})
												}
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="category">Category</Label>
											<CategorySelect
												valueId={product.category.id}
												onChange={(c) =>
													setProduct({
														...product,
														category: {
															id: c.id,
															name: c.name,
															description: c.description,
															parent_id: product.category.parent_id,
														},
													})
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
										Add or edit product specifications such as material, origin,
										or warranty.
									</p>
									<div className="space-y-4">
										{product.specifications?.map((spec, index) => (
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
															setProduct((prev) =>
																prev
																	? {
																			...prev,
																			specifications: (prev.specifications ??
																				[]).map((s, i) =>
																				i === index
																					? { ...s, name: e.target.value }
																					: s
																			),
																	  }
																	: prev
															)
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
															setProduct((prev) =>
																prev
																	? {
																			...prev,
																			specifications: (prev.specifications ??
																				[]).map((s, i) =>
																				i === index
																					? { ...s, value: e.target.value }
																					: s
																			),
																	  }
																	: prev
															)
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
															setProduct((prev) =>
																prev
																	? {
																			...prev,
																			specifications: (prev.specifications ??
																				[]).filter((_, i) => i !== index),
																	  }
																	: prev
															)
														}
														disabled={(product.specifications?.length ?? 0) === 1}
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
											setProduct((prev) =>
												prev
													? {
															...prev,
															specifications: [
																...(prev.specifications ?? []),
																{ name: "", value: "" },
															],
													  }
													: prev
											)
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

							{/* Statistics */}
							<Card>
								<CardHeader>
									<CardTitle>Statistics</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex justify-between">
										<span className="text-sm text-muted-foreground">
											Rating
										</span>
										<span className="font-medium">
											{product.rating?.score ?? 0}/5
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-muted-foreground">
											Reviews
										</span>
										<span className="font-medium">
											{product.rating?.total ?? 0}
										</span>
									</div>
								</CardContent>
							</Card>

							{/* Metadata */}
							<Card>
								<CardHeader>
									<CardTitle>Metadata</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Created</span>
										<span>
											{new Date(product.date_created).toLocaleDateString()}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Updated</span>
										<span>
											{new Date(product.date_updated).toLocaleDateString()}
										</span>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}
