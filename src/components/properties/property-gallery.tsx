"use client"

import {
  MediaItem,
  MediaLightbox,
} from "@/components/properties/media-lightbox"
import { PropertyImage } from "@/lib/data"
import { ImageIcon, Play, Video } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface PropertyGalleryProps {
  images: PropertyImage[]
  videos?: string[]
  title: string
}

export function PropertyGallery({
  images,
  videos = [],
  title,
}: PropertyGalleryProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const allMedia: MediaItem[] = [
    ...images.map((img) => ({
      type: "image" as const,
      url: img.src,
      width: img.width,
      height: img.height,
      alt: title,
      title: title,
    })),
    ...videos.map((url) => ({ type: "video" as const, url })),
  ]

  const handleMediaClick = (index: number) => {
    setLightboxIndex(index)
    setIsLightboxOpen(true)
  }

  if (!images || images.length === 0) return null

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 rounded-3xl overflow-hidden h-[50vh] md:h-[60vh] relative group'>
        {/* Main Image (Left) */}
        <div
          className='relative h-full w-full md:col-span-1 cursor-pointer overflow-hidden'
          onClick={() => handleMediaClick(0)}
        >
          <Image
            src={images[0].src}
            alt={title}
            fill
            className='object-cover hover:scale-105 transition-transform duration-500'
            priority
          />
          <div className='absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors' />
        </div>

        {/* Right Side Grid */}
        <div className='hidden md:grid grid-rows-2 gap-4 h-full'>
          {images.slice(1, 3).map((image, index) => (
            <div
              key={index}
              className='relative h-full w-full overflow-hidden cursor-pointer'
              onClick={() => handleMediaClick(index + 1)}
            >
              <Image
                src={image.src}
                alt={`${title} - ${index + 1}`}
                fill
                className='object-cover hover:scale-105 transition-transform duration-500'
              />
              <div className='absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors' />
            </div>
          ))}

          {/* Fallback/Empty states if needed - logic kept from previous version but simplified */}
          {images.length < 3 && (
            <div className='bg-muted/20 flex items-center justify-center text-muted-foreground'>
              {/* Placeholder for layout consistency */}
            </div>
          )}
        </div>

        {/* View All Button */}
        <button
          onClick={() => handleMediaClick(0)}
          className='absolute bottom-4 right-4 bg-white/90 hover:bg-white text-black px-4 py-2 rounded-full font-medium text-sm shadow-lg transition-all flex items-center gap-2 backdrop-blur-sm z-10'
        >
          <ImageIcon className='w-4 h-4' />
          View all photos ({images.length})
          {videos.length > 0 && (
            <>
              <span className='mx-1'>•</span>
              <Video className='w-4 h-4' />
              {videos.length} Videos
            </>
          )}
        </button>
      </div>

      <MediaLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        media={allMedia}
        initialIndex={lightboxIndex}
      />
    </>
  )
}
