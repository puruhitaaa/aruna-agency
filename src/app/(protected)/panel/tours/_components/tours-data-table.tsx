"use client"

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

export function ToursDataTable() {
  const [data, setData] = React.useState<Tour[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
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

  const fetchData = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await api.tours.get()
      if (response.error) {
        toast.error("Failed to fetch tours")
        console.error(response.error)
        return
      }
      setData(response.data?.data ?? [])
    } catch (error) {
      toast.error("Failed to fetch tours")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

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

    try {
      const response = await api.tours({ id: deletingId }).delete()
      if (response.error) {
        toast.error("Failed to delete tour")
        return
      }
      toast.success("Tour deleted successfully")
      fetchData()
    } catch (error) {
      toast.error("Failed to delete tour")
      console.error(error)
    } finally {
      setDeleteOpen(false)
      setDeletingId(null)
    }
  }

  const handleFormSuccess = () => {
    setFormOpen(false)
    setEditingTour(null)
    fetchData()
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
              onClick={fetchData}
              disabled={isLoading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
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
