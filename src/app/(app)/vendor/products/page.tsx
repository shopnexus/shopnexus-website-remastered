"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "../components/page-header"
import { EmptyState } from "../components/empty-state"
import { ProductTable } from "./components/product-table"
// import { SPUForm } from "./components/spu-form" // Now using dedicated edit page
import { SKUForm } from "./components/sku-form"
import { toast } from "sonner"
import { RefreshCw } from "lucide-react"
import {
	useListProductSPU,
	useDeleteProductSPU,
	useUpdateProductSPU,
	useCreateProductSKU,
	useUpdateProductSKU,
	useDeleteProductSKU,
	ProductSPU,
	ProductSku,
} from "@/core/catalog/product.vendor"
import { useInfiniteMerge } from "@/hooks/use-infinite-merge"
import { Pagination } from "@/components/ui/pagination"

export default function ProductsPage() {
	const router = useRouter()
	const deleteSpu = useDeleteProductSPU()
	const updateSpu = useUpdateProductSPU()

	// Load SPUs from real API (infinite)
	const [currentPage, setCurrentPage] = useState(1)
	const limit = 10
	const listSpuResult = useListProductSPU({ page: currentPage, limit })
	const apiSpus = useInfiniteMerge(listSpuResult)

	// Use API SPUs directly
	const spus = useMemo(() => apiSpus, [apiSpus])

	const [showSKUForm, setShowSKUForm] = useState(false)
	const [editingSKU, setEditingSKU] = useState<ProductSku | null>(null)
	const [selectedSPU, setSelectedSPU] = useState<ProductSPU | null>(null)

	// Calculate stats (placeholder; real metrics TBD)
	const stats = useMemo(() => {
		return []
	}, [])

	const handleCreateSPU = () => {
		router.push("/vendor/products/new")
	}

	const handleEditSPU = (spu: ProductSPU) => {
		// router.push(`/vendor/products/${spu.id}`)
		// open in new tab
		window.open(`/vendor/products/${spu.id}/edit`, "_blank")
	}

	const handleDeleteSPU = (spuId: number) => {
		deleteSpu.mutate(
			{ id: spuId },
			{
				onSuccess: () => toast.success("Product deleted successfully"),
				onError: () => toast.error("Failed to delete product"),
			}
		)
	}

	const handleToggleSPUStatus = (spuId: number) => {
		const current = spus.find((s) => s.id === spuId)
		if (!current) return
		updateSpu.mutate(
			{ id: spuId, is_active: !current.is_active },
			{
				onSuccess: () => toast.success("Product status updated"),
				onError: () => toast.error("Failed to update status"),
			}
		)
	}

	const handleCreateSKU = (spu: ProductSPU) => {
		setSelectedSPU(spu)
		setEditingSKU(null)
		setShowSKUForm(true)
	}

	const handleEditSKU = (sku: ProductSku, spu: ProductSPU) => {
		setSelectedSPU(spu)
		setEditingSKU(sku)
		setShowSKUForm(true)
	}

	const createSku = useCreateProductSKU()
	const updateSku = useUpdateProductSKU()
	const deleteSku = useDeleteProductSKU()

	const handleSaveSKU = (
		skuData: Partial<ProductSku> & {
			price?: number
			can_combine?: boolean
			attributes?: { name: string; value: string }[]
			stock?: number
			package_details?: {
				weight_grams: number
				length_cm: number
				width_cm: number
				height_cm: number
			}
		}
	) => {
		if (!selectedSPU) return

		if (editingSKU) {
			// Update existing SKU

			updateSku.mutate(
				{
					id: editingSKU.id,
					price: skuData.price,
					can_combine: skuData.can_combine,
					attributes: skuData.attributes ?? [],
					package_details: skuData.package_details,
				},
				{
					onSuccess: () => {
						toast.success("SKU updated successfully")
						setShowSKUForm(false)
						setEditingSKU(null)
						setSelectedSPU(null)
					},
					onError: () => toast.error("Failed to update SKU"),
				}
			)
		} else {
			// Create new SKU

			createSku.mutate(
				{
					spu_id: selectedSPU.id,
					price: skuData.price || 0,
					can_combine: skuData.can_combine ?? false,
					attributes: skuData.attributes ?? [],
					package_details: skuData.package_details ?? {
						weight_grams: 0,
						length_cm: 0,
						width_cm: 0,
						height_cm: 0,
					},
				},
				{
					onSuccess: () => {
						toast.success("SKU created successfully")
						setShowSKUForm(false)
						setEditingSKU(null)
						setSelectedSPU(null)
					},
					onError: () => toast.error("Failed to create SKU"),
				}
			)
		}
	}

	const handleDeleteSKU = (skuId: number, _spuId: number) => {
		void _spuId
		deleteSku.mutate(
			{ id: skuId },
			{
				onSuccess: () => toast.success("SKU deleted successfully"),
				onError: () => toast.error("Failed to delete SKU"),
			}
		)
	}

	const handleManageInventory = (sku: ProductSku, _spu: ProductSPU) => {
		void _spu
		// Navigate to inventory page with SKU filter
		router.push(`/vendor/inventory?sku=${sku.id}`)
	}

	// const handleBulkAction = (action: string) => {
	// 	toast.info(`Bulk ${action} action would be implemented`)
	// }

	const handleRefresh = () => {
		toast.info("Data refreshed")
	}

	const secondaryActions = [
		// {
		// 	label: "Import",
		// 	icon: <Upload className="h-4 w-4" />,
		// 	onClick: handleImport,
		// 	variant: "outline" as const,
		// },
		// {
		// 	label: "Export",
		// 	icon: <Download className="h-4 w-4" />,
		// 	onClick: handleExport,
		// 	variant: "outline" as const,
		// },
		// {
		// 	label: "Analytics",
		// 	icon: <BarChart3 className="h-4 w-4" />,
		// 	onClick: handleViewAnalytics,
		// 	variant: "outline" as const,
		// },
		{
			label: "Refresh",
			icon: <RefreshCw className="h-4 w-4" />,
			onClick: handleRefresh,
			variant: "ghost" as const,
		},
		// {
		// 	label: "Settings",
		// 	icon: <Settings className="h-4 w-4" />,
		// 	onClick: handleSettings,
		// 	variant: "ghost" as const,
		// },
	]

	if (!listSpuResult.isLoading && spus.length === 0) {
		return (
			<div className="min-h-screen flex flex-col">
				<main className="flex-1 py-8 mx-auto">
					<div className="container max-w-7xl">
						<PageHeader
							title="Product Management"
							description="Manage your product catalog"
							actionLabel="Add Product"
							onAction={handleCreateSPU}
							stats={stats}
							secondaryActions={secondaryActions}
						/>

						<EmptyState
							title="No products found"
							description="Get started by creating your first product. You can add multiple SKUs for each product to offer different variations."
							actionLabel="Create Product"
							onAction={handleCreateSPU}
						/>
					</div>
				</main>
			</div>
		)
	}

	return (
		<div className="min-h-screen lg:min-w-3xl min-w-xl flex flex-col">
			<main className="flex-1 py-8 mx-auto">
				<div className="container max-w-7xl">
					<PageHeader
						title="Product Management"
						description="Manage your product catalog"
						actionLabel="Add Product"
						onAction={handleCreateSPU}
						stats={stats}
						secondaryActions={secondaryActions}
					/>

					<ProductTable
						spus={spus}
						onEditSPU={handleEditSPU}
						onDeleteSPU={handleDeleteSPU}
						onToggleSPUStatus={handleToggleSPUStatus}
						onCreateSKU={handleCreateSKU}
						onEditSKU={handleEditSKU}
						onDeleteSKU={handleDeleteSKU}
						onManageInventory={handleManageInventory}
					/>

					{/* Pagination */}
					{(() => {
						const firstPage = listSpuResult.data?.pages?.[0]
						const total = firstPage?.pagination?.total ?? 0
						const totalPages = Math.max(1, Math.ceil(total / limit))
						if (totalPages <= 1) return null
						return (
							<Pagination
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={(page) => {
									const next = Math.min(Math.max(1, page), totalPages)
									if (next !== currentPage) setCurrentPage(next)
								}}
								className="mt-4"
							/>
						)
					})()}

					{/* SPU Form is now handled by dedicated edit page */}

					{showSKUForm && selectedSPU && (
						<SKUForm
							sku={editingSKU}
							spu={selectedSPU}
							onSave={handleSaveSKU}
							onCancel={() => {
								setShowSKUForm(false)
								setEditingSKU(null)
								setSelectedSPU(null)
							}}
						/>
					)}
				</div>
			</main>
		</div>
	)
}
