import { redirect } from "next/navigation"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { getSession } from "@/server/better-auth/server"
import data from "./data.json"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) redirect("/sign-in")

  return (
    <>
      <SectionCards />
      <div className='px-4 lg:px-6'>
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </>
  )
}
