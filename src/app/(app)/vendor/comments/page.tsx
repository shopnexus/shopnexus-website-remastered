"use client"

import { useState } from "react"
import { PageHeader } from "../components/page-header"
import { CommentTable } from "./components/comment-table"
import { mockComments, MockComment } from "@/lib/mocks/mock-data"
import { toast } from "sonner"

export default function CommentsPage() {
	const [comments, setComments] = useState<MockComment[]>(mockComments)

	const handleFlagComment = (commentId: number) => {
		// In real implementation, this would flag the comment for review
		toast.success("Comment flagged for review")
	}

	const handleHideComment = (commentId: number) => {
		setComments((prev) => prev.filter((comment) => comment.id !== commentId))
		toast.success("Comment hidden")
	}

	const handleRespondToComment = (commentId: number, response: string) => {
		// In real implementation, this would add a response to the comment
		toast.success("Response added to comment")
	}

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 py-8 mx-auto">
				<div className="container max-w-7xl">
					<PageHeader
						title="Comment Management"
						description="Manage customer reviews and comments on your products"
					/>

					<CommentTable
						comments={comments}
						onFlagComment={handleFlagComment}
						onHideComment={handleHideComment}
						onRespondToComment={handleRespondToComment}
					/>
				</div>
			</main>
		</div>
	)
}
