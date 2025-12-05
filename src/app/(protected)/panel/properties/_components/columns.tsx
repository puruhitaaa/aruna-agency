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

export type Property = {
  id: string
  ownerId: string
  title: string
  description: string | null
  price: string
  status: "draft" | "published" | "sold" | "rented" | "archived"
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  size: number
  bedrooms: number
  bathrooms: string
  features: string[] | null
  images: string[] | null
  createdAt: string
  updatedAt: string
}

const statusVariants: Record<
  Property["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  draft: "secondary",
  published: "default",
  sold: "destructive",
  rented: "outline",
  archived: "secondary",
}

type ColumnActions = {
  onEdit: (property: Property) => void
  onDelete: (id: string) => void
}

export const columns = ({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<Property>[] => [
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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[200px] truncate font-medium'>
        {row.getValue("title")}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Price' />
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)
      return <div className='font-medium'>{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as Property["status"]
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
    accessorKey: "city",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='City' />
    ),
    cell: ({ row }) => <div>{row.getValue("city")}</div>,
  },
  {
    accessorKey: "bedrooms",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bedrooms' />
    ),
    cell: ({ row }) => (
      <div className='text-center'>{row.getValue("bedrooms")}</div>
    ),
  },
  {
    accessorKey: "size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Size (sqft)' />
    ),
    cell: ({ row }) => {
      const size = row.getValue("size") as number
      return <div>{size.toLocaleString()}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const property = row.original

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
            <DropdownMenuItem onClick={() => onEdit(property)}>
              <Edit className='mr-2 h-4 w-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(property.id)}
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
