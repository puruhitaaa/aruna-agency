"use client"

import { PaymentsDataTable } from "./_components/payments-data-table"

export default function PaymentsPage() {
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
