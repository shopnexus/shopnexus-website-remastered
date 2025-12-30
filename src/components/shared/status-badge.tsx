"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
	status: string
	variant?: "default" | "secondary" | "destructive" | "outline"
	className?: string
}

const statusConfig: Record<
	string,
	{
		variant: "default" | "secondary" | "destructive" | "outline"
		className?: string
	}
> = {
	// General statuses
	Active: {
		variant: "default",
		className: "bg-green-100 text-green-800 hover:bg-green-100",
	},
	Inactive: {
		variant: "secondary",
		className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
	},
	Pending: {
		variant: "outline",
		className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
	},
	Processing: {
		variant: "default",
		className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
	},
	Success: {
		variant: "default",
		className: "bg-green-100 text-green-800 hover:bg-green-100",
	},
	Canceled: {
		variant: "destructive",
		className: "bg-red-100 text-red-800 hover:bg-red-100",
	},
	Failed: {
		variant: "destructive",
		className: "bg-red-100 text-red-800 hover:bg-red-100",
	},

	// Payment statuses
	Paid: {
		variant: "default",
		className: "bg-green-100 text-green-800 hover:bg-green-100",
	},
	Unpaid: {
		variant: "outline",
		className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
	},

	// Refund methods
	PickUp: {
		variant: "outline",
		className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
	},
	DropOff: {
		variant: "outline",
		className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
	},

	// Promotion types
	Discount: {
		variant: "default",
		className: "bg-green-100 text-green-800 hover:bg-green-100",
	},
	Bundle: {
		variant: "default",
		className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
	},
	BuyXGetY: {
		variant: "default",
		className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
	},
	Cashback: {
		variant: "default",
		className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
	},
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
	const config = statusConfig[status] || { variant: "secondary" }

	return (
		<Badge
			variant={variant || config.variant}
			className={cn(config.className, className)}
		>
			{status}
		</Badge>
	)
}

