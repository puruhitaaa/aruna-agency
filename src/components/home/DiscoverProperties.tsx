"use client"

import { ArrowUpRight, Bath, Bed, MapPin, Square } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Property {
  id: string
  title: string
  location: string
  beds: number
  baths: number
  area: number
  image: string
  className?: string
}

const properties: Property[] = [
  {
    id: "1",
    title: "Griya Asri Tamansari",
    location: "Bogor Tengah",
    beds: 4,
    baths: 2.5,
    area: 410,
    image:
      "https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?q=80&w=2070&auto=format&fit=crop",
    className: "md:col-span-1 md:row-span-2 aspect-[4/5]",
  },
  {
    id: "2",
    title: "Arjuna Hills Estate",
    location: "Gunungkidul, Yogyakarta",
    beds: 4,
    baths: 2.5,
    area: 410,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    className: "aspect-[4/3]",
  },
  {
    id: "3",
    title: "Nirwana Residence",
    location: "Semarang Selatan",
    beds: 4,
    baths: 2.5,
    area: 410,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    className: "aspect-[4/3]",
  },
  {
    id: "4",
    title: "Serenity Heights",
    location: "Malang Barat",
    beds: 4,
    baths: 2.5,
    area: 410,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
    className: "aspect-[4/3]",
  },
  {
    id: "5",
    title: "Taman Asri Estate",
    location: "Jakarta Selatan",
    beds: 4,
    baths: 2.5,
    area: 410,
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
    className: "aspect-[4/3]",
  },
  {
    id: "6",
    title: "Sentosa Hills",
    location: "Surabaya Timur",
    beds: 4,
    baths: 2.5,
    area: 410,
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1984&auto=format&fit=crop",
    className: "md:col-span-1 md:row-span-2 aspect-[4/5]",
  },
]

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
          href='#'
          className='group flex items-center gap-2 font-medium hover:text-muted-foreground transition-colors whitespace-nowrap'
        >
          See All Properties
          <ArrowUpRight className='w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform' />
        </Link>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12'>
        {properties.map((property) => (
          <div
            key={property.id}
            className={cn("flex flex-col gap-4 group", property.className)}
          >
            <div className='relative w-full h-full rounded-[2rem] overflow-hidden'>
              <Image
                src={property.image}
                alt={property.title}
                fill
                className='object-cover transition-transform duration-700 group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />

              {/* Details Overlay */}
              <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <div className='w-24 h-24 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white font-medium cursor-pointer transform scale-90 group-hover:scale-100 transition-transform duration-300'>
                  Details
                </div>
              </div>
            </div>

            <div className='space-y-3'>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
                <h3 className='text-xl font-semibold'>{property.title}</h3>
                <div className='flex items-center gap-1.5 text-muted-foreground'>
                  <MapPin className='w-4 h-4' />
                  <span className='text-sm'>{property.location}</span>
                </div>
              </div>

              <div className='flex items-center gap-6 text-muted-foreground text-sm font-medium'>
                <div className='flex items-center gap-2'>
                  <Bed className='w-4 h-4' />
                  <span>{property.beds}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Bath className='w-4 h-4' />
                  <span>{property.baths}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Square className='w-4 h-4' />
                  <span>{property.area} m²</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
