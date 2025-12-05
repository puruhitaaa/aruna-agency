"use client"

import {
  IconBell,
  IconBuildingEstate,
  IconCalendarEvent,
  IconCreditCard,
  IconDashboard,
  IconHelp,
  IconHistory,
  IconSearch,
  IconSettings,
  IconUserCheck,
} from "@tabler/icons-react"
import Link from "next/link"
import type * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/panel/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Properties",
      url: "/panel/properties",
      icon: IconBuildingEstate,
    },
    {
      title: "Landlords",
      url: "/panel/landlords",
      icon: IconUserCheck,
    },
    {
      title: "Tours",
      url: "/panel/tours",
      icon: IconCalendarEvent,
    },
    {
      title: "Payments",
      url: "/panel/payments",
      icon: IconCreditCard,
    },
    {
      title: "Notifications",
      url: "/panel/notifications",
      icon: IconBell,
    },
    {
      title: "Audit Logs",
      url: "/panel/audit-logs",
      icon: IconHistory,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/search",
      icon: IconSearch,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:p-1.5!'
            >
              <Link href='/dashboard'>
                <IconBuildingEstate className='size-5!' />
                <span className='text-base font-semibold'>Aruna Agency</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
