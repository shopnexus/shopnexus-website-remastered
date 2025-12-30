"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { CommentTable } from "./components/comment-table"
import { useListComments, useDeleteComment, TComment } from "@/core/catalog/comment.customer"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function CommentsPage() {
	// Fetch all comments for vendor products
	// Note: This would ideally filter by vendor_id, but the API may need vendor-specific endpoint
	const commentsQuery = useListComments({
		limit: 20,
		ref_type: "ProductSpu",
		ref_id: "", // Empty to get all, or filter by specific product
	})
	const { items: comments } = useInfiniteScroll(commentsQuery)
	const deleteCommentMutation = useDeleteComment()

	const handleFlagComment = (commentId: number) => {
		// In real implementation, this would flag the comment for review
		toast.success("Comment flagged for review")
	}

	const handleHideComment = async (commentId: number) => {
		try {
			await deleteCommentMutation.mutateAsync({ ids: [commentId.toString()] })
			toast.success("Comment deleted successfully")
		} catch (error) {
			toast.error("Failed to delete comment")
		}
	}

	const handleRespondToComment = (commentId: number, response: string) => {
		// In real implementation, this would add a response to the comment
		// This might require creating a new comment with ref_type="Comment" and ref_id=commentId
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

					{commentsQuery.isLoading && comments.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-muted-foreground">Loading comments...</p>
						</div>
					) : (
						<>
							<CommentTable
								comments={comments}
								onFlagComment={handleFlagComment}
								onHideComment={handleHideComment}
								onRespondToComment={handleRespondToComment}
							/>
							{commentsQuery.hasNextPage && (
								<div className="flex justify-center mt-4">
									<Button
										variant="outline"
										onClick={() => commentsQuery.fetchNextPage()}
										disabled={commentsQuery.isFetchingNextPage}
									>
										{commentsQuery.isFetchingNextPage ? "Loading..." : "Load More"}
									</Button>
								</div>
							)}
						</>
					)}
				</div>
			</main>
		</div>
	)
}
