import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BulkOrderForm } from "@/components/cart/bulk-order-form"

export default function BulkOrdersPage() {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			<main className="flex-1 py-8 mx-auto">
				<div className="container max-w-4xl">
					<BulkOrderForm />
				</div>
			</main>

			<Footer />
		</div>
	)
}
