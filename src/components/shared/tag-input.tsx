"use client"

import { useState, KeyboardEvent, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"

interface TagInputProps {
	tags: string[]
	onTagsChange: (tags: string[]) => void
	placeholder?: string
	disabled?: boolean
}

export function TagInput({
	tags,
	onTagsChange,
	placeholder = "Add tag",
	disabled = false,
}: TagInputProps) {
	const [inputValue, setInputValue] = useState("")

	const addTags = useCallback(
		(value: string) => {
			// Split by spaces and filter out empty strings
			const newTags = value
				.split(/\s+/)
				.map((tag) => tag.trim())
				.filter((tag) => tag.length > 0)

			if (newTags.length === 0) return

			// Add only non-duplicate tags
			const uniqueTags = newTags.filter((tag) => !tags.includes(tag))
			if (uniqueTags.length > 0) {
				onTagsChange([...tags, ...uniqueTags])
			}
		},
		[tags, onTagsChange]
	)

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault()
			if (inputValue.trim()) {
				addTags(inputValue)
				setInputValue("")
			}
		}
	}

	const handleAddClick = () => {
		if (inputValue.trim()) {
			addTags(inputValue)
			setInputValue("")
		}
	}

	const handleRemoveTag = useCallback(
		(tagToRemove: string) => {
			onTagsChange(tags.filter((tag) => tag !== tagToRemove))
		},
		[tags, onTagsChange]
	)

	return (
		<div className="space-y-4">
			<div className="flex gap-2">
				<Input
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					disabled={disabled}
				/>
				<Button onClick={handleAddClick} size="sm" disabled={disabled}>
					<Plus className="h-4 w-4" />
				</Button>
			</div>

			{tags.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{tags.map((tag, index) => (
						<Badge
							key={`${tag}-${index}`}
							variant="secondary"
							className="flex items-center gap-1 pr-1"
						>
							<span>{tag}</span>
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault()
									e.stopPropagation()
									handleRemoveTag(tag)
								}}
								className="ml-1 rounded-full hover:bg-secondary-foreground/20 p-0.5 transition-colors flex items-center justify-center"
								disabled={disabled}
								aria-label={`Remove ${tag} tag`}
							>
								<X className="h-3 w-3 hover:text-destructive" />
							</button>
						</Badge>
					))}
				</div>
			)}
		</div>
	)
}
