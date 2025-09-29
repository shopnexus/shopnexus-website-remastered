"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Building, CreditCard, Settings, Upload } from "lucide-react"

export function UserProfile() {
	const [isLoading, setIsLoading] = useState(false)
	const [profileData, setProfileData] = useState({
		firstName: "John",
		lastName: "Doe",
		email: "john@acmecorp.com",
		phoneNumber: "+1 (555) 123-4567",
		companyName: "Acme Corporation",
		companySize: "51-200",
		industry: "technology",
		jobTitle: "Procurement Manager",
		department: "Operations",
	})

	const handleSave = async () => {
		setIsLoading(true)
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000))
		setIsLoading(false)
		console.log("Profile updated:", profileData)
	}

	return (
		<div className="space-y-6">
			{/* Profile Header */}
			<Card>
				<CardHeader>
					<div className="flex items-center space-x-4">
						<Avatar className="h-20 w-20">
							<AvatarImage src="/placeholder-avatar.jpg" />
							<AvatarFallback className="text-lg">
								{profileData.firstName[0]}
								{profileData.lastName[0]}
							</AvatarFallback>
						</Avatar>
						<div className="space-y-2">
							<div>
								<h2 className="text-2xl font-bold">
									{profileData.firstName} {profileData.lastName}
								</h2>
								<p className="text-muted-foreground">{profileData.email}</p>
							</div>
							<div className="flex items-center space-x-2">
								<Badge variant="secondary">{profileData.companyName}</Badge>
								<Badge variant="outline">Verified Business</Badge>
							</div>
						</div>
						<div className="ml-auto">
							<Button variant="outline" size="sm">
								<Upload className="h-4 w-4 mr-2" />
								Change Photo
							</Button>
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* Profile Tabs */}
			<Tabs defaultValue="personal" className="space-y-6">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="personal" className="flex items-center space-x-2">
						<User className="h-4 w-4" />
						<span>Personal</span>
					</TabsTrigger>
					{/* <TabsTrigger value="company" className="flex items-center space-x-2">
						<Building className="h-4 w-4" />
						<span>Company</span>
					</TabsTrigger> */}
					{/* <TabsTrigger value="billing" className="flex items-center space-x-2">
						<CreditCard className="h-4 w-4" />
						<span>Billing</span>
					</TabsTrigger> */}
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
							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="firstName">First Name</Label>
									<Input
										id="firstName"
										value={profileData.firstName}
										onChange={(e) =>
											setProfileData({
												...profileData,
												firstName: e.target.value,
											})
										}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="lastName">Last Name</Label>
									<Input
										id="lastName"
										value={profileData.lastName}
										onChange={(e) =>
											setProfileData({
												...profileData,
												lastName: e.target.value,
											})
										}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email Address</Label>
								<Input
									id="email"
									type="email"
									value={profileData.email}
									onChange={(e) =>
										setProfileData({ ...profileData, email: e.target.value })
									}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="phoneNumber">Phone Number</Label>
								<Input
									id="phoneNumber"
									value={profileData.phoneNumber}
									onChange={(e) =>
										setProfileData({
											...profileData,
											phoneNumber: e.target.value,
										})
									}
								/>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="jobTitle">Job Title</Label>
									<Input
										id="jobTitle"
										placeholder="e.g., Procurement Manager"
										value={profileData.jobTitle}
										onChange={(e) =>
											setProfileData({
												...profileData,
												jobTitle: e.target.value,
											})
										}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="department">Department</Label>
									<Input
										id="department"
										placeholder="e.g., Operations"
										value={profileData.department}
										onChange={(e) =>
											setProfileData({
												...profileData,
												department: e.target.value,
											})
										}
									/>
								</div>
							</div>

							<div className="flex justify-end">
								<Button onClick={handleSave} disabled={isLoading}>
									{isLoading ? "Saving..." : "Save Changes"}
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="company">
					<Card>
						<CardHeader>
							<CardTitle>Company Information</CardTitle>
							<CardDescription>
								Manage your company details and business information
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="companyName">Company Name</Label>
								<Input
									id="companyName"
									value={profileData.companyName}
									onChange={(e) =>
										setProfileData({
											...profileData,
											companyName: e.target.value,
										})
									}
								/>
							</div>

							<div className="grid gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor="companySize">Company Size</Label>
									<Select
										value={profileData.companySize}
										onValueChange={(value) =>
											setProfileData({ ...profileData, companySize: value })
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="1-10">1-10 employees</SelectItem>
											<SelectItem value="11-50">11-50 employees</SelectItem>
											<SelectItem value="51-200">51-200 employees</SelectItem>
											<SelectItem value="201-1000">
												201-1000 employees
											</SelectItem>
											<SelectItem value="1000+">1000+ employees</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="industry">Industry</Label>
									<Select
										value={profileData.industry}
										onValueChange={(value) =>
											setProfileData({ ...profileData, industry: value })
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="technology">Technology</SelectItem>
											<SelectItem value="healthcare">Healthcare</SelectItem>
											<SelectItem value="finance">Finance</SelectItem>
											<SelectItem value="manufacturing">
												Manufacturing
											</SelectItem>
											<SelectItem value="retail">Retail</SelectItem>
											<SelectItem value="education">Education</SelectItem>
											<SelectItem value="other">Other</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="flex justify-end">
								<Button onClick={handleSave} disabled={isLoading}>
									{isLoading ? "Saving..." : "Save Changes"}
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="billing">
					<Card>
						<CardHeader>
							<CardTitle>Billing Information</CardTitle>
							<CardDescription>
								Manage your payment methods and billing preferences
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="text-center py-8">
								<CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
								<h3 className="text-lg font-semibold mb-2">
									No Payment Methods
								</h3>
								<p className="text-muted-foreground mb-4">
									Add a payment method to start making purchases
								</p>
								<Button>Add Payment Method</Button>
							</div>
						</CardContent>
					</Card>
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
