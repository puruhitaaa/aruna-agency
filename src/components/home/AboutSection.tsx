import { Play } from "lucide-react"
import Image from "next/image"

export function AboutSection() {
  return (
    <section className='w-full max-w-[1400px] mx-auto px-4 md:px-6 h-[500px] md:h-[600px] relative rounded-[2.5rem] overflow-hidden my-12 md:my-20'>
      <Image
        src='https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop'
        alt='Modern home interior'
        fill
        className='object-cover'
      />
      <div className='absolute inset-0 bg-black/30' />

      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all group'>
          <div className='w-12 h-12 md:w-14 md:h-14 bg-[#1A1A1A] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform'>
            <Play className='w-5 h-5 md:w-6 md:h-6 text-white fill-white ml-1' />
          </div>
        </div>
      </div>

      <div className='absolute bottom-0 left-0 right-0 p-6 md:p-12 flex flex-col md:flex-row justify-between items-end gap-6'>
        <h2 className='text-white text-3xl md:text-5xl font-semibold tracking-tight'>
          What is Aruna?
        </h2>

        <p className='text-white/90 text-sm md:text-base max-w-xl leading-relaxed md:text-right'>
          At Aruna, we believe that finding your ideal home should be an
          exciting and seamless journey. As a leading real estate agency in
          Indonesia, we are dedicated to guiding you through every step of the
          process, from discovering your perfect property to closing the deal
          with confidence.
        </p>
      </div>
    </section>
  )
}
