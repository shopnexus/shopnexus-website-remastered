"use client"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, DollarSign } from "lucide-react"
import { useCurrency, Currency } from "./currency-context"

interface CurrencySwitcherProps {
	variant?: "default" | "compact" | "badge"
	className?: string
}

export function CurrencySwitcher({
	variant = "default",
	className = "",
}: CurrencySwitcherProps) {
	const { currentCurrency, setCurrency, currencies, getCurrentConfig } =
		useCurrency()
	const currentConfig = getCurrentConfig()

	const handleCurrencyChange = (currency: Currency) => {
		setCurrency(currency)
	}

	if (variant === "badge") {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Badge
						variant="outline"
						className={`cursor-pointer hover:bg-muted ${className}`}
					>
						{currentConfig.symbol} {currentConfig.code}
						<ChevronDown className="h-3 w-3 ml-1" />
					</Badge>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="min-w-[140px]">
					{currencies.map((currency) => (
						<DropdownMenuItem
							key={currency.code}
							onClick={() => handleCurrencyChange(currency.code)}
							className={currentCurrency === currency.code ? "bg-muted" : ""}
						>
							<span className="font-medium">{currency.symbol}</span>
							<span className="ml-2">{currency.code}</span>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		)
	}

	if (variant === "compact") {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm" className={`h-8 px-2 ${className}`}>
						<DollarSign className="h-4 w-4 mr-1" />
						{currentConfig.code}
						<ChevronDown className="h-3 w-3 ml-1" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="min-w-[160px]">
					{currencies.map((currency) => (
						<DropdownMenuItem
							key={currency.code}
							onClick={() => handleCurrencyChange(currency.code)}
							className={currentCurrency === currency.code ? "bg-muted" : ""}
						>
							<div className="flex items-center justify-between w-full">
								<div className="flex items-center">
									<span className="font-medium mr-2">{currency.symbol}</span>
									<span>{currency.code}</span>
								</div>
								<span className="text-xs text-muted-foreground">
									{currency.name}
								</span>
							</div>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		)
	}

	// Default variant
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className={className}>
					<DollarSign className="h-4 w-4 mr-2" />
					{currentConfig.symbol} {currentConfig.code}
					<ChevronDown className="h-4 w-4 ml-2" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-[200px]">
				{currencies.map((currency) => (
					<DropdownMenuItem
						key={currency.code}
						onClick={() => handleCurrencyChange(currency.code)}
						className={currentCurrency === currency.code ? "bg-muted" : ""}
					>
						<div className="flex items-center justify-between w-full">
							<div className="flex items-center">
								<span className="font-medium mr-3">{currency.symbol}</span>
								<div>
									<div className="font-medium">{currency.code}</div>
									<div className="text-xs text-muted-foreground">
										{currency.name}
									</div>
								</div>
							</div>
							{currentCurrency === currency.code && (
								<Badge variant="secondary" className="text-xs">
									Current
								</Badge>
							)}
						</div>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
