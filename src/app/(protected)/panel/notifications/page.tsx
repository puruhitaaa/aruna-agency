"use client"

import { NotificationsDataTable } from "./_components/notifications-data-table"

export default function NotificationsPage() {
  return (
    <div className='px-4 lg:px-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold tracking-tight'>Notifications</h1>
        <p className='text-muted-foreground'>
          Manage user notifications and messages.
        </p>
      </div>
      <NotificationsDataTable />
    </div>
  )
}
