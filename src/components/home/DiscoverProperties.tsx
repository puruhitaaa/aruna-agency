"use client"

import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { properties } from "@/lib/data"
import { PropertyCard } from "@/components/properties/property-card"

export function DiscoverProperties() {
  return (
    <section className='py-12 md:py-20 max-w-[1400px] mx-auto w-full px-4 md:px-6 flex flex-col gap-12'>
      <div className='flex flex-col md:flex-row justify-between items-end gap-6'>
        <div className='space-y-4 max-w-2xl'>
          <h2 className='text-4xl md:text-5xl font-semibold tracking-tight'>
            Discover Aruna's Properties
          </h2>
          <p className='text-muted-foreground leading-relaxed'>
            Whether you're looking for a modern apartment in the city or a
            peaceful home in the suburbs, our listings offer something for
            everyone.
          </p>
        </div>

        <Link
          href='/properties'
          className='group flex items-center gap-2 font-medium hover:text-muted-foreground transition-colors whitespace-nowrap'
        >
          See All Properties
          <ArrowUpRight className='w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform' />
        </Link>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12'>
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            className={property.className}
            aspectRatio={property.aspectRatio}
          />
        ))}
      </div>
    </section>
  )
}
