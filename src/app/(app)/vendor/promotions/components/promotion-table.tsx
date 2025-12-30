"use client"

import { DataTable, Column } from "@/components/shared/data-table"
import { StatusBadge } from "@/components/shared/status-badge"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Promotion, PromotionDiscount } from "@/core/promotion/promotion.vendor"
import { Edit, Trash2, ToggleLeft, ToggleRight, Calendar } from "lucide-react"
import { useState } from "react"

interface PromotionTableProps {
	promotions: Promotion[]
	onEditPromotion: (promotion: Promotion) => void
	onDeletePromotion: (promotionId: string) => void
	onTogglePromotionStatus: (promotionId: string) => void
}

export function PromotionTable({
	promotions,
	onEditPromotion,
	onDeletePromotion,
	onTogglePromotionStatus,
}: PromotionTableProps) {
	const [deleteConfirm, setDeleteConfirm] = useState<{
		id: string
		name: string
	} | null>(null)

	const handleDeleteConfirm = () => {
		if (deleteConfirm) {
			onDeletePromotion(deleteConfirm.id)
			setDeleteConfirm(null)
		}
	}

	const getDiscountText = (promotion: Promotion) => {
		if (promotion.type === "Discount" && "discount_percent" in promotion) {
			const discountPromo = promotion as PromotionDiscount
			if (discountPromo.discount_percent) {
				return `${discountPromo.discount_percent}% off`
			}
			if (discountPromo.discount_price) {
				return `$${discountPromo.discount_price} off`
			}
		}
		return promotion.type || "Special Offer"
	}

	const promotionColumns: Column<Promotion>[] = [
		{
			key: "code",
			label: "Code",
			sortable: true,
		},
		{
			key: "title",
			label: "Title",
			sortable: true,
		},
		{
			key: "type",
			label: "Type",
			render: (value: string) => <StatusBadge status={value} />,
		},
		{
			key: "refs",
			label: "Target",
			render: (refs: Promotion["refs"]) => (
				<Badge variant="outline">
					{refs.length > 0 ? `${refs[0].ref_type}` : "All"}
				</Badge>
			),
		},
		{
			key: "type",
			label: "Discount",
			render: (_, row: Promotion) => (
				<span className="text-sm font-medium">{getDiscountText(row)}</span>
			),
		},
		{
			key: "date_started",
			label: "Start Date",
			render: (value: string) => new Date(value).toLocaleDateString(),
			sortable: true,
		},
		{
			key: "date_ended",
			label: "End Date",
			render: (value: string | undefined) =>
				value ? new Date(value).toLocaleDateString() : "No end date",
		},
		{
			key: "is_active",
			label: "Status",
			render: (value: boolean) => (
				<StatusBadge status={value ? "Active" : "Inactive"} />
			),
		},
	]

	const renderExpandedRow = (promotion: Promotion) => (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<div>
					<h4 className="font-medium mb-2">Description</h4>
					<p className="text-sm text-muted-foreground">
						{promotion.description || "No description"}
					</p>
				</div>
				<div>
					<h4 className="font-medium mb-2">Auto Apply</h4>
					<StatusBadge status={promotion.auto_apply ? "Yes" : "No"} />
				</div>
			</div>

			{promotion.type === "Discount" && "min_spend" in promotion && (
				<div>
					<h4 className="font-medium mb-2">Discount Details</h4>
					<div className="grid grid-cols-3 gap-4 text-sm">
						<div>
							<span className="text-muted-foreground">Min Spend:</span>
							<p>${(promotion as PromotionDiscount).min_spend}</p>
						</div>
						<div>
							<span className="text-muted-foreground">Max Discount:</span>
							<p>${(promotion as PromotionDiscount).max_discount || "No limit"}</p>
						</div>
						<div>
							<span className="text-muted-foreground">Discount:</span>
							<p>
								{(promotion as PromotionDiscount).discount_percent
									? `${(promotion as PromotionDiscount).discount_percent}%`
									: (promotion as PromotionDiscount).discount_price
									? `$${(promotion as PromotionDiscount).discount_price}`
									: "N/A"}
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	)

	return (
		<>
			<DataTable
				data={promotions}
				columns={promotionColumns}
				searchKey="title"
				searchPlaceholder="Search promotions..."
				expandable
				renderExpandedRow={renderExpandedRow}
				actions={(promotion) => (
					<div className="flex items-center gap-1">
						<Button
							size="sm"
							variant="ghost"
							onClick={() => onTogglePromotionStatus(promotion.id)}
							title={promotion.is_active ? "Deactivate" : "Activate"}
						>
							{promotion.is_active ? (
								<ToggleRight className="h-4 w-4 text-green-600" />
							) : (
								<ToggleLeft className="h-4 w-4 text-gray-400" />
							)}
						</Button>
						<Button
							size="sm"
							variant="ghost"
							onClick={() => onEditPromotion(promotion)}
						>
							<Edit className="h-4 w-4" />
						</Button>
						<Button
							size="sm"
							variant="ghost"
							onClick={() =>
								setDeleteConfirm({
									id: promotion.id,
									name: promotion.title,
								})
							}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				)}
			/>

			<ConfirmDialog
				open={!!deleteConfirm}
				onOpenChange={() => setDeleteConfirm(null)}
				title="Delete Promotion"
				description={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
				confirmText="Delete"
				variant="destructive"
				onConfirm={handleDeleteConfirm}
			/>
		</>
	)
}

