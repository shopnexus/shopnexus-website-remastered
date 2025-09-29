import { OrderTracking } from "../components/order-tracking"

const sampleOrder = {
	id: "ORD-2024-001",
	status: "shipped" as const,
	orderDate: "2024-01-15",
	estimatedDelivery: "2024-01-19",
	trackingNumber: "1Z999AA1234567890",
	items: [
		{
			sku_id: "SKU-001",
			name: "Professional Office Chair - Ergonomic Design",
			sku_name: "Black Leather, Adjustable Height",
			quantity: 8,
			price: 249.99,
			resource: { url: "/professional-office-chair.jpg" },
		},
		{
			sku_id: "SKU-002",
			name: "Premium Paper Pack - 5000 Sheets",
			sku_name: "A4 White, 80gsm",
			quantity: 25,
			price: 39.99,
			resource: { url: "/office-paper-stack.jpg" },
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
				<div className="container max-w-4xl mx-auto">
					<OrderTracking order={sampleOrder} />
				</div>
			</main>
		</div>
	)
}
