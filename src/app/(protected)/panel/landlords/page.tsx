"use client"

import { LandlordsDataTable } from "./_components/landlords-data-table"

export default function LandlordsPage() {
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
