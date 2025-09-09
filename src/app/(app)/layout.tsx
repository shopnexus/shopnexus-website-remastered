import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CurrencyProvider } from "@/components/currency/currency-context"

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<CurrencyProvider defaultCurrency="USDT">
			<div className="min-h-screen flex flex-col">
				<Header hideSearch />
				<main className="flex-1">{children}</main>
				<Footer />
			</div>
		</CurrencyProvider>
	)
}
