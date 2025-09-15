"use client"

import { useEffect, useState } from "react"
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
import { CartSidebar } from "@/app/(app)/cart/components/cart-sidebar"
import { Search, User, Menu, LogOut, Settings, BarChart3 } from "lucide-react"
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useGetMe, useSignOut } from "@/core/account/account.customer"
import { useRouter } from "next/navigation"
import { Logo } from "../shared/logo"
import { cn } from "@/lib/utils"

export function Header({ hideSearch = false }: { hideSearch?: boolean }) {
	const router = useRouter()
	const { data: account } = useGetMe()
	const { mutateAsync: mutateSignOut } = useSignOut()
	const isLoggedIn = !!account

	const [isScrolled, setIsScrolled] = useState(false)
	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState("")

	useEffect(() => {
		const onScroll = () => setIsScrolled(window.scrollY > 4)
		onScroll()
		window.addEventListener("scroll", onScroll)
		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	const handleSignOut = () => {
		mutateSignOut()
		router.refresh()
	}

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchQuery.trim()) {
			router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
		}
	}

	const handleMobileSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchQuery.trim()) {
			router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
			setIsSearchOpen(false)
		}
	}

	return (
		<header
			className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${
				isScrolled ? "shadow-sm" : ""
			}`}
		>
			<div
				className={cn(
					"container flex h-16 items-center mx-auto justify-between"
				)}
			>
				{/* Logo */}
				<Logo />

				{/* Navigation */}
				{/* Search */}
				{!hideSearch ? (
					<div className="hidden md:flex flex-1 items-center justify-center px-6 ">
						<form onSubmit={handleSearch} className="relative w-full max-w-sm">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="What are you looking for today?"
								className="pl-10 pr-4 border-none"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</form>
					</div>
				) : (
					<div className="hidden md:flex flex-1 items-center justify-center px-6 ">
						<div className="w-full"></div>
					</div>
				)}

				{/* Actions */}
				<div className="flex items-center space-x-2 md:space-x-4">
					{/* Mobile search toggle */}
					{!hideSearch && (
						<Button
							variant="ghost"
							size="icon"
							className="md:hidden"
							onClick={() => setIsSearchOpen((v) => !v)}
							aria-label="Toggle search"
						>
							<Search className="h-5 w-5" />
						</Button>
					)}
					<CartSidebar />

					{isLoggedIn ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon">
									<User className="h-5 w-5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel>My Account</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link href="/account" className="flex items-center">
										<Settings className="mr-2 h-4 w-4" />
										Profile & Settings
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/orders" className="flex items-center">
										<BarChart3 className="mr-2 h-4 w-4" />
										My Orders
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/dashboard" className="flex items-center">
										<BarChart3 className="mr-2 h-4 w-4" />
										Dashboard
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-destructive"
									onClick={handleSignOut}
								>
									<LogOut className="mr-2 h-4 w-4" />
									Sign Out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<Button variant="ghost" size="icon" asChild>
							<Link href="/login">
								<User className="h-5 w-5" />
							</Link>
						</Button>
					)}

					{/* Mobile menu */}
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="md:hidden"
								aria-label="Open menu"
							>
								<Menu className="h-5 w-5" />
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-80">
							<SheetHeader>
								<SheetTitle>Menu</SheetTitle>
							</SheetHeader>
							<div className="mt-4 space-y-4">
								<div className="grid gap-2">
									<Link href="/products" className="text-sm font-medium">
										All Products
									</Link>
									<Link href="/products/office-supplies" className="text-sm">
										Office Supplies
									</Link>
									<Link href="/products/technology" className="text-sm">
										Technology
									</Link>
									<Link href="/products/furniture" className="text-sm">
										Furniture
									</Link>
								</div>
								<Separator />
								<div className="grid gap-2">
									<Link href="/bulk-orders" className="text-sm font-medium">
										Bulk Orders
									</Link>
									<Link href="/orders" className="text-sm">
										Orders
									</Link>
									<Link href="/checkout" className="text-sm">
										Checkout
									</Link>
								</div>
								<Separator />
								<div className="grid gap-2">
									{isLoggedIn ? (
										<>
											<Link href="/account" className="text-sm">
												Profile & Settings
											</Link>
											<Link href="/dashboard" className="text-sm">
												Dashboard
											</Link>
											<button
												onClick={handleSignOut}
												className="text-left text-sm text-destructive"
											>
												Sign Out
											</button>
										</>
									) : (
										<Link href="/login" className="text-sm">
											Sign In
										</Link>
									)}
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>

			{/* Mobile search bar overlay */}
			{isSearchOpen && (
				<div className="md:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
					<div className="container mx-auto px-4 py-3">
						<form onSubmit={handleMobileSearch} className="relative">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								placeholder="Search products, categories..."
								className="pl-10 pr-4"
								autoFocus
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</form>
					</div>
				</div>
			)}
		</header>
	)
}
