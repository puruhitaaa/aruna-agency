import type { Metadata } from "next"

import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { PropertiesGrid } from "./_components/properties-grid"

// SEO Metadata for the properties listing page
export const metadata: Metadata = {
  title: "Properties",
  description:
    "Browse our curated selection of exclusive properties in the most desirable locations across Indonesia. Find luxury homes, apartments, villas, and more.",
  keywords: [
    "properties for sale",
    "real estate listings",
    "homes Indonesia",
    "apartments for sale",
    "luxury villas",
    "property search",
    "rumah dijual",
    "properti Indonesia",
  ],
  alternates: {
    canonical: "/properties",
  },
  openGraph: {
    title: "Browse Properties | Aruna Agency",
    description:
      "Discover exclusive properties in prime locations across Indonesia. From modern apartments to luxury villas.",
    url: "/properties",
    type: "website",
  },
  twitter: {
    title: "Browse Properties | Aruna Agency",
    description:
      "Discover exclusive properties in prime locations across Indonesia.",
  },
}

// JSON-LD structured data for the property listing page
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: process.env.NEXT_PUBLIC_APP_URL || "https://aruna-agency.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Properties",
      item: `${
        process.env.NEXT_PUBLIC_APP_URL || "https://aruna-agency.com"
      }/properties`,
    },
  ],
}

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Properties for Sale",
  description:
    "Browse our curated selection of exclusive properties in the most desirable locations across Indonesia.",
  url: `${
    process.env.NEXT_PUBLIC_APP_URL || "https://aruna-agency.com"
  }/properties`,
  isPartOf: {
    "@type": "WebSite",
    name: "Aruna Agency",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://aruna-agency.com",
  },
}

export default function PropertiesPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />

      <main className='min-h-screen bg-background flex flex-col'>
        <Navbar />

        <article className='flex-1 container mx-auto px-4 md:px-6 py-12 space-y-12'>
          <header className='flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto mt-8'>
            <h1 className='text-4xl md:text-5xl font-bold tracking-tight'>
              Find Your Dream Property
            </h1>
            <p className='text-muted-foreground text-lg leading-relaxed'>
              Browse our curated selection of exclusive properties found in the
              most desirable locations.
            </p>
          </header>

          <PropertiesGrid />
        </article>

        <Footer />
      </main>
    </>
  )
}
