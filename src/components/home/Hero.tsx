import Image from "next/image"
import { SearchForm } from "./SearchForm"

export function Hero() {
  return (
    <section className='px-4 md:px-6 pb-12 pt-8 max-w-[1400px] mx-auto w-full flex flex-col gap-12'>
      <div className='flex flex-col md:flex-row justify-between items-start gap-8'>
        <h1 className='text-4xl md:text-6xl font-semibold tracking-tight max-w-4xl leading-none'>
          Guiding your path <br />
          to a new home in <br />
          Indonesia
        </h1>

        <div className='flex flex-col justify-between h-full gap-8 md:text-right max-w-md md:pt-4'>
          <p className='text-[10px] font-bold tracking-widest uppercase hidden md:block'>
            ©2025 Aruna Residence. All <br /> Rights Reserved
          </p>
          <p className='text-muted-foreground text-sm leading-relaxed md:self-end text-left md:text-right max-w-[300px]'>
            With expert guidance and a deep understanding of Indonesia's real
            estate landscape, we make your journey to a new home seamless and
            stress-free.
          </p>
        </div>
      </div>

      <div className='relative w-full h-[34rem] md:h-[38rem] rounded-[2.5rem] overflow-hidden shadow-2xl'>
        <Image
          src='https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop'
          alt='Modern container home in nature'
          fill
          className='object-cover'
          priority
        />

        {/* Search Form Overlay */}
        <div className='absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-10'>
          <SearchForm />
        </div>
      </div>
    </section>
  )
}
