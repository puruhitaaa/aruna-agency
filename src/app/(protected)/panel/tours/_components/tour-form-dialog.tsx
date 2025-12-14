"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import * as React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { DataTableFormDialog } from "@/components/common/data-table-form-dialog"
import {
  AsyncSelect,
  type AsyncSelectOption,
  type PaginatedResponse,
} from "@/components/ui/async-select"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/eden"
import { authClient } from "@/server/better-auth/client"

import type { Tour } from "./columns"

const toursKeys = {
  all: ["tours"] as const,
  lists: () => [...toursKeys.all, "list"] as const,
}

const tourFormSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  buyerId: z.string().min(1, "Buyer ID is required"),
  agentId: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]).optional(),
  notes: z.string().optional(),
})

type TourFormValues = z.infer<typeof tourFormSchema>

interface TourFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tour: Tour | null
  onSuccess: () => void
}

export function TourFormDialog({
  open,
  onOpenChange,
  tour,
  onSuccess,
}: TourFormDialogProps) {
  const isEditing = !!tour
  const queryClient = useQueryClient()
  const { data: session } = authClient.useSession()
  const isAdmin = session?.user?.role === "admin"

  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      propertyId: "",
      buyerId: "",
      agentId: "",
      date: "",
      status: "pending",
      notes: "",
    },
  })

  React.useEffect(() => {
    if (tour) {
      form.reset({
        propertyId: tour.propertyId,
        buyerId: tour.buyerId,
        agentId: tour.agentId ?? "",
        date: tour.date ? new Date(tour.date).toISOString().slice(0, 16) : "",
        status: tour.status,
        notes: tour.notes ?? "",
      })
    } else {
      form.reset({
        propertyId: "",
        buyerId: "",
        agentId: "",
        date: "",
        status: "pending",
        notes: "",
      })
    }
  }, [tour, form])

  // Auto-set buyerId for non-admin users
  React.useEffect(() => {
    if (!isAdmin && session?.user?.id && !isEditing) {
      form.setValue("buyerId", session.user.id)
    }
  }, [isAdmin, session?.user?.id, isEditing, form])

  // Query function for fetching users
  const fetchUsers = async (params: {
    limit: number
    offset: number
    search: string
  }): Promise<PaginatedResponse<AsyncSelectOption>> => {
    const response = await api.users.get({
      query: {
        limit: params.limit,
        offset: params.offset,
        search: params.search || undefined,
      },
    })
    if (response.error) throw new Error("Failed to fetch users")
    return {
      data: response.data.data.map((user) => ({
        value: user.id,
        label: user.name,
        description: user.email,
      })),
      meta: response.data.meta,
    }
  }

  // Query function for fetching properties
  const fetchProperties = async (params: {
    limit: number
    offset: number
    search: string
  }): Promise<PaginatedResponse<AsyncSelectOption>> => {
    const response = await api.properties.get({
      query: {
        limit: params.limit,
        offset: params.offset,
        search: params.search || undefined,
      },
    })
    if (response.error) throw new Error("Failed to fetch properties")
    return {
      data: response.data.data.map((property) => ({
        value: property.id,
        label: property.title,
        description: `${property.city}, ${property.state}`,
      })),
      meta: response.data.meta,
    }
  }

  const createMutation = useMutation({
    mutationFn: async (data: TourFormValues) => {
      const payload = {
        ...data,
        date: new Date(data.date).toISOString(),
        agentId: data.agentId || undefined,
      }
      const response = await api.tours.post(payload)
      if (response.error) throw new Error("Failed to create tour")
      return response.data
    },
    onMutate: async (newTour) => {
      await queryClient.cancelQueries({ queryKey: toursKeys.lists() })
      const prev = queryClient.getQueryData<Tour[]>(toursKeys.lists())
      if (prev) {
        const opt: Tour = {
          id: `temp-${Date.now()}`,
          propertyId: newTour.propertyId,
          buyerId: newTour.buyerId,
          agentId: newTour.agentId ?? null,
          date: new Date(newTour.date),
          status: newTour.status ?? "pending",
          notes: newTour.notes ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        queryClient.setQueryData<Tour[]>(toursKeys.lists(), [opt, ...prev])
      }
      return { prev }
    },
    onError: (_err, _new, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(toursKeys.lists(), ctx.prev)
      toast.error("Failed to create tour")
    },
    onSuccess: () => {
      toast.success("Tour scheduled successfully")
      onSuccess()
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: toursKeys.all })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: TourFormValues) => {
      if (!tour) throw new Error("No tour to update")
      const payload = {
        ...data,
        date: new Date(data.date).toISOString(),
        agentId: data.agentId || undefined,
      }
      const response = await api.tours({ id: tour.id }).patch(payload)
      if (response.error) throw new Error("Failed to update tour")
      return response.data
    },
    onMutate: async (upd) => {
      await queryClient.cancelQueries({ queryKey: toursKeys.lists() })
      const prev = queryClient.getQueryData<Tour[]>(toursKeys.lists())
      if (prev && tour) {
        queryClient.setQueryData<Tour[]>(
          toursKeys.lists(),
          prev.map((t) =>
            t.id === tour.id
              ? {
                  ...t,
                  date: new Date(upd.date),
                  agentId: upd.agentId ?? null,
                  status: upd.status ?? t.status,
                  notes: upd.notes ?? null,
                  updatedAt: new Date(),
                }
              : t
          )
        )
      }
      return { prev }
    },
    onError: (_err, _upd, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(toursKeys.lists(), ctx.prev)
      toast.error("Failed to update tour")
    },
    onSuccess: () => {
      toast.success("Tour updated successfully")
      onSuccess()
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: toursKeys.all })
    },
  })

  const onSubmit = (data: TourFormValues) => {
    isEditing ? updateMutation.mutate(data) : createMutation.mutate(data)
  }
  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <DataTableFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit Tour" : "Schedule Tour"}
      description={
        isEditing
          ? "Update the tour details below."
          : "Fill in the details to schedule a new property tour."
      }
      form={form}
      onSubmit={onSubmit}
      submitText={isEditing ? "Update" : "Schedule"}
      isSubmitting={isPending}
    >
      <div className='grid gap-4'>
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='propertyId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property</FormLabel>
                <FormControl>
                  <AsyncSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder='Select property...'
                    searchPlaceholder='Search properties...'
                    emptyMessage='No properties found.'
                    disabled={isEditing}
                    queryFn={fetchProperties}
                    queryKey={["properties", "select"]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='buyerId'
            render={({ field }) => (
              <FormItem className={!isAdmin ? "hidden" : ""}>
                <FormLabel>Buyer</FormLabel>
                <FormControl>
                  <AsyncSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder='Select buyer...'
                    searchPlaceholder='Search users...'
                    emptyMessage='No users found.'
                    disabled={isEditing}
                    queryFn={fetchUsers}
                    queryKey={["users", "select"]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='date'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date & Time</FormLabel>
                <FormControl>
                  <Input type='datetime-local' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='agentId'
            render={({ field }) => (
              <FormItem className={!isAdmin ? "hidden" : ""}>
                <FormLabel>Agent (Optional)</FormLabel>
                <FormControl>
                  <AsyncSelect
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    placeholder='Select agent...'
                    searchPlaceholder='Search users...'
                    emptyMessage='No users found.'
                    queryFn={fetchUsers}
                    queryKey={["users", "select"]}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {isEditing && (
          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='pending'>Pending</SelectItem>
                    <SelectItem value='confirmed'>Confirmed</SelectItem>
                    <SelectItem value='cancelled'>Cancelled</SelectItem>
                    <SelectItem value='completed'>Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name='notes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Any special instructions or notes...'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </DataTableFormDialog>
  )
}
