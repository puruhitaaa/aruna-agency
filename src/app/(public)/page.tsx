import { AboutSection } from "@/components/home/AboutSection"
import { ContactSection } from "@/components/home/ContactSection"
import { DiscoverProperties } from "@/components/home/DiscoverProperties"
import { FaqSection } from "@/components/home/FaqSection"
import { FeaturedProperties } from "@/components/home/FeaturedProperties"
import { Hero } from "@/components/home/Hero"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"

export default function Home() {
  return (
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
  )
}
