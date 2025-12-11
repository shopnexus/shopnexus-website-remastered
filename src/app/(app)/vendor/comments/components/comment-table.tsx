"use client"

import { useState } from "react"
import { DataTable, Column } from "../../components/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { MockComment } from "@/lib/mocks/mock-data"
import {
	MessageSquare,
	Flag,
	Eye,
	EyeOff,
	ThumbsUp,
	ThumbsDown,
} from "lucide-react"
import { toast } from "sonner"

interface CommentTableProps {
	comments: MockComment[]
	onFlagComment: (commentId: number) => void
	onHideComment: (commentId: number) => void
	onRespondToComment: (commentId: number, response: string) => void
}

export function CommentTable({
	comments,
	onFlagComment,
	onHideComment,
	onRespondToComment,
}: CommentTableProps) {
	const [scoreFilter, setScoreFilter] = useState<string>("all")
	const [expandedComments, setExpandedComments] = useState<Set<number>>(
		new Set()
	)
	const [responses, setResponses] = useState<Record<number, string>>({})

	const filteredComments = comments.filter((comment) => {
		if (scoreFilter === "all") return true
		if (scoreFilter === "high") return comment.score >= 4
		if (scoreFilter === "medium") return comment.score === 3
		if (scoreFilter === "low") return comment.score <= 2
		return true
	})

	const toggleExpanded = (commentId: number) => {
		const newExpanded = new Set(expandedComments)
		if (newExpanded.has(commentId)) {
			newExpanded.delete(commentId)
		} else {
			newExpanded.add(commentId)
		}
		setExpandedComments(newExpanded)
	}

	const handleResponseSubmit = (commentId: number) => {
		const response = responses[commentId]
		if (response?.trim()) {
			onRespondToComment(commentId, response)
			setResponses((prev) => ({ ...prev, [commentId]: "" }))
		}
	}

	const getScoreColor = (score: number) => {
		if (score >= 4) return "bg-green-100 text-green-800"
		if (score === 3) return "bg-yellow-100 text-yellow-800"
		return "bg-red-100 text-red-800"
	}

	const commentColumns: Column<MockComment>[] = [
		{
			key: "product_name",
			label: "Product",
			sortable: true,
		},
		{
			key: "customer_name",
			label: "Customer",
			sortable: true,
		},
		{
			key: "score",
			label: "Rating",
			render: (value: number) => (
				<Badge className={getScoreColor(value)}>{value}/5</Badge>
			),
			sortable: true,
		},
		{
			key: "body",
			label: "Comment",
			render: (value: string) => (
				<div className="max-w-xs">
					<p className="truncate" title={value}>
						{value}
					</p>
				</div>
			),
		},
		{
			key: "upvote",
			label: "Votes",
			render: (_, row: MockComment) => (
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1 text-green-600">
						<ThumbsUp className="h-3 w-3" />
						<span className="text-xs">{row.upvote}</span>
					</div>
					<div className="flex items-center gap-1 text-red-600">
						<ThumbsDown className="h-3 w-3" />
						<span className="text-xs">{row.downvote}</span>
					</div>
				</div>
			),
		},
		{
			key: "date_created",
			label: "Date",
			render: (value: string) => new Date(value).toLocaleDateString(),
			sortable: true,
		},
	]

	const renderExpandedRow = (comment: MockComment) => (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label className="text-sm font-medium">Full Comment</Label>
				<p className="text-sm p-3 bg-muted rounded-md">{comment.body}</p>
			</div>

			<div className="grid grid-cols-2 gap-4 text-sm">
				<div>
					<Label className="text-sm font-medium text-muted-foreground">
						Reference Type
					</Label>
					<p>{comment.ref_type}</p>
				</div>
				<div>
					<Label className="text-sm font-medium text-muted-foreground">
						Reference ID
					</Label>
					<p>#{comment.ref_id}</p>
				</div>
			</div>

			<div className="space-y-2">
				<Label className="text-sm font-medium">Respond to Comment</Label>
				<Textarea
					value={responses[comment.id] || ""}
					onChange={(e) =>
						setResponses((prev) => ({ ...prev, [comment.id]: e.target.value }))
					}
					placeholder="Write your response..."
					rows={3}
				/>
				<Button
					size="sm"
					onClick={() => handleResponseSubmit(comment.id)}
					disabled={!responses[comment.id]?.trim()}
				>
					Submit Response
				</Button>
			</div>
		</div>
	)

	return (
		<div className="space-y-4">
			{/* Filters */}
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium">Filter by rating:</span>
					<Select value={scoreFilter} onValueChange={setScoreFilter}>
						<SelectTrigger className="w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Ratings</SelectItem>
							<SelectItem value="high">4-5 Stars</SelectItem>
							<SelectItem value="medium">3 Stars</SelectItem>
							<SelectItem value="low">1-2 Stars</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<DataTable
				data={filteredComments}
				columns={commentColumns}
				searchKey="customer_name"
				searchPlaceholder="Search by customer name..."
				expandable
				renderExpandedRow={renderExpandedRow}
				actions={(comment) => (
					<div className="flex items-center gap-1">
						<Button
							size="sm"
							variant="ghost"
							onClick={() => toggleExpanded(comment.id)}
							title={expandedComments.has(comment.id) ? "Collapse" : "Expand"}
						>
							{expandedComments.has(comment.id) ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
						</Button>
						<Button
							size="sm"
							variant="ghost"
							onClick={() => onFlagComment(comment.id)}
							title="Flag for Review"
						>
							<Flag className="h-4 w-4" />
						</Button>
						<Button
							size="sm"
							variant="ghost"
							onClick={() => onHideComment(comment.id)}
							title="Hide Comment"
						>
							<EyeOff className="h-4 w-4" />
						</Button>
					</div>
				)}
			/>
		</div>
	)
}
