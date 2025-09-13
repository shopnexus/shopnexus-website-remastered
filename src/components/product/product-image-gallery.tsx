"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel"

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
	const [selectedImage, setSelectedImage] = useState(0)
	const mainCarouselRef = useRef<any>(null)
	const thumbnailCarouselRef = useRef<any>(null)

	const handleImageChange = (index: number) => {
		setSelectedImage(index)
		// Sync both carousels
		if (mainCarouselRef.current) {
			mainCarouselRef.current.scrollTo(index)
		}
		if (thumbnailCarouselRef.current) {
			thumbnailCarouselRef.current.scrollTo(index)
		}
	}

	return (
		<div className="space-y-4">
			{/* Main Image Carousel */}
			<Carousel
				className="w-full touch-pan-x"
				opts={{
					loop: false,
					startIndex: selectedImage,
				}}
				setApi={(api) => {
					mainCarouselRef.current = api
					if (api) {
						api.on("select", () => {
							const newIndex = api.selectedScrollSnap()
							// handleImageChange(newIndex)
						})
					}
				}}
			>
				<CarouselContent>
					{resources.map((resource, index) => (
						<CarouselItem key={index} className="basis-full">
							<div className="relative aspect-square bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg overflow-hidden">
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
					startIndex: selectedImage,
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
								className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-colors ${
									selectedImage === index
										? "border-blue-600 ring-2 ring-blue-200"
										: "border-gray-200 hover:border-gray-300"
								}`}
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
		</div>
	)
}
