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

import { columns, type Tour } from "./columns"
import { TourFormDialog } from "./tour-form-dialog"

// Query key factory for tours
const toursKeys = {
  all: ["tours"] as const,
  lists: () => [...toursKeys.all, "list"] as const,
}

export function ToursDataTable() {
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
  const [editingTour, setEditingTour] = React.useState<Tour | null>(null)

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  // Query for fetching tours
  const {
    data = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: toursKeys.lists(),
    queryFn: async () => {
      const response = await api.tours.get()
      if (response.error) {
        throw new Error("Failed to fetch tours")
      }
      return response.data?.data ?? []
    },
  })

  // Mutation for deleting a tour
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.tours({ id }).delete()
      if (response.error) {
        throw new Error("Failed to delete tour")
      }
      return response.data
    },
    onSuccess: () => {
      toast.success("Tour deleted successfully")
      queryClient.invalidateQueries({ queryKey: toursKeys.all })
    },
    onError: () => {
      toast.error("Failed to delete tour")
    },
    onSettled: () => {
      setDeleteOpen(false)
      setDeletingId(null)
    },
  })

  const handleCreate = () => {
    setEditingTour(null)
    setFormOpen(true)
  }

  const handleEdit = (tour: Tour) => {
    setEditingTour(tour)
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
    setEditingTour(null)
    queryClient.invalidateQueries({ queryKey: toursKeys.all })
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
        searchKey='buyerId'
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
              Schedule Tour
            </Button>
          </div>
        }
      />

      <TourFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        tour={editingTour}
        onSuccess={handleFormSuccess}
      />

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title='Delete Tour'
        description='Are you sure you want to cancel and delete this tour? This action cannot be undone.'
        onConfirm={handleDelete}
      />
    </>
  )
}
