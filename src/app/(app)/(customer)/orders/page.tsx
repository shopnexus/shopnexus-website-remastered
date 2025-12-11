import { OrderHistory } from "./components/order-history"

export default function OrdersPage() {
	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 py-8">
				<div className="container max-w-6xl">
					<OrderHistory />
				</div>
			</main>
		</div>
	)
}
