import { OrderTracking } from "../components/order-tracking"

const sampleOrder = {
	id: "ORD-2024-001",
	status: "shipped" as const,
	orderDate: "2024-01-15",
	estimatedDelivery: "2024-01-19",
	trackingNumber: "1Z999AA1234567890",
	items: [
		{
			name: "Professional Office Chair - Ergonomic Design",
			quantity: 8,
			price: 249.99,
		},
		{
			name: "Premium Paper Pack - 5000 Sheets",
			quantity: 25,
			price: 39.99,
		},
	],
	shippingAddress: {
		company: "Acme Corporation",
		address: "123 Business Ave, Suite 100",
		city: "New York",
		state: "NY",
		zip: "10001",
	},
}

export default function OrderDetailPage() {
	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 py-8">
				<div className="container max-w-4xl">
					<OrderTracking order={sampleOrder} />
				</div>
			</main>
		</div>
	)
}
