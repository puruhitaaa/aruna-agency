"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

function prettySegment(segment: string) {
  const map: Record<string, string> = {
    dashboard: "Dashboard",
    properties: "Properties",
    documents: "Documents",
    home: "Home",
    settings: "Settings",
    payments: "Payments",
    landlord: "Landlord",
    profile: "Profile",
  }

  if (map[segment]) return map[segment]

  // fallback -> replace dashes and capitalize
  return segment.replace(/-/g, " ").replace(/(^|\s)\S/g, (s) => s.toUpperCase())
}

export function SiteHeader() {
  const pathname = usePathname() || "/"
  const segments = pathname.split("/").filter(Boolean)
  const crumbs = [
    "/",
    ...segments.map((_, i) => `/${segments.slice(0, i + 1).join("/")}`),
  ]

  return (
    <header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
      <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
        <SidebarTrigger className='-ml-1' />
        <Separator
          orientation='vertical'
          className='mx-2 data-[orientation=vertical]:h-4'
        />

        {/* Breadcrumbs */}
        <div className='min-w-0 flex-auto'>
          <Breadcrumb>
            <BreadcrumbList>
              {crumbs.map((path, idx) => {
                const label =
                  idx === 0
                    ? "Home"
                    : prettySegment(path.split("/").pop() ?? "")
                const isLast = idx === crumbs.length - 1

                return (
                  <React.Fragment key={path}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={path}>{label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {idx !== crumbs.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className='ml-auto flex items-center gap-2'>
          <Button variant='ghost' asChild size='sm' className='hidden sm:flex'>
            <a
              href='https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard'
              rel='noopener noreferrer'
              target='_blank'
              className='dark:text-foreground'
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
