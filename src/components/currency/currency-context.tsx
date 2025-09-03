"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

export type Currency = "USDT" | "VND" | "USD" | "EUR"

export interface CurrencyConfig {
	code: Currency
	symbol: string
	name: string
	rate: number // Rate to USDT (base currency)
	decimals: number
}

const CURRENCY_CONFIGS: Record<Currency, CurrencyConfig> = {
	USDT: {
		code: "USDT",
		symbol: "USDT",
		name: "Tether USD",
		rate: 1, // Base currency
		decimals: 2,
	},
	VND: {
		code: "VND",
		symbol: "₫",
		name: "Vietnamese Dong",
		rate: 24000, // 1 USDT = 24,000 VND (approximate)
		decimals: 0,
	},
	USD: {
		code: "USD",
		symbol: "$",
		name: "US Dollar",
		rate: 1, // 1 USDT ≈ 1 USD
		decimals: 2,
	},
	EUR: {
		code: "EUR",
		symbol: "€",
		name: "Euro",
		rate: 0.92, // 1 USDT ≈ 0.92 EUR (approximate)
		decimals: 2,
	},
}

interface CurrencyContextType {
	currentCurrency: Currency
	setCurrency: (currency: Currency) => void
	currencies: CurrencyConfig[]
	getCurrentConfig: () => CurrencyConfig
	convertFromUSDT: (amount: number, toCurrency?: Currency) => number
	convertToUSDT: (amount: number, fromCurrency?: Currency) => number
	formatCurrency: (amount: number, currency?: Currency) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
	undefined
)

interface CurrencyProviderProps {
	children: React.ReactNode
	defaultCurrency?: Currency
}

export function CurrencyProvider({
	children,
	defaultCurrency = "USDT",
}: CurrencyProviderProps) {
	const [currentCurrency, setCurrentCurrency] =
		useState<Currency>(defaultCurrency)

	const currencies = Object.values(CURRENCY_CONFIGS)

	const getCurrentConfig = useCallback(() => {
		return CURRENCY_CONFIGS[currentCurrency]
	}, [currentCurrency])

	const setCurrency = useCallback((currency: Currency) => {
		setCurrentCurrency(currency)
	}, [])

	const convertFromUSDT = useCallback(
		(amount: number, toCurrency?: Currency) => {
			const targetCurrency = toCurrency || currentCurrency
			const config = CURRENCY_CONFIGS[targetCurrency]
			return amount * config.rate
		},
		[currentCurrency]
	)

	const convertToUSDT = useCallback(
		(amount: number, fromCurrency?: Currency) => {
			const sourceCurrency = fromCurrency || currentCurrency
			const config = CURRENCY_CONFIGS[sourceCurrency]
			return amount / config.rate
		},
		[currentCurrency]
	)

	const formatCurrency = useCallback(
		(amount: number, currency?: Currency) => {
			const targetCurrency = currency || currentCurrency
			const config = CURRENCY_CONFIGS[targetCurrency]

			const convertedAmount = convertFromUSDT(amount, targetCurrency)

			// Format based on currency type
			if (config.code === "VND") {
				return `${Math.round(convertedAmount).toLocaleString("vi-VN")}${
					config.symbol
				}`
			} else if (config.code === "USDT") {
				return `${convertedAmount.toFixed(config.decimals)} ${config.symbol}`
			} else {
				return `${config.symbol}${convertedAmount.toFixed(config.decimals)}`
			}
		},
		[currentCurrency, convertFromUSDT]
	)

	const value: CurrencyContextType = {
		currentCurrency,
		setCurrency,
		currencies,
		getCurrentConfig,
		convertFromUSDT,
		convertToUSDT,
		formatCurrency,
	}

	return (
		<CurrencyContext.Provider value={value}>
			{children}
		</CurrencyContext.Provider>
	)
}

export function useCurrency() {
	const context = useContext(CurrencyContext)
	if (context === undefined) {
		throw new Error("useCurrency must be used within a CurrencyProvider")
	}
	return context
}
