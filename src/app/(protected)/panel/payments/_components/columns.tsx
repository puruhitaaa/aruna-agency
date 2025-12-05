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

export type Payment = {
  id: string
  userId: string
  propertyId: string | null
  amount: string
  currency: string
  planType: "full_payment" | "installment"
  installmentsTotal: number | null
  installmentNumber: number | null
  gateway: string
  gatewayTransactionId: string | null
  status: "pending" | "completed" | "failed" | "refunded"
  metadata: unknown
  createdAt: string
  updatedAt: string
}

const statusVariants: Record<
  Payment["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  completed: "default",
  failed: "destructive",
  refunded: "outline",
}

type ColumnActions = {
  onEdit: (payment: Payment) => void
  onDelete: (id: string) => void
}

export const columns = ({
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<Payment>[] => [
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
    accessorKey: "userId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User ID' />
    ),
    cell: ({ row }) => (
      <div className='max-w-[120px] truncate font-mono text-xs'>
        {row.getValue("userId")}
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amount' />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const currency = row.original.currency
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
      }).format(amount)
      return <div className='font-medium'>{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as Payment["status"]
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
    accessorKey: "gateway",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Gateway' />
    ),
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue("gateway")}</div>
    ),
  },
  {
    accessorKey: "planType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Plan' />
    ),
    cell: ({ row }) => {
      const planType = row.getValue("planType") as Payment["planType"]
      const installmentNumber = row.original.installmentNumber
      const installmentsTotal = row.original.installmentsTotal

      if (
        planType === "installment" &&
        installmentNumber &&
        installmentsTotal
      ) {
        return (
          <div className='text-sm'>
            Installment {installmentNumber}/{installmentsTotal}
          </div>
        )
      }
      return (
        <div className='text-sm capitalize'>{planType.replace("_", " ")}</div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original

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
            <DropdownMenuItem onClick={() => onEdit(payment)}>
              <Edit className='mr-2 h-4 w-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(payment.id)}
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
