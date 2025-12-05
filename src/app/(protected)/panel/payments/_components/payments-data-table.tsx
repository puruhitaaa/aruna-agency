"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { Plus, RefreshCw } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"
import { ConfirmDeleteDialog } from "@/components/common/confirm-delete-dialog"
import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/eden"

import { columns, type Payment } from "./columns"
import { PaymentFormDialog } from "./payment-form-dialog"

// Query key factory for payments
const paymentsKeys = {
  all: ["payments"] as const,
  lists: () => [...paymentsKeys.all, "list"] as const,
}

export function PaymentsDataTable() {
  const queryClient = useQueryClient()

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Form dialog state
  const [formOpen, setFormOpen] = React.useState(false)
  const [editingPayment, setEditingPayment] = React.useState<Payment | null>(
    null
  )

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  // Query for fetching payments
  const {
    data = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: paymentsKeys.lists(),
    queryFn: async () => {
      const response = await api.payments.get()
      if (response.error) {
        throw new Error("Failed to fetch payments")
      }
      return response.data?.data ?? []
    },
  })

  // Mutation for deleting a payment
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.payments({ id }).delete()
      if (response.error) {
        throw new Error("Failed to delete payment")
      }
      return response.data
    },
    onSuccess: () => {
      toast.success("Payment deleted successfully")
      queryClient.invalidateQueries({ queryKey: paymentsKeys.all })
    },
    onError: () => {
      toast.error("Failed to delete payment")
    },
    onSettled: () => {
      setDeleteOpen(false)
      setDeletingId(null)
    },
  })

  const handleCreate = () => {
    setEditingPayment(null)
    setFormOpen(true)
  }

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment)
    setFormOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setDeletingId(id)
    setDeleteOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingId) return
    deleteMutation.mutate(deletingId)
  }

  const handleFormSuccess = () => {
    setFormOpen(false)
    setEditingPayment(null)
    queryClient.invalidateQueries({ queryKey: paymentsKeys.all })
  }

  const table = useReactTable({
    data,
    columns: columns({ onEdit: handleEdit, onDelete: handleDeleteClick }),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const isRefreshing = isLoading || isFetching

  return (
    <>
      <DataTable
        table={table}
        columns={columns({ onEdit: handleEdit, onDelete: handleDeleteClick })}
        searchKey='gateway'
        toolbarActions={
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => refetch()}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button size='sm' onClick={handleCreate}>
              <Plus className='mr-2 h-4 w-4' />
              Record Payment
            </Button>
          </div>
        }
      />

      <PaymentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        payment={editingPayment}
        onSuccess={handleFormSuccess}
      />

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title='Delete Payment'
        description='Are you sure you want to delete this payment record? This action cannot be undone.'
        onConfirm={handleDelete}
      />
    </>
  )
}
