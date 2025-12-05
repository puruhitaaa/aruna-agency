"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Eye } from "lucide-react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

export type AuditLog = {
  id: string
  userId: string | null
  action: string
  entityType: string | null
  entityId: string | null
  details: unknown
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
}

const actionVariants: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  create: "default",
  update: "secondary",
  delete: "destructive",
  login: "outline",
  logout: "outline",
}

function getActionVariant(
  action: string
): "default" | "secondary" | "destructive" | "outline" {
  const lowercaseAction = action.toLowerCase()
  for (const [key, variant] of Object.entries(actionVariants)) {
    if (lowercaseAction.includes(key)) {
      return variant
    }
  }
  return "outline"
}

export const columns: ColumnDef<AuditLog>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Timestamp' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return <div className='text-sm'>{date.toLocaleString()}</div>
    },
  },
  {
    accessorKey: "action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Action' />
    ),
    cell: ({ row }) => {
      const action = row.getValue("action") as string
      return (
        <Badge variant={getActionVariant(action)} className='capitalize'>
          {action.replace(/_/g, " ")}
        </Badge>
      )
    },
  },
  {
    accessorKey: "userId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User ID' />
    ),
    cell: ({ row }) => {
      const userId = row.getValue("userId") as string | null
      return (
        <div className='max-w-[100px] truncate font-mono text-xs'>
          {userId ?? <span className='text-muted-foreground'>System</span>}
        </div>
      )
    },
  },
  {
    accessorKey: "entityType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Entity Type' />
    ),
    cell: ({ row }) => {
      const entityType = row.getValue("entityType") as string | null
      return (
        <div className='capitalize'>
          {entityType ?? <span className='text-muted-foreground'>-</span>}
        </div>
      )
    },
  },
  {
    accessorKey: "entityId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Entity ID' />
    ),
    cell: ({ row }) => {
      const entityId = row.getValue("entityId") as string | null
      return (
        <div className='max-w-[100px] truncate font-mono text-xs'>
          {entityId ?? <span className='text-muted-foreground'>-</span>}
        </div>
      )
    },
  },
  {
    accessorKey: "ipAddress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='IP Address' />
    ),
    cell: ({ row }) => {
      const ipAddress = row.getValue("ipAddress") as string | null
      return (
        <div className='font-mono text-xs'>
          {ipAddress ?? <span className='text-muted-foreground'>-</span>}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const log = row.original

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>View details</span>
              <Eye className='h-4 w-4' />
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Audit Log Details</DialogTitle>
              <DialogDescription>
                {new Date(log.createdAt).toLocaleString()} - {log.action}
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Action
                  </p>
                  <p className='capitalize'>{log.action.replace(/_/g, " ")}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    User ID
                  </p>
                  <p className='font-mono text-sm'>{log.userId ?? "System"}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Entity Type
                  </p>
                  <p className='capitalize'>{log.entityType ?? "-"}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Entity ID
                  </p>
                  <p className='font-mono text-sm'>{log.entityId ?? "-"}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    IP Address
                  </p>
                  <p className='font-mono text-sm'>{log.ipAddress ?? "-"}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Timestamp
                  </p>
                  <p>{new Date(log.createdAt).toLocaleString()}</p>
                </div>
              </div>
              {log.userAgent && (
                <div>
                  <p className='text-sm font-medium text-muted-foreground'>
                    User Agent
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    {log.userAgent}
                  </p>
                </div>
              )}
              {log.details && (
                <div>
                  <p className='text-sm font-medium text-muted-foreground mb-2'>
                    Details
                  </p>
                  <ScrollArea className='h-[200px] rounded-md border p-4'>
                    <pre className='text-sm'>
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </ScrollArea>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )
    },
  },
]
