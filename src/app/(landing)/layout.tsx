import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CurrencyProvider } from "@/components/currency/currency-context"

export default function LandingLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<CurrencyProvider defaultCurrency="USDT">
			<div className="min-h-screen flex flex-col">
				<Header />
				<main className="flex-1 w-full">{children}</main>
				<Footer />
			</div>
		</CurrencyProvider>
	)
}
