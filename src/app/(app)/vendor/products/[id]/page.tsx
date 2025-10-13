"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { mockSpus, MockSPU, mockComments } from "../../components/mock-data"
import { ProductComments } from "./components/product-comments"
import { toast } from "sonner"
import {
	ArrowLeft,
	Edit,
	Eye,
	Star,
	TrendingUp,
	Package,
	Tag,
	Calendar,
	Image as ImageIcon,
	ExternalLink,
	Copy,
	Share,
} from "lucide-react"

interface ProductViewPageProps {
	params: {
		id: string
	}
}

export default function ProductViewPage({ params }: ProductViewPageProps) {
	const router = useRouter()
	const [product, setProduct] = useState<MockSPU | null>(null)

	useEffect(() => {
		const productId = parseInt(params.id)
		const foundProduct = mockSpus.find((spu) => spu.id === productId)
		if (foundProduct) {
			setProduct(foundProduct)
		} else {
			toast.error("Product not found")
			router.push("/vendor/products")
		}
	}, [params.id, router])

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
								<h1 className="text-3xl font-bold">{product.name}</h1>
								<p className="text-muted-foreground">
									{product.code} • {product.brand} • {product.category}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								onClick={() => {
									/* Mock share */
								}}
								className="flex items-center gap-2"
							>
								<Share className="h-4 w-4" />
								Share
							</Button>
							<Button
								variant="outline"
								onClick={() => {
									/* Mock copy link */
								}}
								className="flex items-center gap-2"
							>
								<Copy className="h-4 w-4" />
								Copy Link
							</Button>
							<Button
								onClick={() =>
									router.push(`/vendor/products/${product.id}/edit`)
								}
								className="flex items-center gap-2"
							>
								<Edit className="h-4 w-4" />
								Edit Product
							</Button>
						</div>
					</div>

					<div className="grid gap-6 lg:grid-cols-3">
						{/* Main Content */}
						<div className="lg:col-span-2 space-y-6">
							{/* Product Images */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<ImageIcon className="h-5 w-5" />
										Product Images
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid gap-4 md:grid-cols-2">
										{product.images.map((image, index) => (
											<div key={index} className="relative group">
												<img
													src={image}
													alt={`Product image ${index + 1}`}
													className="w-full h-48 object-cover rounded-lg border"
												/>
												<Button
													size="sm"
													variant="secondary"
													className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
													onClick={() => {
														/* Mock view full size */
													}}
												>
													<Eye className="h-4 w-4" />
												</Button>
											</div>
										))}
									</div>
								</CardContent>
							</Card>

							{/* Description */}
							<Card>
								<CardHeader>
									<CardTitle>Description</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="prose max-w-none">
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
								</CardContent>
							</Card>

							{/* SKUs */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Package className="h-5 w-5" />
										Product Variants (SKUs)
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{product.skus.map((sku) => (
											<div
												key={sku.id}
												className="flex items-center justify-between p-4 border rounded-lg"
											>
												<div className="flex items-center gap-4">
													<div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
														<Package className="h-6 w-6 text-muted-foreground" />
													</div>
													<div>
														<div className="font-medium">SKU #{sku.id}</div>
														<div className="text-sm text-muted-foreground">
															{Object.entries(sku.attributes).map(
																([key, value]) => (
																	<Badge
																		key={key}
																		variant="outline"
																		className="mr-1 text-xs"
																	>
																		{key}: {value}
																	</Badge>
																)
															)}
														</div>
													</div>
												</div>
												<div className="text-right">
													<div className="font-medium">
														${sku.price.toLocaleString()}
													</div>
													<div className="text-sm text-muted-foreground">
														Stock: {sku.stock}
													</div>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
							{/* Comments Section */}
							<ProductComments comments={mockComments} productId={product.id} />
						</div>

						{/* Sidebar */}
						<div className="space-y-6">
							{/* Status */}
							<Card>
								<CardHeader>
									<CardTitle>Status</CardTitle>
								</CardHeader>
								<CardContent>
									<Badge variant={product.is_active ? "default" : "secondary"}>
										{product.is_active ? "Active" : "Inactive"}
									</Badge>
								</CardContent>
							</Card>

							{/* Performance */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<TrendingUp className="h-5 w-5" />
										Performance
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Eye className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm">Views</span>
										</div>
										<span className="font-medium">
											{product.views.toLocaleString()}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<TrendingUp className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm">Sales</span>
										</div>
										<span className="font-medium">{product.sales}</span>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Star className="h-4 w-4 text-yellow-500" />
											<span className="text-sm">Rating</span>
										</div>
										<span className="font-medium">{product.rating}/5</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">
											Reviews
										</span>
										<span className="font-medium">{product.review_count}</span>
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
									<div className="flex flex-wrap gap-2">
										{product.tags.map((tag, index) => (
											<Badge key={index} variant="secondary">
												{tag}
											</Badge>
										))}
									</div>
								</CardContent>
							</Card>

							{/* Metadata */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Calendar className="h-5 w-5" />
										Metadata
									</CardTitle>
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
									<div className="flex justify-between">
										<span className="text-muted-foreground">SKUs</span>
										<span>{product.skus.length}</span>
									</div>
								</CardContent>
							</Card>

							{/* Quick Actions */}
							<Card>
								<CardHeader>
									<CardTitle>Quick Actions</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2">
									<Button
										variant="outline"
										className="w-full justify-start"
										onClick={() =>
											router.push(`/vendor/products/${product.id}/edit`)
										}
									>
										<Edit className="h-4 w-4 mr-2" />
										Edit Product
									</Button>
									<Button
										variant="outline"
										className="w-full justify-start"
										onClick={() => router.push(`/vendor/inventory`)}
									>
										<Package className="h-4 w-4 mr-2" />
										Manage Inventory
									</Button>
									<Button
										variant="outline"
										className="w-full justify-start"
										onClick={() => {
											/* Mock view in store */
										}}
									>
										<ExternalLink className="h-4 w-4 mr-2" />
										View in Store
									</Button>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}
