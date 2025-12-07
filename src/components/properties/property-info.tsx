import { Bath, Bed, Check, MapPin, Maximize } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import type { DisplayProperty } from "@/types/property"

interface PropertyInfoProps {
  property: DisplayProperty
}

export function PropertyInfo({ property }: PropertyInfoProps) {
  return (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <MapPin className='w-4 h-4' />
              <span className='text-sm'>{property.location}</span>
            </div>
            <h1 className='text-3xl md:text-4xl font-semibold tracking-tight'>
              {property.title}
            </h1>
          </div>
          <div className='text-2xl md:text-3xl font-bold text-primary'>
            {property.price.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </div>
        </div>

        <div className='flex items-center gap-6 text-sm md:text-base text-muted-foreground border-y py-4 mt-2'>
          <div className='flex items-center gap-2'>
            <Bed className='w-5 h-5' />
            <span>{property.beds} Beds</span>
          </div>
          <div className='flex items-center gap-2'>
            <Bath className='w-5 h-5' />
            <span>{property.baths} Baths</span>
          </div>
          <div className='flex items-center gap-2'>
            <Maximize className='w-5 h-5' />
            <span>{property.area} m²</span>
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        <h2 className='text-xl font-semibold'>Description</h2>
        <p className='text-muted-foreground leading-relaxed'>
          {property.description}
        </p>
      </div>

      <Separator />

      <div className='space-y-4'>
        <h2 className='text-xl font-semibold'>Amenities</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          {property.amenities.map((amenity) => (
            <div
              key={amenity}
              className='flex items-center gap-2 text-muted-foreground'
            >
              <div className='bg-primary/10 p-1 rounded-full'>
                <Check className='w-3 h-3 text-primary' />
              </div>
              <span className='text-sm'>{amenity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
