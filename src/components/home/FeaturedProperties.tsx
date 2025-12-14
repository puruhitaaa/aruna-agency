"use client"

import { useQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight, Loader2, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { api } from "@/lib/eden"
import { cn } from "@/lib/utils"
import { type DisplayProperty, toDisplayProperty } from "@/types/property"

// Query key factory for featured properties
const featuredPropertiesKeys = {
  all: ["featured-properties"] as const,
  list: () => [...featuredPropertiesKeys.all, "list"] as const,
}

export function FeaturedProperties() {
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  const {
    data: properties = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: featuredPropertiesKeys.list(),
    queryFn: async () => {
      const response = await api.properties.get({
        query: {
          status: "published",
          limit: 4,
        },
      })
      if (response.error) {
        throw new Error("Failed to fetch featured properties")
      }
      // Transform API properties to display format
      return (response.data?.data ?? []).map(toDisplayProperty)
    },
  })

  React.useEffect(() => {
    if (!carouselApi) {
      return
    }

    setCurrent(carouselApi.selectedScrollSnap())

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap())
    })
  }, [carouselApi])

  const activeProperty = properties[current]

  if (isLoading) {
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
        </div>
        <div className='flex items-center justify-center py-20'>
          <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        </div>
      </section>
    )
  }

  if (error) {
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
        </div>
        <div className='flex items-center justify-center py-20'>
          <p className='text-destructive'>Failed to load featured properties</p>
        </div>
      </section>
    )
  }

  if (properties.length === 0) {
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
        </div>
        <div className='flex items-center justify-center py-20'>
          <p className='text-muted-foreground'>No featured properties found</p>
        </div>
      </section>
    )
  }

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
          setApi={setCarouselApi}
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
                    src={property.mainImage}
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
                    <Link href={`/properties/${property.id}`}>
                      <div className='w-24 h-24 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white font-medium'>
                        Details
                      </div>
                    </Link>
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
            onClick={() => carouselApi?.scrollPrev()}
          >
            <ChevronLeft className='w-5 h-5' />
            <span className='sr-only'>Previous</span>
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='rounded-full w-12 h-12 border-border/50 hover:bg-[#1A1A1A] hover:text-white transition-colors'
            onClick={() => carouselApi?.scrollNext()}
          >
            <ChevronRight className='w-5 h-5' />
            <span className='sr-only'>Next</span>
          </Button>
        </div>
      </div>
    </section>
  )
}
