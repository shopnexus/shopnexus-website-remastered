"use client"

import { useState, useMemo } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SkuDetail {
	id: number
	price: number
	original_price: number
	attributes: { name: string; value: string }[]
}

interface ProductOptionsProps {
	skus: SkuDetail[]
	selectedSku: SkuDetail | null
	onSelectSku: (sku: SkuDetail | null) => void
	productImages?: string[]
}

// Mock function để lấy thumbnail cho từng option
const getOptionThumbnail = (
	attributes: { name: string; value: string }[],
	productImages?: string[]
): string => {
	const colorAttr = attributes.find((attr) => attr.name === "color")
	const color = colorAttr?.value.toLowerCase()
	const colorImageMap: Record<string, string> = {
		black: "/placeholder.jpg",
		green: "/placeholder.jpg",
		white: "/placeholder.jpg",
		red: "/placeholder.jpg",
		blue: "/placeholder.jpg",
	}
	const fallbackImage = productImages?.[0] || "/placeholder.jpg"
	return colorImageMap[color || ""] || fallbackImage
}

export function ProductOptions({
	skus,
	selectedSku,
	onSelectSku,
	productImages,
}: ProductOptionsProps) {
	// Tạo sections từ tất cả attribute names có trong SKUs
	const sections = useMemo(() => {
		const allAttributeNames = new Set<string>()
		skus.forEach((sku) => {
			sku.attributes.forEach((attr) => allAttributeNames.add(attr.name))
		})
		return Array.from(allAttributeNames)
	}, [skus])

	// Tạo options cho mỗi section
	const sectionOptions = useMemo(() => {
		const result: Record<string, string[]> = {}

		sections.forEach((section) => {
			const values = new Set<string>()
			skus.forEach((sku) => {
				const attr = sku.attributes.find((a) => a.name === section)
				if (attr) {
					values.add(attr.value)
				}
			})
			result[section] = Array.from(values)
		})

		return result
	}, [skus, sections])

	// State để track selections cho từng section
	const [selections, setSelections] = useState<Record<string, string>>(() => {
		if (selectedSku) {
			const selectionsRecord: Record<string, string> = {}
			selectedSku.attributes.forEach((attr) => {
				selectionsRecord[attr.name] = attr.value
			})
			return selectionsRecord
		}
		return {}
	})

	// Tìm SKUs khả dụng dựa trên selections hiện tại
	const availableSkus = useMemo(() => {
		return skus.filter((sku) => {
			return Object.entries(selections).every(([key, value]) => {
				if (!selections[key]) return true
				const attr = sku.attributes.find((a) => a.name === key)
				return attr?.value === value
			})
		})
	}, [skus, selections])

	// Kiểm tra option có khả dụng không
	const isOptionAvailable = (section: string, value: string) => {
		const testSelections = { ...selections, [section]: value }
		return skus.some((sku) => {
			return Object.entries(testSelections).every(([key, val]) => {
				if (!testSelections[key]) return true
				const attr = sku.attributes.find((a) => a.name === key)
				return attr?.value === val
			})
		})
	}

	// Handle selection change
	const handleSelectionChange = (section: string, value: string) => {
		// Nếu đang chọn cùng giá trị, thì bỏ chọn (toggle)
		if (selections[section] === value) {
			const newSelections = { ...selections }
			delete newSelections[section]
			setSelections(newSelections)
			onSelectSku(null)
		} else {
			// Chọn giá trị mới
			const newSelections = { ...selections, [section]: value }
			setSelections(newSelections)

			if (Object.keys(newSelections).length === sections.length) {
				// Tìm SKU matching với selections mới
				const matchingSku = skus.find((sku) => {
					return Object.entries(newSelections).every(([key, val]) => {
						const attr = sku.attributes.find((a) => a.name === key)
						return attr?.value === val
					})
				})
				if (matchingSku) {
					onSelectSku(matchingSku)
				} else {
					onSelectSku(null)
				}
			}
		}
	}

	return (
		<div className="space-y-6">
			{sections.map((section) => (
				<div key={section} className="space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-sm font-bold text-gray-700 capitalize">
							{section}
						</span>
						{/* {selections[section] && (
							<span className="text-xs text-gray-500">Click để bỏ chọn</span>
						)} */}
					</div>

					<div className="grid grid-cols-2 gap-3">
						{sectionOptions[section].map((value) => {
							const isSelected = selections[section] === value
							const isAvailable = isOptionAvailable(section, value)
							const isDisabled = !isAvailable

							return (
								<button
									key={value}
									onClick={() => handleSelectionChange(section, value)}
									disabled={isDisabled}
									className={cn(
										"relative p-3 border rounded-lg text-left transition-all duration-200",
										"hover:shadow-md group",
										isSelected
											? "border-orange-500 bg-orange-50 shadow-md"
											: isDisabled
											? "border-gray-100 bg-gray-50 cursor-not-allowed opacity-50"
											: "border-gray-200 hover:border-gray-300"
									)}
								>
									{/* Option text */}
									<div className="space-y-1">
										<span
											className={cn(
												"text-sm font-medium block",
												isDisabled ? "text-gray-400" : "text-gray-900"
											)}
										>
											{value}
										</span>
									</div>

									{/* Selection indicator */}
									{isSelected && (
										<div className="absolute top-3 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
											<Check className="w-3 h-3 text-white" />
										</div>
									)}

									{/* Disabled indicator */}
									{isDisabled && (
										<div className="absolute bg-gray-100 bg-opacity-50 rounded-lg" />
									)}
								</button>
							)
						})}
					</div>
				</div>
			))}

			{/* Display selected SKU info */}
			{selectedSku ? (
				// <div className="mt-6 p-4 bg-gray-50 rounded-lg">
				// 	<div className="flex items-center justify-between">
				// 		<div>
				// 			<span className="text-sm font-medium text-gray-700">
				// 				Selected:
				// 			</span>
				// 			<span className="ml-2 text-sm text-gray-900">
				// 				{Object.entries(selectedSku.attributes)
				// 					.map(([key, value]) => `${key}: ${value}`)
				// 					.join(", ")}
				// 			</span>
				// 		</div>
				// 		<div className="flex items-center space-x-2">
				// 			<span className="text-lg font-semibold text-orange-600">
				// 				${(selectedSku.price / 100).toFixed(2)}
				// 			</span>
				// 			{selectedSku.original_price !== selectedSku.price && (
				// 				<span className="text-sm text-gray-500 line-through">
				// 					${(selectedSku.original_price / 100).toFixed(2)}
				// 				</span>
				// 			)}
				// 		</div>
				// 	</div>
				// </div>
				<></>
			) : (
				<div className="mt-6 p-4 bg-gray-50 rounded-lg">
					<div className="text-center">
						<span className="text-sm text-gray-500">
							Vui lòng chọn các tùy chọn để xem giá
						</span>
					</div>
				</div>
			)}
		</div>
	)
}
