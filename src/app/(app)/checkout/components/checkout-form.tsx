"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"

// Google Maps types
declare global {
	interface Window {
		google: any
	}
}

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
	Truck,
	CreditCard,
	FileText,
	User,
	MapPin,
	Clock,
	Home,
	Mail,
	Phone,
	Check,
} from "lucide-react"
import { useCheckout } from "@/core/order/order.customer"
import { toast } from "sonner"
import { useGetCart } from "@/core/account/cart.customer"
import { useRouter, useSearchParams } from "next/navigation"

export function CheckoutForm() {
	return (
		<Suspense>
			<Checkout></Checkout>
		</Suspense>
	)
}

function Checkout() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [isLoading, setIsLoading] = useState(false)
	const [paymentMethod, setPaymentMethod] = useState("cod")
	const [bankTransferMethod, setBankTransferMethod] = useState("VNPAY")
	const [shippingMethod, setShippingMethod] = useState("standard")
	const [sameAsBilling, setSameAsBilling] = useState(true)
	const [showMap, setShowMap] = useState(false)
	const { mutateAsync: mutateCheckout } = useCheckout()
	const { data: allCartItems = [] } = useGetCart()

	// Get selected item IDs from URL parameters
	const selectedItemIds = searchParams.get("selected")?.split(",") || []

	// Filter cart items based on selected IDs, or use all items if no selection
	const items =
		selectedItemIds.length > 0
			? allCartItems.filter((item) =>
					selectedItemIds.includes(String(item.sku_id))
			  )
			: allCartItems
	const [formData, setFormData] = useState({
		// Personal Information
		firstName: "",
		lastName: "",
		email: "",
		phone: "",

		// Billing Address
		billingAddress: "",
		billingCity: "",
		billingState: "",
		billingZip: "",
		billingCountry: "US",

		// Shipping Address
		shippingAddress: "",
		shippingCity: "",
		shippingState: "",
		shippingZip: "",
		shippingCountry: "US",

		// Order Information
		specialInstructions: "",

		// Payment Information
		cardNumber: "",
		expiryDate: "",
		cvv: "",
		cardName: "",
	})

	// Load Google Maps script
	useEffect(() => {
		const script = document.createElement("script")
		script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
		script.async = true
		script.defer = true
		document.head.appendChild(script)

		return () => {
			document.head.removeChild(script)
		}
	}, [])

	const subtotal = items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	)
	const shippingCost =
		shippingMethod === "expedited"
			? 9.99
			: shippingMethod === "overnight"
			? 19.99
			: 0
	const tax = subtotal * 0.08
	const total = subtotal + shippingCost + tax

	// Initialize Google Places Autocomplete
	const initializeAutocomplete = (
		inputId: string,
		addressType: "billing" | "shipping"
	) => {
		if (typeof window !== "undefined" && window.google) {
			const input = document.getElementById(inputId) as HTMLInputElement
			if (input) {
				const autocomplete = new window.google.maps.places.Autocomplete(input, {
					types: ["address"],
					// componentRestrictions: { country: "us" },
				})

				autocomplete.addListener("place_changed", () => {
					const place = autocomplete.getPlace()
					if (place.formatted_address) {
						const addressComponents = place.formatted_address.split(", ")
						const address = addressComponents[0] || ""
						const city = addressComponents[1] || ""
						const stateZip = addressComponents[2] || ""
						const state = stateZip.split(" ")[0] || ""
						const zip = stateZip.split(" ")[1] || ""

						setFormData((prev) => ({
							...prev,
							[`${addressType}Address`]: address,
							[`${addressType}City`]: city,
							[`${addressType}State`]: state,
							[`${addressType}Zip`]: zip,
						}))
					}
				})
			}
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		try {
			// const finalPaymentMethod =
			// 	paymentMethod === "BankTransfer" && bankTransferMethod
			// 		? `${paymentMethod}_${bankTransferMethod}`
			// 		: paymentMethod
			let finalPaymentMethod = ""
			if (paymentMethod === "BankTransfer") {
				if (bankTransferMethod === "VNPAY") {
					finalPaymentMethod = "vnpay_banktransfer"
				}
			}

			if (finalPaymentMethod === "") {
				throw new Error("Invalid payment method")
			}

			const res = await mutateCheckout({
				address: `${formData.firstName} ${formData.lastName}, ${formData.billingAddress}, ${formData.billingCity}, ${formData.billingState}, ${formData.billingZip}, ${formData.billingCountry}`,
				payment_gateway: finalPaymentMethod,
				sku_ids: items.map((item) => parseInt(item.sku_id)),
			})
			// Handle success (e.g., show a success message, redirect, etc.)
			toast.success("Order placed successfully!")

			router.push(res.url)
		} catch (error) {
			toast.error("Error placing order: " + (error as Error).message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="grid gap-8 lg:grid-cols-3">
			{/* Main Form */}
			<div className="lg:col-span-2 space-y-6">
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Personal Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<User className="h-5 w-5" />
								<span>Personal Information</span>
							</CardTitle>
							<CardDescription>Tell us a bit about yourself</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="firstName">First Name *</Label>
									<Input
										id="firstName"
										placeholder="John"
										value={formData.firstName}
										onChange={(e) =>
											setFormData({ ...formData, firstName: e.target.value })
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="lastName">Last Name *</Label>
									<Input
										id="lastName"
										placeholder="Doe"
										value={formData.lastName}
										onChange={(e) =>
											setFormData({ ...formData, lastName: e.target.value })
										}
										required
									/>
								</div>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="email">Email Address *</Label>
									<div className="relative">
										<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
										<Input
											id="email"
											type="email"
											placeholder="john@example.com"
											value={formData.email}
											onChange={(e) =>
												setFormData({ ...formData, email: e.target.value })
											}
											className="pl-10"
											required
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label htmlFor="phone">Phone Number *</Label>
									<div className="relative">
										<Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
										<Input
											id="phone"
											type="tel"
											placeholder="(555) 123-4567"
											value={formData.phone}
											onChange={(e) =>
												setFormData({ ...formData, phone: e.target.value })
											}
											className="pl-10"
											required
										/>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Billing Address */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Truck className="h-5 w-5" />
								<span>Shipping Address</span>
							</CardTitle>
							<CardDescription>
								Where should we deliver your order?
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="billingAddress">Street Address *</Label>
								<div className="relative">
									<MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="billingAddress"
										placeholder="Start typing your address..."
										value={formData.billingAddress}
										onChange={(e) =>
											setFormData({
												...formData,
												billingAddress: e.target.value,
											})
										}
										className="pl-10"
										onFocus={() =>
											initializeAutocomplete("billingAddress", "billing")
										}
										required
									/>
								</div>
								<p className="text-xs text-muted-foreground">
									💡 Start typing to see address suggestions
								</p>
							</div>

							<div className="grid gap-4 md:grid-cols-3">
								<div className="space-y-2">
									<Label htmlFor="billingCity">City *</Label>
									<Input
										id="billingCity"
										placeholder="New York"
										value={formData.billingCity}
										onChange={(e) =>
											setFormData({ ...formData, billingCity: e.target.value })
										}
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="billingState">State *</Label>
									<Input
										id="billingState"
										placeholder="NY"
										value={formData.billingState}
										onChange={(e) =>
											setFormData({ ...formData, billingState: e.target.value })
										}
										required
									/>
								</div>
								{/* <div className="space-y-2">
									<Label htmlFor="billingZip">ZIP Code *</Label>
									<Input
										id="billingZip"
										placeholder="10001"
										value={formData.billingZip}
										onChange={(e) =>
											setFormData({ ...formData, billingZip: e.target.value })
										}
										required
									/>
								</div> */}
							</div>
						</CardContent>
					</Card>

					{/* Shipping Method */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Truck className="h-5 w-5" />
								<span>Delivery Options</span>
							</CardTitle>
							<CardDescription>
								How fast do you need your order?
							</CardDescription>
						</CardHeader>
						<CardContent>
							<RadioGroup
								value={shippingMethod}
								onValueChange={setShippingMethod}
							>
								<div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
									<RadioGroupItem value="standard" id="standard" />
									<div className="flex-1">
										<Label
											htmlFor="standard"
											className="font-medium cursor-pointer"
										>
											🚚 Standard Delivery
										</Label>
										<p className="text-sm text-muted-foreground">
											5-7 business days • Free shipping
										</p>
									</div>
									<span className="font-medium text-green-600">FREE</span>
								</div>
								<div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
									<RadioGroupItem value="expedited" id="expedited" />
									<div className="flex-1">
										<Label
											htmlFor="expedited"
											className="font-medium cursor-pointer"
										>
											⚡ Fast Delivery
										</Label>
										<p className="text-sm text-muted-foreground">
											2-3 business days
										</p>
									</div>
									<span className="font-medium">$9.99</span>
								</div>
								<div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
									<RadioGroupItem value="overnight" id="overnight" />
									<div className="flex-1">
										<Label
											htmlFor="overnight"
											className="font-medium cursor-pointer"
										>
											🚀 Next Day Delivery
										</Label>
										<p className="text-sm text-muted-foreground">
											Next business day
										</p>
									</div>
									<span className="font-medium">$19.99</span>
								</div>
							</RadioGroup>
						</CardContent>
					</Card>

					{/* Special Instructions */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<FileText className="h-5 w-5" />
								<span>Special Instructions</span>
							</CardTitle>
							<CardDescription>
								Any special requests for your delivery?
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<Label htmlFor="specialInstructions">
									Delivery Notes (Optional)
								</Label>
								<Textarea
									id="specialInstructions"
									placeholder="e.g., Leave package at front door, call before delivery, etc."
									value={formData.specialInstructions}
									onChange={(e) =>
										setFormData({
											...formData,
											specialInstructions: e.target.value,
										})
									}
									rows={3}
								/>
							</div>
						</CardContent>
					</Card>

					{/* Payment Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<CreditCard className="h-5 w-5" />
								<span>Payment</span>
							</CardTitle>
							<CardDescription>Secure payment processing</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<RadioGroup
								value={paymentMethod}
								onValueChange={(value) => {
									setPaymentMethod(value)
									if (value !== "BankTransfer") {
										setBankTransferMethod("")
									}
								}}
							>
								<div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
									<RadioGroupItem value="COD" id="COD" />
									<Label htmlFor="COD" className="cursor-pointer">
										💰 Cash on Delivery (COD)
									</Label>
								</div>
								<div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
									<RadioGroupItem value="Card" id="Card" />
									<Label htmlFor="Card" className="cursor-pointer">
										💳 Credit/Debit Card
									</Label>
								</div>
								<div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
									<RadioGroupItem value="BankTransfer" id="BankTransfer" />
									<Label htmlFor="BankTransfer" className="cursor-pointer">
										🏦 Bank Transfer
									</Label>
								</div>
								<div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors opacity-50">
									<RadioGroupItem value="Crypto" id="Crypto" disabled />
									<Label htmlFor="Crypto" className="cursor-not-allowed">
										₿ Cryptocurrency (Coming Soon)
									</Label>
								</div>
							</RadioGroup>

							{paymentMethod === "COD" && (
								<div className="p-4 bg-green-50 rounded-lg">
									<p className="text-sm text-green-800">
										💰 Pay with cash when your order is delivered. No upfront
										payment required!
									</p>
								</div>
							)}

							{paymentMethod === "Card" && (
								<div className="space-y-4 pt-4">
									<div className="space-y-2">
										<Label htmlFor="cardName">Cardholder Name *</Label>
										<Input
											id="cardName"
											placeholder="John Doe"
											value={formData.cardName}
											onChange={(e) =>
												setFormData({ ...formData, cardName: e.target.value })
											}
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="cardNumber">Card Number *</Label>
										<Input
											id="cardNumber"
											placeholder="1234 5678 9012 3456"
											value={formData.cardNumber}
											onChange={(e) =>
												setFormData({ ...formData, cardNumber: e.target.value })
											}
											required
										/>
									</div>

									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label htmlFor="expiryDate">Expiry Date *</Label>
											<Input
												id="expiryDate"
												placeholder="MM/YY"
												value={formData.expiryDate}
												onChange={(e) =>
													setFormData({
														...formData,
														expiryDate: e.target.value,
													})
												}
												required
											/>
										</div>
										<div className="space-y-2">
											<Label htmlFor="cvv">CVV *</Label>
											<Input
												id="cvv"
												placeholder="123"
												value={formData.cvv}
												onChange={(e) =>
													setFormData({ ...formData, cvv: e.target.value })
												}
												required
											/>
										</div>
									</div>
								</div>
							)}

							{paymentMethod === "BankTransfer" && (
								<div className="space-y-4 pt-4">
									<div className="space-y-3">
										<Label className="text-base font-medium">
											Choose Payment Provider
										</Label>
										<RadioGroup
											value={bankTransferMethod}
											onValueChange={setBankTransferMethod}
											className="grid grid-cols-1 md:grid-cols-3 gap-3"
										>
											<div className="flex flex-col items-center space-y-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
												<RadioGroupItem
													value="VNPAY"
													id="VNPAY"
													className="self-start"
												/>
												<div className="flex flex-col items-center space-y-2 text-center">
													<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
														<span className="text-blue-600 font-bold text-xl">
															V
														</span>
													</div>
													<div>
														<Label
															htmlFor="VNPAY"
															className="cursor-pointer font-medium"
														>
															VNPAY
														</Label>
														<p className="text-xs text-muted-foreground">
															Secure online banking payment
														</p>
													</div>
												</div>
											</div>

											<div className="flex flex-col items-center space-y-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
												<RadioGroupItem
													value="MOMO"
													id="MOMO"
													className="self-start"
												/>
												<div className="flex flex-col items-center space-y-2 text-center">
													<div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
														<span className="text-pink-600 font-bold text-xl">
															M
														</span>
													</div>
													<div>
														<Label
															htmlFor="MOMO"
															className="cursor-pointer font-medium"
														>
															MOMO Wallet
														</Label>
														<p className="text-xs text-muted-foreground">
															Instant payment via MOMO app
														</p>
													</div>
												</div>
											</div>

											<div className="flex flex-col items-center space-y-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
												<RadioGroupItem
													value="ZALO"
													id="ZALO"
													className="self-start"
												/>
												<div className="flex flex-col items-center space-y-2 text-center">
													<div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
														<span className="text-blue-500 font-bold text-xl">
															Z
														</span>
													</div>
													<div>
														<Label
															htmlFor="ZALO"
															className="cursor-pointer font-medium"
														>
															ZALO Pay
														</Label>
														<p className="text-xs text-muted-foreground">
															Quick payment through ZALO
														</p>
													</div>
												</div>
											</div>
										</RadioGroup>
									</div>

									{bankTransferMethod && (
										<div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
											<div className="flex items-start space-x-3">
												<div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
													<span className="text-blue-600 text-sm">ℹ️</span>
												</div>
												<div className="space-y-2">
													<p className="text-sm text-blue-800 font-medium">
														{bankTransferMethod === "MOMO" &&
															"MOMO Wallet Payment"}
														{bankTransferMethod === "VNPAY" && "VNPAY Payment"}
														{bankTransferMethod === "ZALO" &&
															"ZALO Pay Payment"}
													</p>
													<p className="text-sm text-blue-700">
														You&apos;ll be redirected to the payment provider to
														complete your payment securely.
													</p>
													<div className="flex items-center space-x-2 text-xs text-blue-600">
														<span>🔒</span>
														<span>SSL Encrypted • Secure Payment</span>
													</div>
												</div>
											</div>
										</div>
									)}
								</div>
							)}

							{paymentMethod === "Crypto" && (
								<div className="p-4 bg-gray-50 rounded-lg">
									<p className="text-sm text-gray-700">
										₿ Cryptocurrency payments are not yet supported. Please
										choose another payment method.
									</p>
								</div>
							)}
						</CardContent>
					</Card>

					<Button
						type="submit"
						size="lg"
						className="w-full"
						disabled={
							isLoading ||
							(paymentMethod === "BankTransfer" && !bankTransferMethod)
						}
					>
						{isLoading
							? "Processing Order..."
							: paymentMethod === "BankTransfer" && !bankTransferMethod
							? "Please select a payment provider"
							: `Complete Order - $${total.toFixed(2)}`}
					</Button>
				</form>
			</div>

			{/* Order Summary */}
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<span>🛍️ Your Order</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{items.map((item) => (
							<div key={item.sku_id} className="flex space-x-3">
								<div className="relative h-16 w-16 overflow-hidden rounded-lg border">
									<img
										src={item.resource.url || "/placeholder.svg"}
										alt={item.name}
										className="h-full w-full object-cover"
									/>
								</div>
								<div className="flex-1 space-y-1">
									<h4 className="text-sm font-medium line-clamp-2">
										{item.name}
									</h4>
									<div className="text-sm text-muted-foreground">
										{item.sku_name}
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">
											Qty: {item.quantity}
										</span>
										<span className="font-medium">
											${(item.price * item.quantity).toFixed(2)}
										</span>
									</div>
								</div>
							</div>
						))}

						<Separator />

						<div className="space-y-3">
							<div className="flex justify-between text-sm">
								<span>Subtotal:</span>
								<span>${subtotal.toFixed(2)}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span>Shipping:</span>
								<span
									className={
										shippingCost === 0 ? "text-green-600 font-medium" : ""
									}
								>
									{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
								</span>
							</div>
							<div className="flex justify-between text-sm">
								<span>Tax:</span>
								<span>${tax.toFixed(2)}</span>
							</div>
							<Separator />
							<div className="flex justify-between text-lg font-bold">
								<span>Total:</span>
								<span>${total.toFixed(2)}</span>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<Clock className="h-5 w-5" />
							<span>Delivery Timeline</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-center space-y-3">
							<Badge variant="outline" className="text-lg px-4 py-2">
								{shippingMethod === "overnight"
									? "🚀 Tomorrow"
									: shippingMethod === "expedited"
									? "⚡ 2-3 Days"
									: "🚚 5-7 Days"}
							</Badge>
							<p className="text-sm text-muted-foreground">
								{shippingMethod === "overnight"
									? "Next business day delivery"
									: shippingMethod === "expedited"
									? "Fast delivery service"
									: "Standard delivery with free shipping"}
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<span>🔒 Security</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2 text-sm text-muted-foreground">
							<p>✅ SSL encrypted checkout</p>
							<p>✅ Secure payment processing</p>
							<p>✅ Your data is protected</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
