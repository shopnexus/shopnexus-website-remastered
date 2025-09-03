"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users, Calendar, Target } from "lucide-react"

const monthlySpending = [
  { month: "Jan", amount: 12500 },
  { month: "Feb", amount: 15200 },
  { month: "Mar", amount: 18900 },
  { month: "Apr", amount: 16700 },
  { month: "May", amount: 21300 },
  { month: "Jun", amount: 19800 },
]

const categorySpending = [
  { name: "Office Supplies", value: 35, amount: 15400 },
  { name: "Technology", value: 30, amount: 13200 },
  { name: "Furniture", value: 25, amount: 11000 },
  { name: "Industrial", value: 10, amount: 4400 },
]

const COLORS = ["#6366f1", "#10b981", "#f97316", "#ef4444"]

export function DashboardOverview() {
  const currentMonth = new Date().toLocaleString("default", { month: "long" })
  const totalSpent = monthlySpending.reduce((sum, month) => sum + month.amount, 0)
  const lastMonthSpending = monthlySpending[monthlySpending.length - 1]?.amount || 0
  const previousMonthSpending = monthlySpending[monthlySpending.length - 2]?.amount || 0
  const spendingChange = ((lastMonthSpending - previousMonthSpending) / previousMonthSpending) * 100

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent (YTD)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {spendingChange > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={spendingChange > 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(spendingChange).toFixed(1)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders This Month</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Purchased</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+8% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Suppliers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="text-muted-foreground">Across 4 categories</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Budget Tracking - {currentMonth}</span>
          </CardTitle>
          <CardDescription>Monitor your monthly spending against budget limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Monthly Budget</span>
              <span className="font-medium">$25,000</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Spent This Month</span>
              <span className="font-medium">${lastMonthSpending.toLocaleString()}</span>
            </div>
            <Progress value={(lastMonthSpending / 25000) * 100} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{((lastMonthSpending / 25000) * 100).toFixed(1)}% used</span>
              <span>${(25000 - lastMonthSpending).toLocaleString()} remaining</span>
            </div>
          </div>

          {lastMonthSpending > 20000 && (
            <div className="flex items-center space-x-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="h-2 w-2 bg-orange-500 rounded-full" />
              <span className="text-sm text-orange-700">
                Approaching budget limit - {((lastMonthSpending / 25000) * 100).toFixed(0)}% used
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Spending Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending Trend</CardTitle>
            <CardDescription>Your spending pattern over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlySpending}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Amount"]} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Distribution of your procurement spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 lg:grid-cols-2">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categorySpending}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categorySpending.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-3">
                {categorySpending.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">${category.amount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{category.value}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>Latest orders and procurement activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                date: "2024-01-22",
                action: "Order Placed",
                description: "Office supplies bulk order",
                amount: "$899.50",
                status: "processing",
              },
              {
                date: "2024-01-20",
                action: "Order Delivered",
                description: "Wireless conference system",
                amount: "$1,299.99",
                status: "delivered",
              },
              {
                date: "2024-01-18",
                action: "Quote Requested",
                description: "Industrial equipment bulk quote",
                amount: "Pending",
                status: "pending",
              },
              {
                date: "2024-01-15",
                action: "Order Delivered",
                description: "Office chairs and paper supplies",
                amount: "$2,599.75",
                status: "delivered",
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    {activity.status === "delivered" ? (
                      <Package className="h-4 w-4 text-green-600" />
                    ) : activity.status === "processing" ? (
                      <ShoppingCart className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Calendar className="h-4 w-4 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{activity.amount}</p>
                  <Badge
                    variant={activity.status === "delivered" ? "default" : "secondary"}
                    className="text-xs capitalize"
                  >
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
