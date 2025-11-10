"use client"

import { useState } from "react"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ConfirmOrderDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onConfirm: (specs: Record<string, string>, fromAddress?: string) => void
	isLoading?: boolean
	orderItemId: number
}

export function ConfirmOrderDialog({
	open,
	onOpenChange,
	onConfirm,
	isLoading = false,
	orderItemId,
}: ConfirmOrderDialogProps) {
	const [specs, setSpecs] = useState<Record<string, string>>({
		weight_grams: "",
		length_cm: "",
		width_cm: "",
		height_cm: "",
	})
	const [fromAddress, setFromAddress] = useState<string>("")

	// Reset form when dialog closes
	const handleReset = () => {
		setSpecs({
			weight_grams: "",
			length_cm: "",
			width_cm: "",
			height_cm: "",
		})
		setFromAddress("")
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		// Validate required specs
		if (
			!specs.weight_grams ||
			!specs.length_cm ||
			!specs.width_cm ||
			!specs.height_cm
		) {
			return
		}

		onConfirm(specs, fromAddress.trim() || undefined)
		handleReset()
	}

	const handleClose = () => {
		handleReset()
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Confirm Order Item #{orderItemId}</DialogTitle>
					<DialogDescription>
						Enter shipping specifications for this order item
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit}>
					<div className="space-y-4 py-4">
						{/* Shipping Specifications */}
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="weight_grams">Weight (grams) *</Label>
								<Input
									id="weight_grams"
									type="number"
									placeholder="1000"
									value={specs.weight_grams}
									onChange={(e) =>
										setSpecs({ ...specs, weight_grams: e.target.value })
									}
									required
									min="1"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="length_cm">Length (cm) *</Label>
								<Input
									id="length_cm"
									type="number"
									placeholder="10"
									value={specs.length_cm}
									onChange={(e) =>
										setSpecs({ ...specs, length_cm: e.target.value })
									}
									required
									min="1"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="width_cm">Width (cm) *</Label>
								<Input
									id="width_cm"
									type="number"
									placeholder="10"
									value={specs.width_cm}
									onChange={(e) =>
										setSpecs({ ...specs, width_cm: e.target.value })
									}
									required
									min="1"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="height_cm">Height (cm) *</Label>
								<Input
									id="height_cm"
									type="number"
									placeholder="10"
									value={specs.height_cm}
									onChange={(e) =>
										setSpecs({ ...specs, height_cm: e.target.value })
									}
									required
									min="1"
								/>
							</div>
						</div>

						{/* From Address (Optional) */}
						<div className="space-y-2">
							<Label htmlFor="from_address">From Address (Optional)</Label>
							<Input
								id="from_address"
								placeholder="Enter origin address..."
								value={fromAddress}
								onChange={(e) => setFromAddress(e.target.value)}
							/>
							<p className="text-xs text-muted-foreground">
								Leave empty to use default warehouse address
							</p>
						</div>

						{/* Additional Specs Note */}
						<div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
							<p>
								💡 You can add additional specifications by adding custom fields
								to the API request. All values should be provided as strings.
							</p>
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={handleClose}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? "Confirming..." : "Confirm Order Item"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
