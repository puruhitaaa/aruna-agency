"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import * as React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { DataTableFormDialog } from "@/components/common/data-table-form-dialog"
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

import type { Landlord } from "./columns"

// Query key factory - must match the one in data-table
const landlordsKeys = {
  all: ["landlords"] as const,
  lists: () => [...landlordsKeys.all, "list"] as const,
}

const landlordFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  bio: z.string().optional(),
  verificationStatus: z.enum(["pending", "verified", "rejected"]).optional(),
  rating: z.string().optional(),
})

type LandlordFormValues = z.infer<typeof landlordFormSchema>

interface LandlordFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  landlord: Landlord | null
  onSuccess: () => void
}

export function LandlordFormDialog({
  open,
  onOpenChange,
  landlord,
  onSuccess,
}: LandlordFormDialogProps) {
  const isEditing = !!landlord
  const queryClient = useQueryClient()

  const form = useForm<LandlordFormValues>({
    resolver: zodResolver(landlordFormSchema),
    defaultValues: {
      userId: "",
      bio: "",
      verificationStatus: "pending",
      rating: "",
    },
  })

  React.useEffect(() => {
    if (landlord) {
      form.reset({
        userId: landlord.userId,
        bio: landlord.bio ?? "",
        verificationStatus: landlord.verificationStatus,
        rating: landlord.rating ?? "",
      })
    } else {
      form.reset({
        userId: "",
        bio: "",
        verificationStatus: "pending",
        rating: "",
      })
    }
  }, [landlord, form])

  // Create mutation with optimistic update
  const createMutation = useMutation({
    mutationFn: async (data: LandlordFormValues) => {
      const response = await api.landlords.post({
        userId: data.userId,
        bio: data.bio,
      })
      if (response.error) {
        throw new Error("Failed to create landlord")
      }
      return response.data
    },
    onMutate: async (newLandlord) => {
      await queryClient.cancelQueries({ queryKey: landlordsKeys.lists() })

      const previousLandlords = queryClient.getQueryData<Landlord[]>(
        landlordsKeys.lists()
      )

      if (previousLandlords) {
        const optimisticLandlord: Landlord = {
          id: `temp-${Date.now()}`,
          userId: newLandlord.userId,
          bio: newLandlord.bio ?? null,
          verificationStatus: "pending",
          verificationDocuments: null,
          rating: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        queryClient.setQueryData<Landlord[]>(landlordsKeys.lists(), [
          optimisticLandlord,
          ...previousLandlords,
        ])
      }

      return { previousLandlords }
    },
    onError: (_err, _newLandlord, context) => {
      if (context?.previousLandlords) {
        queryClient.setQueryData(
          landlordsKeys.lists(),
          context.previousLandlords
        )
      }
      toast.error("Failed to create landlord")
    },
    onSuccess: () => {
      toast.success("Landlord created successfully")
      onSuccess()
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: landlordsKeys.all })
    },
  })

  // Update mutation with optimistic update
  const updateMutation = useMutation({
    mutationFn: async (data: LandlordFormValues) => {
      if (!landlord) throw new Error("No landlord to update")
      const response = await api.landlords({ id: landlord.id }).patch(data)
      if (response.error) {
        throw new Error("Failed to update landlord")
      }
      return response.data
    },
    onMutate: async (updatedData) => {
      await queryClient.cancelQueries({ queryKey: landlordsKeys.lists() })

      const previousLandlords = queryClient.getQueryData<Landlord[]>(
        landlordsKeys.lists()
      )

      if (previousLandlords && landlord) {
        queryClient.setQueryData<Landlord[]>(
          landlordsKeys.lists(),
          previousLandlords.map((l) =>
            l.id === landlord.id
              ? {
                  ...l,
                  bio: updatedData.bio ?? null,
                  verificationStatus:
                    updatedData.verificationStatus ?? l.verificationStatus,
                  rating: updatedData.rating ?? null,
                  updatedAt: new Date(),
                }
              : l
          )
        )
      }

      return { previousLandlords }
    },
    onError: (_err, _updatedData, context) => {
      if (context?.previousLandlords) {
        queryClient.setQueryData(
          landlordsKeys.lists(),
          context.previousLandlords
        )
      }
      toast.error("Failed to update landlord")
    },
    onSuccess: () => {
      toast.success("Landlord updated successfully")
      onSuccess()
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: landlordsKeys.all })
    },
  })

  const onSubmit = async (data: LandlordFormValues) => {
    if (isEditing) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <DataTableFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit Landlord" : "Create Landlord"}
      description={
        isEditing
          ? "Update the landlord profile details below."
          : "Fill in the details to create a new landlord profile."
      }
      form={form}
      onSubmit={onSubmit}
      submitText={isEditing ? "Update" : "Create"}
      isSubmitting={isPending}
    >
      <div className='grid gap-4'>
        <FormField
          control={form.control}
          name='userId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>User ID</FormLabel>
              <FormControl>
                <Input placeholder='User ID' {...field} disabled={isEditing} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEditing && (
          <FormField
            control={form.control}
            name='verificationStatus'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Status</FormLabel>
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
                    <SelectItem value='verified'>Verified</SelectItem>
                    <SelectItem value='rejected'>Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {isEditing && (
          <FormField
            control={form.control}
            name='rating'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    min='0'
                    max='5'
                    placeholder='4.5'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Tell us about this landlord...'
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
