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

  // Build crumbs: start with Dashboard (/panel/dashboard), then remaining segments after "panel"
  const crumbs: { path: string; label: string; isLink: boolean }[] = [
    { path: "/panel/dashboard", label: "Dashboard", isLink: true },
  ]

  // Add remaining segments (skip "panel" as it's already represented by Dashboard)
  segments.forEach((segment, i) => {
    if (segment === "panel") {
      // "Panel" should be text only, not a link
      crumbs.push({ path: "/panel", label: "Panel", isLink: false })
    } else {
      const path = `/${segments.slice(0, i + 1).join("/")}`
      crumbs.push({ path, label: prettySegment(segment), isLink: true })
    }
  })

  // Remove duplicate Dashboard entries and filter logic
  // If current path is /panel/dashboard, we only show Dashboard
  // If current path is /panel/something, we show: Dashboard > Panel > Something
  const filteredCrumbs = crumbs.filter((crumb, idx) => {
    // Always keep the first Dashboard
    if (idx === 0) return true
    // Remove "Panel" if we're on /panel/dashboard (would be redundant)
    if (crumb.label === "Panel" && pathname === "/panel/dashboard") return false
    // Remove duplicate Dashboard from the segments
    if (crumb.label === "Dashboard" && idx > 0) return false
    return true
  })

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
              {filteredCrumbs.map((crumb, idx) => {
                const isLast = idx === filteredCrumbs.length - 1

                return (
                  <React.Fragment key={`${crumb.path}-${crumb.label}`}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : crumb.isLink ? (
                        <BreadcrumbLink asChild>
                          <Link href={crumb.path}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <span className='text-muted-foreground'>
                          {crumb.label}
                        </span>
                      )}
                    </BreadcrumbItem>
                    {idx !== filteredCrumbs.length - 1 && (
                      <BreadcrumbSeparator />
                    )}
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* <div className='ml-auto flex items-center gap-2'>
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
        </div> */}
      </div>
    </header>
  )
}
