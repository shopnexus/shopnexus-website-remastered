"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
	X,
	ZoomIn,
	ZoomOut,
	RotateCcw,
	ChevronLeft,
	ChevronRight,
} from "lucide-react"

interface MediaResource {
	id: number
	mime: string
	url: string
	file_size: number
	width: number
	height: number
	duration: number
}

interface MediaViewerModalProps {
	isOpen: boolean
	onClose: () => void
	resources: MediaResource[]
	currentIndex: number
	onIndexChange: (index: number) => void
	productName: string
}

export function MediaViewerModal({
	isOpen,
	onClose,
	resources,
	currentIndex,
	onIndexChange,
	productName,
}: MediaViewerModalProps) {
	const [scale, setScale] = useState(1)
	const [position, setPosition] = useState({ x: 0, y: 0 })
	const [isDragging, setIsDragging] = useState(false)
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
	const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })
	const containerRef = useRef<HTMLDivElement>(null)
	const imageRef = useRef<HTMLDivElement>(null)

	const currentResource = resources[currentIndex]

	// Reset scale and position when modal opens or resource changes
	useEffect(() => {
		if (isOpen) {
			setScale(1)
			setPosition({ x: 0, y: 0 })
			setLastPosition({ x: 0, y: 0 })
		}
	}, [isOpen, currentIndex])

	// Handle keyboard events
	useEffect(() => {
		if (!isOpen) return

		const handleKeyDown = (e: KeyboardEvent) => {
			switch (e.key) {
				case "Escape":
					onClose()
					break
				case "ArrowLeft":
					e.preventDefault()
					if (currentIndex > 0) {
						onIndexChange(currentIndex - 1)
					}
					break
				case "ArrowRight":
					e.preventDefault()
					if (currentIndex < resources.length - 1) {
						onIndexChange(currentIndex + 1)
					}
					break
				case "+":
				case "=":
					e.preventDefault()
					handleZoomIn()
					break
				case "-":
					e.preventDefault()
					handleZoomOut()
					break
				case "0":
					e.preventDefault()
					handleReset()
					break
			}
		}

		document.addEventListener("keydown", handleKeyDown)
		return () => document.removeEventListener("keydown", handleKeyDown)
	}, [isOpen, currentIndex, resources.length])

	// Handle wheel zoom
	const handleWheel = useCallback(
		(e: React.WheelEvent) => {
			e.preventDefault()
			const delta = e.deltaY > 0 ? -0.1 : 0.1
			const newScale = Math.max(0.5, Math.min(5, scale + delta))
			setScale(newScale)
		},
		[scale]
	)

	// Handle mouse down for dragging
	const handleMouseDown = (e: React.MouseEvent) => {
		if (scale <= 1) return
		setIsDragging(true)
		setDragStart({ x: e.clientX, y: e.clientY })
	}

	// Handle mouse move for dragging
	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging || scale <= 1) return

		const deltaX = e.clientX - dragStart.x
		const deltaY = e.clientY - dragStart.y

		setPosition({
			x: lastPosition.x + deltaX,
			y: lastPosition.y + deltaY,
		})
	}

	// Handle mouse up for dragging
	const handleMouseUp = () => {
		if (isDragging) {
			setIsDragging(false)
			setLastPosition(position)
		}
	}

	// Zoom functions
	const handleZoomIn = () => {
		setScale((prev) => Math.min(5, prev + 0.5))
	}

	const handleZoomOut = () => {
		setScale((prev) => Math.max(0.5, prev - 0.5))
	}

	const handleReset = () => {
		setScale(1)
		setPosition({ x: 0, y: 0 })
		setLastPosition({ x: 0, y: 0 })
	}

	// Navigation functions
	const handlePrevious = () => {
		if (currentIndex > 0) {
			onIndexChange(currentIndex - 1)
		}
	}

	const handleNext = () => {
		if (currentIndex < resources.length - 1) {
			onIndexChange(currentIndex + 1)
		}
	}

	if (!currentResource) return null

	const isVideo = currentResource.mime.startsWith("video/")
	const isImage = currentResource.mime.startsWith("image/")

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="!min-w-[80vw] !min-h-[85vh] p-0 bg-black/95 border-none shadow-lg">
				{/* Header Controls */}
				<div className="absolute top-4 right-4 z-50 flex items-center gap-2">
					<Button
						variant="secondary"
						size="sm"
						onClick={handleReset}
						className="bg-black/50 text-white hover:bg-black/70"
					>
						<RotateCcw className="w-4 h-4" />
					</Button>
					<Button
						variant="secondary"
						size="sm"
						onClick={handleZoomOut}
						className="bg-black/50 text-white hover:bg-black/70"
					>
						<ZoomOut className="w-4 h-4" />
					</Button>
					<Button
						variant="secondary"
						size="sm"
						onClick={handleZoomIn}
						className="bg-black/50 text-white hover:bg-black/70"
					>
						<ZoomIn className="w-4 h-4" />
					</Button>
					<Button
						variant="secondary"
						size="sm"
						onClick={onClose}
						className="bg-black/50 text-white hover:bg-black/70"
					>
						<X className="w-4 h-4" />
					</Button>
				</div>

				{/* Navigation Arrows */}
				{resources.length > 1 && (
					<>
						<Button
							variant="secondary"
							size="sm"
							onClick={handlePrevious}
							disabled={currentIndex === 0}
							className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 text-white hover:bg-black/70 disabled:opacity-50"
						>
							<ChevronLeft className="w-6 h-6" />
						</Button>
						<Button
							variant="secondary"
							size="sm"
							onClick={handleNext}
							disabled={currentIndex === resources.length - 1}
							className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 text-white hover:bg-black/70 disabled:opacity-50"
						>
							<ChevronRight className="w-6 h-6" />
						</Button>
					</>
				)}

				{/* Media Container */}
				<div
					ref={containerRef}
					className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
					onWheel={handleWheel}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseUp}
					style={{
						userSelect: "none",
						WebkitUserSelect: "none",
						MozUserSelect: "none",
						msUserSelect: "none",
					}}
				>
					<div
						ref={imageRef}
						className="relative transition-transform duration-200 ease-out select-none"
						style={{
							transform: `scale(${scale}) translate(${position.x / scale}px, ${
								position.y / scale
							}px)`,
							cursor:
								scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
							userSelect: "none",
							WebkitUserSelect: "none",
							MozUserSelect: "none",
							msUserSelect: "none",
							WebkitUserDrag: "none",
							KhtmlUserSelect: "none",
							WebkitTouchCallout: "none",
						}}
					>
						{isImage && (
							<Image
								src={currentResource.url}
								alt={productName}
								width={currentResource.width}
								height={currentResource.height}
								className="max-w-[90vw] max-h-[90vh] object-contain select-none"
								style={{
									userSelect: "none",
									WebkitUserSelect: "none",
									MozUserSelect: "none",
									msUserSelect: "none",
									WebkitUserDrag: "none",
									KhtmlUserSelect: "none",
									WebkitTouchCallout: "none",
									pointerEvents: "none",
								}}
								unoptimized
								draggable={false}
							/>
						)}
						{isVideo && (
							<video
								src={currentResource.url}
								controls
								className="max-w-[90vw] max-h-[90vh] object-contain select-none"
								style={{
									userSelect: "none",
									WebkitUserSelect: "none",
									MozUserSelect: "none",
									msUserSelect: "none",
									WebkitUserDrag: "none",
									KhtmlUserSelect: "none",
									WebkitTouchCallout: "none",
								}}
								autoPlay
								loop
								draggable={false}
							>
								Your browser does not support the video tag.
							</video>
						)}
					</div>
				</div>

				{/* Footer Info */}
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
					{currentIndex + 1} / {resources.length}
					{scale !== 1 && (
						<span className="ml-2">• {Math.round(scale * 100)}%</span>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}
