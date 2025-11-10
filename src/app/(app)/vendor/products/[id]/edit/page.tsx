"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
	ArrowLeft,
	Save,
	Eye,
	EyeOff,
	Image as ImageIcon,
	Tag,
	Upload,
} from "lucide-react"
import {
	useGetProductSPU,
	useUpdateProductSPU,
	ProductSPU,
} from "@/core/catalog/product.vendor"
import FileUpload from "@/components/shared/file-upload"
import { TagInput } from "@/components/shared/tag-input"
import { Resource } from "@/core/common/resource.type"

interface ProductEditPageProps {
	params: {
		id: string
	}
}

export default function ProductEditPage({ params }: ProductEditPageProps) {
	const router = useRouter()
	const [product, setProduct] = useState<ProductSPU | null>(null)
	const [isPreview, setIsPreview] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [resources, setResources] = useState<{ id: string; url: string }[]>([])

	const productId = Number.parseInt(params.id)
	const { data: apiProduct, isLoading: isLoadingProduct } = useGetProductSPU(
		Number.isFinite(productId) ? productId : undefined
	)
	const updateSpu = useUpdateProductSPU()

	useEffect(() => {
		if (!apiProduct) return
		setProduct(apiProduct)
		// Map resources to file-upload format
		setResources(
			apiProduct.resources.map((r) => ({ id: r.id.toString(), url: r.url }))
		)
	}, [apiProduct])

	const handleSave = async () => {
		if (!product) return

		setIsLoading(true)
		try {
			await new Promise<void>((resolve, reject) => {
				updateSpu.mutate(
					{
						id: product.id,
						name: product.name,
						description: product.description,
						is_active: product.is_active,
					},
					{
						onSuccess: () => resolve(),
						onError: () => reject(new Error("update failed")),
					}
				)
			})
			toast.success("Product updated successfully")
			router.push("/vendor/products")
		} catch (error) {
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
		setResources([...resources, ...urls])
		if (product) {
			setProduct({
				...product,
				resources: [
					...product.resources,
					...urls.map((r) => ({
						id: Number(r.id),
						url: r.url,
						mime: "image/*",
						size: 0,
						checksum: null,
					})),
				],
			})
		}
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
											<Input
												id="brand"
												value={product.brand.name}
												disabled
												placeholder="Brand (read-only)"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="category">Category</Label>
											<Input
												id="category"
												value={product.category.name}
												disabled
												placeholder="Category (read-only)"
											/>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Description */}
							<Card>
								<CardHeader>
									<CardTitle>Description</CardTitle>
									<p className="text-sm text-muted-foreground">
										Write your product description using Markdown. You can use
										**bold**, *italic*, lists, and more.
									</p>
								</CardHeader>
								<CardContent>
									{isPreview ? (
										<div className="prose max-w-none">
											<div className="p-4 border rounded-lg bg-muted/50">
												<h3 className="text-lg font-semibold mb-2">Preview</h3>
												<div
													className="prose prose-sm max-w-none"
													dangerouslySetInnerHTML={{
														__html: product.description
															.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
															.replace(/\*(.*?)\*/g, "<em>$1</em>")
															.replace(/\n/g, "<br/>"),
													}}
												/>
											</div>
										</div>
									) : (
										<Textarea
											value={product.description}
											onChange={(e) =>
												setProduct({ ...product, description: e.target.value })
											}
											placeholder="Enter product description using Markdown..."
											className="min-h-[300px] font-mono text-sm"
										/>
									)}
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
