"use client"

import { useMemo } from "react"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ServiceOption } from "@/core/common/option"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export interface ServiceOptionSelectorProps {
	title: string
	description: string
	icon: LucideIcon
	options: ServiceOption[]
	selectedOptionId: string
	onChange: (optionId: string) => void
	providerIconMap?: Record<string, React.ComponentType<{ className?: string }>>
	groupByProvider?: boolean
	additionalInfo?: (option?: ServiceOption) => React.ReactNode
	loading?: boolean
}

export function ServiceOptionSelector({
	title,
	description,
	icon: Icon,
	options,
	selectedOptionId,
	onChange,
	providerIconMap = {},
	groupByProvider = true,
	additionalInfo,
	loading = false,
}: ServiceOptionSelectorProps) {
	// Group options by provider
	const groupedOptions = useMemo(() => {
		if (!groupByProvider) {
			return { "": options }
		}

		return options.reduce((acc, option) => {
			const provider = option.provider || ""
			if (!acc[provider]) {
				acc[provider] = []
			}
			acc[provider].push(option)
			return acc
		}, {} as Record<string, ServiceOption[]>)
	}, [options, groupByProvider])

	const getProviderIcon = (provider: string) => {
		const IconComponent =
			providerIconMap[provider] ||
			providerIconMap[provider.toUpperCase()] ||
			providerIconMap["DEFAULT"] ||
			Icon
		return IconComponent
	}

	if (loading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Icon className="h-5 w-5" />
						<span>{title}</span>
					</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					{[...Array(3)].map((_, i) => (
						<Skeleton key={i} className="h-20 w-full" />
					))}
				</CardContent>
			</Card>
		)
	}

	if (options.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Icon className="h-5 w-5" />
						<span>{title}</span>
					</CardTitle>
					<CardDescription>{description}</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						No options available at the moment.
					</p>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Icon className="h-5 w-5" />
					<span>{title}</span>
				</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<RadioGroup
					value={selectedOptionId}
					onValueChange={onChange}
					className="space-y-4"
				>
					{Object.entries(groupedOptions).map(([provider, providerOptions]) => (
						<div key={provider} className="space-y-3">
							{groupByProvider && provider && (
								<div className="flex items-center space-x-2 pb-2">
									{(() => {
										const ProviderIcon = getProviderIcon(provider)
										return (
											<ProviderIcon className="h-4 w-4 text-muted-foreground" />
										)
									})()}
									<Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
										{provider}
									</Label>
								</div>
							)}

							<div className="space-y-2">
								{providerOptions.map((option) => {
									const isSelected = selectedOptionId === option.id
									const OptionIcon = getProviderIcon(option.provider)

									return (
										<Label
											key={option.id}
											htmlFor={option.id}
											className={cn(
												"relative flex cursor-pointer flex-col rounded-lg border-2 p-4 transition-all hover:border-primary/50 hover:bg-accent/50",
												isSelected
													? "border-primary bg-primary/5 shadow-sm"
													: "border-border bg-card"
											)}
										>
											<div className="flex items-start space-x-3">
												<div className="mt-1 flex-shrink-0">
													<RadioGroupItem
														value={option.id}
														id={option.id}
														className="mt-0.5"
													/>
												</div>
												<div className="flex-1 space-y-1">
													<div className="flex items-center space-x-2">
														<OptionIcon className="h-4 w-4 text-muted-foreground" />
														<span className="font-medium">{option.name}</span>
													</div>
													{option.description && (
														<p className="text-sm text-muted-foreground">
															{option.description}
														</p>
													)}
													{option.method && (
														<p className="text-xs text-muted-foreground/70">
															Method: {option.method}
														</p>
													)}
													{additionalInfo &&
														isSelected &&
														(() => {
															try {
																const optionInfo = additionalInfo(option)
																return optionInfo ? (
																	<div className="pt-1">{optionInfo}</div>
																) : null
															} catch {
																return null
															}
														})()}
												</div>
											</div>
										</Label>
									)
								})}
							</div>
						</div>
					))}
				</RadioGroup>

				{/* Show general additional info if provided */}
				{additionalInfo && (
					<div className="mt-4">
						{(() => {
							try {
								const generalInfo = additionalInfo()
								return generalInfo || null
							} catch {
								return null
							}
						})()}
					</div>
				)}
			</CardContent>
		</Card>
	)
}
