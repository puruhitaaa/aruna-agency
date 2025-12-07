import { redirect } from "next/navigation"
import { getSession } from "@/server/better-auth/server"
import { PropertiesDataTable } from "./_components/properties-data-table"

export default async function PropertiesPage() {
  const session = await getSession()

  if (!session) redirect("/sign-in")

  return (
    <div className='px-4 lg:px-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold tracking-tight'>Properties</h1>
        <p className='text-muted-foreground'>
          Manage your property listings here.
        </p>
      </div>
      <PropertiesDataTable />
    </div>
  )
}
