"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Bell, BellOff, Edit, MoreHorizontal, Trash2 } from "lucide-react"
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

export type Notification = {
  id: string
  userId: string
  type: string
  title: string
  message: string
  read: boolean
  data: unknown
  createdAt: string
}

type ColumnActions = {
  onEdit: (notification: Notification) => void
  onDelete: (id: string) => void
}

export const columns = ({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<Notification>[] => [
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
    accessorKey: "read",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const read = row.getValue("read") as boolean
      return read ? (
        <BellOff className='h-4 w-4 text-muted-foreground' />
      ) : (
        <Bell className='h-4 w-4 text-primary' />
      )
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => {
      const read = row.original.read
      return (
        <div className={`max-w-[200px] truncate ${read ? "" : "font-medium"}`}>
          {row.getValue("title")}
        </div>
      )
    },
  },
  {
    accessorKey: "message",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Message' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[300px] truncate text-muted-foreground'>
        {row.getValue("message")}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      return (
        <Badge variant='outline' className='capitalize'>
          {type.replace(/_/g, " ")}
        </Badge>
      )
    },
  },
  {
    accessorKey: "userId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User ID' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[100px] truncate font-mono text-xs'>
        {row.getValue("userId")}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return <div className='text-sm'>{date.toLocaleString()}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const notification = row.original

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
            <DropdownMenuItem onClick={() => onEdit(notification)}>
              <Edit className='mr-2 h-4 w-4' />
              {notification.read ? "Mark as Unread" : "Mark as Read"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(notification.id)}
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
