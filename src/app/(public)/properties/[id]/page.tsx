import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { PropertyGallery } from "@/components/properties/property-gallery"
import { PropertyInfo } from "@/components/properties/property-info"
import { api } from "@/lib/eden"
import { type ApiProperty, toDisplayProperty } from "@/types/property"

interface PropertyDetailPageProps {
  params: Promise<{
    id: string
  }>
}

// Type guard to check if the response is a property object
function isProperty(data: unknown): data is ApiProperty {
  return (
    typeof data === "object" && data !== null && "id" in data && "title" in data
  )
}

// Helper function to fetch property data (used by both generateMetadata and Page)
async function getProperty(id: string) {
  const response = await api.properties({ id }).get()

  if (response.error || !response.data || !isProperty(response.data)) {
    return null
  }

  return response.data
}

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const propertyData = await getProperty(id)

  if (!propertyData) {
    return {
      title: "Property Not Found | Aruna Agency",
      description: "The requested property could not be found.",
    }
  }

  const property = toDisplayProperty(propertyData)
  const formattedPrice = property.price.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  })

  // Base URL for canonical and OG URLs
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://aruna-agency.com"
  const propertyUrl = `${baseUrl}/properties/${id}`

  // Create SEO-optimized description
  const description =
    property.description?.slice(0, 160) ||
    `${property.title} - ${property.beds} bedrooms, ${property.baths} bathrooms, ${property.area}m² property in ${property.location}. ${formattedPrice}`

  return {
    title: `${property.title} | ${property.location} | Aruna Agency`,
    description,
    keywords: [
      property.title,
      property.location,
      "property",
      "real estate",
      "Indonesia",
      "rumah dijual",
      "properti",
      ...property.amenities,
    ],
    authors: [{ name: "Aruna Agency" }],
    creator: "Aruna Agency",
    publisher: "Aruna Agency",

    // Canonical URL
    alternates: {
      canonical: propertyUrl,
    },

    // Open Graph metadata for social sharing
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: propertyUrl,
      siteName: "Aruna Agency",
      title: `${property.title} - ${formattedPrice}`,
      description,
      images:
        property.images.length > 0
          ? property.images.slice(0, 4).map((img, index) => ({
              url: img.src,
              width: img.width,
              height: img.height,
              alt: `${property.title} - Image ${index + 1}`,
            }))
          : [
              {
                url: `${baseUrl}/og-default.png`,
                width: 1200,
                height: 630,
                alt: property.title,
              },
            ],
    },

    // Twitter Card metadata
    twitter: {
      card: "summary_large_image",
      title: `${property.title} | Aruna Agency`,
      description,
      images: property.images.length > 0 ? [property.images[0].src] : undefined,
    },

    // Additional robots directives
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

// JSON-LD structured data for rich search results
function generateStructuredData(
  property: ReturnType<typeof toDisplayProperty>,
  id: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://aruna-agency.com"

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `${baseUrl}/properties/${id}`,
    image: property.images.map((img) => img.src),
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location.split(",")[0]?.trim(),
      addressRegion: property.location.split(",")[1]?.trim() || "Indonesia",
      addressCountry: "ID",
    },
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
    },
    numberOfRooms: property.beds,
    numberOfBathroomsTotal: property.baths,
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.area,
      unitCode: "MTK", // Square meters
    },
    amenityFeature: property.amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity,
    })),
  }
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { id } = await params

  // Fetch property from API
  const propertyData = await getProperty(id)

  // Check for error or invalid response
  if (!propertyData) {
    notFound()
  }

  const property = toDisplayProperty(propertyData)
  const structuredData = generateStructuredData(property, id)

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <main className='min-h-screen bg-background font-sans text-foreground'>
        <Navbar />

        <article className='max-w-[1400px] mx-auto px-4 md:px-6 py-8 flex flex-col gap-8 md:gap-12'>
          <PropertyGallery images={property.images} title={property.title} />

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
            <div className='lg:col-span-2'>
              <PropertyInfo property={property} />
            </div>
            <aside className='lg:col-span-1'>
              <div className='sticky top-24'>
                {/* Contact card - simplified since we don't have agent data in API */}
                <div className='bg-muted/30 rounded-2xl p-6 border space-y-4'>
                  <h3 className='font-semibold text-lg'>
                    Interested in this property?
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Contact us for more information about this listing or to
                    schedule a viewing.
                  </p>
                  <a
                    href='/contact'
                    className='block w-full text-center bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors'
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </article>

        <Footer />
      </main>
    </>
  )
}
