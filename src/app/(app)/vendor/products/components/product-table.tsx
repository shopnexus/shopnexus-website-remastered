"use client"

import { DataTable, Column } from "../../components/data-table"
import { StatusBadge } from "../../components/status-badge"
import { ConfirmDialog } from "../../components/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MockSPU, MockSKU } from "../../components/mock-data"
import {
	Edit,
	Trash2,
	Plus,
	ToggleLeft,
	ToggleRight,
	Eye,
	Star,
	TrendingUp,
	Package,
	Image as ImageIcon,
	Filter,
	Search,
	MoreHorizontal,
	Copy,
	ExternalLink,
} from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface ProductTableProps {
	spus: MockSPU[]
	onEditSPU: (spu: MockSPU) => void
	onDeleteSPU: (spuId: number) => void
	onToggleSPUStatus: (spuId: number) => void
	onCreateSKU: (spu: MockSPU) => void
	onEditSKU: (sku: MockSKU, spu: MockSPU) => void
	onDeleteSKU: (skuId: number, spuId: number) => void
}

export function ProductTable({
	spus,
	onEditSPU,
	onDeleteSPU,
	onToggleSPUStatus,
	onCreateSKU,
	onEditSKU,
	onDeleteSKU,
}: ProductTableProps) {
	const router = useRouter()
	const [deleteConfirm, setDeleteConfirm] = useState<{
		type: "spu" | "sku"
		id: number
		spuId?: number
		name: string
	} | null>(null)

	const handleDeleteConfirm = () => {
		if (!deleteConfirm) return

		if (deleteConfirm.type === "spu") {
			onDeleteSPU(deleteConfirm.id)
		} else if (deleteConfirm.type === "sku" && deleteConfirm.spuId) {
			onDeleteSKU(deleteConfirm.id, deleteConfirm.spuId)
		}
		setDeleteConfirm(null)
	}

	const spuColumns: Column<MockSPU>[] = [
		{
			key: "images",
			label: "Image",
			render: (images: string[], spu: MockSPU) => (
				<div className="flex items-center space-x-2">
					<Avatar className="h-10 w-10">
						<AvatarImage src={images[0]} alt={spu.name} />
						<AvatarFallback>
							<ImageIcon className="h-4 w-4" />
						</AvatarFallback>
					</Avatar>
					{/* {images.length > 1 && (
						<Badge variant="secondary" className="text-xs">
							+{images.length - 1}
						</Badge>
					)} */}
				</div>
			),
			className: "w-20",
		},
		{
			key: "name",
			label: "Product",
			render: (value: string, spu: MockSPU) => (
				<div className="space-y-1">
					<div className="font-medium">{value}</div>
					<div className="text-sm text-muted-foreground">{spu.code}</div>
					<div className="flex items-center space-x-2">
						<div className="flex items-center space-x-1">
							<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
							<span className="text-xs">{spu.rating}</span>
						</div>
						<span className="text-xs text-muted-foreground">
							({spu.review_count} reviews)
						</span>
					</div>
				</div>
			),
			sortable: true,
		},
		// {
		// 	key: "brand",
		// 	label: "Brand",
		// 	render: (value: string) => <Badge variant="outline">{value}</Badge>,
		// 	sortable: true,
		// },
		// {
		// 	key: "category",
		// 	label: "Category",
		// 	render: (value: string) => <Badge variant="secondary">{value}</Badge>,
		// 	sortable: true,
		// },
		{
			key: "sales",
			label: "Performance",
			render: (sales: number, spu: MockSPU) => (
				<div className="space-y-1">
					<div className="flex items-center space-x-2">
						<TrendingUp className="h-3 w-3 text-green-500" />
						<span className="text-sm font-medium">{sales} sales</span>
					</div>
					<div className="text-xs text-muted-foreground">{spu.views} views</div>
				</div>
			),
			sortable: true,
		},
		{
			key: "skus",
			label: "SKUs & Stock",
			render: (skus: MockSKU[]) => {
				const totalStock = skus.reduce((sum, sku) => sum + sku.stock, 0)
				const lowStockCount = skus.filter((sku) => sku.stock < 10).length
				return (
					<div className="space-y-1">
						<div className="flex items-center space-x-2">
							<Package className="h-3 w-3" />
							<span className="text-sm font-medium">{skus.length} SKUs</span>
						</div>
						<div className="text-xs text-muted-foreground">
							{totalStock} total stock
						</div>
						{lowStockCount > 0 && (
							<Badge variant="destructive" className="text-xs">
								{lowStockCount} low stock
							</Badge>
						)}
					</div>
				)
			},
		},
		{
			key: "is_active",
			label: "Status",
			render: (value: boolean) => (
				<StatusBadge status={value ? "Active" : "Inactive"} />
			),
		},
		// {
		// 	key: "date_updated",
		// 	label: "Last Updated",
		// 	render: (value: string) => (
		// 		<div className="text-sm">{new Date(value).toLocaleDateString()}</div>
		// 	),
		// 	sortable: true,
		// },
	]

	const skuColumns: Column<MockSKU>[] = [
		{
			key: "id",
			label: "SKU ID",
			render: (value: number) => (
				<div className="flex items-center space-x-2">
					<span className="font-mono text-sm">#{value}</span>
					{/* Mock featured indicator */}
					{/* {Math.random() > 0.7 && (
						<Badge variant="default" className="text-xs">
							Featured
						</Badge>
					)} */}
				</div>
			),
			className: "w-24",
		},
		{
			key: "price",
			label: "Price",
			render: (value: number) => (
				<div className="space-y-1">
					<div className="font-medium">${value.toLocaleString()}</div>
				</div>
			),
			className: "w-28",
		},
		{
			key: "stock",
			label: "Stock",
			render: (value: number) => {
				const stockLevel = value > 50 ? "high" : value > 10 ? "medium" : "low"
				const variant =
					stockLevel === "high"
						? "default"
						: stockLevel === "medium"
						? "secondary"
						: "destructive"
				return (
					<div className="space-y-1">
						<Badge variant={variant}>{value}</Badge>
						{/* <div className="text-xs text-muted-foreground capitalize">
							{stockLevel} stock
						</div> */}
					</div>
				)
			},
			className: "w-24",
		},
		{
			key: "attributes",
			label: "Attributes",
			render: (attributes: Record<string, string>) => (
				<div className="flex flex-wrap gap-1 max-w-48">
					{Object.entries(attributes).map(([key, value]) => (
						<Badge key={key} variant="outline" className="text-xs">
							{key}: {value}
						</Badge>
					))}
				</div>
			),
		},
		{
			key: "can_combine",
			label: "Combinable",
			render: (value: boolean) => <StatusBadge status={value ? "Yes" : "No"} />,
			className: "w-24",
		},
	]

	const renderExpandedRow = (spu: MockSPU) => (
		<div className="m-4 gap-0 border-0">
			<CardHeader className="">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							onClick={() => onCreateSKU(spu)}
							className="flex items-center gap-2"
						>
							<Plus className="h-4 w-4" />
							Add SKU
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<DataTable
					data={spu.skus}
					columns={skuColumns}
					actions={(sku) => (
						<div className="flex items-center gap-1">
							<Button
								size="sm"
								variant="ghost"
								onClick={() => onEditSKU(sku, spu)}
								title="Edit SKU"
							>
								<Edit className="h-4 w-4" />
							</Button>
							<Button
								size="sm"
								variant="ghost"
								onClick={() =>
									setDeleteConfirm({
										type: "sku",
										id: sku.id,
										spuId: spu.id,
										name: `SKU ${sku.id}`,
									})
								}
								title="Delete SKU"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					)}
				/>
			</CardContent>
		</div>
	)

	return (
		<>
			<DataTable
				data={spus}
				columns={spuColumns}
				searchKey="name"
				searchPlaceholder="Search products..."
				expandable
				renderExpandedRow={renderExpandedRow}
				actions={(spu) => (
					<div className="flex items-center gap-1">
						<Button
							size="sm"
							variant="ghost"
							onClick={() => router.push(`/vendor/products/${spu.id}`)}
							title="View Product"
						>
							<Eye className="h-4 w-4" />
						</Button>
						<Button
							size="sm"
							variant="ghost"
							onClick={() => onToggleSPUStatus(spu.id)}
							title={spu.is_active ? "Deactivate" : "Activate"}
						>
							{spu.is_active ? (
								<ToggleRight className="h-4 w-4 text-green-600" />
							) : (
								<ToggleLeft className="h-4 w-4 text-gray-400" />
							)}
						</Button>
						<Button
							size="sm"
							variant="ghost"
							onClick={() => router.push(`/vendor/products/${spu.id}/edit`)}
							title="Edit Product"
						>
							<Edit className="h-4 w-4" />
						</Button>
						<Button
							size="sm"
							variant="ghost"
							onClick={() =>
								setDeleteConfirm({
									type: "spu",
									id: spu.id,
									name: spu.name,
								})
							}
							title="Delete Product"
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				)}
			/>

			<ConfirmDialog
				open={!!deleteConfirm}
				onOpenChange={() => setDeleteConfirm(null)}
				title={`Delete ${deleteConfirm?.type.toUpperCase()}`}
				description={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
				confirmText="Delete"
				variant="destructive"
				onConfirm={handleDeleteConfirm}
			/>
		</>
	)
}
