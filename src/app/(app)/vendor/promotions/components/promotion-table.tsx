"use client"

import { DataTable, Column } from "../../components/data-table"
import { StatusBadge } from "../../components/status-badge"
import { ConfirmDialog } from "../../components/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MockPromotion } from "../../components/mock-data"
import { Edit, Trash2, ToggleLeft, ToggleRight, Calendar } from "lucide-react"
import { useState } from "react"

interface PromotionTableProps {
	promotions: MockPromotion[]
	onEditPromotion: (promotion: MockPromotion) => void
	onDeletePromotion: (promotionId: number) => void
	onTogglePromotionStatus: (promotionId: number) => void
}

export function PromotionTable({
	promotions,
	onEditPromotion,
	onDeletePromotion,
	onTogglePromotionStatus,
}: PromotionTableProps) {
	const [deleteConfirm, setDeleteConfirm] = useState<{
		id: number
		name: string
	} | null>(null)

	const handleDeleteConfirm = () => {
		if (deleteConfirm) {
			onDeletePromotion(deleteConfirm.id)
			setDeleteConfirm(null)
		}
	}

	const getDiscountText = (promotion: MockPromotion) => {
		const { discount } = promotion
		if (promotion.type === "Discount") {
			if (discount.discount_percent) {
				return `${discount.discount_percent}% off`
			}
			if (discount.discount_price) {
				return `$${discount.discount_price} off`
			}
		}
		if (promotion.type === "BuyXGetY") {
			return "Buy X Get Y"
		}
		if (promotion.type === "Bundle") {
			return "Bundle Deal"
		}
		if (promotion.type === "Cashback") {
			return "Cashback"
		}
		return "Special Offer"
	}

	const promotionColumns: Column<MockPromotion>[] = [
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
			key: "ref_type",
			label: "Target",
			render: (value: string) => <Badge variant="outline">{value}</Badge>,
		},
		{
			key: "discount",
			label: "Discount",
			render: (_, row: MockPromotion) => (
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

	const renderExpandedRow = (promotion: MockPromotion) => (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<div>
					<h4 className="font-medium mb-2">Description</h4>
					<p className="text-sm text-muted-foreground">
						{promotion.description}
					</p>
				</div>
				<div>
					<h4 className="font-medium mb-2">Auto Apply</h4>
					<StatusBadge status={promotion.auto_apply ? "Yes" : "No"} />
				</div>
			</div>

			{promotion.discount && (
				<div>
					<h4 className="font-medium mb-2">Discount Details</h4>
					<div className="grid grid-cols-3 gap-4 text-sm">
						<div>
							<span className="text-muted-foreground">Min Spend:</span>
							<p>${promotion.discount.min_spend}</p>
						</div>
						<div>
							<span className="text-muted-foreground">Max Discount:</span>
							<p>${promotion.discount.max_discount || "No limit"}</p>
						</div>
						<div>
							<span className="text-muted-foreground">Discount:</span>
							<p>
								{promotion.discount.discount_percent
									? `${promotion.discount.discount_percent}%`
									: promotion.discount.discount_price
									? `$${promotion.discount.discount_price}`
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
