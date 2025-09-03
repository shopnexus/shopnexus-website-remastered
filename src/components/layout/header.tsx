"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { CartSidebar } from "@/components/cart/cart-sidebar"
import {
	Search,
	User,
	Menu,
	Building2,
	LogOut,
	Settings,
	BarChart3,
} from "lucide-react"

export function Header() {
	const [isLoggedIn] = useState(true) // Added dashboard link to user dropdown

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
			<div className="container flex h-16 items-center justify-between mx-auto">
				{/* Logo */}
				<Link href="/" className="flex items-center space-x-2">
					<Building2 className="h-8 w-8 text-primary" />
					<span className="text-xl font-bold text-primary">B2B Commerce</span>
				</Link>

				{/* Navigation */}
				<NavigationMenu className="hidden md:flex">
					<NavigationMenuList>
						<NavigationMenuItem>
							<NavigationMenuTrigger>Products</NavigationMenuTrigger>
							<NavigationMenuContent>
								<div className="grid gap-3 p-6 w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
									<div className="row-span-3">
										<NavigationMenuLink asChild>
											<Link
												className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
												href="/products"
											>
												<div className="mb-2 mt-4 text-lg font-medium">
													All Products
												</div>
												<p className="text-sm leading-tight text-muted-foreground">
													Browse our complete catalog of business solutions
												</p>
											</Link>
										</NavigationMenuLink>
									</div>
									<div className="grid gap-2">
										<Link
											href="/products/office-supplies"
											className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
										>
											<div className="text-sm font-medium leading-none">
												Office Supplies
											</div>
											<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
												Essential office equipment and supplies
											</p>
										</Link>
										<Link
											href="/products/technology"
											className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
										>
											<div className="text-sm font-medium leading-none">
												Technology
											</div>
											<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
												Computers, software, and tech solutions
											</p>
										</Link>
										<Link
											href="/products/furniture"
											className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
										>
											<div className="text-sm font-medium leading-none">
												Furniture
											</div>
											<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
												Office furniture and workspace solutions
											</p>
										</Link>
									</div>
								</div>
							</NavigationMenuContent>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<Link href="/bulk-orders" legacyBehavior passHref>
								<NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
									Bulk Orders
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<Link href="/solutions" legacyBehavior passHref>
								<NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
									Solutions
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>

				{/* Search */}
				<div className="flex flex-1 items-center justify-center px-6">
					<div className="relative w-full max-w-sm">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input placeholder="Search products..." className="pl-10 pr-4" />
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center space-x-4">
					<CartSidebar />

					{isLoggedIn ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon">
									<User className="h-5 w-5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel>John Doe</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link href="/dashboard" className="flex items-center">
										<BarChart3 className="mr-2 h-4 w-4" />
										Dashboard
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/account" className="flex items-center">
										<Settings className="mr-2 h-4 w-4" />
										Account Settings
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/orders" className="flex items-center">
										<Settings className="mr-2 h-4 w-4" />
										Order History
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem className="text-destructive">
									<LogOut className="mr-2 h-4 w-4" />
									Sign Out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button variant="ghost" size="icon" asChild>
							<Link href="/auth/login">
								<User className="h-5 w-5" />
							</Link>
						</Button>
					)}

					<Button variant="ghost" size="icon" className="md:hidden">
						<Menu className="h-5 w-5" />
					</Button>
				</div>
			</div>
		</header>
	)
}
