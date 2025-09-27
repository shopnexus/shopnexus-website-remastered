import { TProductCard } from "@/core/product/product.customer"
import { ProductCard } from "./product-card"
import { forwardRef } from "react"

export const ProductGrid = forwardRef<
	HTMLDivElement,
	{ products: TProductCard[] }
>(({ products = [] }, ref) => {
	return (
		<div
			ref={ref}
			className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
		>
			{products.map((product, index) => (
				<ProductCard key={product.id + " " + index} product={product} />
			))}
		</div>
	)
})
