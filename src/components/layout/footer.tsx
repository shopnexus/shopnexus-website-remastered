import Link from "next/link"
import { Building2, Phone } from "lucide-react"
import { Logo } from "../shared/logo"
import { cn } from "@/lib/utils"

export function Footer({ className }: { className?: string }) {
	return (
		<footer className={cn("border-t bg-muted/50 mx-auto")}>
			<div className={cn("container py-12", className)}>
				<div className="grid gap-8 lg:grid-cols-4">
					{/* Company Info */}
					<div className="space-y-4">
						<Logo />
						<p className="text-sm text-muted-foreground max-w-xs">
							Your one-stop shop for quality products at unbeatable prices. Fast
							shipping, easy returns, and 24/7 customer support.
						</p>
						<div className="flex space-x-4">
							<div className="flex items-center space-x-2 text-sm text-muted-foreground">
								<Phone className="h-4 w-4" />
								<span>1-800-SHOPNOW</span>
							</div>
						</div>
					</div>

					{/* Shop */}
					<div className="space-y-4">
						<h3 className="text-sm font-semibold">Shop</h3>
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
									href="/products/new-arrivals"
									className="hover:text-foreground transition-colors"
								>
									New Arrivals
								</Link>
							</li>
							<li>
								<Link
									href="/products/bestsellers"
									className="hover:text-foreground transition-colors"
								>
									Best Sellers
								</Link>
							</li>
						</ul>
					</div>

					{/* Customer Care */}
					<div className="space-y-4 ">
						<h3 className="text-sm font-semibold">Customer Care</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link
									href="/shipping-info"
									className="hover:text-foreground transition-colors"
								>
									Shipping & Delivery
								</Link>
							</li>
							<li>
								<Link
									href="/returns"
									className="hover:text-foreground transition-colors"
								>
									Returns & Exchanges
								</Link>
							</li>
							<li>
								<Link
									href="/size-guide"
									className="hover:text-foreground transition-colors"
								>
									Size Guide
								</Link>
							</li>
							<li>
								<Link
									href="/support"
									className="hover:text-foreground transition-colors"
								>
									Help & Support
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="hover:text-foreground transition-colors"
								>
									Contact Us
								</Link>
							</li>
						</ul>
					</div>

					{/* My Account */}
					<div className="space-y-4">
						<h3 className="text-sm font-semibold">My Account </h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link
									href="/login"
									className="hover:text-foreground transition-colors"
								>
									Sign In
								</Link>
							</li>
							<li>
								<Link
									href="/orders"
									className="hover:text-foreground transition-colors"
								>
									Track My Order
								</Link>
							</li>
							<li>
								<Link
									href="/account"
									className="hover:text-foreground transition-colors"
								>
									My Profile
								</Link>
							</li>
							<li>
								<Link
									href="/wishlist"
									className="hover:text-foreground transition-colors"
								>
									Wishlist
								</Link>
							</li>
							<li>
								<Link
									href="/bulk-orders"
									className="hover:text-foreground transition-colors"
								>
									Bulk Orders
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div className="border-t pt-8 text-center text-sm text-muted-foreground pb-5">
				<p>&copy; 2024 ShopNexus. All rights reserved.</p>
			</div>
		</footer>
	)
}
