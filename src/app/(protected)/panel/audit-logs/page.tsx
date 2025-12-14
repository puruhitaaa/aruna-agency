import { notFound, redirect } from "next/navigation"
import { getSession } from "@/server/better-auth/server"
import { AuditLogsDataTable } from "./_components/audit-logs-data-table"

export default async function AuditLogsPage() {
  const session = await getSession()

  if (!session) redirect("/sign-in")

  if (session.user.role !== "admin") notFound()

  return (
    <div className='px-4 lg:px-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold tracking-tight'>Audit Logs</h1>
        <p className='text-muted-foreground'>
          View system activity and user action history.
        </p>
      </div>
      <AuditLogsDataTable />
    </div>
  )
}
