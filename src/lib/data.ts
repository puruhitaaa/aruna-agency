export interface Agent {
  name: string
  image: string
  phone: string
  email: string
}

export interface Property {
  id: string
  title: string
  location: string
  beds: number
  baths: number
  area: number
  price: number
  description: string
  amenities: string[]
  images: string[]
  image: string // Main image for card
  agent: Agent
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
    price: 450000,
    description:
      "Nestled in the heart of Bogor, Griya Asri Tamansari offers a perfect blend of modern luxury and natural serenity. This exquisite property features spacious living areas, a state-of-the-art kitchen, and a landscaped garden that provides a peaceful retreat from the city bustle. With easy access to local amenities and stunning views of Mount Salak, it's an ideal home for families seeking comfort and style.",
    amenities: [
      "Swimming Pool",
      "Garden",
      "24/7 Security",
      "Smart Home System",
      "Garage",
      "Gym",
    ],
    images: [
      "https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
    ],
    image:
      "https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?q=80&w=2070&auto=format&fit=crop",
    agent: {
      name: "Sarah Tan",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop",
      phone: "+62 812 3456 7890",
      email: "sarah.tan@aruna.com",
    },
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
    price: 320000,
    description:
      "Experience the tranquility of Yogyakarta at Arjuna Hills Estate. This property boasts traditional Javanese architecture mixed with modern comforts, offering panoramic views of the surrounding hills.",
    amenities: ["Mountain View", "Terrace", "Traditional Joglo", "Wi-Fi"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    ],
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    agent: {
      name: "Budi Santoso",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop",
      phone: "+62 813 4567 8901",
      email: "budi.s@aruna.com",
    },
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
    price: 380000,
    description:
      "A contemporary masterpiece in Semarang Selatan. Nirwana Residence offers sleek design, premium finishes, and a prime location near the city center.",
    amenities: ["City View", "Elevator", "Rooftop Deck", "Fitness Center"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    ],
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    agent: {
      name: "Linda Wijaya",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
      phone: "+62 811 2345 6789",
      email: "linda.w@aruna.com",
    },
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
    price: 290000,
    description:
      "Escape to the cool climate of Malang at Serenity Heights. This family-friendly home features a large backyard and cozy interiors.",
    amenities: [
      "Fireplace",
      "Large Backyard",
      "BBQ Area",
      "Quiet Neighborhood",
    ],
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
    ],
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
    agent: {
      name: "Sarah Tan",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1888&auto=format&fit=crop",
      phone: "+62 812 3456 7890",
      email: "sarah.tan@aruna.com",
    },
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
    price: 850000,
    description:
      "Luxury living in the heart of South Jakarta. Taman Asri Estate provides exclusive access to top-tier facilities and is minutes away from the business district.",
    amenities: [
      "Private Pool",
      "Concierge",
      "Clubhouse Access",
      "High Security",
    ],
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
    ],
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
    agent: {
      name: "Budi Santoso",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop",
      phone: "+62 813 4567 8901",
      email: "budi.s@aruna.com",
    },
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
    price: 420000,
    description:
      "Modern minimalist design meets functionality at Sentosa Hills. Ideal for young professionals or families looking for a stylish upgrade.",
    amenities: [
      "Minimalist Design",
      "Smart Lighting",
      "Home Office",
      "Balcony",
    ],
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1984&auto=format&fit=crop",
    ],
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1984&auto=format&fit=crop",
    agent: {
      name: "Linda Wijaya",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
      phone: "+62 811 2345 6789",
      email: "linda.w@aruna.com",
    },
    className: "md:col-span-1 md:row-span-2",
    aspectRatio: "aspect-[4/5]",
  },
]
