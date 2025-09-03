import Link from "next/link"
import { Building2, Phone } from "lucide-react"

export function Footer() {
	return (
		<footer className="border-t bg-muted/50 mx-auto">
			<div className="container py-12">
				<div className="grid gap-8 lg:grid-cols-4">
					{/* Company Info */}
					<div className="space-y-4">
						<Link href="/" className="flex items-center space-x-2">
							<Building2 className="h-6 w-6 text-primary" />
							<span className="text-lg font-bold text-primary">
								B2B Commerce
							</span>
						</Link>
						<p className="text-sm text-muted-foreground max-w-xs">
							Your trusted partner for business procurement solutions. Quality
							products, competitive pricing, and exceptional service.
						</p>
						<div className="flex space-x-4">
							<div className="flex items-center space-x-2 text-sm text-muted-foreground">
								<Phone className="h-4 w-4" />
								<span>1-800-B2B-SHOP</span>
							</div>
						</div>
					</div>

					{/* Products */}
					<div className="space-y-4">
						<h3 className="text-sm font-semibold">Products</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link
									href="/products/office-supplies"
									className="hover:text-foreground transition-colors"
								>
									Office Supplies
								</Link>
							</li>
							<li>
								<Link
									href="/products/technology"
									className="hover:text-foreground transition-colors"
								>
									Technology
								</Link>
							</li>
							<li>
								<Link
									href="/products/furniture"
									className="hover:text-foreground transition-colors"
								>
									Furniture
								</Link>
							</li>
							<li>
								<Link
									href="/products/industrial"
									className="hover:text-foreground transition-colors"
								>
									Industrial Equipment
								</Link>
							</li>
						</ul>
					</div>

					{/* Services */}
					<div className="space-y-4 ">
						<h3 className="text-sm font-semibold">Services</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link
									href="/bulk-orders"
									className="hover:text-foreground transition-colors"
								>
									Bulk Orders
								</Link>
							</li>
							<li>
								<Link
									href="/custom-quotes"
									className="hover:text-foreground transition-colors"
								>
									Custom Quotes
								</Link>
							</li>
							<li>
								<Link
									href="/account-management"
									className="hover:text-foreground transition-colors"
								>
									Account Management
								</Link>
							</li>
							<li>
								<Link
									href="/support"
									className="hover:text-foreground transition-colors"
								>
									Customer Support
								</Link>
							</li>
						</ul>
					</div>

					{/* Business Tools */}
					<div className="space-y-4">
						<h3 className="text-sm font-semibold">Business Tools</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link
									href="/dashboard"
									className="hover:text-foreground transition-colors"
								>
									Analytics Dashboard
								</Link>
							</li>
							<li>
								<Link
									href="/orders"
									className="hover:text-foreground transition-colors"
								>
									Order Management
								</Link>
							</li>
							<li>
								<Link
									href="/account"
									className="hover:text-foreground transition-colors"
								>
									Account Settings
								</Link>
							</li>
							<li>
								<Link
									href="/support"
									className="hover:text-foreground transition-colors"
								>
									Customer Support
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
					<p>&copy; 2024 B2B Commerce. All rights reserved.</p>
				</div>
			</div>
		</footer>
	)
}
