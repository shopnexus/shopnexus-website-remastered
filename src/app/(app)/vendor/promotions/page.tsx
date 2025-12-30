"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { PromotionTable } from "./components/promotion-table"
import { PromotionForm } from "./components/promotion-form"
import {
	useListPromotionVendor,
	useUpdateDiscount,
	useDeletePromotion,
	Promotion,
	PromotionDiscount,
} from "@/core/promotion/promotion.vendor"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function PromotionsPage() {
	const promotionsQuery = useListPromotionVendor({ limit: 20 })
	const { items: promotions } = useInfiniteScroll(promotionsQuery)
	const updatePromotionMutation = useUpdateDiscount()
	const deletePromotionMutation = useDeletePromotion()

	const [showForm, setShowForm] = useState(false)
	const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)

	const handleCreatePromotion = () => {
		setEditingPromotion(null)
		setShowForm(true)
	}

	const handleEditPromotion = (promotion: Promotion) => {
		setEditingPromotion(promotion)
		setShowForm(true)
	}

	const handleSavePromotion = async (promotionData: Partial<PromotionDiscount>) => {
		if (editingPromotion) {
			try {
				await updatePromotionMutation.mutateAsync({
					id: editingPromotion.id,
					...promotionData,
				})
				toast.success("Promotion updated successfully")
			} catch (error) {
				toast.error("Failed to update promotion")
			}
		}
		// Note: Creation is handled in PromotionForm component
		setShowForm(false)
		setEditingPromotion(null)
	}

	const handleDeletePromotion = async (promotionId: string) => {
		try {
			await deletePromotionMutation.mutateAsync(promotionId)
			toast.success("Promotion deleted successfully")
		} catch (error) {
			toast.error("Failed to delete promotion")
		}
	}

	const handleTogglePromotionStatus = async (promotionId: string) => {
		const promotion = promotions.find((p) => p.id === promotionId)
		if (!promotion) return

		try {
			await updatePromotionMutation.mutateAsync({
				id: promotionId,
				is_active: !promotion.is_active,
			})
			toast.success("Promotion status updated")
		} catch (error) {
			toast.error("Failed to update promotion status")
		}
	}

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 py-8 mx-auto">
				<div className="container max-w-7xl">
					<PageHeader
						title="Promotion Management"
						description="Create and manage promotional campaigns and discounts"
						actionLabel="Create Promotion"
						onAction={handleCreatePromotion}
					/>

					{promotionsQuery.isLoading && promotions.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-muted-foreground">Loading promotions...</p>
						</div>
					) : (
						<>
							<PromotionTable
								promotions={promotions}
								onEditPromotion={handleEditPromotion}
								onDeletePromotion={handleDeletePromotion}
								onTogglePromotionStatus={handleTogglePromotionStatus}
							/>
							{promotionsQuery.hasNextPage && (
								<div className="flex justify-center mt-4">
									<Button
										variant="outline"
										onClick={() => promotionsQuery.fetchNextPage()}
										disabled={promotionsQuery.isFetchingNextPage}
									>
										{promotionsQuery.isFetchingNextPage ? "Loading..." : "Load More"}
									</Button>
								</div>
							)}
						</>
					)}

					{showForm && (
						<PromotionForm
							promotion={editingPromotion}
							onSave={handleSavePromotion}
							onCancel={() => {
								setShowForm(false)
								setEditingPromotion(null)
							}}
						/>
					)}
				</div>
			</main>
		</div>
	)
}
