"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CurrencyProvider } from "@/components/currency/currency-context"
import { usePathname } from "next/navigation"

export default function AppLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname()
	const hideSearch = pathname === "/search"

	return (
		<CurrencyProvider defaultCurrency="USDT">
			<div className="min-h-screen flex flex-col">
				<Header hideSearch={hideSearch} />

				<main className="flex-1 bg-gray-50">
					{/* Content */}
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						{children}
					</div>
				</main>
			</div>
			<Footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" />
		</CurrencyProvider>
	)
}
