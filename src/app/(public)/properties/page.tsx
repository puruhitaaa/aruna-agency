import { SearchForm } from "@/components/home/SearchForm"
import { PropertyCard } from "@/components/properties/property-card"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { properties } from "@/lib/data"

export default function PropertiesPage() {
  return (
    <main className='min-h-screen bg-background flex flex-col'>
      <Navbar />

      <div className='flex-1 container mx-auto px-4 md:px-6 py-12 space-y-12'>
        <div className='flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto mt-8'>
          <h1 className='text-4xl md:text-5xl font-bold tracking-tight'>
            Find Your Dream Property
          </h1>
          <p className='text-muted-foreground text-lg leading-relaxed'>
            Browse our curated selection of exclusive properties found in the
            most desirable locations.
          </p>
        </div>

        <div className='flex justify-center w-full'>
          <SearchForm />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8'>
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  )
}
