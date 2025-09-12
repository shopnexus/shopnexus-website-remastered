import { VendorProfileHeader } from "./components/vendor-profile-header"
import { VendorStats } from "./components/vendor-stats"
import { VendorProducts } from "./components/vendor-products"
import { Card, CardContent } from "@/components/ui/card"

export default function VendorProfilePage() {
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container max-w-7xl mx-auto py-8">
				{/* Header Section */}
				<VendorProfileHeader />

				{/* Stats Section */}
				<VendorStats />

				{/* Shop Description Section */}
				<div className="mt-8">
					<Card>
						<CardContent className="p-6">
							<div className="space-y-6">
								<div>
									<h3 className="text-2xl font-bold mb-4">About Our Shop</h3>
									<p className="text-gray-600 leading-relaxed text-lg">
										We are a trusted supplier specializing in office equipment
										and business solutions. With over 5 years of experience in
										the industry, we provide high-quality products and
										exceptional customer service to businesses of all sizes.
									</p>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<h4 className="font-semibold text-lg mb-3">Our Mission</h4>
										<p className="text-gray-600">
											To provide reliable, high-quality office equipment and
											business solutions that help companies operate more
											efficiently and productively.
										</p>
									</div>

									<div>
										<h4 className="font-semibold text-lg mb-3">
											Why Choose Us?
										</h4>
										<ul className="text-gray-600 space-y-2">
											<li className="flex items-center">
												<span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
												Fast and reliable shipping
											</li>
											<li className="flex items-center">
												<span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
												Competitive pricing
											</li>
											<li className="flex items-center">
												<span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
												Excellent customer support
											</li>
											<li className="flex items-center">
												<span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
												Quality guarantee on all products
											</li>
											<li className="flex items-center">
												<span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
												Bulk order discounts available
											</li>
										</ul>
									</div>
								</div>

								<div className="bg-blue-50 p-6 rounded-lg">
									<h4 className="font-semibold text-lg mb-3">Our Commitment</h4>
									<p className="text-gray-700">
										We are committed to delivering excellence in every aspect of
										our business. From product selection to customer service, we
										strive to exceed expectations and build long-lasting
										relationships with our clients.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Products Section */}
				<div className="mt-8">
					<VendorProducts />
				</div>
			</div>
		</div>
	)
}
