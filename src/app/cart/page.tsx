"use client"

import { Metadata } from "next"
import { CartContainer } from "@/components/cart/cart-container"
import { CurrencyProvider } from "@/components/currency/currency-context"
import { CurrencySwitcher } from "@/components/currency/currency-switcher"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// export const metadata: Metadata = {
//   title: "Shopping Cart | ShopNexus",
//   description: "Review and manage your cart items before checkout",
// }

export default function CartPage() {
	return (
		<CurrencyProvider defaultCurrency="USDT">
			<div className="min-h-screen bg-background">
				<div className="container mx-auto px-4 py-8">
					{/* Breadcrumb Navigation */}
					<Breadcrumb className="mb-6">
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href="/">Home</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>Shopping Cart</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>

					{/* Page Header */}
					<div className="mb-8 flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">
								Your Shopping Cart
							</h1>
							<p className="text-muted-foreground mt-2">
								Review and manage your items before checkout
							</p>
						</div>
						<CurrencySwitcher variant="compact" />
					</div>

					{/* Cart Content */}
					<CartContainer />
				</div>
			</div>
		</CurrencyProvider>
	)
}
