import type { Metadata } from "next"

import { AboutSection } from "@/components/home/AboutSection"
import { ContactSection } from "@/components/home/ContactSection"
import { DiscoverProperties } from "@/components/home/DiscoverProperties"
import { FaqSection } from "@/components/home/FaqSection"
import { FeaturedProperties } from "@/components/home/FeaturedProperties"
import { Hero } from "@/components/home/Hero"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"

// SEO Metadata for the homepage
export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to Aruna Agency - Your trusted partner in finding premium real estate properties across Indonesia. Browse luxury homes, apartments, and villas in prime locations.",
  keywords: [
    "Aruna Agency",
    "real estate Indonesia",
    "luxury properties",
    "homes for sale",
    "apartments Indonesia",
    "villa Bali",
    "property Jakarta",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Aruna Agency | Premium Real Estate in Indonesia",
    description:
      "Your trusted partner in finding premium real estate properties across Indonesia. Browse luxury homes, apartments, and villas.",
    url: "/",
    type: "website",
  },
}

// JSON-LD structured data for the organization
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Aruna Agency",
  description:
    "Premium real estate agency specializing in luxury properties across Indonesia.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://aruna-agency.com",
  logo: `${
    process.env.NEXT_PUBLIC_APP_URL || "https://aruna-agency.com"
  }/logo.png`,
  image: `${
    process.env.NEXT_PUBLIC_APP_URL || "https://aruna-agency.com"
  }/og-image.png`,
  address: {
    "@type": "PostalAddress",
    addressCountry: "ID",
  },
  areaServed: {
    "@type": "Country",
    name: "Indonesia",
  },
  sameAs: [
    // Add social media links when available
    // "https://www.facebook.com/arunaagency",
    // "https://www.instagram.com/arunaagency",
  ],
}

// JSON-LD for website search action
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Aruna Agency",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://aruna-agency.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${
        process.env.NEXT_PUBLIC_APP_URL || "https://aruna-agency.com"
      }/properties?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
}

export default function Home() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      <main className='min-h-screen bg-background font-sans text-foreground overflow-x-hidden'>
        <Navbar />
        <Hero />
        <AboutSection />
        <FeaturedProperties />
        <DiscoverProperties />
        <ContactSection />
        <FaqSection />
        <Footer />
      </main>
    </>
  )
}
