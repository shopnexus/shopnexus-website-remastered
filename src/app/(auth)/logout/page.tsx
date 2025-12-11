"use client"

import { useSignOut } from "@/core/account/account"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
	const router = useRouter()
	const { mutateAsync: signOut } = useSignOut()

	useEffect(() => {
		signOut().then(() => {
			router.push("/login")
		})
	}, [signOut, router])

	return null
}
