"use client"

import { useState, useEffect } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
	DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { uploadFile } from "@/components/shared/file-upload"
import { Upload, X } from "lucide-react"
import {
	User,
	Settings,
	MapPin,
	Plus,
	Edit,
	Trash2,
	Phone,
	Star,
} from "lucide-react"
import { useGetMe, useUpdateMe } from "@/core/account/account"
import {
	useListContacts,
	useCreateContact,
	useUpdateContact,
	useDeleteContact,
	type Contact,
} from "@/core/account/contact"

function ContactsTab() {
	const { data: profileData } = useGetMe()
	const updateMe = useUpdateMe()
	const { data: contacts, isLoading } = useListContacts()
	const createContact = useCreateContact()
	const updateContact = useUpdateContact()
	const deleteContact = useDeleteContact()

	const [isCreateOpen, setIsCreateOpen] = useState(false)
	const [isEditOpen, setIsEditOpen] = useState(false)
	const [editingContact, setEditingContact] = useState<Contact | null>(null)
	const [isDeleteOpen, setIsDeleteOpen] = useState(false)
	const [contactToDelete, setContactToDelete] = useState<Contact | null>(null)

	const [contactForm, setContactForm] = useState<{
		full_name: string
		phone: string
		address: string
		address_type?: 'Home' | 'Work'
		phone_verified?: boolean
	}>({
		full_name: "",
		phone: "",
		address: "",
		address_type: "Home",
		phone_verified: false,
	})

	const handleCreate = async () => {
		try {
			await createContact.mutateAsync(contactForm)
			setIsCreateOpen(false)
			setContactForm({
				full_name: "",
				phone: "",
				address: "",
				address_type: "Home",
				phone_verified: false,
			})
		} catch (error) {
			console.error("Failed to create contact:", error)
		}
	}

	const handleEdit = (contact: Contact) => {
		setEditingContact(contact)
		setContactForm({
			full_name: contact.full_name,
			phone: contact.phone,
			address: contact.address,
			address_type: contact.address_type,
			phone_verified: contact.phone_verified,
		})
		setIsEditOpen(true)
	}

	const handleUpdate = async () => {
		if (!editingContact) return
		try {
			await updateContact.mutateAsync({
				contact_id: editingContact.id,
				...contactForm,
			})
			setEditingContact(null)
			setIsEditOpen(false)
			setContactForm({
				full_name: "",
				phone: "",
				address: "",
				address_type: "Home",
				phone_verified: false,
			})
		} catch (error) {
			console.error("Failed to update contact:", error)
		}
	}

	const handleDelete = async () => {
		if (!contactToDelete) return
		try {
			await deleteContact.mutateAsync({ contact_id: contactToDelete.id })
			setIsDeleteOpen(false)
			setContactToDelete(null)
		} catch (error) {
			console.error("Failed to delete contact:", error)
		}
	}

	const handleSetDefault = async (contactId: number) => {
		try {
			await updateMe.mutateAsync({ default_contact_id: contactId })
		} catch (error) {
			console.error("Failed to set default contact:", error)
		}
	}

	if (isLoading) {
		return (
			<Card>
				<CardContent className="py-8">
					<div className="text-center text-muted-foreground">
						Loading contacts...
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="space-y-6">
			<Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Address</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this address? This action cannot
							be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={deleteContact.isPending}
						>
							{deleteContact.isPending ? "Deleting..." : "Delete"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Delivery Addresses</CardTitle>
							<CardDescription>
								Manage your delivery addresses for orders
							</CardDescription>
						</div>
						<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
							<DialogTrigger asChild>
								<Button>
									<Plus className="h-4 w-4 mr-2" />
									Add Address
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Add New Address</DialogTitle>
									<DialogDescription>
										Add a new delivery address for your orders
									</DialogDescription>
								</DialogHeader>
								<div className="space-y-4 py-4">
									<div className="space-y-2">
										<Label htmlFor="create-full_name">Full Name</Label>
										<Input
											id="create-full_name"
											value={contactForm.full_name}
											onChange={(e) =>
												setContactForm({
													...contactForm,
													full_name: e.target.value,
												})
											}
											placeholder="Enter full name"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="create-phone">Phone Number</Label>
										<Input
											id="create-phone"
											value={contactForm.phone}
											onChange={(e) =>
												setContactForm({
													...contactForm,
													phone: e.target.value,
												})
											}
											placeholder="Enter phone number"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="create-address">Address</Label>
										<Textarea
											id="create-address"
											value={contactForm.address}
											onChange={(e) =>
												setContactForm({
													...contactForm,
													address: e.target.value,
												})
											}
											placeholder="Enter full address"
											rows={3}
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="create-address_type">Address Type</Label>
										<Select
											value={contactForm.address_type}
											onValueChange={(value: "Home" | "Work") =>
												setContactForm({ ...contactForm, address_type: value })
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
										onClick={() => setIsCreateOpen(false)}
									>
										Cancel
									</Button>
									<Button
										onClick={handleCreate}
										disabled={createContact.isPending}
									>
										{createContact.isPending ? "Adding..." : "Add Address"}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</CardHeader>
				<CardContent>
					{contacts && contacts.length > 0 ? (
						<div className="space-y-4">
							{contacts.map((contact) => {
								const isDefault = contact.id === profileData?.default_contact_id
								return (
									<Card
										key={contact.id}
										className={isDefault ? "border-2 border-primary" : ""}
									>
										<CardContent className="pt-6">
											<div className="flex items-start justify-between">
												<div className="flex-1 space-y-2">
													<div className="flex items-center space-x-2">
														<h3 className="font-semibold">
															{contact.full_name}
														</h3>
														{isDefault && (
															<Badge variant="default">Default</Badge>
														)}
														<Badge variant="outline">
															{contact.address_type}
														</Badge>
														{contact.phone_verified && (
															<Badge
																variant="outline"
																className="text-green-600"
															>
																Verified
															</Badge>
														)}
													</div>
													<div className="flex items-center space-x-2 text-muted-foreground">
														<Phone className="h-4 w-4" />
														<span>{contact.phone}</span>
													</div>
													<div className="flex items-start space-x-2 text-muted-foreground">
														<MapPin className="h-4 w-4 mt-1" />
														<span>{contact.address}</span>
													</div>
												</div>
												<div className="flex items-center space-x-2">
													{!isDefault && (
														<Button
															variant="outline"
															size="sm"
															onClick={() => handleSetDefault(contact.id)}
															disabled={updateMe.isPending}
															title="Set as default address"
														>
															<Star className="h-4 w-4" />
														</Button>
													)}
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleEdit(contact)}
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Dialog
														open={isEditOpen}
														onOpenChange={setIsEditOpen}
													>
														<DialogContent>
															<DialogHeader>
																<DialogTitle>Edit Address</DialogTitle>
																<DialogDescription>
																	Update the delivery address information
																</DialogDescription>
															</DialogHeader>
															<div className="space-y-4 py-4">
																<div className="space-y-2">
																	<Label htmlFor="edit-full_name">
																		Full Name
																	</Label>
																	<Input
																		id="edit-full_name"
																		value={contactForm.full_name}
																		onChange={(e) =>
																			setContactForm({
																				...contactForm,
																				full_name: e.target.value,
																			})
																		}
																	/>
																</div>
																<div className="space-y-2">
																	<Label htmlFor="edit-phone">
																		Phone Number
																	</Label>
																	<Input
																		id="edit-phone"
																		value={contactForm.phone}
																		onChange={(e) =>
																			setContactForm({
																				...contactForm,
																				phone: e.target.value,
																			})
																		}
																	/>
																</div>
																<div className="space-y-2">
																	<Label htmlFor="edit-address">Address</Label>
																	<Textarea
																		id="edit-address"
																		value={contactForm.address}
																		onChange={(e) =>
																			setContactForm({
																				...contactForm,
																				address: e.target.value,
																			})
																		}
																		rows={3}
																	/>
																</div>
																<div className="space-y-2">
																	<Label htmlFor="edit-address_type">
																		Address Type
																	</Label>
																	<Select
																		value={contactForm.address_type}
																		onValueChange={(value: "Home" | "Work") =>
																			setContactForm({
																				...contactForm,
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
																	onClick={() => {
																		setIsEditOpen(false)
																		setEditingContact(null)
																	}}
																>
																	Cancel
																</Button>
																<Button
																	onClick={handleUpdate}
																	disabled={updateContact.isPending}
																>
																	{updateContact.isPending
																		? "Updating..."
																		: "Update"}
																</Button>
															</DialogFooter>
														</DialogContent>
													</Dialog>
													<Button
														variant="outline"
														size="sm"
														onClick={() => {
															setContactToDelete(contact)
															setIsDeleteOpen(true)
														}}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</div>
										</CardContent>
									</Card>
								)
							})}
						</div>
					) : (
						<div className="text-center py-8">
							<MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
							<h3 className="text-lg font-semibold mb-2">No Addresses</h3>
							<p className="text-muted-foreground mb-4">
								Add a delivery address to get started
							</p>
							<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
								<DialogTrigger asChild>
									<Button>
										<Plus className="h-4 w-4 mr-2" />
										Add Address
									</Button>
								</DialogTrigger>
							</Dialog>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}

export function UserProfile() {
	const { data: profileData, isLoading: isLoadingProfile } = useGetMe()
	const updateMe = useUpdateMe()
	const [isSaving, setIsSaving] = useState(false)
	const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
	const [formData, setFormData] = useState({
		username: "",
		phone: "",
		email: "",
		gender: "",
		name: "",
		date_of_birth: "",
		description: "",
		avatar_rs_id: null as string | null,
	})

	// Initialize form data when profile loads
	useEffect(() => {
		if (profileData) {
			setFormData({
				username: profileData.username || "",
				phone: profileData.phone || "",
				email: profileData.email || "",
				gender: profileData.gender || "",
				name: profileData.name || "",
				date_of_birth: profileData.date_of_birth || "",
				description: profileData.description || "",
				avatar_rs_id: null,
			})
			setAvatarPreview(profileData.avatar_url || null)
		}
	}, [profileData])

	const handleAvatarUpload = async (file: File) => {
		setIsUploadingAvatar(true)
		try {
			const uploadedResource = await uploadFile(file)

			// Update preview immediately
			setAvatarPreview(uploadedResource.url)

			// Update profile with new avatar_rs_id
			await updateMe.mutateAsync({ avatar_rs_id: uploadedResource.id })
		} catch (error) {
			console.error("Failed to upload avatar:", error)
			setAvatarPreview(profileData?.avatar_url || null)
		} finally {
			setIsUploadingAvatar(false)
		}
	}

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (!files || files.length === 0) return

		const file = files[0]
		if (file.type.startsWith("image/")) {
			await handleAvatarUpload(file)
		}
	}

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
	}

	const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()

		const files = e.dataTransfer.files
		if (!files || files.length === 0) return

		const file = files[0]
		if (file.type.startsWith("image/")) {
			await handleAvatarUpload(file)
		}
	}

	const handleSave = async () => {
		setIsSaving(true)
		try {
			await updateMe.mutateAsync(formData)
		} catch (error) {
			console.error("Failed to update profile:", error)
		} finally {
			setIsSaving(false)
		}
	}

	const getInitials = () => {
		if (profileData?.name) {
			const parts = profileData.name.split(" ")
			if (parts.length >= 2) {
				return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
			}
			return profileData.name.substring(0, 2).toUpperCase()
		}
		if (profileData?.username) {
			return profileData.username.substring(0, 2).toUpperCase()
		}
		return "U"
	}

	if (isLoadingProfile) {
		return (
			<div className="space-y-6">
				<Card>
					<CardContent className="py-8">
						<div className="text-center text-muted-foreground">
							Loading profile...
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	if (!profileData) {
		return (
			<div className="space-y-6">
				<Card>
					<CardContent className="py-8">
						<div className="text-center text-muted-foreground">
							No profile data available
						</div>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			{/* Profile Header */}
			<Card>
				<CardHeader>
					<div className="flex items-center space-x-4">
						<div className="relative group">
							<div
								className={`relative ${isUploadingAvatar ? "opacity-50" : ""}`}
								onDragOver={handleDragOver}
								onDrop={handleDrop}
								onClick={() => {
									const input = document.getElementById(
										"avatar-upload"
									) as HTMLInputElement
									input?.click()
								}}
							>
								<Avatar className="h-20 w-20 cursor-pointer hover:opacity-80 transition-opacity">
									<AvatarImage src={avatarPreview || undefined} />
									<AvatarFallback className="text-lg">
										{getInitials()}
									</AvatarFallback>
								</Avatar>
								<div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
									<Upload className="h-5 w-5 text-white" />
								</div>
							</div>
							<input
								id="avatar-upload"
								type="file"
								accept="image/*"
								onChange={handleFileSelect}
								className="hidden"
							/>
							{isUploadingAvatar && (
								<div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
									<p className="text-xs text-white">Uploading...</p>
								</div>
							)}
						</div>
						<div className="space-y-2">
							<div>
								<h2 className="text-2xl font-bold">
									{profileData.name || profileData.username || "User"}
								</h2>
								<p className="text-muted-foreground">
									{profileData.email || profileData.phone || "No contact info"}
								</p>
							</div>
							<div className="flex items-center space-x-2">
								<Badge variant="secondary">{profileData.type}</Badge>
								<Badge
									variant={
										profileData.status === "Active" ? "default" : "outline"
									}
								>
									{profileData.status}
								</Badge>
								{profileData.email_verified && (
									<Badge variant="outline">Email Verified</Badge>
								)}
								{profileData.phone_verified && (
									<Badge variant="outline">Phone Verified</Badge>
								)}
							</div>
							<p className="text-xs text-muted-foreground">
								Drag an image here or click avatar to upload
							</p>
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* Profile Tabs */}
			<Tabs defaultValue="personal" className="space-y-6">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="personal" className="flex items-center space-x-2">
						<User className="h-4 w-4" />
						<span>Personal</span>
					</TabsTrigger>
					<TabsTrigger value="contacts" className="flex items-center space-x-2">
						<MapPin className="h-4 w-4" />
						<span>Contacts</span>
					</TabsTrigger>
					<TabsTrigger value="settings" className="flex items-center space-x-2">
						<Settings className="h-4 w-4" />
						<span>Settings</span>
					</TabsTrigger>
				</TabsList>

				<TabsContent value="personal">
					<Card>
						<CardHeader>
							<CardTitle>Personal Information</CardTitle>
							<CardDescription>
								Update your personal details and contact information
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">Full Name</Label>
								<Input
									id="name"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									placeholder="Enter your full name"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="username">Username</Label>
								<Input
									id="username"
									value={formData.username}
									onChange={(e) =>
										setFormData({ ...formData, username: e.target.value })
									}
									placeholder="Enter your username"
								/>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="email">Email Address</Label>
									<Input
										id="email"
										type="email"
										value={formData.email}
										onChange={(e) =>
											setFormData({ ...formData, email: e.target.value })
										}
										placeholder="Enter your email"
									/>
									{profileData.email_verified && (
										<p className="text-xs text-green-600">Email verified</p>
									)}
								</div>
								<div className="space-y-2">
									<Label htmlFor="phone">Phone Number</Label>
									<Input
										id="phone"
										value={formData.phone}
										onChange={(e) =>
											setFormData({ ...formData, phone: e.target.value })
										}
										placeholder="Enter your phone number"
									/>
									{profileData.phone_verified && (
										<p className="text-xs text-green-600">Phone verified</p>
									)}
								</div>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="gender">Gender</Label>
									<Select
										value={formData.gender}
										onValueChange={(value) =>
											setFormData({ ...formData, gender: value })
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select gender" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Male">Male</SelectItem>
											<SelectItem value="Female">Female</SelectItem>
											<SelectItem value="Other">Other</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="date_of_birth">Date of Birth</Label>
									<Input
										id="date_of_birth"
										type="date"
										value={formData.date_of_birth}
										onChange={(e) =>
											setFormData({
												...formData,
												date_of_birth: e.target.value,
											})
										}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="description">Description</Label>
								<Textarea
									id="description"
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									placeholder="Tell us about yourself"
									rows={4}
								/>
							</div>

							<div className="flex justify-end">
								<Button onClick={handleSave} disabled={isSaving}>
									{isSaving ? "Saving..." : "Save Changes"}
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="contacts">
					<ContactsTab />
				</TabsContent>

				<TabsContent value="settings">
					<Card>
						<CardHeader>
							<CardTitle>Account Settings</CardTitle>
							<CardDescription>
								Manage your account preferences and security settings
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div>
										<h4 className="font-medium">Email Notifications</h4>
										<p className="text-sm text-muted-foreground">
											Receive updates about your orders and account
										</p>
									</div>
									<Button variant="outline" size="sm">
										Configure
									</Button>
								</div>

								<div className="flex items-center justify-between">
									<div>
										<h4 className="font-medium">Two-Factor Authentication</h4>
										<p className="text-sm text-muted-foreground">
											Add an extra layer of security to your account
										</p>
									</div>
									<Button variant="outline" size="sm">
										Enable
									</Button>
								</div>

								<div className="flex items-center justify-between">
									<div>
										<h4 className="font-medium">Change Password</h4>
										<p className="text-sm text-muted-foreground">
											Update your account password
										</p>
									</div>
									<Button variant="outline" size="sm">
										Change
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
