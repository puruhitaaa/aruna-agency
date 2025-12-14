"use client"

import { Building2, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className='flex items-center justify-between px-6 py-6 max-w-[1400px] mx-auto w-full bg-background'>
      <div className='flex items-center gap-12'>
        <div className='hidden lg:flex items-center gap-8 text-sm font-medium text-muted-foreground/80'>
          <Link
            href='/'
            className={cn(
              "transition-colors",
              isActive("/")
                ? "text-foreground font-semibold"
                : "hover:text-foreground"
            )}
          >
            Home
          </Link>
          <Link
            href='/properties'
            className={cn(
              "transition-colors",
              isActive("/properties")
                ? "text-foreground font-semibold"
                : "hover:text-foreground"
            )}
          >
            Properties
          </Link>
          <Link
            href='#'
            className={cn(
              "transition-colors",
              isActive("/projects")
                ? "text-foreground font-semibold"
                : "hover:text-foreground"
            )}
          >
            Our Projects
          </Link>
          <Link
            href='#'
            className={cn(
              "transition-colors",
              isActive("/faqs")
                ? "text-foreground font-semibold"
                : "hover:text-foreground"
            )}
          >
            FAQs
          </Link>
          <Link
            href='#'
            className={cn(
              "transition-colors",
              isActive("/about")
                ? "text-foreground font-semibold"
                : "hover:text-foreground"
            )}
          >
            About Us
          </Link>
        </div>
      </div>

      <div className='absolute left-1/2 -translate-x-1/2 flex items-center gap-2 font-bold text-2xl tracking-tight'>
        <Building2 className='h-6 w-6' strokeWidth={2.5} />
        <span>Aruna</span>
      </div>

      <div className='flex items-center gap-6'>
        <div className='hidden lg:flex items-center gap-6'>
          <Link
            href={`/sign-in/?callbackUrl=${pathname}`}
            className='text-sm font-medium hover:text-foreground transition-colors'
          >
            Sign in
          </Link>
          <Button
            variant='outline'
            className='rounded-full px-5 font-medium border-foreground/20 hover:bg-foreground hover:text-background transition-all'
          >
            Book a Call
          </Button>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant='ghost' size='icon' className='lg:hidden'>
              <Menu className='h-6 w-6' />
              <span className='sr-only'>Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='right' className='w-[300px] sm:w-[400px]'>
            <SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
            <div className='flex flex-col gap-8 mt-8 p-8'>
              <div className='flex flex-col gap-4 text-lg font-medium'>
                <Link
                  href='/'
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "transition-colors",
                    isActive("/")
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Home
                </Link>
                <Link
                  href='/properties'
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "transition-colors",
                    isActive("/properties")
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Properties
                </Link>
                <Link
                  href='#'
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "transition-colors",
                    isActive("/projects")
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Our Projects
                </Link>
                <Link
                  href='#'
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "transition-colors",
                    isActive("/faqs")
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  FAQs
                </Link>
                <Link
                  href='#'
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "transition-colors",
                    isActive("/about")
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  About Us
                </Link>
              </div>
              <div className='h-px bg-border' />
              <div className='flex flex-col gap-4'>
                <Link
                  href={`/sign-in/?callbackUrl=${pathname}`}
                  onClick={() => setIsOpen(false)}
                  className='text-lg font-medium text-muted-foreground hover:text-foreground transition-colors'
                >
                  Sign in
                </Link>
                <Button
                  className='w-full rounded-full font-medium'
                  onClick={() => setIsOpen(false)}
                >
                  Book a Call
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
