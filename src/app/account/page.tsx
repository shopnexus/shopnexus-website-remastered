import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { UserProfile } from "@/components/auth/user-profile"

export default function AccountPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-balance">Account Settings</h1>
            <p className="text-muted-foreground text-pretty">
              Manage your account information and business preferences
            </p>
          </div>

          <UserProfile />
        </div>
      </main>

      <Footer />
    </div>
  )
}
