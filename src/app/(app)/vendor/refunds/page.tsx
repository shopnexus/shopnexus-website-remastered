"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { RefundTable } from "./components/refund-table"
import { RefundDetailDialog } from "./components/refund-detail-dialog"
import {
	useListRefundsVendor,
	useUpdateRefundVendor,
	useConfirmRefundVendor,
	useCancelRefundVendor,
	TRefund,
} from "@/core/order/refund.vendor"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Status } from "@/core/common/status.type"

export default function RefundsPage() {
	const refundsQuery = useListRefundsVendor({ limit: 20 })
	const { items: refunds } = useInfiniteScroll(refundsQuery)
	const updateRefundMutation = useUpdateRefundVendor()
	const confirmRefundMutation = useConfirmRefundVendor()
	const cancelRefundMutation = useCancelRefundVendor()

	const [selectedRefund, setSelectedRefund] = useState<TRefund | null>(null)
	const [showDetailDialog, setShowDetailDialog] = useState(false)

	const handleViewDetails = (refund: TRefund) => {
		setSelectedRefund(refund)
		setShowDetailDialog(true)
	}

	const handleUpdateStatus = async (
		refundId: string,
		newStatus: Status
	) => {
		try {
			if (newStatus === Status.Success) {
				await confirmRefundMutation.mutateAsync({ id: refundId })
			} else {
				await updateRefundMutation.mutateAsync({
					id: refundId,
					resource_ids: [],
				})
			}
			toast.success(`Refund status updated to ${newStatus}`)
		} catch (error) {
			toast.error("Failed to update refund status")
		}
	}

	const handleCreateDispute = async (refundId: string, reason: string) => {
		try {
			await cancelRefundMutation.mutateAsync({ id: refundId })
			toast.success(`Dispute created for refund #${refundId}`)
		} catch (error) {
			toast.error("Failed to create dispute")
		}
	}

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 py-8 mx-auto">
				<div className="container max-w-7xl">
					<PageHeader
						title="Refund Management"
						description="Manage customer refund requests and disputes"
					/>

					{refundsQuery.isLoading && refunds.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-muted-foreground">Loading refunds...</p>
						</div>
					) : (
						<>
							<RefundTable
								refunds={refunds}
								onViewDetails={handleViewDetails}
								onUpdateStatus={handleUpdateStatus}
								onCreateDispute={handleCreateDispute}
							/>
							{refundsQuery.hasNextPage && (
								<div className="flex justify-center mt-4">
									<Button
										variant="outline"
										onClick={() => refundsQuery.fetchNextPage()}
										disabled={refundsQuery.isFetchingNextPage}
									>
										{refundsQuery.isFetchingNextPage ? "Loading..." : "Load More"}
									</Button>
								</div>
							)}
						</>
					)}

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
