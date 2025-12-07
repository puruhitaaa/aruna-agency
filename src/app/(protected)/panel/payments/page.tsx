import { redirect } from "next/navigation"
import { getSession } from "@/server/better-auth/server"
import { PaymentsDataTable } from "./_components/payments-data-table"

export default async function PaymentsPage() {
  const session = await getSession()

  if (!session) redirect("/sign-in")

  return (
    <div className='px-4 lg:px-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold tracking-tight'>Payments</h1>
        <p className='text-muted-foreground'>
          Track and manage all payment transactions.
        </p>
      </div>
      <PaymentsDataTable />
    </div>
  )
}
