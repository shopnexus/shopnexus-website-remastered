"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "../components/page-header"
import { EmptyState } from "../components/empty-state"
import { ProductTable } from "./components/product-table"
// import { SPUForm } from "./components/spu-form" // Now using dedicated edit page
import { SKUForm } from "./components/sku-form"
import { mockSpus, MockSPU, MockSKU } from "../components/mock-data"
import { toast } from "sonner"
import {
	Download,
	Upload,
	Filter,
	RefreshCw,
	BarChart3,
	Settings,
	Eye,
	Copy,
} from "lucide-react"

export default function ProductsPage() {
	const router = useRouter()
	const [spus, setSpus] = useState<MockSPU[]>(mockSpus)
	const [showSKUForm, setShowSKUForm] = useState(false)
	const [editingSKU, setEditingSKU] = useState<MockSKU | null>(null)
	const [selectedSPU, setSelectedSPU] = useState<MockSPU | null>(null)

	// Calculate stats
	const stats = useMemo(() => {
		const totalProducts = spus.length
		const activeProducts = spus.filter((spu) => spu.is_active).length
		const totalSkus = spus.reduce((sum, spu) => sum + spu.skus.length, 0)
		const lowStockSkus = spus.reduce(
			(sum, spu) => sum + spu.skus.filter((sku) => sku.stock < 10).length,
			0
		)
		const totalSales = spus.reduce((sum, spu) => sum + spu.sales, 0)
		const totalViews = spus.reduce((sum, spu) => sum + spu.views, 0)
		const avgRating =
			spus.reduce((sum, spu) => sum + spu.rating, 0) / spus.length

		return [
			{
				label: "Total Products",
				value: totalProducts,
				change: 12,
				trend: "up" as const,
			},
			{
				label: "Active Products",
				value: activeProducts,
				change: 5,
				trend: "up" as const,
			},
			{
				label: "Total Sales",
				value: totalSales,
				change: 18,
				trend: "up" as const,
			},
			{
				label: "Avg Rating",
				value: avgRating.toFixed(1),
				change: 0.3,
				trend: "up" as const,
			},
		]
	}, [spus])

	const handleCreateSPU = () => {
		router.push("/vendor/products/new")
	}

	const handleEditSPU = (spu: MockSPU) => {
		router.push(`/vendor/products/${spu.id}`)
	}

	const handleDeleteSPU = (spuId: number) => {
		setSpus((prev) => prev.filter((spu) => spu.id !== spuId))
		toast.success("Product deleted successfully")
	}

	const handleToggleSPUStatus = (spuId: number) => {
		setSpus((prev) =>
			prev.map((spu) =>
				spu.id === spuId
					? {
							...spu,
							is_active: !spu.is_active,
							date_updated: new Date().toISOString().split("T")[0],
					  }
					: spu
			)
		)
		toast.success("Product status updated")
	}

	const handleCreateSKU = (spu: MockSPU) => {
		setSelectedSPU(spu)
		setEditingSKU(null)
		setShowSKUForm(true)
	}

	const handleEditSKU = (sku: MockSKU, spu: MockSPU) => {
		setSelectedSPU(spu)
		setEditingSKU(sku)
		setShowSKUForm(true)
	}

	const handleSaveSKU = (skuData: Partial<MockSKU>) => {
		if (!selectedSPU) return

		if (editingSKU) {
			// Update existing SKU
			setSpus((prev) =>
				prev.map((spu) =>
					spu.id === selectedSPU.id
						? {
								...spu,
								skus: spu.skus.map((sku) =>
									sku.id === editingSKU.id
										? {
												...sku,
												...skuData,
												date_updated: new Date().toISOString().split("T")[0],
										  }
										: sku
								),
								date_updated: new Date().toISOString().split("T")[0],
						  }
						: spu
				)
			)
			toast.success("SKU updated successfully")
		} else {
			// Create new SKU
			const newSKU: MockSKU = {
				id: Math.max(...selectedSPU.skus.map((s) => s.id), 0) + 1,
				spu_id: selectedSPU.id,
				price: skuData.price || 0,
				stock: skuData.stock || 0,
				can_combine: skuData.can_combine ?? true,
				attributes: skuData.attributes || {},
				date_created: new Date().toISOString().split("T")[0],
				date_updated: new Date().toISOString().split("T")[0],
				is_featured: skuData.is_featured ?? false,
			}
			setSpus((prev) =>
				prev.map((spu) =>
					spu.id === selectedSPU.id
						? {
								...spu,
								skus: [...spu.skus, newSKU],
								date_updated: new Date().toISOString().split("T")[0],
						  }
						: spu
				)
			)
			toast.success("SKU created successfully")
		}
		setShowSKUForm(false)
		setEditingSKU(null)
		setSelectedSPU(null)
	}

	const handleDeleteSKU = (skuId: number, spuId: number) => {
		setSpus((prev) =>
			prev.map((spu) =>
				spu.id === spuId
					? {
							...spu,
							skus: spu.skus.filter((sku) => sku.id !== skuId),
							date_updated: new Date().toISOString().split("T")[0],
					  }
					: spu
			)
		)
		toast.success("SKU deleted successfully")
	}

	const handleBulkAction = (action: string) => {
		toast.info(`Bulk ${action} action would be implemented`)
	}

	const handleExport = () => {
		toast.info("Export functionality would be implemented")
	}

	const handleImport = () => {
		toast.info("Import functionality would be implemented")
	}

	const handleRefresh = () => {
		toast.info("Data refreshed")
	}

	const handleViewAnalytics = () => {
		toast.info("Analytics view would be implemented")
	}

	const handleSettings = () => {
		toast.info("Settings would be implemented")
	}

	const secondaryActions = [
		{
			label: "Import",
			icon: <Upload className="h-4 w-4" />,
			onClick: handleImport,
			variant: "outline" as const,
		},
		{
			label: "Export",
			icon: <Download className="h-4 w-4" />,
			onClick: handleExport,
			variant: "outline" as const,
		},
		{
			label: "Analytics",
			icon: <BarChart3 className="h-4 w-4" />,
			onClick: handleViewAnalytics,
			variant: "outline" as const,
		},
		{
			label: "Refresh",
			icon: <RefreshCw className="h-4 w-4" />,
			onClick: handleRefresh,
			variant: "ghost" as const,
		},
		{
			label: "Settings",
			icon: <Settings className="h-4 w-4" />,
			onClick: handleSettings,
			variant: "ghost" as const,
		},
	]

	if (spus.length === 0) {
		return (
			<div className="min-h-screen flex flex-col">
				<main className="flex-1 py-8 mx-auto">
					<div className="container max-w-7xl">
						<PageHeader
							title="Product Management"
							description="Manage your product catalog including SPUs and SKUs"
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
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 py-8 mx-auto">
				<div className="container max-w-7xl">
					<PageHeader
						title="Product Management"
						description="Manage your product catalog including SPUs and SKUs"
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
					/>

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
