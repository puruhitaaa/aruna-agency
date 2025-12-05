"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Tour = {
  id: string
  propertyId: string
  agentId: string | null
  buyerId: string
  date: Date
  status: "pending" | "confirmed" | "cancelled" | "completed"
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

const statusVariants: Record<
  Tour["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  confirmed: "default",
  cancelled: "destructive",
  completed: "outline",
}

type ColumnActions = {
  onEdit: (tour: Tour) => void
  onDelete: (id: string) => void
}

export const columns = ({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<Tour>[] => [
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
    accessorKey: "propertyId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Property ID' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[120px] truncate font-mono text-xs'>
        {row.getValue("propertyId")}
      </div>
    ),
  },
  {
    accessorKey: "buyerId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Buyer ID' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[120px] truncate font-mono text-xs'>
        {row.getValue("buyerId")}
      </div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"))
      return (
        <div>
          {date.toLocaleDateString()}{" "}
          {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as Tour["status"]
      return (
        <Badge variant={statusVariants[status]} className='capitalize'>
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "agentId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Agent' />
    ),
    cell: ({ row }) => {
      const agentId = row.getValue("agentId") as string | null
      return (
        <div className='max-w-[120px] truncate font-mono text-xs'>
          {agentId ?? <span className='text-muted-foreground'>Unassigned</span>}
        </div>
      )
    },
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Notes' />
    ),
    cell: ({ row }) => {
      const notes = row.getValue("notes") as string | null
      return (
        <div className='max-w-[200px] truncate'>
          {notes ?? <span className='text-muted-foreground'>No notes</span>}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const tour = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(tour)}>
              <Edit className='mr-2 h-4 w-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(tour.id)}
              className='text-destructive focus:text-destructive'
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
