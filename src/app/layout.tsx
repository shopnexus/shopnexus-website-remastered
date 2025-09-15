import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ErrorBoundary } from "react-error-boundary"
import Providers from "./providers"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
	title: "ShopNexus - Buy and Sell Anything!",
	description:
		"Connect with verified suppliers and grow your business with confidence. Professional B2B ecommerce platform for bulk orders, office supplies, and business solutions.",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
				<ErrorBoundary fallback={<div>Something went wrong</div>}>
					<Providers>{children}</Providers>
				</ErrorBoundary>
				<Analytics />
				<Toaster />
			</body>
		</html>
	)
}
