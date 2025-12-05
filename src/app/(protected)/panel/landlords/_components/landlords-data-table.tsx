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

import { columns, type Landlord } from "./columns"
import { LandlordFormDialog } from "./landlord-form-dialog"

// Query key factory for landlords
const landlordsKeys = {
  all: ["landlords"] as const,
  lists: () => [...landlordsKeys.all, "list"] as const,
}

export function LandlordsDataTable() {
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
  const [editingLandlord, setEditingLandlord] = React.useState<Landlord | null>(
    null
  )

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  // Query for fetching landlords
  const {
    data = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: landlordsKeys.lists(),
    queryFn: async () => {
      const response = await api.landlords.get()
      if (response.error) {
        throw new Error("Failed to fetch landlords")
      }
      return response.data?.data ?? []
    },
  })

  // Mutation for deleting a landlord
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.landlords({ id }).delete()
      if (response.error) {
        throw new Error("Failed to delete landlord")
      }
      return response.data
    },
    onSuccess: () => {
      toast.success("Landlord deleted successfully")
      queryClient.invalidateQueries({ queryKey: landlordsKeys.all })
    },
    onError: () => {
      toast.error("Failed to delete landlord")
    },
    onSettled: () => {
      setDeleteOpen(false)
      setDeletingId(null)
    },
  })

  const handleCreate = () => {
    setEditingLandlord(null)
    setFormOpen(true)
  }

  const handleEdit = (landlord: Landlord) => {
    setEditingLandlord(landlord)
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
    setEditingLandlord(null)
    queryClient.invalidateQueries({ queryKey: landlordsKeys.all })
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
        searchKey='userId'
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
              Add Landlord
            </Button>
          </div>
        }
      />

      <LandlordFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        landlord={editingLandlord}
        onSuccess={handleFormSuccess}
      />

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title='Delete Landlord'
        description='Are you sure you want to delete this landlord profile? This action cannot be undone.'
        onConfirm={handleDelete}
      />
    </>
  )
}
