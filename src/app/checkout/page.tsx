import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CheckoutForm } from "@/components/checkout/checkout-form"

export default function CheckoutPage() {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			<main className="flex-1 py-8">
				<div className="container max-w-6xl mx-auto">
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-balance">Checkout</h1>
						<p className="text-muted-foreground text-pretty">
							Complete your order with secure payment processing
						</p>
					</div>

					<CheckoutForm />
				</div>
			</main>

			<Footer />
		</div>
	)
}
