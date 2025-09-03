import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SpendingAnalytics } from "@/components/dashboard/spending-analytics"

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-balance">Business Dashboard</h1>
            <p className="text-muted-foreground text-pretty">
              Monitor your procurement activities and business insights
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-96">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <DashboardOverview />
            </TabsContent>

            <TabsContent value="analytics">
              <SpendingAnalytics />
            </TabsContent>

            <TabsContent value="reports">
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">Reports Coming Soon</h3>
                <p className="text-muted-foreground">
                  Advanced reporting features will be available in the next update.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
