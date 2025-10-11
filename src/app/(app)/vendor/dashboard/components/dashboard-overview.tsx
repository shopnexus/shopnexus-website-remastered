"use client"

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
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
	BarChart,
	Bar,
	AreaChart,
	Area,
	ComposedChart,
} from "recharts"
import {
	TrendingUp,
	TrendingDown,
	DollarSign,
	ShoppingCart,
	Package,
	Users,
	Calendar,
	Target,
	AlertTriangle,
	CheckCircle,
	Clock,
	Star,
	Eye,
	Download,
	RefreshCw,
	Filter,
	MoreHorizontal,
} from "lucide-react"

const monthlySpending = [
	{ month: "Jan", amount: 12500, orders: 45, items: 234, avgOrder: 278 },
	{ month: "Feb", amount: 15200, orders: 52, items: 289, avgOrder: 292 },
	{ month: "Mar", amount: 18900, orders: 68, items: 356, avgOrder: 278 },
	{ month: "Apr", amount: 16700, orders: 61, items: 312, avgOrder: 274 },
	{ month: "May", amount: 21300, orders: 78, items: 445, avgOrder: 273 },
	{ month: "Jun", amount: 19800, orders: 72, items: 398, avgOrder: 275 },
]

const categorySpending = [
	{ name: "Office Supplies", value: 35, amount: 15400, growth: 12, orders: 89 },
	{ name: "Technology", value: 30, amount: 13200, growth: 8, orders: 67 },
	{ name: "Furniture", value: 25, amount: 11000, growth: 15, orders: 45 },
	{ name: "Industrial", value: 10, amount: 4400, growth: -3, orders: 23 },
]

const topSuppliers = [
	{
		name: "TechCorp Solutions",
		orders: 45,
		amount: 18900,
		rating: 4.8,
		status: "Active",
	},
	{
		name: "OfficeMax Pro",
		orders: 38,
		amount: 12400,
		rating: 4.6,
		status: "Active",
	},
	{
		name: "Furniture World",
		orders: 29,
		amount: 9800,
		rating: 4.4,
		status: "Active",
	},
	{
		name: "Industrial Supply Co",
		orders: 22,
		amount: 5600,
		rating: 4.2,
		status: "Pending",
	},
]

const recentOrders = [
	{
		id: "ORD-001",
		supplier: "TechCorp Solutions",
		amount: 1299,
		status: "Delivered",
		date: "2024-01-22",
		items: 3,
	},
	{
		id: "ORD-002",
		supplier: "OfficeMax Pro",
		amount: 899,
		status: "Processing",
		date: "2024-01-21",
		items: 5,
	},
	{
		id: "ORD-003",
		supplier: "Furniture World",
		amount: 2349,
		status: "Shipped",
		date: "2024-01-20",
		items: 2,
	},
	{
		id: "ORD-004",
		supplier: "Industrial Supply Co",
		amount: 567,
		status: "Pending",
		date: "2024-01-19",
		items: 8,
	},
]

const performanceMetrics = [
	{
		metric: "Order Fulfillment Rate",
		value: "98.5%",
		change: 2.1,
		trend: "up",
	},
	{
		metric: "Average Delivery Time",
		value: "3.2 days",
		change: -0.5,
		trend: "down",
	},
	{ metric: "Supplier Satisfaction", value: "4.6/5", change: 0.2, trend: "up" },
	{ metric: "Cost Savings", value: "$2,400", change: 15.3, trend: "up" },
]

const COLORS = [
	"#6366f1",
	"#10b981",
	"#f97316",
	"#ef4444",
	"#8b5cf6",
	"#06b6d4",
]

export function DashboardOverview() {
	const currentMonth = new Date().toLocaleString("default", { month: "long" })
	const totalSpent = monthlySpending.reduce(
		(sum, month) => sum + month.amount,
		0
	)
	const lastMonthSpending =
		monthlySpending[monthlySpending.length - 1]?.amount || 0
	const previousMonthSpending =
		monthlySpending[monthlySpending.length - 2]?.amount || 0
	const spendingChange =
		((lastMonthSpending - previousMonthSpending) / previousMonthSpending) * 100
	const totalOrders = monthlySpending.reduce(
		(sum, month) => sum + month.orders,
		0
	)
	const totalItems = monthlySpending.reduce(
		(sum, month) => sum + month.items,
		0
	)

	return (
		<div className="space-y-6">
			{/* Header with Controls */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold">Business Overview</h2>
					<p className="text-muted-foreground">
						Monitor your procurement performance and key metrics
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Select defaultValue="6m">
						<SelectTrigger className="w-32">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="1m">Last Month</SelectItem>
							<SelectItem value="3m">Last 3 Months</SelectItem>
							<SelectItem value="6m">Last 6 Months</SelectItem>
							<SelectItem value="1y">Last Year</SelectItem>
						</SelectContent>
					</Select>
					<Button variant="outline" size="sm">
						<RefreshCw className="h-4 w-4 mr-2" />
						Refresh
					</Button>
					<Button variant="outline" size="sm">
						<Download className="h-4 w-4 mr-2" />
						Export
					</Button>
				</div>
			</div>

			{/* Key Metrics */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card className="relative overflow-hidden">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Spent (YTD)
						</CardTitle>
						<div className="p-2 bg-blue-100 rounded-lg">
							<DollarSign className="h-4 w-4 text-blue-600" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							${totalSpent.toLocaleString()}
						</div>
						<div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
							{spendingChange > 0 ? (
								<TrendingUp className="h-3 w-3 text-green-500" />
							) : (
								<TrendingDown className="h-3 w-3 text-red-500" />
							)}
							<span
								className={
									spendingChange > 0 ? "text-green-500" : "text-red-500"
								}
							>
								{Math.abs(spendingChange).toFixed(1)}% from last month
							</span>
						</div>
						<div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -translate-y-10 translate-x-10" />
					</CardContent>
				</Card>

				<Card className="relative overflow-hidden">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Orders</CardTitle>
						<div className="p-2 bg-green-100 rounded-lg">
							<ShoppingCart className="h-4 w-4 text-green-600" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalOrders}</div>
						<div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
							<TrendingUp className="h-3 w-3 text-green-500" />
							<span className="text-green-500">+12% from last month</span>
						</div>
						<div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -translate-y-10 translate-x-10" />
					</CardContent>
				</Card>

				<Card className="relative overflow-hidden">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Items Purchased
						</CardTitle>
						<div className="p-2 bg-orange-100 rounded-lg">
							<Package className="h-4 w-4 text-orange-600" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{totalItems.toLocaleString()}
						</div>
						<div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
							<TrendingUp className="h-3 w-3 text-green-500" />
							<span className="text-green-500">+8% from last month</span>
						</div>
						<div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full -translate-y-10 translate-x-10" />
					</CardContent>
				</Card>

				<Card className="relative overflow-hidden">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Active Suppliers
						</CardTitle>
						<div className="p-2 bg-purple-100 rounded-lg">
							<Users className="h-4 w-4 text-purple-600" />
						</div>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">12</div>
						<div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
							<span className="text-muted-foreground">Across 4 categories</span>
						</div>
						<div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -translate-y-10 translate-x-10" />
					</CardContent>
				</Card>
			</div>

			{/* Performance Metrics */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{performanceMetrics.map((metric, index) => (
					<Card key={index} className="border-l-4 border-l-blue-500">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										{metric.metric}
									</p>
									<p className="text-xl font-bold">{metric.value}</p>
								</div>
								<div className="flex items-center space-x-1">
									{metric.trend === "up" ? (
										<TrendingUp className="h-4 w-4 text-green-500" />
									) : (
										<TrendingDown className="h-4 w-4 text-red-500" />
									)}
									<span
										className={`text-xs ${
											metric.trend === "up" ? "text-green-500" : "text-red-500"
										}`}
									>
										{metric.change > 0 ? "+" : ""}
										{metric.change}%
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Enhanced Charts Section */}
			<Tabs defaultValue="spending" className="space-y-4">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="spending">Spending Trends</TabsTrigger>
					<TabsTrigger value="categories">Categories</TabsTrigger>
					<TabsTrigger value="suppliers">Suppliers</TabsTrigger>
					<TabsTrigger value="performance">Performance</TabsTrigger>
				</TabsList>

				<TabsContent value="spending" className="space-y-4">
					<div className="grid gap-6 lg:grid-cols-2">
						{/* Monthly Spending Trend */}
						<Card>
							<CardHeader>
								<CardTitle>Monthly Spending Trend</CardTitle>
								<CardDescription>
									Your spending pattern over the last 6 months
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<ComposedChart data={monthlySpending}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="month" />
										<YAxis
											yAxisId="left"
											tickFormatter={(value) =>
												`$${(value / 1000).toFixed(0)}k`
											}
										/>
										<YAxis yAxisId="right" orientation="right" />
										<Tooltip
											formatter={(value, name) => [
												name === "amount"
													? `$${value.toLocaleString()}`
													: value,
												name === "amount"
													? "Amount"
													: name === "orders"
													? "Orders"
													: "Items",
											]}
										/>
										<Bar
											yAxisId="right"
											dataKey="orders"
											fill="#10b981"
											opacity={0.3}
										/>
										<Line
											yAxisId="left"
											type="monotone"
											dataKey="amount"
											stroke="#6366f1"
											strokeWidth={3}
											dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
										/>
									</ComposedChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						{/* Budget Tracking */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<Target className="h-5 w-5" />
									<span>Budget Tracking - {currentMonth}</span>
								</CardTitle>
								<CardDescription>
									Monitor your monthly spending against budget limits
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span>Monthly Budget</span>
										<span className="font-medium">$25,000</span>
									</div>
									<div className="flex justify-between text-sm">
										<span>Spent This Month</span>
										<span className="font-medium">
											${lastMonthSpending.toLocaleString()}
										</span>
									</div>
									<Progress
										value={(lastMonthSpending / 25000) * 100}
										className="h-3"
									/>
									<div className="flex justify-between text-xs text-muted-foreground">
										<span>
											{((lastMonthSpending / 25000) * 100).toFixed(1)}% used
										</span>
										<span>
											${(25000 - lastMonthSpending).toLocaleString()} remaining
										</span>
									</div>
								</div>

								{lastMonthSpending > 20000 && (
									<div className="flex items-center space-x-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
										<AlertTriangle className="h-4 w-4 text-orange-500" />
										<span className="text-sm text-orange-700">
											Approaching budget limit -{" "}
											{((lastMonthSpending / 25000) * 100).toFixed(0)}% used
										</span>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="categories" className="space-y-4">
					<div className="grid gap-6 lg:grid-cols-2">
						{/* Category Breakdown */}
						<Card>
							<CardHeader>
								<CardTitle>Spending by Category</CardTitle>
								<CardDescription>
									Distribution of your procurement spending
								</CardDescription>
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
													<Cell
														key={`cell-${index}`}
														fill={COLORS[index % COLORS.length]}
													/>
												))}
											</Pie>
											<Tooltip
												formatter={(value) => [`${value}%`, "Percentage"]}
											/>
										</PieChart>
									</ResponsiveContainer>

									<div className="space-y-3">
										{categorySpending.map((category, index) => (
											<div
												key={category.name}
												className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
											>
												<div className="flex items-center space-x-2">
													<div
														className="h-3 w-3 rounded-full"
														style={{
															backgroundColor: COLORS[index % COLORS.length],
														}}
													/>
													<span className="text-sm font-medium">
														{category.name}
													</span>
												</div>
												<div className="text-right">
													<div className="text-sm font-medium">
														${category.amount.toLocaleString()}
													</div>
													<div className="text-xs text-muted-foreground">
														{category.value}%
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Category Growth */}
						<Card>
							<CardHeader>
								<CardTitle>Category Growth</CardTitle>
								<CardDescription>
									Growth rates by category this month
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{categorySpending.map((category, index) => (
										<div
											key={category.name}
											className="flex items-center justify-between"
										>
											<div className="flex items-center space-x-3">
												<div
													className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
													style={{
														backgroundColor: COLORS[index % COLORS.length],
													}}
												>
													{category.name.charAt(0)}
												</div>
												<div>
													<p className="text-sm font-medium">{category.name}</p>
													<p className="text-xs text-muted-foreground">
														{category.orders} orders
													</p>
												</div>
											</div>
											<div className="text-right">
												<div
													className={`text-sm font-medium ${
														category.growth > 0
															? "text-green-600"
															: "text-red-600"
													}`}
												>
													{category.growth > 0 ? "+" : ""}
													{category.growth}%
												</div>
												<div className="text-xs text-muted-foreground">
													vs last month
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="suppliers" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Top Suppliers</CardTitle>
							<CardDescription>
								Your most active suppliers by order volume and amount
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{topSuppliers.map((supplier, index) => (
									<div
										key={supplier.name}
										className="flex items-center justify-between p-4 border rounded-lg"
									>
										<div className="flex items-center space-x-4">
											<div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
												{supplier.name.charAt(0)}
											</div>
											<div>
												<p className="font-medium">{supplier.name}</p>
												<div className="flex items-center space-x-2 text-sm text-muted-foreground">
													<span>{supplier.orders} orders</span>
													<span>•</span>
													<div className="flex items-center space-x-1">
														<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
														<span>{supplier.rating}</span>
													</div>
												</div>
											</div>
										</div>
										<div className="text-right">
											<p className="font-medium">
												${supplier.amount.toLocaleString()}
											</p>
											<Badge
												variant={
													supplier.status === "Active" ? "default" : "secondary"
												}
											>
												{supplier.status}
											</Badge>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="performance" className="space-y-4">
					<div className="grid gap-6 lg:grid-cols-2">
						{/* Order Performance */}
						<Card>
							<CardHeader>
								<CardTitle>Order Performance</CardTitle>
								<CardDescription>
									Order volume and average order value trends
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<AreaChart data={monthlySpending}>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="month" />
										<YAxis yAxisId="left" />
										<YAxis yAxisId="right" orientation="right" />
										<Tooltip />
										<Area
											yAxisId="left"
											type="monotone"
											dataKey="orders"
											stackId="1"
											stroke="#10b981"
											fill="#10b981"
											fillOpacity={0.3}
										/>
										<Line
											yAxisId="right"
											type="monotone"
											dataKey="avgOrder"
											stroke="#6366f1"
											strokeWidth={2}
										/>
									</AreaChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>

						{/* Recent Orders */}
						<Card>
							<CardHeader>
								<CardTitle>Recent Orders</CardTitle>
								<CardDescription>
									Latest orders and their status
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{recentOrders.map((order) => (
										<div
											key={order.id}
											className="flex items-center justify-between p-3 border rounded-lg"
										>
											<div className="flex items-center space-x-3">
												<div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
													{order.status === "Delivered" ? (
														<CheckCircle className="h-4 w-4 text-green-600" />
													) : order.status === "Processing" ? (
														<Clock className="h-4 w-4 text-blue-600" />
													) : order.status === "Shipped" ? (
														<Package className="h-4 w-4 text-orange-600" />
													) : (
														<AlertTriangle className="h-4 w-4 text-yellow-600" />
													)}
												</div>
												<div>
													<p className="text-sm font-medium">{order.id}</p>
													<p className="text-xs text-muted-foreground">
														{order.supplier}
													</p>
												</div>
											</div>
											<div className="text-right">
												<p className="text-sm font-medium">
													${order.amount.toLocaleString()}
												</p>
												<Badge variant="outline" className="text-xs">
													{order.status}
												</Badge>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
