"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Star, ThumbsUp, ThumbsDown, MoreHorizontal } from "lucide-react"
import { Resource } from "@/core/common/resource.type"

interface RatingDetail {
	score: number
	total: number
	breakdown: Record<string, number>
}

interface Review {
	id: number
	account: {
		id: number
		name: string
		avatar?: Resource
		verified: boolean
	}
	score: number
	date_created: string
	body: string
	upvote: number
	downvote: number
	resources: Resource[]
}

interface ReviewsSectionProps {
	rating: RatingDetail
	reviews: Review[]
}

export function ReviewsSection({ rating, reviews }: ReviewsSectionProps) {
	return (
		<Card className="bg-white shadow-sm border border-gray-100 mx-4">
			<CardHeader>
				<CardTitle>
					Customer Reviews ({rating.total.toLocaleString()})
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{/* Rating Summary */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="text-center">
							<div className="text-4xl font-bold text-gray-900 mb-2">
								{rating.score.toFixed(1)}
							</div>
							<div className="flex justify-center mb-2">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={`h-5 w-5 ${
											i < Math.floor(rating.score)
												? "fill-yellow-400 text-yellow-400"
												: "text-gray-300"
										}`}
									/>
								))}
							</div>
							<p className="text-gray-600">
								{rating.total.toLocaleString()} reviews
							</p>
						</div>

						<div className="space-y-2">
							{[5, 4, 3, 2, 1].map((ratingValue) => (
								<div key={ratingValue} className="flex items-center space-x-2">
									<span className="text-sm w-3">{ratingValue}</span>
									<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
									<Progress
										value={
											((rating.breakdown[ratingValue.toString()] || 0) /
												rating.total) *
											100
										}
										className="flex-1 h-2"
									/>
									<span className="text-sm text-gray-600 w-12">
										{rating.breakdown[ratingValue.toString()] || 0}
									</span>
								</div>
							))}
						</div>
					</div>

					<Separator />

					{/* Individual Reviews */}
					<div className="space-y-6">
						{reviews?.map((review) => (
							<div
								key={review.id}
								className="border-b border-gray-100 pb-6 last:border-b-0"
							>
								<div className="flex items-start space-x-4">
									<Avatar>
										<AvatarImage src={review.account.avatar?.url} />
										<AvatarFallback>
											{review.account.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<div className="flex-1">
										<div className="flex items-center justify-between mb-2">
											<div>
												<div className="flex items-center space-x-2">
													<h4 className="font-medium">{review.account.name}</h4>
													{review.account.verified && (
														<Badge variant="secondary" className="text-xs">
															Verified Purchase
														</Badge>
													)}
												</div>
												<div className="flex items-center space-x-2 mt-1">
													<div className="flex">
														{[...Array(5)].map((_, i) => (
															<Star
																key={i}
																className={`h-3 w-3 ${
																	i < review.score
																		? "fill-yellow-400 text-yellow-400"
																		: "text-gray-300"
																}`}
															/>
														))}
													</div>
													<span className="text-sm text-gray-600">
														{new Date(review.date_created).toLocaleDateString()}
													</span>
												</div>
											</div>
											<Button variant="ghost" size="sm">
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</div>

										{/* <h5 className="font-medium mb-2">{review.title}</h5> */}
										{/* TODO: add title */}
										<p className="text-gray-700 mb-3">{review.body}</p>

										{review.resources.length > 0 && (
											<div className="flex space-x-2 mb-3">
												{review.resources.map((img, idx) => (
													<div
														key={idx}
														className="w-16 h-16 rounded border overflow-hidden"
													>
														<Image
															src={img.url}
															alt={`Review image ${idx + 1}`}
															width={64}
															height={64}
															className="object-cover"
														/>
													</div>
												))}
											</div>
										)}

										<div className="flex items-center space-x-4">
											<Button variant="ghost" size="sm">
												<ThumbsUp className="h-4 w-4 mr-1" />
												Helpful ({review.upvote})
											</Button>
											<Button variant="ghost" size="sm">
												<ThumbsDown className="h-4 w-4 mr-1" />
												Not helpful ({review.downvote})
											</Button>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
