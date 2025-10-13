"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { useGetProductDetail } from "@/core/product/product.customer"
import {
	ProductMainSection,
	SellerInfo,
	ProductSpecifications,
	ReviewsSection,
	RelatedProducts,
} from "./components"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { useListComments } from "@/core/comment/comment.customer"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { useCreateInteraction } from "@/core/analytic/analytic.customer"

interface Resource {
	id: number
	mime: string
	url: string
	file_size: number
	width: number
	height: number
	duration: number
}

interface Product {
	id: number
	name: string
	description: string
	resources: Resource[]
	category: string
	rating: RatingDetail
	sold: number
	promo_id?: number
	skus: SkuDetail[]
	specifications: Record<string, string>
	// Optional fields that might not be in API response
	reviews?: Review[]
	seller?: Seller
	relatedProducts?: RelatedProduct[]
	sameShopProducts?: RelatedProduct[]
}

interface RatingDetail {
	score: number
	total: number
	breakdown: Record<string, number>
}

interface SkuDetail {
	id: number
	price: number
	original_price: number
	attributes: Record<string, string>
}

interface Review {
	id: number
	account: {
		id: number
		name: string
		avatar?: Resource
	}
	score: number
	date_created: string
	title: string
	body: string
	upvote: number
	verified: boolean
	resources: Resource[]
}

interface Seller {
	name: string
	rating: number
	responseRate: number
	joinedYears: number
	totalProducts: number
	followers: number
	avatar: string
}

interface RelatedProduct {
	id: string
	name: string
	description: string
	price: number
	original_price: number
	image: string
	category: string
	rating: {
		score: number
		total: number
	}
	// minOrderQuantity: number
}

export default function ProductDetailPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = use(params)
	const { data: product, isLoading, error } = useGetProductDetail(id)
	const [selectedSku, setSelectedSku] = useState<SkuDetail | null>(null)
	const infiniteComments = useListComments({
		limit: 10,
		ref_type: "ProductSpu",
		ref_id: [Number(id)],
	})
	const { items: comments } = useInfiniteScroll(infiniteComments)
	const { mutateAsync: mutateCreateInteraction } = useCreateInteraction()

	// Set default selected SKU when product data loads
	// useEffect(() => {
	// 	if (productData?.skus && productData.skus.length > 0 && !selectedSku) {
	// 		setSelectedSku(productData.skus[0])
	// 	}
	// }, [productData, selectedSku])

	useEffect(() => {
		mutateCreateInteraction({
			event_type: "view",
			ref_type: "Product",
			ref_id: Number(id),
			metadata: {},
		})
	}, [id])

	if (isLoading) {
		return (
			<div className="min-h-screen bg-card flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading product details...</p>
				</div>
			</div>
		)
	}

	if (error || !product) {
		return (
			<div className="min-h-screen bg-card flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-2">
						Product Not Found
					</h1>
					<p className="text-gray-600 mb-4">
						The product you&apos;re looking for doesn&apos;t exist.
					</p>
					<Link href="/" className="text-blue-600 hover:underline">
						Return to Home
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-card flex flex-col gap-y-6 ">
			<Breadcrumb className="px-6 mt-6">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="/">B2B Store</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="/categories/office">Office & Business</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href="/categories/furniture">Furniture</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>
							{/* Product name will be displayed here */}
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className="container mx-auto px-4 space-y-6 max-w-7xl">
				{/* Main Product Section */}
				<ProductMainSection
					name={product.name}
					resources={product.resources}
					promoId={product.promo_id}
					rating={product.rating}
					sold={product.sold}
					skus={product.skus}
					selectedSku={selectedSku}
					onSelectSku={setSelectedSku}
				/>
			</div>

			{/* Seller Information */}
			{product.seller && <SellerInfo seller={product.seller} />}

			{/* Product Description & Specifications */}
			<ProductSpecifications
				specifications={product.specifications}
				description={product.description}
			/>

			{/* Customer Reviews */}
			<ReviewsSection rating={product.rating} reviews={comments || []} />

			{/* From Same Shop */}
			<RelatedProducts products={[]} title="From the Same Shop" />

			{/* You May Also Like */}
			<RelatedProducts products={[]} title="You May Also Like" />

			<div className=""></div>
		</div>
	)
}
