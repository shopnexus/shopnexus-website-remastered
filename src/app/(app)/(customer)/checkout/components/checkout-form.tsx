"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"

// Google Maps types
declare global {
	interface Window {
		google?: {
			maps: {
				places: {
					Autocomplete: new (
						input: HTMLInputElement,
						options: { types: string[] }
					) => {
						addListener: (event: string, callback: () => void) => void
						getPlace: () => { formatted_address?: string }
					}
				}
			}
		}
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
import { Separator } from "@/components/ui/separator"
import {
	Truck,
	CreditCard,
	FileText,
	User,
	MapPin,
	Mail,
	Phone,
	Wallet,
	Building2,
	Smartphone,
} from "lucide-react"
import { useCheckout, useQuote } from "@/core/order/order.customer"
import { toast } from "sonner"
import { useGetCart, useListCheckoutCart } from "@/core/order/cart"
import { useRouter, useSearchParams } from "next/navigation"
import { useCurrency } from "@/components/currency/currency-context"
import { useMemo } from "react"
import { useListServiceOption } from "@/core/common/option"
import { ServiceOptionSelector } from "./service-option-selector"
import { useListContacts, useCreateContact } from "@/core/account/contact"
import { useGetMe } from "@/core/account/account"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"

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
	const { formatCurrency } = useCurrency()
	const [isLoading, setIsLoading] = useState(false)
	const [selectedPaymentOptionId, setSelectedPaymentOptionId] =
		useState<string>("")
	const [shipmentOption, setShipmentOption] = useState("")
	const [quoteData, setQuoteData] = useState<{
		total: number
		product_cost: number
		ship_cost: number
	}>()
	const { mutateAsync: mutateCheckout } = useCheckout()
	const { mutateAsync: mutateQuote } = useQuote()

	// Get selected item IDs from URL parameters
	const selectedItemIds = searchParams.get("selected")?.split(",") || []

	// Get buy_now parameter from URL
	const buyNow = searchParams.get("buy_now") === "true"

	// Get sku_id and quantity for buy_now flow
	const buyNowSkuId = searchParams.get("sku_id")
	const buyNowQuantity = searchParams.get("quantity")

	const { data: allCartItems = [] } = useListCheckoutCart({
		buy_now_quantity: buyNow ? Number(buyNowQuantity) : undefined,
		buy_now_sku_id: buyNow ? buyNowSkuId : undefined,
		sku_ids:
			!buyNow && selectedItemIds.length > 0 ? selectedItemIds : undefined,
	})

	const { data: paymentOptions = [], isLoading: isLoadingPayment } =
		useListServiceOption({
			category: "payment",
		})
	const { data: shipmentOptions = [], isLoading: isLoadingShipment } =
		useListServiceOption({
			category: "shipment",
		})
	const { data: userAccount } = useGetMe()
	const { data: contacts = [] } = useListContacts()
	const createContact = useCreateContact()
	const [selectedContactId, setSelectedContactId] = useState<string>(
		userAccount?.default_contact_id?.toString() ?? "contact-select"
	)
	const [isCreateContactOpen, setIsCreateContactOpen] = useState(false)
	const [newContactForm, setNewContactForm] = useState<{
		full_name: string
		phone: string
		address: string
		address_type?: "Home" | "Work"
		phone_verified?: boolean
	}>({
		full_name: "",
		phone: "",
		address: "",
		address_type: "Home",
	})

	// Check if user is logged in
	const isLoggedIn = !!userAccount

	// Provider icon map
	const providerIconMap: Record<
		string,
		React.ComponentType<{ className?: string }>
	> = {
		VNPAY: Building2,
		MOMO: Smartphone,
		ZALO: Smartphone,
		COD: Wallet,
		DEFAULT: CreditCard,
	}

	// Filter cart items based on selected IDs, or use all items if no selection
	const items =
		selectedItemIds.length > 0
			? allCartItems.filter((item) =>
				selectedItemIds.includes(String(item.sku.id))
			)
			: allCartItems

	const [formData, setFormData] = useState({
		// Personal Information
		fullName: "",
		email: "",
		phone: "",

		// Shipping Address
		address: "",

		// Order Information
		specialInstructions: "",
	})

	// Get current address (from selected contact or manual input)
	const fullAddress = useMemo(() => {
		if (selectedContactId && selectedContactId !== "new") {
			const selectedContact = contacts.find(
				(c) => String(c.id) === selectedContactId
			)
			return selectedContact?.address || formData.address
		}
		return formData.address
	}, [selectedContactId, contacts, formData.address])

	// Handle contact selection
	const handleContactSelect = (contactId: string) => {
		setSelectedContactId(contactId)
		if (contactId === "new") {
			setIsCreateContactOpen(true)
		} else if (contactId && contactId !== "new") {
			const selectedContact = contacts.find((c) => String(c.id) === contactId)
			if (selectedContact) {
				setFormData({
					...formData,
					fullName: selectedContact.full_name,
					phone: selectedContact.phone,
					address: selectedContact.address,
				})
			}
		}
	}

	// Handle creating new contact
	const handleCreateContact = async () => {
		try {
			const newContact = await createContact.mutateAsync(newContactForm)
			setSelectedContactId(String(newContact.id))
			setFormData({
				...formData,
				fullName: newContact.full_name,
				phone: newContact.phone,
				address: newContact.address,
			})
			setIsCreateContactOpen(false)
			setNewContactForm({
				full_name: "",
				phone: "",
				address: "",
				address_type: "Home",
			})
		} catch (error) {
			console.error("Failed to create contact:", error)
		}
	}

	// Fetch quote when address or items change
	useEffect(() => {
		if (!fullAddress || items.length === 0 || !shipmentOption) return

		const fetchQuote = async () => {
			try {
				const quote = await mutateQuote({
					address: fullAddress,
					items: items.map((item) => ({
						sku_id: item.sku.id,
						quantity: item.quantity,
						promotion_ids: [],
						shipment_option: shipmentOption,
					})),
				})
				setQuoteData(quote)
			} catch (error) {
				console.error("Failed to fetch quote:", error)
			}
		}

		const timeoutId = setTimeout(fetchQuote, 500) // Debounce
		return () => clearTimeout(timeoutId)
	}, [fullAddress, shipmentOption, mutateQuote])

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

	const subtotal =
		quoteData?.product_cost ??
		items.reduce((sum, item) => sum + item.sku.price * item.quantity, 0)
	const shippingCost = quoteData?.ship_cost ?? 0
	const total = buyNow
		? allCartItems.reduce((sum, item) => sum + item.sku.price * item.quantity, 0)
		: subtotal + shippingCost


	// Initialize Google Places Autocomplete
	const initializeAutocomplete = (inputId: string) => {
		if (typeof window !== "undefined" && window.google) {
			const input = document.getElementById(inputId) as HTMLInputElement
			if (input) {
				const autocomplete = new window.google.maps.places.Autocomplete(input, {
					types: ["address"],
				})

				autocomplete.addListener("place_changed", () => {
					const place = autocomplete.getPlace()
					if (place.formatted_address) {
						setFormData((prev) => ({
							...prev,
							address: place.formatted_address || "",
						}))
					}
				})
			}
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!shipmentOption) {
			toast.error("Please select a shipping method")
			return
		}
		if (!fullAddress) {
			toast.error("Please enter a complete shipping address")
			return
		}
		if (!selectedPaymentOptionId) {
			toast.error("Please select a payment method")
			return
		}

		setIsLoading(true)
		try {
			const res = await mutateCheckout({
				address: fullAddress,
				payment_option: selectedPaymentOptionId,
				buy_now: buyNow,
				items: items.map((item) => ({
					sku_id: item.sku.id,
					quantity: item.quantity,
					promotion_ids: [],
					shipment_option: shipmentOption,
					note: formData.specialInstructions || undefined,
					data: {},
				})),

			})

			toast.success("Order placed successfully!")

			if (res.url) {
				router.push(res.url)
			} else {
				router.push("/orders")
			}
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
							<CardDescription>
								{isLoggedIn
									? "Select your delivery address"
									: "Tell us a bit about yourself"}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{isLoggedIn ? (
								// Logged in: Show contact dropdown
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="contact-select">Select Address</Label>
										<Select
											defaultValue={
												String(userAccount.default_contact_id) ??
												"contact-select"
											}
											onValueChange={handleContactSelect}
										>
											<SelectTrigger
												id="contact-select"
												className="w-full justify-center min-h-[40px]"
											>
												<SelectValue placeholder="Choose from saved addresses or create new" />
											</SelectTrigger>
											<SelectContent>
												{contacts.map((contact) => (
													<SelectItem
														key={contact.id}
														value={String(contact.id)}
													>
														<div className="flex flex-col">
															<span className="font-medium">
																{contact.full_name}
															</span>
															<span className="text-xs text-muted-foreground">
																{contact.address}
															</span>
														</div>
													</SelectItem>
												))}
												<SelectItem value="new">
													+ Create New Address
												</SelectItem>
											</SelectContent>
										</Select>
									</div>

									{/* Create New Contact Dialog */}
									<Dialog
										open={isCreateContactOpen}
										onOpenChange={(open) => {
											setIsCreateContactOpen(open)
											if (!open && selectedContactId === "new") {
												setSelectedContactId("")
											}
										}}
									>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Add New Address</DialogTitle>
												<DialogDescription>
													Add a new delivery address for your order
												</DialogDescription>
											</DialogHeader>
											<div className="space-y-4 py-4">
												<div className="space-y-2">
													<Label htmlFor="new-contact-full_name">
														Full Name
													</Label>
													<Input
														id="new-contact-full_name"
														value={newContactForm.full_name}
														onChange={(e) =>
															setNewContactForm({
																...newContactForm,
																full_name: e.target.value,
															})
														}
														placeholder="Enter full name"
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="new-contact-phone">
														Phone Number
													</Label>
													<Input
														id="new-contact-phone"
														value={newContactForm.phone}
														onChange={(e) =>
															setNewContactForm({
																...newContactForm,
																phone: e.target.value,
															})
														}
														placeholder="Enter phone number"
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="new-contact-address">Address</Label>
													<Textarea
														id="new-contact-address"
														value={newContactForm.address}
														onChange={(e) =>
															setNewContactForm({
																...newContactForm,
																address: e.target.value,
															})
														}
														placeholder="Enter full address"
														rows={3}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="new-contact-address_type">
														Address Type
													</Label>
													<Select
														value={newContactForm.address_type}
														onValueChange={(value: "Home" | "Work") =>
															setNewContactForm({
																...newContactForm,
																address_type: value,
															})
														}
													>
														<SelectTrigger>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="Home">Home</SelectItem>
															<SelectItem value="Work">Work</SelectItem>
														</SelectContent>
													</Select>
												</div>
											</div>
											<DialogFooter>
												<Button
													variant="outline"
													onClick={() => setIsCreateContactOpen(false)}
												>
													Cancel
												</Button>
												<Button
													onClick={handleCreateContact}
													disabled={createContact.isPending}
												>
													{createContact.isPending
														? "Adding..."
														: "Add Address"}
												</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</div>
							) : (
								// Not logged in: Show full form
								<>
									<div className="space-y-2">
										<Label htmlFor="fullName">Full Name *</Label>
										<Input
											id="fullName"
											placeholder="John Doe"
											value={formData.fullName}
											onChange={(e) =>
												setFormData({ ...formData, fullName: e.target.value })
											}
											required
										/>
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

									<div className="space-y-2">
										<Label htmlFor="address">Address *</Label>
										<div className="relative">
											<MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
											<Input
												id="address"
												placeholder="Enter your full address..."
												value={formData.address}
												onChange={(e) =>
													setFormData({
														...formData,
														address: e.target.value,
													})
												}
												className="pl-10"
												onFocus={() => initializeAutocomplete("address")}
												required
											/>
										</div>
										<p className="text-xs text-muted-foreground">
											💡 Start typing to see address suggestions
										</p>
									</div>
								</>
							)}
						</CardContent>
					</Card>

					{/* Shipping Method */}
					<ServiceOptionSelector
						title="Delivery Options"
						description="Select your preferred shipping method"
						icon={Truck}
						options={shipmentOptions}
						selectedOptionId={shipmentOption}
						onChange={setShipmentOption}
						providerIconMap={providerIconMap}
						groupByProvider={true}
						loading={isLoadingShipment}
						additionalInfo={() =>
							quoteData ? (
								<p className="text-sm text-blue-700 font-medium">
									Shipping cost: {formatCurrency(quoteData.ship_cost)}
								</p>
							) : null
						}
					/>

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
					<ServiceOptionSelector
						title="Payment"
						description="Secure payment processing"
						icon={CreditCard}
						options={paymentOptions}
						selectedOptionId={selectedPaymentOptionId}
						onChange={setSelectedPaymentOptionId}
						providerIconMap={providerIconMap}
						groupByProvider={true}
						loading={isLoadingPayment}
					// additionalInfo={() => (
					// 	<div className="flex items-center space-x-2 text-xs text-blue-600 mt-2">
					// 		<span>🔒</span>
					// 		<span>SSL Encrypted • Secure Payment</span>
					// 	</div>
					// )}
					/>

					<Button
						type="submit"
						size="lg"
						className="w-full"
						disabled={isLoading || !shipmentOption || !selectedPaymentOptionId}
					>
						{isLoading
							? "Processing Order..."
							: !shipmentOption
								? "Please select a shipping method"
								: !selectedPaymentOptionId
									? "Please select a payment method"
									: `Complete Order - ${formatCurrency(total)}`}
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
						{items.map((item) => {
							const itemTotal = item.sku.price * item.quantity

							// Calculate name from attributes
							const name = item.sku.attributes.map((a) => a.value).join(" - ")

							return (
								<div key={item.sku.id} className="flex space-x-3">
									<div className="relative h-16 w-16 overflow-hidden rounded-lg border">
										<Image
											width={64}
											height={64}
											src={item.resource?.url || "/placeholder.svg"}
											alt={name}
											className="h-full w-full object-cover"
										/>
									</div>
									<div className="flex-1 space-y-1">
										<h4 className="text-sm font-medium line-clamp-2">
											{name}
										</h4>
										<span className="text-muted-foreground text-sm">
											Qty: {item.quantity}
										</span>
										<div className="flex flex-col gap-1">
											<div className="flex justify-between items-center text-sm ">
												<div className="flex items-center gap-2">
													<span className="font-medium">
														{formatCurrency(itemTotal)}
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							)
						})}

						<Separator />

						<div className="space-y-3">
							<div className="flex justify-between text-sm">
								<span>Subtotal:</span>
								<span>{formatCurrency(subtotal)}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span>Shipping:</span>
								<span
									className={
										shippingCost === 0 ? "text-green-600 font-medium" : ""
									}
								>
									{shippingCost === 0 ? "FREE" : formatCurrency(shippingCost)}
								</span>
							</div>
							{!quoteData && (
								<p className="text-xs text-muted-foreground">
									Shipping will be calculated after you enter an address and
									select a shipping method
								</p>
							)}
							<Separator />
							<div className="flex justify-between text-lg font-bold">
								<span>Total:</span>
								<span>{formatCurrency(total)}</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* <Card>
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
				</Card> */}
			</div>
		</div>
	)
}
