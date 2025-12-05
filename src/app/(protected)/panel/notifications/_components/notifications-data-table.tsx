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

import { columns, type Notification } from "./columns"
import { NotificationFormDialog } from "./notification-form-dialog"

// Query key factory for notifications
const notificationsKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationsKeys.all, "list"] as const,
}

export function NotificationsDataTable() {
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
  const [editingNotification, setEditingNotification] =
    React.useState<Notification | null>(null)

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  // Query for fetching notifications
  const {
    data = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: notificationsKeys.lists(),
    queryFn: async () => {
      const response = await api.notifications.get()
      if (response.error) {
        throw new Error("Failed to fetch notifications")
      }
      return response.data?.data ?? []
    },
  })

  // Mutation for deleting a notification
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.notifications({ id }).delete()
      if (response.error) {
        throw new Error("Failed to delete notification")
      }
      return response.data
    },
    onSuccess: () => {
      toast.success("Notification deleted successfully")
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all })
    },
    onError: () => {
      toast.error("Failed to delete notification")
    },
    onSettled: () => {
      setDeleteOpen(false)
      setDeletingId(null)
    },
  })

  const handleCreate = () => {
    setEditingNotification(null)
    setFormOpen(true)
  }

  const handleEdit = (notification: Notification) => {
    setEditingNotification(notification)
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
    setEditingNotification(null)
    queryClient.invalidateQueries({ queryKey: notificationsKeys.all })
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
              Send Notification
            </Button>
          </div>
        }
      />

      <NotificationFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        notification={editingNotification}
        onSuccess={handleFormSuccess}
      />

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title='Delete Notification'
        description='Are you sure you want to delete this notification? This action cannot be undone.'
        onConfirm={handleDelete}
      />
    </>
  )
}
