"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Star,
	ThumbsUp,
	ThumbsDown,
	MessageSquare,
	Flag,
	EyeOff,
	Reply,
} from "lucide-react"
import { toast } from "sonner"

// Comment type - replace with real API type when available
type Comment = {
	id: number
	product_name: string
	customer_name: string
	score: number
	body: string
	upvote: number
	downvote: number
	ref_type: 'ProductSpu' | 'Comment'
	ref_id: number
	date_created: string
}

interface ProductCommentsProps {
	comments: Comment[]
	productId: number
}

export function ProductComments({ comments, productId }: ProductCommentsProps) {
	const [sortBy, setSortBy] = useState<string>("newest")

	// Filter comments for this specific product
	const productComments = comments.filter(
		(comment) =>
			comment.ref_id === productId && comment.ref_type === "ProductSpu"
	)

	// Sort comments based on selected option
	const sortedComments = [...productComments].sort((a, b) => {
		switch (sortBy) {
			case "newest":
				return (
					new Date(b.date_created).getTime() -
					new Date(a.date_created).getTime()
				)
			case "oldest":
				return (
					new Date(a.date_created).getTime() -
					new Date(b.date_created).getTime()
				)
			case "highest_rating":
				return b.score - a.score
			case "lowest_rating":
				return a.score - b.score
			case "most_helpful":
				return b.upvote - a.upvote
			default:
				return 0
		}
	})

	const handleVote = (commentId: number, type: "upvote" | "downvote") => {
		// In real implementation, this would send API request
		toast.success(`Comment ${type} recorded`)
	}

	const handleFlagComment = (_commentId: number) => {
		// In real implementation, this would flag the comment
		toast.success("Comment flagged for review")
	}

	const handleHideComment = (_commentId: number) => {
		// In real implementation, this would hide the comment
		toast.success("Comment hidden from public view")
	}

	const handleRespondToComment = (_commentId: number) => {
		// In real implementation, this would open a response modal
		toast.success("Response feature coming soon")
	}

	const getScoreColor = (score: number) => {
		if (score >= 4) return "bg-green-100 text-green-800"
		if (score === 3) return "bg-yellow-100 text-yellow-800"
		return "bg-red-100 text-red-800"
	}

	const renderStars = (score: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<Star
				key={i}
				className={`h-4 w-4 ${
					i < score ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
				}`}
			/>
		))
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<MessageSquare className="h-5 w-5" />
						Customer Reviews Management ({productComments.length})
					</CardTitle>
					<div className="flex items-center gap-2">
						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-40">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="newest">Newest First</SelectItem>
								<SelectItem value="oldest">Oldest First</SelectItem>
								<SelectItem value="highest_rating">Highest Rating</SelectItem>
								<SelectItem value="lowest_rating">Lowest Rating</SelectItem>
								<SelectItem value="most_helpful">Most Helpful</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Comments List */}
				{productComments.length === 0 ? (
					<div className="text-center py-8">
						<MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-lg font-medium mb-2">
							No customer reviews yet
						</h3>
						<p className="text-muted-foreground">
							Customer reviews will appear here once customers start reviewing
							this product.
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{sortedComments.map((comment) => (
							<Card key={comment.id} className="border-l-4 border-l-blue-500">
								<CardContent className="pt-6">
									<div className="space-y-4">
										{/* Comment Header */}
										<div className="flex items-start justify-between">
											<div className="flex items-center gap-3">
												<Avatar className="h-10 w-10">
													<AvatarFallback>
														{comment.customer_name
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</AvatarFallback>
												</Avatar>
												<div>
													<div className="flex items-center gap-2">
														<h4 className="font-medium">
															{comment.customer_name}
														</h4>
														<Badge className={getScoreColor(comment.score)}>
															{comment.score}/5
														</Badge>
													</div>
													<div className="flex items-center gap-1">
														{renderStars(comment.score)}
													</div>
													<p className="text-sm text-muted-foreground">
														{new Date(
															comment.date_created
														).toLocaleDateString()}
													</p>
												</div>
											</div>
											<div className="flex items-center gap-1">
												<Button
													size="sm"
													variant="ghost"
													onClick={() => handleRespondToComment(comment.id)}
													title="Respond to Review"
													className="text-blue-600 hover:text-blue-700"
												>
													<Reply className="h-4 w-4" />
												</Button>
												<Button
													size="sm"
													variant="ghost"
													onClick={() => handleHideComment(comment.id)}
													title="Hide Comment"
													className="text-orange-600 hover:text-orange-700"
												>
													<EyeOff className="h-4 w-4" />
												</Button>
												<Button
													size="sm"
													variant="ghost"
													onClick={() => handleFlagComment(comment.id)}
													title="Flag for Review"
													className="text-red-600 hover:text-red-700"
												>
													<Flag className="h-4 w-4" />
												</Button>
											</div>
										</div>

										{/* Comment Body */}
										<div className="pl-13">
											<p className="text-sm leading-relaxed">{comment.body}</p>

											{/* Voting Section */}
											<div className="flex items-center gap-4 mt-3">
												<Button
													size="sm"
													variant="ghost"
													onClick={() => handleVote(comment.id, "upvote")}
													className="flex items-center gap-1 text-green-600 hover:text-green-700"
												>
													<ThumbsUp className="h-4 w-4" />
													<span className="text-xs">{comment.upvote}</span>
												</Button>
												<Button
													size="sm"
													variant="ghost"
													onClick={() => handleVote(comment.id, "downvote")}
													className="flex items-center gap-1 text-red-600 hover:text-red-700"
												>
													<ThumbsDown className="h-4 w-4" />
													<span className="text-xs">{comment.downvote}</span>
												</Button>
												{/* <span className="text-xs text-muted-foreground">
													Was this review helpful?
												</span> */}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	)
}
