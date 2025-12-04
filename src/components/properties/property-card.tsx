"use client"

import { Bath, Bed, MapPin, Square } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Property } from "@/lib/data"
import { useRouter } from "next/navigation"

interface PropertyCardProps {
  property: Property
  className?: string
  aspectRatio?: string
}

export function PropertyCard({
  property,
  className,
  aspectRatio = "aspect-[4/3]",
}: PropertyCardProps) {
  const router = useRouter()

  const handleDetails = () => void router.push(`/properties/${property.id}`)

  return (
    <div className={cn("flex flex-col gap-4 group", className)}>
      <div
        className={cn(
          "relative w-full rounded-[2rem] overflow-hidden",
          aspectRatio
        )}
      >
        <Image
          src={property.image}
          alt={property.title}
          fill
          className='object-cover transition-transform duration-700 group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />

        {/* Details Overlay */}
        <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
          <div
            className='w-24 h-24 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white font-medium cursor-pointer transform scale-90 group-hover:scale-100 transition-transform duration-300'
            onClick={handleDetails}
          >
            Details
          </div>
        </div>
      </div>

      <div className='space-y-3'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
          <h3 className='text-xl font-semibold'>{property.title}</h3>
          <div className='flex items-center gap-1.5 text-muted-foreground'>
            <MapPin className='w-4 h-4' />
            <span className='text-sm'>{property.location}</span>
          </div>
        </div>

        <div className='flex items-center gap-6 text-muted-foreground text-sm font-medium'>
          <div className='flex items-center gap-2'>
            <Bed className='w-4 h-4' />
            <span>{property.beds}</span>
          </div>
          <div className='flex items-center gap-2'>
            <Bath className='w-4 h-4' />
            <span>{property.baths}</span>
          </div>
          <div className='flex items-center gap-2'>
            <Square className='w-4 h-4' />
            <span>{property.area} m²</span>
          </div>
        </div>
      </div>
    </div>
  )
}
