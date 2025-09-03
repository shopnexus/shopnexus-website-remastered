import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { OrderHistory } from "@/components/orders/order-history"

export default function OrdersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container max-w-6xl">
          <OrderHistory />
        </div>
      </main>

      <Footer />
    </div>
  )
}
