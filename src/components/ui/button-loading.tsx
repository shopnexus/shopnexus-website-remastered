import { Button } from "./button"
import { Spinner } from "./spinner"
import { useEffect, useState } from "react"

export function ButtonLoading({
	loading,
	onClick,
	children,
	...props
}: Parameters<typeof Button>[0] & {
	loading?: boolean
	minDurationMs?: number
}) {
	const [localLoading, setLocalLoading] = useState(loading || false)

	useEffect(() => {
		if (loading !== undefined) {
			setLocalLoading(loading)
		}
	}, [loading])

	return (
		<Button
			{...props}
			onClick={async (e) => {
				setLocalLoading(true)
				const start = Date.now()
				try {
					await onClick?.(e)
				} finally {
					const elapsed = Date.now() - start
					const minDuration = (props as any).minDurationMs || 0
					const remaining = Math.max(0, minDuration - elapsed)
					if (remaining > 0) {
						await new Promise((resolve) => setTimeout(resolve, remaining))
					}
					setLocalLoading(false)
				}
			}}
			disabled={localLoading || props.disabled}
		>
			{localLoading && <Spinner className="" />}
			{children}
		</Button>
	)
}
