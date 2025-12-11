"use client"

import {
	SidebarProvider,
	SidebarInset,
	SidebarTrigger,
} from "@/components/ui/sidebar"
import { VendorSidebar } from "./components/vendor-sidebar"

export default function VendorLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<SidebarProvider>
			<VendorSidebar />
			<SidebarInset className="bg-gray-50 min-h-screen">
				<header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
					<SidebarTrigger className="-ml-1" />
				</header>
				<div className="flex flex-1 flex-col">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
