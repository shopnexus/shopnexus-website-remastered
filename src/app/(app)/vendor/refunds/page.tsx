"use client"

import { useState } from "react"
import { PageHeader } from "../components/page-header"
import { RefundTable } from "./components/refund-table"
import { RefundDetailDialog } from "./components/refund-detail-dialog"
import { mockRefunds, MockRefund } from "@/lib/mocks/mock-data"
import { toast } from "sonner"

export default function RefundsPage() {
	const [refunds, setRefunds] = useState<MockRefund[]>(mockRefunds)
	const [selectedRefund, setSelectedRefund] = useState<MockRefund | null>(null)
	const [showDetailDialog, setShowDetailDialog] = useState(false)

	const handleViewDetails = (refund: MockRefund) => {
		setSelectedRefund(refund)
		setShowDetailDialog(true)
	}

	const handleUpdateStatus = (
		refundId: number,
		newStatus: MockRefund["status"]
	) => {
		setRefunds((prev) =>
			prev.map((refund) =>
				refund.id === refundId ? { ...refund, status: newStatus } : refund
			)
		)
		toast.success(`Refund status updated to ${newStatus}`)
	}

	const handleCreateDispute = (refundId: number, reason: string) => {
		// In real implementation, this would create a dispute record
		toast.success(`Dispute created for refund #${refundId}`)
	}

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 py-8 mx-auto">
				<div className="container max-w-7xl">
					<PageHeader
						title="Refund Management"
						description="Manage customer refund requests and disputes"
					/>

					<RefundTable
						refunds={refunds}
						onViewDetails={handleViewDetails}
						onUpdateStatus={handleUpdateStatus}
						onCreateDispute={handleCreateDispute}
					/>

					{showDetailDialog && selectedRefund && (
						<RefundDetailDialog
							refund={selectedRefund}
							onUpdateStatus={handleUpdateStatus}
							onCreateDispute={handleCreateDispute}
							onClose={() => {
								setShowDetailDialog(false)
								setSelectedRefund(null)
							}}
						/>
					)}
				</div>
			</main>
		</div>
	)
}
