"use client"

import { DataTable, Column } from "@/components/shared/data-table"
import { StatusBadge } from "@/components/shared/status-badge"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	Edit,
	Trash2,
	Plus,
	ToggleLeft,
	ToggleRight,
	Eye,
	Star,
	Image as ImageIcon,
	Warehouse,
} from "lucide-react"
import { useState } from "react"

import {
	ProductSPU,
	ProductSku,
	useListProductSKU,
} from "@/core/catalog/product.vendor"
import { Resource } from "@/core/common/resource.type"

// SKU columns definition
const skuColumns: Column<ProductSku>[] = [
	{
		key: "id",
		label: "SKU ID",
		render: (value: number) => (
			<div className="flex items-center space-x-2">
				<span className="font-mono text-sm">#{value}</span>
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
				</div>
			)
		},
		className: "w-24",
	},
	{
		key: "attributes",
		label: "Attributes",
		render: (attributes: { name: string; value: string }[]) => (
			<div className="flex flex-wrap gap-1 max-w-48">
				{attributes.map((attr, index) => (
					<Badge key={index} variant="outline" className="text-xs">
						{attr.name}: {attr.value}
					</Badge>
				))}
			</div>
		),
	},
	{
		key: "package_details",
		label: "Package",
		render: (pkg: {
			weight_grams: number
			length_cm: number
			width_cm: number
			height_cm: number
		}) => (
			<div className="space-y-1 text-xs">
				<div>
					<span className="text-muted-foreground">Weight:</span>{" "}
					<span className="font-medium">{pkg.weight_grams}</span> g
				</div>
				<div>
					<span className="text-muted-foreground">Size:</span>{" "}
					<span className="font-medium">
						{pkg.length_cm}×{pkg.width_cm}×{pkg.height_cm}
					</span>{" "}
					cm
				</div>
			</div>
		),
		className: "w-44",
	},
	{
		key: "can_combine",
		label: "Combinable",
		render: (value: boolean) => <StatusBadge status={value ? "Yes" : "No"} />,
		className: "w-24",
	},
]

// Component to handle SKU loading and display for a specific SPU
function SKUTable({
	spuId,
	onCreateSKU,
	onEditSKU,
	onDeleteSKU,
	onManageInventory,
	spu,
}: {
	spuId: number
	spu: ProductSPU
	onCreateSKU: (spu: ProductSPU) => void
	onEditSKU: (sku: ProductSku, spu: ProductSPU) => void
	onDeleteSKU: (skuId: number, spuId: number) => void
	onManageInventory: (sku: ProductSku, spu: ProductSPU) => void
}) {
	const { data: skusData } = useListProductSKU({ spu_id: spuId, limit: 10 })
	const skus: ProductSku[] = Array.isArray(skusData) ? skusData : []

	const handleCreateSKU = () => {
		onCreateSKU(spu)
	}

	return (
		<div className="m-4 gap-0 border-0">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							onClick={handleCreateSKU}
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
					data={skus}
					columns={skuColumns}
					actions={(sku) => (
						<div className="flex items-center gap-1">
							<Button
								size="sm"
								variant="ghost"
								onClick={() => onManageInventory(sku, spu)}
								title="Manage Inventory"
							>
								<Warehouse className="h-4 w-4" />
							</Button>
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
								onClick={() => onDeleteSKU(sku.id, spuId)}
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
}

interface ProductTableProps {
	spus: ProductSPU[]
	onEditSPU: (spu: ProductSPU) => void
	onDeleteSPU: (spuId: number) => void
	onToggleSPUStatus: (spuId: number) => void
	onCreateSKU: (spu: ProductSPU) => void
	onEditSKU: (sku: ProductSku, spu: ProductSPU) => void
	onDeleteSKU: (skuId: number, spuId: number) => void
	onManageInventory: (sku: ProductSku, spu: ProductSPU) => void
}

export function ProductTable({
	spus,
	onEditSPU,
	onDeleteSPU,
	onToggleSPUStatus,
	onCreateSKU,
	onEditSKU,
	onDeleteSKU,
	onManageInventory,
}: ProductTableProps) {
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

	const spuColumns: Column<ProductSPU>[] = [
		{
			key: "resources",
			label: "Image",
			render: (resources: Resource[], spu: ProductSPU) => (
				<div className="flex items-center space-x-2">
					<Avatar className="h-10 w-10">
						<AvatarImage src={resources?.[0]?.url} alt={spu.name} />
						<AvatarFallback>
							<ImageIcon className="h-4 w-4" />
						</AvatarFallback>
					</Avatar>
				</div>
			),
			className: "w-20",
		},
		{
			key: "name",
			label: "Product",
			render: (value: string, spu: ProductSPU) => (
				<div className="space-y-1">
					<div className="font-medium max-w-3xl truncate">{value}</div>
					<div className="text-sm text-muted-foreground w-100 truncate">
						{spu.description}
					</div>
					<div className="flex items-center space-x-2">
						<div className="flex items-center space-x-1">
							<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
							<span className="text-xs">{spu.rating.score.toFixed(1)}</span>
						</div>
						<span className="text-xs text-muted-foreground">
							({spu.rating.total} reviews)
						</span>
					</div>
				</div>
			),
			sortable: true,
		},
		// {
		// 	key: "sales",
		// 	label: "Performance",
		// 	render: () => (
		// 		<div className="space-y-1">
		// 			<div className="flex items-center space-x-2">
		// 				<TrendingUp className="h-3 w-3 text-green-500" />
		// 				<span className="text-sm font-medium text-muted-foreground">
		// 					N/A
		// 				</span>
		// 			</div>
		// 		</div>
		// 	),
		// 	sortable: true,
		// },
		// {
		// 	key: "skus",
		// 	label: "SKUs & Stock",
		// 	render: () => {
		// 		// SKUs are loaded dynamically in expanded rows
		// 		return (
		// 			<div className="space-y-1">
		// 				<div className="flex items-center space-x-2">
		// 					<Package className="h-3 w-3" />
		// 					<span className="text-sm font-medium text-muted-foreground">
		// 						Click to view SKUs
		// 					</span>
		// 				</div>
		// 			</div>
		// 		)
		// 	},
		// },
		// {
		// 	key: "is_active",
		// 	label: "Status",
		// 	render: (value: boolean) => (
		// 		<StatusBadge status={value ? "Active" : "Inactive"} />
		// 	),
		// },
		// {
		// 	key: "date_updated",
		// 	label: "Last Updated",
		// 	render: (value: string) => (
		// 		<div className="text-sm">{new Date(value).toLocaleDateString()}</div>
		// 	),
		// 	sortable: true,
		// },
	]

	const renderExpandedRow = (spu: ProductSPU) => {
		return (
			<SKUTable
				spuId={spu.id}
				spu={spu}
				onCreateSKU={onCreateSKU}
				onEditSKU={onEditSKU}
				onDeleteSKU={(skuId, spuId) =>
					setDeleteConfirm({
						type: "sku",
						id: skuId,
						spuId,
						name: `SKU ${skuId}`,
					})
				}
				onManageInventory={onManageInventory}
			/>
		)
	}

	return (
		<>
			<DataTable
				className=""
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
							onClick={() => window.open(`/products/${spu.id}`, "_blank")}
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
							onClick={() => onEditSPU(spu)}
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
