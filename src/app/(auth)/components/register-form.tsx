"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Eye, EyeOff, Store, User } from "lucide-react"
import { ButtonLoading } from "@/components/ui/button-loading"
import { Logo } from "@/components/shared/logo"
import { useRegisterBasic } from "@/core/account/auth"
import { useRouter } from "next/navigation"
import { ResponseError } from "@/lib/queryclient/response.type"
import { toast } from "sonner"
import { useShake } from "@/hooks/use-shake"

type AccountType = "vendor" | "customer"

// Social login providers configuration
const socialProviders = [
	{
		id: "google",
		name: "Google",
		icon: (
			<svg className="w-5 h-5" viewBox="0 0 24 24">
				<path
					fill="#4285F4"
					d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
				/>
				<path
					fill="#34A853"
					d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				/>
				<path
					fill="#FBBC05"
					d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
				/>
				<path
					fill="#EA4335"
					d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				/>
			</svg>
		),
		color:
			"bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400",
		textColor: "text-gray-700",
	},
	{
		id: "facebook",
		name: "Facebook",
		icon: (
			<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
				<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
			</svg>
		),
		color:
			"bg-[#1877F2] text-white border-[#1877F2] hover:bg-[#166FE5] hover:border-[#166FE5]",
		textColor: "text-white",
	},
	{
		id: "github",
		name: "GitHub",
		icon: (
			<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
				<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
			</svg>
		),
		color:
			"bg-[#24292E] text-white border-[#24292E] hover:bg-[#2F363D] hover:border-[#2F363D]",
		textColor: "text-white",
	},
	{
		id: "apple",
		name: "Apple",
		icon: (
			<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
				<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
			</svg>
		),
		color:
			"bg-black text-white border-black hover:bg-gray-900 hover:border-gray-900",
		textColor: "text-white",
	},
]

type ContactMethod = "email" | "phone"

export function RegisterForm() {
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const { mutateAsync: mutateRegisterAccount, isPending } = useRegisterBasic()
	const [socialLoading, setSocialLoading] = useState<string | null>(null)
	const [accountType, setAccountType] = useState<AccountType>("customer")
	const [contactMethod, setContactMethod] = useState<ContactMethod>("email")
	const [formData, setFormData] = useState({
		email: "",
		phone: "",
		password: "",
		confirmPassword: "",
		agreeToTerms: false,
	})
	const router = useRouter()
	const { shake, shakeRef } = useShake({
		duration: 800,
		intensity: 8,
		easing: "ease-in-out",
	})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		// Validate that the selected contact method has a value
		if (contactMethod === "email" && !formData.email) {
			toast.error("Please enter your email address")
			shake()
			return
		}
		if (contactMethod === "phone" && !formData.phone) {
			toast.error("Please enter your phone number")
			shake()
			return
		}

		// Validate password match
		if (formData.password !== formData.confirmPassword) {
			toast.error("Passwords do not match")
			shake()
			return
		}

		try {
			await mutateRegisterAccount({
				type: accountType === "vendor" ? "Vendor" : "Customer",
				username: null,
				email: contactMethod === "email" ? formData.email : null,
				phone: contactMethod === "phone" ? formData.phone : null,
				password: formData.password,
			})

			router.push("/")
		} catch (error) {
			shake()
			if (error instanceof ResponseError) {
				toast.error(error.message)
			} else {
				toast.error("An unknown error occurred")
			}
		}
	}

	const handleSocialRegister = async (provider: string) => {
		setSocialLoading(provider)
		// Simulate social register API call
		await new Promise((resolve) => setTimeout(resolve, 1500))
		setSocialLoading(null)
		console.log(`Social register attempt with ${provider}:`, { accountType })
	}

	const accountTypeConfig = {
		vendor: {
			title: "Vendor Registration",
			description:
				"Join our platform as a vendor and start selling your products",
			icon: Store,
			registerText: "Register as Vendor",
		},
		customer: {
			title: "Customer Registration",
			description:
				"Create your account and start shopping with thousands of vendors",
			icon: User,
			registerText: "Create Customer Account",
		},
	}

	const config = accountTypeConfig[accountType]

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader className="space-y-1 text-center">
				<Logo />
				{/* <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
				<CardDescription>
					Choose your account type and join our platform
				</CardDescription> */}
			</CardHeader>

			<CardContent className="space-y-6">
				<Tabs
					value={accountType}
					onValueChange={(value) => setAccountType(value as AccountType)}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger
							value="customer"
							className="flex items-center space-x-2"
						>
							<User className="h-4 w-4" />
							<span>Customer</span>
						</TabsTrigger>
						<TabsTrigger value="vendor" className="flex items-center space-x-2">
							<Store className="h-4 w-4" />
							<span>Vendor</span>
						</TabsTrigger>
					</TabsList>

					<TabsContent value={accountType} className="space-y-4 mt-6">
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label>Contact Method</Label>
								<RadioGroup
									value={contactMethod}
									onValueChange={(value) =>
										setContactMethod(value as ContactMethod)
									}
									className="flex gap-4"
								>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="email" id="email-option" />
										<Label htmlFor="email-option" className="cursor-pointer">
											Email
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="phone" id="phone-option" />
										<Label htmlFor="phone-option" className="cursor-pointer">
											Phone
										</Label>
									</div>
								</RadioGroup>
							</div>

							{contactMethod === "email" ? (
								<div className="space-y-2">
									<Label htmlFor="email">Email Address</Label>
									<Input
										id="email"
										type="email"
										placeholder={
											accountType === "vendor"
												? "vendor@company.com"
												: "customer@email.com"
										}
										value={formData.email}
										onChange={(e) =>
											setFormData({ ...formData, email: e.target.value })
										}
										required
										className="h-11"
									/>
								</div>
							) : (
								<div className="space-y-2">
									<Label htmlFor="phone">Phone Number</Label>
									<Input
										id="phone"
										type="tel"
										placeholder="+1 (555) 123-4567"
										value={formData.phone}
										onChange={(e) =>
											setFormData({ ...formData, phone: e.target.value })
										}
										required
										className="h-11"
									/>
								</div>
							)}

							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="password">Password</Label>
									<div className="relative">
										<Input
											id="password"
											type={showPassword ? "text" : "password"}
											placeholder="Create password"
											value={formData.password}
											onChange={(e) =>
												setFormData({ ...formData, password: e.target.value })
											}
											required
											className="h-11 pr-10"
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</Button>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="confirmPassword">Confirm Password</Label>
									<div className="relative">
										<Input
											id="confirmPassword"
											type={showConfirmPassword ? "text" : "password"}
											placeholder="Confirm password"
											value={formData.confirmPassword}
											onChange={(e) =>
												setFormData({
													...formData,
													confirmPassword: e.target.value,
												})
											}
											required
											className="h-11 pr-10"
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
											onClick={() =>
												setShowConfirmPassword(!showConfirmPassword)
											}
										>
											{showConfirmPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</Button>
									</div>
								</div>
							</div>

							<div className="flex items-center space-x-2">
								<Checkbox
									id="terms"
									checked={formData.agreeToTerms}
									onCheckedChange={(checked) =>
										setFormData({
											...formData,
											agreeToTerms: checked as boolean,
										})
									}
									required
								/>
								<Label htmlFor="terms" className="text-sm">
									I agree to the{" "}
									<Link href="/terms" className="text-primary hover:underline">
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link
										href="/privacy"
										className="text-primary hover:underline"
									>
										Privacy Policy
									</Link>
								</Label>
							</div>

							<ButtonLoading
								ref={shakeRef as React.RefObject<HTMLButtonElement>}
								loading={isPending}
								onClick={handleSubmit}
								className="w-full h-11 mt-6 cursor-pointer"
								disabled={!formData.agreeToTerms}
							>
								<div className="flex items-center space-x-2">
									<config.icon className="h-4 w-4" />
									<span>
										Create {accountType === "vendor" ? "Vendor" : "Customer"}{" "}
										Account
									</span>
								</div>
							</ButtonLoading>
						</form>

						{/* Social Register Section */}
						<div className="space-y-4">
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<span className="w-full border-t" />
								</div>
								<div className="relative flex justify-center text-xs uppercase">
									<span className="bg-background px-2 text-muted-foreground">
										Or continue with
									</span>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-3">
								{socialProviders.map((provider) => (
									<Button
										key={provider.id}
										type="button"
										variant="outline"
										className={`h-11 ${provider.color} transition-colors`}
										onClick={() => handleSocialRegister(provider.id)}
										disabled={socialLoading !== null}
									>
										{socialLoading === provider.id ? (
											<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
										) : (
											<span className="mr-2">{provider.icon}</span>
										)}
										<span
											className={`text-sm font-medium ${provider.textColor}`}
										>
											{provider.name}
										</span>
									</Button>
								))}
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>

			<CardFooter className="flex flex-col space-y-4 pt-0">
				<div className="relative w-full">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-background px-2 text-muted-foreground">
							Already have an account?
						</span>
					</div>
				</div>

				<div className="text-center text-sm text-muted-foreground">
					<Link
						href="/login"
						className="text-primary hover:underline font-medium transition-colors"
					>
						Sign in instead
					</Link>
				</div>
			</CardFooter>
		</Card>
	)
}
