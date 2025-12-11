"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import { Check, ChevronDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useListBrands, type Brand } from "@/core/catalog/brand"
import { useListCategories, type Category } from "@/core/catalog/category"

type BaseItem = {
	id: number
	name: string
}

type CommonProps<TItem extends BaseItem> = {
	placeholder?: string
	valueId?: number | null
	onChange?: (item: TItem) => void
	disabled?: boolean
	className?: string
}

function SearchableDropdown<TItem extends BaseItem>(
	props: {
		items: TItem[]
		loading: boolean
		hasMore: boolean
		onLoadMore: () => void
		search: string
		setSearch: (s: string) => void
		emptyText: string
		renderKey: (item: TItem) => string | number
		getItemLabel: (item: TItem) => string
	} & CommonProps<TItem>
) {
	const {
		items,
		loading,
		hasMore,
		onLoadMore,
		search,
		setSearch,
		placeholder = "Select...",
		valueId,
		onChange,
		disabled,
		className,
		emptyText,
		renderKey,
		getItemLabel,
	} = props

	const [open, setOpen] = useState(false)

	// Find selected item by id for label
	const selectedItem = useMemo(
		() =>
			typeof valueId === "number" ? items.find((i) => i.id === valueId) : null,
		[items, valueId]
	)
	const buttonLabel = selectedItem ? getItemLabel(selectedItem) : placeholder

	// Load more when popover opens and we have nothing yet
	useEffect(() => {
		if (open && items.length === 0 && !loading) {
			onLoadMore()
		}
	}, [open, items.length, loading, onLoadMore])

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn("w-full justify-between", className)}
					disabled={disabled}
				>
					<span className="truncate">{buttonLabel}</span>
					<ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[--radix-popover-trigger-width] p-0">
				<Command shouldFilter={false}>
					<CommandInput
						value={search}
						onValueChange={(v) => setSearch(v)}
						placeholder="Search..."
						className="h-9"
					/>
					<CommandList>
						{!loading && items.length === 0 ? (
							<CommandEmpty>{emptyText}</CommandEmpty>
						) : null}
						<CommandGroup>
							{items.map((item) => {
								const label = getItemLabel(item)
								const selected = valueId === item.id
								return (
									<CommandItem
										key={renderKey(item)}
										value={label}
										onSelect={() => {
											onChange?.(item)
											setOpen(false)
										}}
									>
										<span className="truncate">{label}</span>
										<Check
											className={cn(
												"ml-auto h-4 w-4",
												selected ? "opacity-100" : "opacity-0"
											)}
										/>
									</CommandItem>
								)
							})}
							{hasMore ? (
								<Button
									variant="ghost"
									className="w-full justify-center"
									onClick={onLoadMore}
									disabled={loading}
								>
									{loading ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Loading...
										</>
									) : (
										"Load more"
									)}
								</Button>
							) : null}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

export function BrandSelect({
	placeholder = "Select brand...",
	valueId,
	onChange,
	disabled,
	className,
}: CommonProps<Brand>) {
	const [search, setSearch] = useState("")
	const { data, fetchNextPage, hasNextPage, isFetching, refetch } =
		useListBrands({
			page: 1,
			limit: 10,
			search: search || undefined,
		})

	// re-fetch when search changes to reset the list from page 1 (thanks to queryKey)
	useEffect(() => {
		// debounce slighty
		const t = setTimeout(() => {
			refetch()
		}, 200)
		return () => clearTimeout(t)
	}, [search, refetch])

	const items = useMemo<Brand[]>(() => {
		return (data?.pages ?? []).flatMap((p) => p.data ?? [])
	}, [data])

	return (
		<SearchableDropdown
			items={items}
			loading={isFetching}
			hasMore={!!hasNextPage}
			onLoadMore={() => fetchNextPage()}
			search={search}
			setSearch={setSearch}
			placeholder={placeholder}
			valueId={valueId ?? null}
			onChange={onChange}
			disabled={disabled}
			className={className}
			emptyText="No brands found."
			renderKey={(b) => b.id}
			getItemLabel={(b) => b.name}
		/>
	)
}

export function CategorySelect({
	placeholder = "Select category...",
	valueId,
	onChange,
	disabled,
	className,
}: CommonProps<Category>) {
	const [search, setSearch] = useState("")
	const { data, fetchNextPage, hasNextPage, isFetching, refetch } =
		useListCategories({
			page: 1,
			limit: 10,
			search: search || undefined,
		})

	useEffect(() => {
		const t = setTimeout(() => {
			refetch()
		}, 200)
		return () => clearTimeout(t)
	}, [search, refetch])

	const items = useMemo<Category[]>(() => {
		return (data?.pages ?? []).flatMap((p) => p.data ?? [])
	}, [data])

	return (
		<SearchableDropdown
			items={items}
			loading={isFetching}
			hasMore={!!hasNextPage}
			onLoadMore={() => fetchNextPage()}
			search={search}
			setSearch={setSearch}
			placeholder={placeholder}
			valueId={valueId ?? null}
			onChange={onChange}
			disabled={disabled}
			className={className}
			emptyText="No categories found."
			renderKey={(c) => c.id}
			getItemLabel={(c) => c.name}
		/>
	)
}
