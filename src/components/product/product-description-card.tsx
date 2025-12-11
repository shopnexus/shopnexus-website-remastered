"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TiptapEditor from "@/components/shared/tiptap-editor"

type ProductDescriptionCardProps = {
	value: string
	onChange: (next: string) => void
	isPreview?: boolean
}

export default function ProductDescriptionCard({
	value,
	onChange,
	isPreview = false,
}: ProductDescriptionCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Description</CardTitle>
				<p className="text-sm text-muted-foreground">
					Write your product description with rich text. Use headings, lists, and formatting.
				</p>
			</CardHeader>
			<CardContent>
				{isPreview ? (
					<div className="prose max-w-none">
						<div className="p-4 border rounded-lg bg-muted/50">
							<h3 className="text-lg font-semibold mb-2">Preview</h3>
							<div
								className="prose prose-sm max-w-none"
								dangerouslySetInnerHTML={{
									__html: value || "",
								}}
							/>
						</div>
					</div>
				) : (
					<TiptapEditor
						value={value}
						onChange={onChange}
						placeholder="Describe your product..."
						minHeightClassName="min-h-[300px]"
					/>
				)}
			</CardContent>
		</Card>
	)
}


