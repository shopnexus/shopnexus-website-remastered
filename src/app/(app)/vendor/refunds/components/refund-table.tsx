"use client"

import { useState } from "react"
import { DataTable, Column } from "../../components/data-table"
import { StatusBadge } from "../../components/status-badge"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { MockRefund } from "../../components/mock-data"
import { Eye, AlertTriangle } from "lucide-react"

interface RefundTableProps {
	refunds: MockRefund[]
	onViewDetails: (refund: MockRefund) => void
	onUpdateStatus: (refundId: number, status: MockRefund["status"]) => void
	onCreateDispute: (refundId: number, reason: string) => void
}

export function RefundTable({
	refunds,
	onViewDetails,
	onUpdateStatus,
	onCreateDispute,
}: RefundTableProps) {
	const [statusFilter, setStatusFilter] = useState<string>("all")

	const filteredRefunds = refunds.filter(
		(refund) => statusFilter === "all" || refund.status === statusFilter
	)

	const refundColumns: Column<MockRefund>[] = [
		{
			key: "id",
			label: "Refund ID",
			render: (value: number) => `#${value}`,
			className: "w-20",
		},
		{
			key: "customer_name",
			label: "Customer",
			sortable: true,
		},
		{
			key: "product_name",
			label: "Product",
			sortable: true,
		},
		{
			key: "method",
			label: "Method",
			render: (value: string) => <StatusBadge status={value} />,
		},
		{
			key: "status",
			label: "Status",
			render: (value: string) => <StatusBadge status={value} />,
		},
		{
			key: "reason",
			label: "Reason",
			render: (value: string) => (
				<div className="max-w-xs truncate" title={value}>
					{value}
				</div>
			),
		},
		{
			key: "date_created",
			label: "Date",
			render: (value: string) => new Date(value).toLocaleDateString(),
			sortable: true,
		},
	]

	return (
		<div className="space-y-4">
			{/* Status Filter */}
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium">Filter by status:</span>
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="Pending">Pending</SelectItem>
							<SelectItem value="Processing">Processing</SelectItem>
							<SelectItem value="Success">Success</SelectItem>
							<SelectItem value="Canceled">Canceled</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<DataTable
				data={filteredRefunds}
				columns={refundColumns}
				searchKey="customer_name"
				searchPlaceholder="Search by customer name..."
				actions={(refund) => (
					<div className="flex items-center gap-1">
						<Button
							size="sm"
							variant="ghost"
							onClick={() => onViewDetails(refund)}
							title="View Details"
						>
							<Eye className="h-4 w-4" />
						</Button>

						{refund.status === "Pending" && (
							<Select
								value=""
								onValueChange={(value) =>
									onUpdateStatus(refund.id, value as MockRefund["status"])
								}
							>
								<SelectTrigger className="w-32 h-8">
									<SelectValue placeholder="Update" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Processing">Processing</SelectItem>
									<SelectItem value="Success">Approve</SelectItem>
									<SelectItem value="Canceled">Reject</SelectItem>
								</SelectContent>
							</Select>
						)}

						{refund.status === "Processing" && (
							<Button
								size="sm"
								variant="ghost"
								onClick={() => onCreateDispute(refund.id, "Dispute reason")}
								title="Create Dispute"
							>
								<AlertTriangle className="h-4 w-4" />
							</Button>
						)}
					</div>
				)}
			/>
		</div>
	)
}
