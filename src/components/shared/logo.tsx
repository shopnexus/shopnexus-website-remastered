import { Building2 } from "lucide-react"
import Link from "next/link"

export function Logo() {
	return (
		<Link href="/" className="flex items-center space-x-2">
			<Building2 className="h-6 w-6 text-primary" />
			<span className="text-lg font-bold text-primary">ShopNexus</span>
		</Link>
	)
}
