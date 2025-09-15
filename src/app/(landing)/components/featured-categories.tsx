import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Monitor, Briefcase, Wrench, Package } from "lucide-react"

const categories = [
	{
		name: "Technology",
		description: "Computers, software, and tech solutions",
		icon: Monitor,
		href: "/search?q=technology&category=Technology",
		image: "/technology-office-equipment.jpg",
	},
	{
		name: "Office Supplies",
		description: "Essential office equipment and supplies",
		icon: Briefcase,
		href: "/search?q=office supplies&category=Office Supplies",
		image: "/office-supplies-desk.jpg",
	},
	{
		name: "Industrial Equipment",
		description: "Heavy-duty tools and machinery",
		icon: Wrench,
		href: "/search?q=industrial equipment&category=Technology",
		image: "/industrial-equipment-warehouse.jpg",
	},
	{
		name: "Furniture",
		description: "Office furniture and workspace solutions",
		icon: Package,
		href: "/search?q=furniture&category=Furniture",
		image: "/modern-office-furniture.png",
	},
]

export function FeaturedCategories() {
	return (
		<section className="py-16 bg-muted/50">
			<div className="container">
				<div className="text-center space-y-4 mb-12">
					<h2 className="text-3xl font-bold text-balance">Shop by Category</h2>
					<p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
						Find exactly what your business needs from our comprehensive product
						categories
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					{categories.map((category) => {
						const Icon = category.icon
						return (
							<Link key={category.name} href={category.href}>
								<Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 h-full">
									<div className="aspect-video overflow-hidden">
										<img
											src={category.image || "/placeholder.svg"}
											alt={category.name}
											className="h-full w-full object-cover transition-transform group-hover:scale-105"
										/>
									</div>
									<CardContent className="p-6">
										<div className="flex items-center space-x-3 mb-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
												<Icon className="h-5 w-5 text-primary" />
											</div>
											<h3 className="font-semibold text-lg">{category.name}</h3>
										</div>
										<p className="text-sm text-muted-foreground">
											{category.description}
										</p>
									</CardContent>
								</Card>
							</Link>
						)
					})}
				</div>
			</div>
		</section>
	)
}
