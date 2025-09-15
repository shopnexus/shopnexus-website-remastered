import { BulkOrderForm } from "@/app/(app)/cart/components/bulk-order-form"

export default function BulkOrdersPage() {
	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 py-8 mx-auto">
				<div className="container max-w-4xl">
					<BulkOrderForm />
				</div>
			</main>
		</div>
	)
}
