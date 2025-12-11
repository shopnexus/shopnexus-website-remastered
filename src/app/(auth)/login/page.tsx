"use client"

import { redirect } from "next/navigation"
import { LoginForm } from "../components/login-form"
import { useGetMe } from "@/core/account/account"

export default function LoginPage() {
	const { data: account } = useGetMe()
	if (account) {
		redirect("/")
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
			<LoginForm />
		</div>
	)
}
