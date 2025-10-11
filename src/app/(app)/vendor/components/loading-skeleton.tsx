"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function PageSkeleton() {
	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 py-8 mx-auto">
				<div className="container max-w-7xl space-y-6">
					{/* Header */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div className="space-y-2">
							<Skeleton className="h-8 w-64" />
							<Skeleton className="h-4 w-96" />
						</div>
						<Skeleton className="h-10 w-32" />
					</div>

					{/* Stats */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{Array.from({ length: 4 }).map((_, i) => (
							<Card key={i}>
								<CardHeader className="pb-2">
									<Skeleton className="h-4 w-20" />
								</CardHeader>
								<CardContent>
									<Skeleton className="h-8 w-16" />
								</CardContent>
							</Card>
						))}
					</div>

					{/* Table */}
					<Card>
						<CardHeader>
							<div className="flex items-center gap-4">
								<Skeleton className="h-10 w-80" />
								<Skeleton className="h-10 w-32" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{Array.from({ length: 5 }).map((_, i) => (
									<div key={i} className="flex items-center space-x-4">
										<Skeleton className="h-4 w-4" />
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-4 w-24" />
										<Skeleton className="h-4 w-20" />
										<Skeleton className="h-4 w-16" />
										<Skeleton className="h-4 w-12" />
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	)
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
	return (
		<tr>
			{Array.from({ length: columns }).map((_, i) => (
				<td key={i} className="p-4">
					<Skeleton className="h-4 w-full" />
				</td>
			))}
		</tr>
	)
}

export function CardSkeleton() {
	return (
		<Card>
			<CardHeader>
				<Skeleton className="h-6 w-3/4" />
				<Skeleton className="h-4 w-1/2" />
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
					<Skeleton className="h-4 w-1/2" />
				</div>
			</CardContent>
		</Card>
	)
}
