"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
	LayoutDashboard,
	Package,
	ShoppingCart,
	Warehouse,
	Tag,
	MessageSquare,
	RotateCcw,
	User,
	LogOut,
} from "lucide-react"
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
	{
		title: "Dashboard",
		url: "/vendor/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Products",
		url: "/vendor/products",
		icon: Package,
	},
	{
		title: "Orders",
		url: "/vendor/orders",
		icon: ShoppingCart,
	},
	{
		title: "Inventory",
		url: "/vendor/inventory",
		icon: Warehouse,
	},
	{
		title: "Promotions",
		url: "/vendor/promotions",
		icon: Tag,
	},
	{
		title: "Comments",
		url: "/vendor/comments",
		icon: MessageSquare,
	},
	{
		title: "Refunds",
		url: "/vendor/refunds",
		icon: RotateCcw,
	},
	{
		title: "Profile",
		url: "/vendor/profile",
		icon: User,
	},
	{
		title: "Logout",
		url: "/logout",
		icon: LogOut,
	},
]

export function VendorSidebar() {
	const pathname = usePathname()

	return (
		<Sidebar variant="inset">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Vendor Portal</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{menuItems.map((item) => {
								const Icon = item.icon
								const isActive =
									pathname === item.url || pathname.startsWith(item.url + "/")
								return (
									<SidebarMenuItem key={item.url}>
										<SidebarMenuButton
											asChild
											isActive={isActive}
											tooltip={item.title}
										>
											<Link href={item.url}>
												<Icon />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								)
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
