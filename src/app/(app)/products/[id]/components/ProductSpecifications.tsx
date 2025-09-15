"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface ProductSpecificationsProps {
	specifications: Record<string, string>
	description: string
}

export function ProductSpecifications({
	specifications,
	description,
}: ProductSpecificationsProps) {
	return (
		<Card className="bg-white px-4 py-6 sm:py-10 shadow-sm border border-gray-100 mx-4">
			<CardContent className="space-y-4">
				{/* Compact Specifications */}
				<div className="space-y-2">
					<h4 className="font-semibold text-gray-900">
						Product Specifications
					</h4>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
						{Object.entries(specifications ?? {}).map(([key, value]) => (
							<div key={key} className="bg-card p-3 rounded-lg">
								<div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
									{key}
								</div>
								<div className="font-medium text-gray-900">{value}</div>
							</div>
						))}
					</div>
				</div>
				<Separator />
				{/* Description */}
				<div>
					<h4 className="font-semibold text-gray-900">Product Description</h4>
					<div className="whitespace-pre-line text-gray-700 leading-relaxed">
						{description}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
