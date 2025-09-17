import { TProductCard } from "@/core/product/product.customer"
import { ProductCard } from "./product-card"

export function ProductGrid({ products = [] }: { products: TProductCard[] }) {
	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	)
}
