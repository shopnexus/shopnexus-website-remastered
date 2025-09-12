"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	TrendingUp,
	Package,
	Star,
	MessageCircle,
	Clock,
	Users,
} from "lucide-react"

export function VendorStats() {
	// Mock stats data
	const stats = [
		{
			title: "Total Sales",
			value: "2.4M",
			change: "+12.5%",
			icon: TrendingUp,
			color: "text-green-600",
		},
		{
			title: "Products Sold",
			value: "15.2K",
			change: "+8.3%",
			icon: Package,
			color: "text-blue-600",
		},
		{
			title: "Average Rating",
			value: "4.8",
			change: "+0.2",
			icon: Star,
			color: "text-yellow-600",
		},
		{
			title: "Response Rate",
			value: "98%",
			change: "+2.1%",
			icon: MessageCircle,
			color: "text-purple-600",
		},
		{
			title: "Response Time",
			value: "< 2h",
			change: "-15min",
			icon: Clock,
			color: "text-orange-600",
		},
		{
			title: "Followers",
			value: "12.5K",
			change: "+156",
			icon: Users,
			color: "text-pink-600",
		},
	]

	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
			{stats.map((stat, index) => {
				const Icon = stat.icon
				return (
					<Card key={index}>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-gray-600">{stat.title}</p>
									<p className={`text-2xl font-bold ${stat.color}`}>
										{stat.value}
									</p>
									<p className="text-xs text-green-600 font-medium">
										{stat.change}
									</p>
								</div>
								<Icon className={`h-8 w-8 ${stat.color} opacity-60`} />
							</div>
						</CardContent>
					</Card>
				)
			})}
		</div>
	)
}
