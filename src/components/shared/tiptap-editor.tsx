"use client"

import { useEffect } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { cn } from "@/lib/utils"
import {
	Bold,
	Italic,
	Strikethrough,
	Code,
	Heading1,
	Heading2,
	List,
	ListOrdered,
	Quote,
	Undo,
	Redo,
	Minus,
} from "lucide-react"
import { Button } from "@/components/ui/button"

type TiptapEditorProps = {
	value: string
	onChange: (next: string) => void
	placeholder?: string
	className?: string
	minHeightClassName?: string
	disabled?: boolean
}

export default function TiptapEditor({
	value,
	onChange,
	placeholder = "Write your content...",
	className,
	minHeightClassName = "min-h-[300px]",
	disabled = false,
}: TiptapEditorProps) {
	const editor = useEditor({
		editable: !disabled,
		editorProps: {
			attributes: {
				class:
					"prose prose-sm max-w-none focus:outline-none px-3 py-2 rounded-md border bg-background",
			},
		},
		extensions: [
			StarterKit,
			Placeholder.configure({
				placeholder,
			}),
		],
		content: value || "",
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML())
		},
		immediatelyRender: false,
	})

	useEffect(() => {
		if (!editor) return
		// Only update if different to avoid cursor jump loops
		const html = editor.getHTML()
		if (value !== html) {
			editor.commands.setContent(value || "", false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value])

	return (
		<div className={cn("w-full", className)}>
			{editor ? (
				<div className="flex flex-wrap items-center gap-1 rounded-md border bg-background p-2 mb-2">
					<Button
						variant={editor.isActive("bold") ? "default" : "ghost"}
						size="sm"
						onClick={() => editor.chain().focus().toggleBold().run()}
						disabled={!editor.can().chain().focus().toggleBold().run()}
					>
						<Bold className="h-4 w-4" />
					</Button>
					<Button
						variant={editor.isActive("italic") ? "default" : "ghost"}
						size="sm"
						onClick={() => editor.chain().focus().toggleItalic().run()}
						disabled={!editor.can().chain().focus().toggleItalic().run()}
					>
						<Italic className="h-4 w-4" />
					</Button>
					<Button
						variant={editor.isActive("strike") ? "default" : "ghost"}
						size="sm"
						onClick={() => editor.chain().focus().toggleStrike().run()}
						disabled={!editor.can().chain().focus().toggleStrike().run()}
					>
						<Strikethrough className="h-4 w-4" />
					</Button>
					<Button
						variant={editor.isActive("code") ? "default" : "ghost"}
						size="sm"
						onClick={() => editor.chain().focus().toggleCode().run()}
						disabled={!editor.can().chain().focus().toggleCode().run()}
					>
						<Code className="h-4 w-4" />
					</Button>

					<div className="mx-1 h-5 w-px bg-border" />

					<Button
						variant={
							editor.isActive("heading", { level: 1 }) ? "default" : "ghost"
						}
						size="sm"
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 1 }).run()
						}
					>
						<Heading1 className="h-4 w-4" />
					</Button>
					<Button
						variant={
							editor.isActive("heading", { level: 2 }) ? "default" : "ghost"
						}
						size="sm"
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 2 }).run()
						}
					>
						<Heading2 className="h-4 w-4" />
					</Button>

					<div className="mx-1 h-5 w-px bg-border" />

					<Button
						variant={editor.isActive("bulletList") ? "default" : "ghost"}
						size="sm"
						onClick={() => editor.chain().focus().toggleBulletList().run()}
					>
						<List className="h-4 w-4" />
					</Button>
					<Button
						variant={editor.isActive("orderedList") ? "default" : "ghost"}
						size="sm"
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
					>
						<ListOrdered className="h-4 w-4" />
					</Button>
					<Button
						variant={editor.isActive("blockquote") ? "default" : "ghost"}
						size="sm"
						onClick={() => editor.chain().focus().toggleBlockquote().run()}
					>
						<Quote className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => editor.chain().focus().setHorizontalRule().run()}
					>
						<Minus className="h-4 w-4" />
					</Button>

					<div className="mx-1 h-5 w-px bg-border" />

					<Button
						variant="ghost"
						size="sm"
						onClick={() => editor.chain().focus().undo().run()}
						disabled={!editor.can().chain().focus().undo().run()}
					>
						<Undo className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => editor.chain().focus().redo().run()}
						disabled={!editor.can().chain().focus().redo().run()}
					>
						<Redo className="h-4 w-4" />
					</Button>
				</div>
			) : null}
			<div className={cn(minHeightClassName)}>
				<EditorContent editor={editor} />
			</div>
		</div>
	)
}
