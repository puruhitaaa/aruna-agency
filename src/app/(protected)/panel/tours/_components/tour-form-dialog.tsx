"use client"

import { zodResolver } from "@hookform/resolvers/zod"
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

import type { Tour } from "./columns"

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

  const onSubmit = async (data: TourFormValues) => {
    try {
      // Convert local datetime to ISO string
      const payload = {
        ...data,
        date: new Date(data.date).toISOString(),
        agentId: data.agentId || undefined,
      }

      if (isEditing && tour) {
        const response = await api.tours({ id: tour.id }).patch(payload)
        if (response.error) {
          toast.error("Failed to update tour")
          return
        }
        toast.success("Tour updated successfully")
      } else {
        const response = await api.tours.post(payload)
        if (response.error) {
          toast.error("Failed to create tour")
          return
        }
        toast.success("Tour scheduled successfully")
      }
      onSuccess()
    } catch (error) {
      toast.error(isEditing ? "Failed to update tour" : "Failed to create tour")
      console.error(error)
    }
  }

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
    >
      <div className='grid gap-4'>
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='propertyId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Property ID'
                    {...field}
                    disabled={isEditing}
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
              <FormItem>
                <FormLabel>Buyer ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Buyer ID'
                    {...field}
                    disabled={isEditing}
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
              <FormItem>
                <FormLabel>Agent ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder='Agent ID' {...field} />
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
