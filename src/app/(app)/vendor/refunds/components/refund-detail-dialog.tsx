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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { StatusBadge } from "../../components/status-badge"
import { Badge } from "@/components/ui/badge"
import { MockRefund } from "../../components/mock-data"
import { AlertTriangle } from "lucide-react"

interface RefundDetailDialogProps {
	refund: MockRefund
	onUpdateStatus: (refundId: number, status: MockRefund["status"]) => void
	onCreateDispute: (refundId: number, reason: string) => void
	onClose: () => void
}

export function RefundDetailDialog({
	refund,
	onUpdateStatus,
	onCreateDispute,
	onClose,
}: RefundDetailDialogProps) {
	const [disputeReason, setDisputeReason] = useState("")
	const [showDisputeForm, setShowDisputeForm] = useState(false)

	const handleCreateDispute = () => {
		if (disputeReason.trim()) {
			onCreateDispute(refund.id, disputeReason)
			setShowDisputeForm(false)
			setDisputeReason("")
		}
	}

	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Refund Details - #{refund.id}</DialogTitle>
					<DialogDescription>
						Review refund request details and take appropriate action
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Basic Information */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label className="text-sm font-medium text-muted-foreground">
								Customer
							</Label>
							<p className="text-sm">{refund.customer_name}</p>
						</div>
						<div>
							<Label className="text-sm font-medium text-muted-foreground">
								Product
							</Label>
							<p className="text-sm">{refund.product_name}</p>
						</div>
						<div>
							<Label className="text-sm font-medium text-muted-foreground">
								Method
							</Label>
							<div className="mt-1">
								<StatusBadge status={refund.method} />
							</div>
						</div>
						<div>
							<Label className="text-sm font-medium text-muted-foreground">
								Status
							</Label>
							<div className="mt-1">
								<StatusBadge status={refund.status} />
							</div>
						</div>
						<div>
							<Label className="text-sm font-medium text-muted-foreground">
								Date Created
							</Label>
							<p className="text-sm">
								{new Date(refund.date_created).toLocaleDateString()}
							</p>
						</div>
						<div>
							<Label className="text-sm font-medium text-muted-foreground">
								Order Item ID
							</Label>
							<p className="text-sm">#{refund.order_item_id}</p>
						</div>
					</div>

					{/* Reason */}
					<div>
						<Label className="text-sm font-medium text-muted-foreground">
							Reason for Refund
						</Label>
						<p className="text-sm mt-1 p-3 bg-muted rounded-md">
							{refund.reason}
						</p>
					</div>

					{/* Address (if applicable) */}
					{refund.address && (
						<div>
							<Label className="text-sm font-medium text-muted-foreground">
								{refund.method === "PickUp" ? "Pickup Address" : "Address"}
							</Label>
							<p className="text-sm mt-1 p-3 bg-muted rounded-md">
								{refund.address}
							</p>
						</div>
					)}

					{/* Dispute Form */}
					{showDisputeForm && (
						<div className="space-y-2">
							<Label htmlFor="dispute-reason">Dispute Reason</Label>
							<Textarea
								id="dispute-reason"
								value={disputeReason}
								onChange={(e) => setDisputeReason(e.target.value)}
								placeholder="Explain why you're disputing this refund request..."
								rows={3}
							/>
						</div>
					)}
				</div>

				<DialogFooter className="gap-2">
					<Button variant="outline" onClick={onClose}>
						Close
					</Button>

					<Button variant="outline" onClick={() => handleCreateDispute()}>
						Create dispute
					</Button>
					<Button onClick={() => onUpdateStatus(refund.id, "Processing")}>
						Approve
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
