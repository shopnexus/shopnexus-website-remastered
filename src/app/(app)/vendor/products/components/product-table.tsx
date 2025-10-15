"use client"

import { DataTable, Column } from "../../components/data-table"
import { StatusBadge } from "../../components/status-badge"
import { ConfirmDialog } from "../../components/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CardContent, CardHeader } from "@/components/ui/card"
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
	Warehouse,
} from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useListProductSKU } from "@/core/product/product.vendor"

// SKU columns definition
const skuColumns: Column<MockSKU>[] = [
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
}: {
	spuId: number
	onCreateSKU: (spu: MockSPU) => void
	onEditSKU: (sku: MockSKU, spu: MockSPU) => void
	onDeleteSKU: (skuId: number, spuId: number) => void
	onManageInventory: (sku: MockSKU, spu: MockSPU) => void
}) {
	const { data: skus = [], isLoading } = useListProductSKU({ spu_id: spuId })

	// Map API SKUs to MockSKU format for compatibility
	const mockSkus: MockSKU[] = skus.map((sku) => ({
		id: sku.id,
		spu_id: sku.spu_id,
		price: sku.price,
		stock: sku.stock || 0, // Default stock if not provided
		can_combine: sku.can_combine,
		attributes: sku.attributes, // ProductAttribute[] is compatible with { name: string; value: string }[]
		date_created: sku.date_created,
		date_updated: sku.date_created, // Use date_created as fallback
		is_featured: false, // Default value
	}))

	const handleCreateSKU = () => {
		// Create a minimal SPU object for the callback
		const mockSpu: MockSPU = { id: spuId } as MockSPU
		onCreateSKU(mockSpu)
	}

	if (isLoading) {
		return (
			<div className="p-4 text-center text-muted-foreground">
				Loading SKUs...
			</div>
		)
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
					data={mockSkus}
					columns={skuColumns}
					actions={(sku) => (
						<div className="flex items-center gap-1">
							<Button
								size="sm"
								variant="ghost"
								onClick={() => onManageInventory(sku, { id: spuId } as MockSPU)}
								title="Manage Inventory"
							>
								<Warehouse className="h-4 w-4" />
							</Button>
							<Button
								size="sm"
								variant="ghost"
								onClick={() => onEditSKU(sku, { id: spuId } as MockSPU)}
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
	spus: MockSPU[]
	onEditSPU: (spu: MockSPU) => void
	onDeleteSPU: (spuId: number) => void
	onToggleSPUStatus: (spuId: number) => void
	onCreateSKU: (spu: MockSPU) => void
	onEditSKU: (sku: MockSKU, spu: MockSPU) => void
	onDeleteSKU: (skuId: number, spuId: number) => void
	onManageInventory: (sku: MockSKU, spu: MockSPU) => void
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
			key: "resources",
			label: "Image",
			render: (resources: string[], spu: MockSPU) => (
				<div className="flex items-center space-x-2">
					<Avatar className="h-10 w-10">
						<AvatarImage src={resources[0]} alt={spu.name} />
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
					<div className="font-medium w-100 truncate">{value}</div>
					<div className="text-sm text-muted-foreground w-100 truncate">
						{spu.code}
					</div>
					<div className="flex items-center space-x-2">
						<div className="flex items-center space-x-1">
							<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
							<span className="text-xs">{spu.rating.score}</span>
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

	const renderExpandedRow = (spu: MockSPU) => {
		return (
			<SKUTable
				spuId={spu.id}
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
