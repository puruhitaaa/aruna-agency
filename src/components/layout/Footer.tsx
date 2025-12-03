import { Facebook, Instagram, Send, Twitter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className='w-full flex flex-col'>
      {/* Top Bar */}
      <div className='max-w-[1400px] mx-auto w-full px-4 md:px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 text-sm font-medium'>
        <div className='uppercase tracking-wide text-center md:text-left'>
          ©2025 Aruna Residence. All Right Reserved
        </div>

        <nav className='flex items-center gap-6 md:gap-8 text-muted-foreground'>
          <Link href='#' className='hover:text-[#1A1A1A] transition-colors'>
            Home
          </Link>
          <Link href='#' className='hover:text-[#1A1A1A] transition-colors'>
            Properties
          </Link>
          <Link href='#' className='hover:text-[#1A1A1A] transition-colors'>
            Our Projects
          </Link>
          <Link href='#' className='hover:text-[#1A1A1A] transition-colors'>
            FAQs
          </Link>
          <Link href='#' className='hover:text-[#1A1A1A] transition-colors'>
            About Us
          </Link>
        </nav>

        <div className='flex items-center gap-4'>
          <Link
            href='#'
            className='w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A1A] text-white hover:bg-black transition-colors'
          >
            <Twitter className='w-4 h-4' />
            <span className='sr-only'>Twitter</span>
          </Link>
          <Link
            href='#'
            className='w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A1A] text-white hover:bg-black transition-colors'
          >
            <Send className='w-4 h-4' />
            <span className='sr-only'>Telegram</span>
          </Link>
          <Link
            href='#'
            className='w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A1A] text-white hover:bg-black transition-colors'
          >
            <Facebook className='w-4 h-4' />
            <span className='sr-only'>Facebook</span>
          </Link>
          <Link
            href='#'
            className='w-8 h-8 flex items-center justify-center rounded-full bg-[#1A1A1A] text-white hover:bg-black transition-colors'
          >
            <Instagram className='w-4 h-4' />
            <span className='sr-only'>Instagram</span>
          </Link>
        </div>
      </div>

      {/* Large Image Section */}
      <div className='relative w-full h-[300px] md:h-[600px] mt-4'>
        <Image
          src='https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=2070&auto=format&fit=crop'
          alt='Aruna Residence Exterior'
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-black/10' />

        <div className='absolute inset-0 flex items-center justify-center'>
          <h1 className='text-[15vw] font-bold text-white tracking-tighter leading-none select-none mix-blend-overlay'>
            ARUNA
          </h1>
        </div>
      </div>
    </footer>
  )
}
