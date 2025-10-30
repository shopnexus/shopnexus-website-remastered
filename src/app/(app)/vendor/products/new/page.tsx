"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
	Plus,
	X,
	Upload,
} from "lucide-react"
import FileUpload from "@/components/shared/file-upload"
import { useCreateProductSPU } from "@/core/product/product.vendor"
import { useGetCategories, useGetBrands } from "@/core/catalog/catalog.query"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

export default function NewProductPage() {
	const router = useRouter()
	const [isPreview, setIsPreview] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [newTag, setNewTag] = useState("")
	const [newImage, setNewImage] = useState("")
	const [resources, setResources] = useState<string[]>([])
	const { mutateAsync: mutateCreateProductSPU } = useCreateProductSPU()
	// const { data: categories = [] } = useListBra()
	// const { data: brands = [] } = useGetBrands()
	const categories = [{ id: 1, name: "Camisas y Blusas" }]
	const brands = [{ id: 1, name: "Unknown" }]

	const [product, setProduct] = useState({
		name: "",
		description: "",
		brand_id: "",
		category_id: "",
		is_active: true,
		tags: [] as string[],
	})

	const handleUploadComplete = (urls: string[]) => {
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
				resource_ids: resources.map((r) => r.split("/").pop()?.split("+")[0]),
			})
			toast.success("Product created successfully")
			router.push("/vendor/products")
		} catch (error) {
			toast.error("Failed to create product")
		} finally {
			setIsLoading(false)
		}
	}

	const handleAddTag = () => {
		if (newTag.trim()) {
			setProduct({
				...product,
				tags: [...product.tags, newTag.trim()],
			})
			setNewTag("")
		}
	}

	const handleRemoveTag = (tagToRemove: string) => {
		setProduct({
			...product,
			tags: product.tags.filter((tag) => tag !== tagToRemove),
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
											<Select
												value={product.brand_id}
												onValueChange={(value) =>
													setProduct({ ...product, brand_id: value })
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select a brand" />
												</SelectTrigger>
												<SelectContent>
													{brands.map((brand) => (
														<SelectItem
															key={brand.id}
															value={brand.id.toString()}
														>
															{brand.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										<div className="space-y-2">
											<Label htmlFor="category">Category</Label>
											<Select
												value={product.category_id}
												onValueChange={(value) =>
													setProduct({ ...product, category_id: value })
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select a category" />
												</SelectTrigger>
												<SelectContent>
													{categories.map((category) => (
														<SelectItem
															key={category.id}
															value={category.id.toString()}
														>
															{category.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
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

									{product.tags.length > 0 && (
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
									)}
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
