import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Shield, Truck } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight lg:text-6xl text-balance">
                Streamline Your Business Procurement
              </h1>
              <p className="text-xl text-muted-foreground text-pretty max-w-lg">
                Access thousands of business products with competitive pricing, bulk discounts, and dedicated account
                management.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/products">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent" asChild>
                <Link href="/bulk-orders">Request Quote</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">10,000+</p>
                  <p className="text-xs text-muted-foreground">Happy Businesses</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Secure</p>
                  <p className="text-xs text-muted-foreground">Payments</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Fast</p>
                  <p className="text-xs text-muted-foreground">Delivery</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
              <img
                src="/modern-business-office-workspace.jpg"
                alt="Modern business workspace"
                className="h-full w-full object-cover"
              />
            </div>
            {/* Floating cards */}
            <div className="absolute -bottom-6 -left-6 rounded-lg bg-card p-4 shadow-lg border">
              <p className="text-sm font-medium">Save up to 40%</p>
              <p className="text-xs text-muted-foreground">on bulk orders</p>
            </div>
            <div className="absolute -top-6 -right-6 rounded-lg bg-card p-4 shadow-lg border">
              <p className="text-sm font-medium">24/7 Support</p>
              <p className="text-xs text-muted-foreground">dedicated team</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
