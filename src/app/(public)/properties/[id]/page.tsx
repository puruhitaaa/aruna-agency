import { notFound } from "next/navigation"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import { PropertyAgent } from "@/components/properties/property-agent"
import { PropertyGallery } from "@/components/properties/property-gallery"
import { PropertyInfo } from "@/components/properties/property-info"
import { properties } from "@/lib/data"

interface PropertyDetailPageProps {
  params: Promise<{
    id: string
  }>
}

// Generate static params for all properties
export async function generateStaticParams() {
  return properties.map((property) => ({
    id: property.id,
  }))
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { id } = await params
  const property = properties.find((p) => p.id === id)

  if (!property) {
    notFound()
  }

  return (
    <main className='min-h-screen bg-background font-sans text-foreground'>
      <Navbar />

      <div className='max-w-[1400px] mx-auto px-4 md:px-6 py-8 flex flex-col gap-8 md:gap-12'>
        <PropertyGallery images={property.images} title={property.title} />

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
          <div className='lg:col-span-2'>
            <PropertyInfo property={property} />
          </div>
          <div className='lg:col-span-1'>
            <div className='sticky top-24'>
              <PropertyAgent agent={property.agent} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
