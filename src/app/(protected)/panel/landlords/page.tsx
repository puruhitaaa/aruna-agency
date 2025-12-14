import { notFound, redirect } from "next/navigation"
import { getSession } from "@/server/better-auth/server"

import { LandlordsDataTable } from "./_components/landlords-data-table"

export default async function LandlordsPage() {
  const session = await getSession()

  if (!session) redirect("/sign-in")

  if (session.user.role !== "admin") notFound()

  return (
    <div className='px-4 lg:px-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold tracking-tight'>Landlords</h1>
        <p className='text-muted-foreground'>
          Manage landlord profiles and verification status.
        </p>
      </div>
      <LandlordsDataTable />
    </div>
  )
}
