import { TProductCard } from "@/core/catalog/product.customer"
import { ProductCard } from "./product-card"
import { forwardRef } from "react"

export const ProductGrid = forwardRef<
	HTMLDivElement,
	{ products: TProductCard[] }
>(({ products = [] }, ref) => {
	return (
		<div className="grid px-6 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{products.map((product, index) => (
				<ProductCard key={product.id + " " + index} product={product} />
			))}
		</div>
	)
})
ProductGrid.displayName = "ProductGrid"
