"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle } from "lucide-react"

interface Seller {
	name: string
	rating: number
	responseRate: number
	joinedYears: number
	totalProducts: number
	followers: number
	avatar: string
}

interface SellerInfoProps {
	seller: Seller
}

export function SellerInfo({ seller }: SellerInfoProps) {
	return (
		<Card className="bg-white shadow-sm border border-gray-100 mx-4">
			<CardContent className="p-4 sm:p-6">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
					<div className="flex items-center space-x-4">
						<Avatar className="w-12 h-12">
							<AvatarImage src={seller.avatar} />
							<AvatarFallback className="bg-blue-600 text-white">
								{seller.name.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<div>
							<div className="flex items-center space-x-2">
								<h3 className="font-medium">{seller.name}</h3>
								<Badge className="bg-red-600 text-white text-xs">
									Preferred
								</Badge>
							</div>
							<p className="text-sm text-gray-600">Active 3 Minutes Ago</p>
						</div>
					</div>

					<div className="grid grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-8 text-center">
						<div>
							<div className="text-sm text-gray-600">Ratings</div>
							<div className="font-medium text-red-600">
								{(seller.rating * 5.7).toFixed(1)}k
							</div>
						</div>
						<div>
							<div className="text-sm text-gray-600">Response Rate</div>
							<div className="font-medium text-red-600">
								{seller.responseRate}%
							</div>
						</div>
						<div>
							<div className="text-sm text-gray-600">Joined</div>
							<div className="font-medium">{seller.joinedYears} years ago</div>
						</div>
						<div>
							<div className="text-sm text-gray-600">Products</div>
							<div className="font-medium">{seller.totalProducts}</div>
						</div>
						<div>
							<div className="text-sm text-gray-600">Response Time</div>
							<div className="font-medium text-red-600">within hours</div>
						</div>
						<div>
							<div className="text-sm text-gray-600">Follower</div>
							<div className="font-medium">
								{(seller.followers / 1000).toFixed(1)}k
							</div>
						</div>
					</div>

					<div className="flex lg:flex-row flex-col gap-2">
						<Button variant="outline" size="sm" className="lg:w-fit w-full">
							<MessageCircle className="h-4 w-4 mr-2 hidden lg:block" />
							Chat Now
						</Button>
						<Button variant="outline" size="sm" className="lg:w-fit w-full">
							View Shop
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
