"use client"

import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import Image from "next/image"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

interface Property {
  id: string
  title: string
  location: string
  description: string
  image: string
}

const properties: Property[] = [
  {
    id: "1",
    title: "Griya Asri Tamansari",
    location: "Sleman, Yogyakarta",
    description:
      "Nestled in the serene landscapes of Sleman, Taman Harmoni Village offers a perfect blend of modern living and natural tranquility.",
    image:
      "https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Permata Indah Residence",
    location: "Bantul, Yogyakarta",
    description:
      "Experience luxury living with our premium residences in Bantul, featuring state-of-the-art amenities and breathtaking views.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Skyline Apartments",
    location: "Depok, Sleman",
    description:
      "Modern apartments in the heart of the city, perfect for young professionals seeking convenience and style.",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Villa Kusuma",
    location: "Kaliurang, Yogyakarta",
    description:
      "A private retreat in the cool hills of Kaliurang, offering exclusive villas with private pools and gardens.",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
  },
]

export function FeaturedProperties() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  const activeProperty = properties[current]

  return (
    <section className='py-12 md:py-20 max-w-[1400px] mx-auto w-full px-4 md:px-6 flex flex-col gap-12'>
      <div className='text-center space-y-4'>
        <h2 className='text-4xl md:text-5xl font-semibold tracking-tight'>
          Explore Our Property Listings
        </h2>
        <p className='text-muted-foreground max-w-2xl mx-auto'>
          From cozy apartments to spacious family homes, our diverse listings
          cater to various needs and preferences.
        </p>

        <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-white shadow-sm mt-4'>
          <MapPin className='w-4 h-4 text-muted-foreground' />
          <span className='text-sm font-medium text-muted'>
            Yogyakarta, Indonesia
          </span>
        </div>
      </div>

      <div className='relative'>
        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            loop: true,
          }}
          className='w-full'
        >
          <CarouselContent className='-ml-4 md:-ml-8'>
            {properties.map((property, index) => (
              <CarouselItem
                key={property.id}
                className='pl-4 md:pl-8 md:basis-1/2 lg:basis-[60%] transition-all duration-300'
              >
                <div
                  className={cn(
                    "relative aspect-[4/3] rounded-[2rem] overflow-hidden group cursor-pointer transition-all duration-500",
                    index === current
                      ? "scale-100 shadow-2xl"
                      : "scale-95 opacity-70 blur-[1px]"
                  )}
                >
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className='object-cover'
                  />
                  <div className='absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors' />

                  {/* Details Overlay - Only visible on active/hover */}
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300",
                      index === current && "group-hover:opacity-100"
                    )}
                  >
                    <div className='w-24 h-24 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white font-medium'>
                      Details
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Active Property Details & Navigation */}
      <div className='flex flex-col md:flex-row justify-between md:items-end gap-8 mt-4 px-2'>
        <div className='space-y-2 flex-1'>
          <h3 className='text-2xl font-semibold'>{activeProperty?.title}</h3>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <MapPin className='w-4 h-4' />
            <span className='text-sm'>{activeProperty?.location}</span>
          </div>
        </div>

        <p className='text-muted-foreground text-sm leading-relaxed max-w-md flex-1'>
          {activeProperty?.description}
        </p>

        <div className='flex items-center gap-4 self-center md:self-[initial]'>
          <Button
            variant='outline'
            size='icon'
            className='rounded-full w-12 h-12 border-border/50 hover:bg-[#1A1A1A] hover:text-white transition-colors'
            onClick={() => api?.scrollPrev()}
          >
            <ChevronLeft className='w-5 h-5' />
            <span className='sr-only'>Previous</span>
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='rounded-full w-12 h-12 border-border/50 hover:bg-[#1A1A1A] hover:text-white transition-colors'
            onClick={() => api?.scrollNext()}
          >
            <ChevronRight className='w-5 h-5' />
            <span className='sr-only'>Next</span>
          </Button>
        </div>
      </div>
    </section>
  )
}
