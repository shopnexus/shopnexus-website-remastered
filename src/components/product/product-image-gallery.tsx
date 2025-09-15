"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel"
import { MediaViewerModal } from "@/components/ui/media-viewer-modal"
import { cn } from "@/lib/utils"

interface Resource {
	id: number
	mime: string
	url: string
	file_size: number
	width: number
	height: number
	duration: number
}

interface ProductImageGalleryProps {
	resources: Resource[]
	productName: string
	promoId?: number
}

export function ProductImageGallery({
	resources,
	productName,
	promoId,
}: ProductImageGalleryProps) {
	const selectedImageRef = useRef(0)
	const mainCarouselRef = useRef<any>(null)
	const thumbnailCarouselRef = useRef<any>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalIndex, setModalIndex] = useState(0)

	// Initialize thumbnail styling on mount
	useEffect(() => {
		const thumbnailButtons = document.querySelectorAll(
			"[data-thumbnail-button]"
		)
		thumbnailButtons.forEach((button, i) => {
			const element = button as HTMLElement
			if (i === 0) {
				element.style.borderColor = "#2563eb"
				element.style.boxShadow = "0 0 0 2px rgba(37, 99, 235, 0.2)"
			} else {
				element.style.borderColor = "#e5e7eb"
				element.style.boxShadow = "none"
			}
		})
	}, [])

	const handleImageChange = (index: number) => {
		selectedImageRef.current = index

		// Update thumbnail styling manually
		const thumbnailButtons = document.querySelectorAll(
			"[data-thumbnail-button]"
		)
		thumbnailButtons.forEach((button, i) => {
			const element = button as HTMLElement
			if (i === index) {
				element.style.borderColor = "#2563eb"
				element.style.boxShadow = "0 0 0 2px rgba(37, 99, 235, 0.2)"
			} else {
				element.style.borderColor = "#e5e7eb"
				element.style.boxShadow = "none"
			}
		})

		// Sync both carousels
		if (mainCarouselRef.current) {
			mainCarouselRef.current.scrollTo(index)
		}
		if (thumbnailCarouselRef.current) {
			thumbnailCarouselRef.current.scrollTo(index)
		}
	}

	const handleImageClick = (index: number) => {
		setModalIndex(index)
		setIsModalOpen(true)
	}

	const handleModalClose = () => {
		setIsModalOpen(false)
	}

	const handleModalIndexChange = (index: number) => {
		setModalIndex(index)
		handleImageChange(index)
	}

	return (
		<div className="space-y-4">
			{/* Main Image Carousel */}
			<Carousel
				className="w-full touch-pan-x"
				opts={{
					loop: false,
					startIndex: selectedImageRef.current,
				}}
				setApi={(api) => {
					mainCarouselRef.current = api
					if (api) {
						api.on("select", () => {
							const newIndex = api.selectedScrollSnap()
							handleImageChange(newIndex)
						})
					}
				}}
			>
				<CarouselContent>
					{resources.map((resource, index) => (
						<CarouselItem key={index} className="basis-full">
							<div
								className="relative aspect-square bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-all duration-200 shadow-sm border border-gray-100"
								onClick={() => handleImageClick(index)}
							>
								<Image
									src={resource.url || "/placeholder.svg"}
									alt={productName}
									fill
									className="object-cover"
								/>
								{promoId && (
									<div className="absolute top-4 left-4">
										<Badge className="bg-red-600 text-white px-3 py-1 text-sm font-bold">
											{/* TODO: promo.title */}
										</Badge>
									</div>
								)}
								{/* Click to expand indicator */}
								<div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
									<div className="opacity-0 hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm rounded-full p-2">
										<svg
											className="w-6 h-6 text-white"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
											/>
										</svg>
									</div>
								</div>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>

			{/* Thumbnail Carousel */}
			<Carousel
				className="w-full touch-pan-x"
				opts={{
					loop: false,
					startIndex: selectedImageRef.current,
					align: "start",
				}}
				setApi={(api) => {
					thumbnailCarouselRef.current = api
					if (api) {
						api.on("select", () => {
							const newIndex = api.selectedScrollSnap()
							handleImageChange(newIndex)
						})
					}
				}}
			>
				<CarouselContent className="-ml-2">
					{resources.map((resource, index) => (
						<CarouselItem key={index} className="pl-2 basis-auto">
							<button
								onClick={() => {
									handleImageChange(index)
								}}
								className="flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all duration-200 border-gray-200 hover:border-gray-300 shadow-sm"
								data-thumbnail-button
							>
								<Image
									src={resource.url || "/placeholder.svg"}
									alt={`View ${index + 1}`}
									width={64}
									height={64}
									className="object-cover"
								/>
							</button>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>

			<div
				className={cn("z-50 absolute top-0 left-0 w-full h-full", {
					hidden: !isModalOpen,
				})}
			>
				{/* Media Viewer Modal */}
				<MediaViewerModal
					isOpen={isModalOpen}
					onClose={handleModalClose}
					resources={resources}
					currentIndex={modalIndex}
					onIndexChange={handleModalIndexChange}
					productName={productName}
				/>
			</div>
		</div>
	)
}
