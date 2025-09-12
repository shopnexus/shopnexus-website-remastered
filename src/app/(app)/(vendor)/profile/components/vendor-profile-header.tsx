"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
	MessageCircle,
	Star,
	MapPin,
	Calendar,
	Users,
	Award,
} from "lucide-react"

export function VendorProfileHeader() {
	// Mock data for vendor profile
	const vendor = {
		name: "TechOffice Solutions",
		avatar: "/placeholder-logo.png",
		rating: 4.8,
		totalReviews: 1247,
		responseRate: 98,
		joinedYears: 5,
		totalProducts: 156,
		followers: 12500,
		location: "Ho Chi Minh City, Vietnam",
		verified: true,
		preferred: true,
		lastActive: "3 minutes ago",
	}

	return (
		<Card className="overflow-hidden">
			<CardContent className="p-0">
				{/* Cover Image */}
				<div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative">
					<div className="absolute inset-0 bg-black/20"></div>
					<div className="absolute bottom-4 left-6">
						<div className="flex items-end space-x-4">
							<Avatar className="w-24 h-24 border-4 border-white">
								<AvatarImage src={vendor.avatar} />
								<AvatarFallback className="bg-blue-600 text-white text-2xl">
									{vendor.name.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div className="text-white mb-2">
								<div className="flex items-center space-x-2 mb-1">
									<h1 className="text-2xl font-bold">{vendor.name}</h1>
									{vendor.verified && (
										<Badge className="bg-green-600 text-white">
											<Award className="h-3 w-3 mr-1" />
											Verified
										</Badge>
									)}
									{vendor.preferred && (
										<Badge className="bg-red-600 text-white">Preferred</Badge>
									)}
								</div>
								<div className="flex items-center space-x-4 text-sm">
									<div className="flex items-center space-x-1">
										<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
										<span>{vendor.rating}</span>
										<span>({vendor.totalReviews} reviews)</span>
									</div>
									<div className="flex items-center space-x-1">
										<MapPin className="h-4 w-4" />
										<span>{vendor.location}</span>
									</div>
									<div className="flex items-center space-x-1">
										<Calendar className="h-4 w-4" />
										<span>Joined {vendor.joinedYears} years ago</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="absolute top-4 right-6 flex space-x-2">
						<Button
							variant="outline"
							size="sm"
							className="bg-white/90 hover:bg-white"
						>
							<MessageCircle className="h-4 w-4 mr-2" />
							Contact
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="bg-white/90 hover:bg-white"
						>
							<Users className="h-4 w-4 mr-2" />
							Follow
						</Button>
					</div>
				</div>

				{/* Status Bar */}
				<div className="px-6 py-4 bg-white border-t">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-6 text-sm text-gray-600">
							<div className="flex items-center space-x-1">
								<div className="w-2 h-2 bg-green-500 rounded-full"></div>
								<span>Active {vendor.lastActive}</span>
							</div>
							<div>
								<span className="font-medium">{vendor.responseRate}%</span>{" "}
								response rate
							</div>
							<div>
								<span className="font-medium">{vendor.totalProducts}</span>{" "}
								products
							</div>
							<div>
								<span className="font-medium">
									{(vendor.followers / 1000).toFixed(1)}k
								</span>{" "}
								followers
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
