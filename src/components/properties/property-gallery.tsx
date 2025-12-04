"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface PropertyGalleryProps {
  images: string[]
  title: string
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  if (!images || images.length === 0) return null

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 rounded-3xl overflow-hidden h-[50vh] md:h-[60vh]'>
      <div className='relative h-full w-full md:col-span-1'>
        <Image
          src={images[0]}
          alt={title}
          fill
          className='object-cover hover:scale-105 transition-transform duration-500 cursor-pointer'
          priority
        />
      </div>
      <div className='hidden md:grid grid-rows-2 gap-4 h-full'>
        {images.slice(1, 3).map((image, index) => (
          <div key={index} className='relative h-full w-full overflow-hidden'>
            <Image
              src={image}
              alt={`${title} - ${index + 1}`}
              fill
              className='object-cover hover:scale-105 transition-transform duration-500 cursor-pointer'
            />
          </div>
        ))}
        {images.length < 2 && (
            // Fallback if only 1 image is provided but we want to keep layout or just hide
             <div className="bg-muted/20 flex items-center justify-center text-muted-foreground">
                No more images
             </div>
        )}
         {images.length < 3 && images.length >= 2 && (
             <div className="bg-muted/20 flex items-center justify-center text-muted-foreground">
                No more images
             </div>
        )}
      </div>
    </div>
  )
}
