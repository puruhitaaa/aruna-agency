"use client"

import { useQuery } from "@tanstack/react-query"
import { ArrowUpRight, Loader2 } from "lucide-react"
import Link from "next/link"

import { PropertyCard } from "@/components/properties/property-card"
import { api } from "@/lib/eden"
import { toDisplayProperty } from "@/types/property"

// Query key factory for discover properties (homepage)
const discoverPropertiesKeys = {
  all: ["discover-properties"] as const,
  featured: () => [...discoverPropertiesKeys.all, "featured"] as const,
}

export function DiscoverProperties() {
  const {
    data: properties = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: discoverPropertiesKeys.featured(),
    queryFn: async () => {
      const response = await api.properties.get({
        query: {
          status: "published",
          limit: 6,
        },
      })
      if (response.error) {
        throw new Error("Failed to fetch properties")
      }
      // Transform API properties to display format
      return (response.data?.data ?? []).map(toDisplayProperty)
    },
  })

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

      {isLoading ? (
        <div className='flex items-center justify-center py-20'>
          <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        </div>
      ) : error ? (
        <div className='flex items-center justify-center py-20'>
          <p className='text-destructive'>Failed to load properties</p>
        </div>
      ) : properties.length === 0 ? (
        <div className='flex items-center justify-center py-20'>
          <p className='text-muted-foreground'>No properties found</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12'>
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  )
}
