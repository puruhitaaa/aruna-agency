"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function ContactSection() {
  return (
    <section className='py-12 md:py-20 max-w-[1400px] mx-auto w-full px-4 md:px-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 rounded-[2.5rem] overflow-hidden min-h-[600px]'>
        {/* Left Side - Image */}
        <div className='relative h-[400px] md:h-auto w-full group'>
          <Image
            src='https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop'
            alt='Modern wooden house exterior'
            fill
            className='object-cover'
          />
          <div className='absolute inset-0 bg-black/10' />

          {/* Navigation Buttons */}
          <div className='absolute bottom-8 right-8 flex gap-4'>
            <Button
              size='icon'
              variant='outline'
              className='rounded-full w-12 h-12 bg-black/20 border-white/20 text-white hover:bg-black/40 hover:text-white backdrop-blur-sm'
            >
              <ChevronLeft className='w-6 h-6' />
              <span className='sr-only'>Previous image</span>
            </Button>
            <Button
              size='icon'
              variant='outline'
              className='rounded-full w-12 h-12 bg-black/20 border-white/20 text-white hover:bg-black/40 hover:text-white backdrop-blur-sm'
            >
              <ChevronRight className='w-6 h-6' />
              <span className='sr-only'>Next image</span>
            </Button>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className='bg-[#1A1A1A] p-8 md:p-16 flex flex-col justify-center'>
          <div className='max-w-md w-full mx-auto space-y-8'>
            <h2 className='text-3xl md:text-4xl font-semibold text-white leading-tight'>
              Still haven't found what you're looking for?
            </h2>

            <form className='space-y-6'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label
                    htmlFor='firstName'
                    className='text-sm font-medium text-white/80'
                  >
                    First Name
                  </label>
                  <Input
                    id='firstName'
                    placeholder='First Name'
                    className='bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/20 h-12 rounded-xl'
                  />
                </div>
                <div className='space-y-2'>
                  <label
                    htmlFor='lastName'
                    className='text-sm font-medium text-white/80'
                  >
                    Last Name
                  </label>
                  <Input
                    id='lastName'
                    placeholder='Last Name'
                    className='bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/20 h-12 rounded-xl'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-white/80'>
                  I Want to
                </label>
                <Select>
                  <SelectTrigger className='bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:ring-white/20 h-12 rounded-xl'>
                    <SelectValue placeholder='Buy Property' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='buy'>Buy Property</SelectItem>
                    <SelectItem value='rent'>Rent Property</SelectItem>
                    <SelectItem value='sell'>Sell Property</SelectItem>
                    <SelectItem value='consult'>Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <label
                  htmlFor='notes'
                  className='text-sm font-medium text-white/80'
                >
                  Notes
                </label>
                <Textarea
                  id='notes'
                  className='bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/20 min-h-[120px] resize-none rounded-xl'
                />
              </div>

              <Button
                type='submit'
                size='lg'
                className='bg-white text-black hover:bg-white/90 rounded-full px-8 font-medium h-12 w-full md:w-auto'
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
