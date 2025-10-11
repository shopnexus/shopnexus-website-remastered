"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { mockSpus, MockSPU } from "../../../components/mock-data"
import { toast } from "sonner"
import {
	ArrowLeft,
	Save,
	Eye,
	EyeOff,
	Image as ImageIcon,
	Tag,
	Plus,
	X,
	Upload,
} from "lucide-react"

interface ProductEditPageProps {
	params: {
		id: string
	}
}

export default function ProductEditPage({ params }: ProductEditPageProps) {
	const router = useRouter()
	const [product, setProduct] = useState<MockSPU | null>(null)
	const [isPreview, setIsPreview] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [newTag, setNewTag] = useState("")
	const [newImage, setNewImage] = useState("")

	useEffect(() => {
		const productId = parseInt(params.id)
		const foundProduct = mockSpus.find((spu) => spu.id === productId)
		if (foundProduct) {
			setProduct({ ...foundProduct })
		} else {
			toast.error("Product not found")
			router.push("/vendor/products")
		}
	}, [params.id, router])

	const handleSave = async () => {
		if (!product) return

		setIsLoading(true)
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000))
			toast.success("Product updated successfully")
			router.push("/vendor/products")
		} catch (error) {
			toast.error("Failed to update product")
		} finally {
			setIsLoading(false)
		}
	}

	const handleAddTag = () => {
		if (newTag.trim() && product) {
			setProduct({
				...product,
				tags: [...product.tags, newTag.trim()],
			})
			setNewTag("")
		}
	}

	const handleRemoveTag = (tagToRemove: string) => {
		if (product) {
			setProduct({
				...product,
				tags: product.tags.filter((tag) => tag !== tagToRemove),
			})
		}
	}

	const handleAddImage = () => {
		if (newImage.trim() && product) {
			setProduct({
				...product,
				images: [...product.images, newImage.trim()],
			})
			setNewImage("")
		}
	}

	const handleRemoveImage = (imageToRemove: string) => {
		if (product) {
			setProduct({
				...product,
				images: product.images.filter((image) => image !== imageToRemove),
			})
		}
	}

	if (!product) {
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
												value={product.brand}
												onChange={(e) =>
													setProduct({ ...product, brand: e.target.value })
												}
												placeholder="Enter brand name"
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="category">Category</Label>
											<Input
												id="category"
												value={product.category}
												onChange={(e) =>
													setProduct({ ...product, category: e.target.value })
												}
												placeholder="Enter category"
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
									<div className="flex gap-2">
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
								<CardContent className="space-y-4">
									<div className="flex gap-2">
										<Input
											value={newTag}
											onChange={(e) => setNewTag(e.target.value)}
											placeholder="Add tag"
											onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
										/>
										<Button onClick={handleAddTag} size="sm">
											<Plus className="h-4 w-4" />
										</Button>
									</div>

									<div className="flex flex-wrap gap-2">
										{product.tags.map((tag, index) => (
											<Badge
												key={index}
												variant="secondary"
												className="flex items-center gap-1"
											>
												{tag}
												<X
													className="h-3 w-3 cursor-pointer hover:text-destructive"
													onClick={() => handleRemoveTag(tag)}
												/>
											</Badge>
										))}
									</div>
								</CardContent>
							</Card>

							{/* Statistics */}
							<Card>
								<CardHeader>
									<CardTitle>Statistics</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex justify-between">
										<span className="text-sm text-muted-foreground">Views</span>
										<span className="font-medium">
											{product.views.toLocaleString()}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-muted-foreground">Sales</span>
										<span className="font-medium">{product.sales}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-muted-foreground">
											Rating
										</span>
										<span className="font-medium">{product.rating}/5</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-muted-foreground">
											Reviews
										</span>
										<span className="font-medium">{product.review_count}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-sm text-muted-foreground">SKUs</span>
										<span className="font-medium">{product.skus.length}</span>
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
