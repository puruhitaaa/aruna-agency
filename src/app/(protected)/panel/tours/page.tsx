import { redirect } from "next/navigation"
import { getSession } from "@/server/better-auth/server"
import { ToursDataTable } from "./_components/tours-data-table"

export default async function ToursPage() {
  const session = await getSession()

  if (!session) redirect("/sign-in")

  return (
    <div className='px-4 lg:px-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold tracking-tight'>Tours</h1>
        <p className='text-muted-foreground'>
          Manage property tour schedules and appointments.
        </p>
      </div>
      <ToursDataTable />
    </div>
  )
}
