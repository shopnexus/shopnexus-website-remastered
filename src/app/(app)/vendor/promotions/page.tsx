"use client"

import { useState } from "react"
import { PageHeader } from "../components/page-header"
import { PromotionTable } from "./components/promotion-table"
import { PromotionForm } from "./components/promotion-form"
import { mockPromotions, MockPromotion } from "@/lib/mocks/mock-data"
import { toast } from "sonner"

export default function PromotionsPage() {
	const [promotions, setPromotions] = useState<MockPromotion[]>(mockPromotions)
	const [showForm, setShowForm] = useState(false)
	const [editingPromotion, setEditingPromotion] =
		useState<MockPromotion | null>(null)

	const handleCreatePromotion = () => {
		setEditingPromotion(null)
		setShowForm(true)
	}

	const handleEditPromotion = (promotion: MockPromotion) => {
		setEditingPromotion(promotion)
		setShowForm(true)
	}

	const handleSavePromotion = (promotionData: Partial<MockPromotion>) => {
		if (editingPromotion) {
			// Update existing promotion
			setPromotions((prev) =>
				prev.map((promo) =>
					promo.id === editingPromotion.id
						? { ...promo, ...promotionData }
						: promo
				)
			)
			toast.success("Promotion updated successfully")
		} else {
			// Create new promotion
			const newPromotion: MockPromotion = {
				id: Math.max(...promotions.map((p) => p.id)) + 1,
				code: promotionData.code || "",
				title: promotionData.title || "",
				description: promotionData.description || "",
				type: promotionData.type || "Discount",
				ref_type: promotionData.ref_type || "All",
				ref_id: promotionData.ref_id,
				is_active: promotionData.is_active ?? true,
				auto_apply: promotionData.auto_apply ?? false,
				date_started:
					promotionData.date_started || new Date().toISOString().split("T")[0],
				date_ended: promotionData.date_ended,
				discount: promotionData.discount || {
					min_spend: 0,
					max_discount: 0,
				},
			}
			setPromotions((prev) => [...prev, newPromotion])
			toast.success("Promotion created successfully")
		}
		setShowForm(false)
		setEditingPromotion(null)
	}

	const handleDeletePromotion = (promotionId: number) => {
		setPromotions((prev) => prev.filter((promo) => promo.id !== promotionId))
		toast.success("Promotion deleted successfully")
	}

	const handleTogglePromotionStatus = (promotionId: number) => {
		setPromotions((prev) =>
			prev.map((promo) =>
				promo.id === promotionId
					? { ...promo, is_active: !promo.is_active }
					: promo
			)
		)
		toast.success("Promotion status updated")
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

					<PromotionTable
						promotions={promotions}
						onEditPromotion={handleEditPromotion}
						onDeletePromotion={handleDeletePromotion}
						onTogglePromotionStatus={handleTogglePromotionStatus}
					/>

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
