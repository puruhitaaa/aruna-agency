export interface Property {
  id: string
  title: string
  location: string
  beds: number
  baths: number
  area: number
  image: string
  className?: string
  aspectRatio?: string
}

export const properties: Property[] = [
  {
    id: "1",
    title: "Griya Asri Tamansari",
    location: "Bogor Tengah",
    beds: 4,
    baths: 2.5,
    area: 410,
    image:
      "https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?q=80&w=2070&auto=format&fit=crop",
    className: "md:col-span-1 md:row-span-2",
    aspectRatio: "aspect-[4/5]",
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
    className: "",
    aspectRatio: "aspect-[4/3]",
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
    className: "",
    aspectRatio: "aspect-[4/3]",
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
    className: "",
    aspectRatio: "aspect-[4/3]",
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
    className: "",
    aspectRatio: "aspect-[4/3]",
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
    className: "md:col-span-1 md:row-span-2",
    aspectRatio: "aspect-[4/5]",
  },
]
