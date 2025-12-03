"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How do I start the process of buying a property with Aruna?",
    answer:
      "At Aruna, we make it simple for you to find your dream home. Start by browsing our property listings, and once you've found a property that interests you, contact our team to schedule a viewing and get expert advice on the next steps.",
  },
  {
    question: "What types of properties does Aruna offer?",
    answer:
      "We offer a diverse range of properties including modern apartments in the city, peaceful suburban homes, luxury villas, and commercial properties to suit various needs and budgets.",
  },
  {
    question: "Can Aruna assist with property financing or mortgages?",
    answer:
      "Yes, we have partnerships with leading banks and financial institutions. Our team can guide you through the mortgage application process and help you find the best financing options.",
  },
  {
    question: "Does Aruna provide property management services?",
    answer:
      "Absolutely. We offer comprehensive property management services for investors and homeowners, including tenant screening, rent collection, and maintenance.",
  },
  {
    question: "Are there any fees involved in working with Aruna?",
    answer:
      "Our fee structure is transparent. We charge a standard commission on successful transactions. There are no hidden fees for viewing properties or initial consultations.",
  },
]

export function FaqSection() {
  return (
    <section className='py-12 md:py-20 w-full overflow-hidden'>
      <div className='max-w-[1400px] mx-auto px-4 md:px-6 mb-20 md:mb-32'>
        <div className='flex flex-col md:flex-row gap-12 md:gap-24'>
          {/* Left Side */}
          <div className='md:w-1/3 space-y-6'>
            <h2 className='text-4xl md:text-5xl font-semibold tracking-tight'>
              Frequently Asked Question
            </h2>
            <p className='text-muted-foreground leading-relaxed max-w-sm'>
              Whether you're looking for a modern apartment in the city or a
              peaceful home in the suburbs, our listings offer something for
              everyone.
            </p>
          </div>

          {/* Right Side - Accordion */}
          <div className='md:w-2/3'>
            <Accordion
              type='single'
              collapsible
              className='w-full'
              defaultValue='item-0'
            >
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className='border-b-border/40'
                >
                  <AccordionTrigger className='text-lg font-medium hover:no-underline py-6'>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className='text-muted-foreground leading-relaxed pb-6'>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>

      {/* Running Text Marquee */}
      <div className='relative w-full border-y border-border/40 py-8 md:py-12 bg-background overflow-hidden'>
        <div className='flex whitespace-nowrap animate-marquee'>
          <span className='text-6xl md:text-9xl font-bold tracking-tighter mx-8 uppercase'>
            Find Comfort, Live with Aruna
          </span>
          <span className='text-6xl md:text-9xl font-bold tracking-tighter mx-8 uppercase'>
            Find Comfort, Live with Aruna
          </span>
          <span className='text-6xl md:text-9xl font-bold tracking-tighter mx-8 uppercase'>
            Find Comfort, Live with Aruna
          </span>
          <span className='text-6xl md:text-9xl font-bold tracking-tighter mx-8 uppercase'>
            Find Comfort, Live with Aruna
          </span>
        </div>
      </div>
    </section>
  )
}
