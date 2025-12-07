import { redirect } from "next/navigation"
import { getSession } from "@/server/better-auth/server"

import { NotificationsDataTable } from "./_components/notifications-data-table"

export default async function NotificationsPage() {
  const session = await getSession()

  if (!session) redirect("/sign-in")

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
