"use client"

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ConfirmDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	title: string
	description: string
	confirmText?: string
	cancelText?: string
	variant?: "default" | "destructive"
	onConfirm: () => void
}

export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmText = "Confirm",
	cancelText = "Cancel",
	variant = "default",
	onConfirm,
}: ConfirmDialogProps) {
	const handleConfirm = () => {
		onConfirm()
		onOpenChange(false)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="flex items-center gap-3">
						{variant === "destructive" && (
							<div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
								<AlertTriangle className="h-5 w-5 text-red-600" />
							</div>
						)}
						<div>
							<DialogTitle>{title}</DialogTitle>
							<DialogDescription className="mt-1">
								{description}
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<DialogFooter className="gap-2">
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						{cancelText}
					</Button>
					<Button
						variant={variant === "destructive" ? "destructive" : "default"}
						onClick={handleConfirm}
					>
						{confirmText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

