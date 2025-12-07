import type { properties } from "@/server/db/schema"

/**
 * API Property type - inferred from the database schema
 * This is the type returned by the API endpoints
 */
export type ApiProperty = typeof properties.$inferSelect

/**
 * Property image for gallery display
 */
export interface PropertyImage {
  src: string
  width: number
  height: number
  alt?: string
}

/**
 * Formatted property for display in UI components
 * Maps API property fields to UI-friendly format
 */
export interface DisplayProperty {
  id: string
  title: string
  location: string
  beds: number
  baths: number
  area: number
  price: number
  description: string | null
  amenities: string[]
  images: PropertyImage[]
  mainImage: string
}

/**
 * Default image dimensions for API images (they don't have width/height)
 */
const DEFAULT_IMAGE_WIDTH = 2070
const DEFAULT_IMAGE_HEIGHT = 1380

/**
 * Converts an API property to a display-friendly format
 */
export function toDisplayProperty(property: ApiProperty): DisplayProperty {
  // Construct location from city + state
  const location = property.state
    ? `${property.city}, ${property.state}`
    : property.city

  // Transform image URLs to PropertyImage format
  const images: PropertyImage[] = (property.images ?? []).map((src) => ({
    src,
    width: DEFAULT_IMAGE_WIDTH,
    height: DEFAULT_IMAGE_HEIGHT,
    alt: property.title,
  }))

  return {
    id: property.id,
    title: property.title,
    location,
    beds: property.bedrooms,
    baths: Number(property.bathrooms),
    area: property.size,
    price: Number(property.price),
    description: property.description,
    amenities: property.features ?? [],
    images,
    mainImage:
      property.images?.[0] ??
      "https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?q=80&w=2070&auto=format&fit=crop",
  }
}
