"use client"

import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

import { SearchForm } from "@/components/home/SearchForm"
import { PropertyCard } from "@/components/properties/property-card"
import { api } from "@/lib/eden"
import { toDisplayProperty } from "@/types/property"

// Query key factory for properties (public)
const propertiesKeys = {
  all: ["public-properties"] as const,
  lists: () => [...propertiesKeys.all, "list"] as const,
}

export function PropertiesGrid() {
  const {
    data: properties = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: propertiesKeys.lists(),
    queryFn: async () => {
      const response = await api.properties.get({
        query: {
          status: "published",
          limit: 50,
        },
      })
      if (response.error) {
        throw new Error("Failed to fetch properties")
      }
      // Transform API properties to display format
      return (response.data?.data ?? []).map(toDisplayProperty)
    },
  })

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center py-20 space-y-4'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        <p className='text-muted-foreground'>Loading properties...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center py-20 space-y-4'>
        <p className='text-destructive'>Failed to load properties</p>
        <p className='text-sm text-muted-foreground'>Please try again later.</p>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 space-y-4'>
        <p className='text-muted-foreground'>No properties found</p>
      </div>
    )
  }

  return (
    <>
      <div className='flex justify-center w-full'>
        <SearchForm />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8'>
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </>
  )
}
