"use client"

import { CartContainer } from "./components/cart-container"
import { CurrencySwitcher } from "@/components/currency/currency-switcher"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function CartPage() {
	return (
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
	)
}
