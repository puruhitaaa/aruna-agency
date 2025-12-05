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

import { columns, type Property } from "./columns"
import { PropertyFormDialog } from "./property-form-dialog"

// Query key factory for properties
const propertiesKeys = {
  all: ["properties"] as const,
  lists: () => [...propertiesKeys.all, "list"] as const,
}

export function PropertiesDataTable() {
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
  const [editingProperty, setEditingProperty] = React.useState<Property | null>(
    null
  )

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  // Query for fetching properties
  const {
    data = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: propertiesKeys.lists(),
    queryFn: async () => {
      const response = await api.properties.get()
      if (response.error) {
        throw new Error("Failed to fetch properties")
      }
      return response.data?.data ?? []
    },
  })

  // Mutation for deleting a property
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.properties({ id }).delete()
      if (response.error) {
        throw new Error("Failed to delete property")
      }
      return response.data
    },
    onSuccess: () => {
      toast.success("Property deleted successfully")
      queryClient.invalidateQueries({ queryKey: propertiesKeys.all })
    },
    onError: () => {
      toast.error("Failed to delete property")
    },
    onSettled: () => {
      setDeleteOpen(false)
      setDeletingId(null)
    },
  })

  const handleCreate = () => {
    setEditingProperty(null)
    setFormOpen(true)
  }

  const handleEdit = (property: Property) => {
    setEditingProperty(property)
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
    setEditingProperty(null)
    queryClient.invalidateQueries({ queryKey: propertiesKeys.all })
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
        searchKey='title'
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
              Add Property
            </Button>
          </div>
        }
      />

      <PropertyFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        property={editingProperty}
        onSuccess={handleFormSuccess}
      />

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title='Delete Property'
        description='Are you sure you want to delete this property? This action cannot be undone.'
        onConfirm={handleDelete}
      />
    </>
  )
}
