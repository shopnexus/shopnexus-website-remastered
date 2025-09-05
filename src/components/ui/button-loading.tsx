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
				try {
					await onClick?.(e)
				} finally {
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
