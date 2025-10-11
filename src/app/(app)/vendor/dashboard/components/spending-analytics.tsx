"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  Area,
  AreaChart,
} from "recharts"
import { Download, TrendingUp, TrendingDown, DollarSign, Calendar, Filter } from "lucide-react"

const quarterlyData = [
  { quarter: "Q1 2023", amount: 45200, orders: 18, avgOrder: 2511 },
  { quarter: "Q2 2023", amount: 52800, orders: 22, avgOrder: 2400 },
  { quarter: "Q3 2023", amount: 48900, orders: 20, avgOrder: 2445 },
  { quarter: "Q4 2023", amount: 61200, orders: 25, avgOrder: 2448 },
  { quarter: "Q1 2024", amount: 58700, orders: 24, avgOrder: 2446 },
]

const departmentSpending = [
  { department: "Operations", amount: 28500, budget: 30000, orders: 45 },
  { department: "IT", amount: 22100, budget: 25000, orders: 12 },
  { department: "HR", amount: 8900, budget: 12000, orders: 23 },
  { department: "Finance", amount: 5200, budget: 8000, orders: 8 },
  { department: "Marketing", amount: 12400, budget: 15000, orders: 18 },
]

const supplierPerformance = [
  { supplier: "Office Depot", amount: 18500, orders: 28, avgDelivery: 3.2, rating: 4.8 },
  { supplier: "Staples Business", amount: 15200, orders: 22, avgDelivery: 2.8, rating: 4.6 },
  { supplier: "Amazon Business", amount: 12800, orders: 35, avgDelivery: 1.9, rating: 4.9 },
  { supplier: "CDW Corporation", amount: 22100, orders: 8, avgDelivery: 4.1, rating: 4.7 },
  { supplier: "Grainger", amount: 8400, orders: 12, avgDelivery: 3.5, rating: 4.5 },
]

export function SpendingAnalytics() {
  const [timeRange, setTimeRange] = useState("quarterly")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  const totalSpending = quarterlyData.reduce((sum, q) => sum + q.amount, 0)
  const avgOrderValue = quarterlyData.reduce((sum, q) => sum + q.avgOrder, 0) / quarterlyData.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-balance">Spending Analytics</h2>
          <p className="text-muted-foreground text-pretty">Detailed insights into your procurement spending patterns</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpending.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+8.2% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgOrderValue.toFixed(0)}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 text-red-500" />
              <span className="text-red-500">-2.1% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="text-green-500">From bulk discounts</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spending Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Trend</CardTitle>
          <CardDescription>Track your procurement spending over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={quarterlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value, name) => [
                  name === "amount" ? `$${value.toLocaleString()}` : value,
                  name === "amount" ? "Spending" : "Orders",
                ]}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} yAxisId="right" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Department Analysis */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Department Spending</span>
            </CardTitle>
            <CardDescription>Budget utilization by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentSpending} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <YAxis dataKey="department" type="category" width={80} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Spent"]} />
                <Bar dataKey="amount" fill="#6366f1" />
                <Bar dataKey="budget" fill="#e5e7eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Budget Status</CardTitle>
            <CardDescription>Current budget utilization rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentSpending.map((dept) => {
                const utilization = (dept.amount / dept.budget) * 100
                return (
                  <div key={dept.department} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{dept.department}</span>
                      <span className="text-muted-foreground">
                        ${dept.amount.toLocaleString()} / ${dept.budget.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            utilization > 90 ? "bg-red-500" : utilization > 75 ? "bg-orange-500" : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(utilization, 100)}%` }}
                        />
                      </div>
                      <Badge
                        variant={utilization > 90 ? "destructive" : utilization > 75 ? "secondary" : "default"}
                        className="text-xs"
                      >
                        {utilization.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supplier Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Performance</CardTitle>
          <CardDescription>Analysis of your key suppliers and their performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Supplier</th>
                  <th className="text-right py-2">Total Spent</th>
                  <th className="text-right py-2">Orders</th>
                  <th className="text-right py-2">Avg Delivery</th>
                  <th className="text-right py-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                {supplierPerformance.map((supplier) => (
                  <tr key={supplier.supplier} className="border-b">
                    <td className="py-3 font-medium">{supplier.supplier}</td>
                    <td className="text-right py-3">${supplier.amount.toLocaleString()}</td>
                    <td className="text-right py-3">{supplier.orders}</td>
                    <td className="text-right py-3">{supplier.avgDelivery} days</td>
                    <td className="text-right py-3">
                      <Badge variant="outline" className="text-xs">
                        {supplier.rating}/5.0
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
