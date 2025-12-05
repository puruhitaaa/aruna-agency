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

import type { Notification } from "./columns"

const notificationFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  type: z.string().min(1, "Type is required").max(50),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  read: z.boolean().optional(),
})

type NotificationFormValues = z.infer<typeof notificationFormSchema>

interface NotificationFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  notification: Notification | null
  onSuccess: () => void
}

export function NotificationFormDialog({
  open,
  onOpenChange,
  notification,
  onSuccess,
}: NotificationFormDialogProps) {
  const isEditing = !!notification

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      userId: "",
      type: "",
      title: "",
      message: "",
      read: false,
    },
  })

  React.useEffect(() => {
    if (notification) {
      form.reset({
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        read: notification.read,
      })
    } else {
      form.reset({
        userId: "",
        type: "",
        title: "",
        message: "",
        read: false,
      })
    }
  }, [notification, form])

  const onSubmit = async (data: NotificationFormValues) => {
    try {
      if (isEditing && notification) {
        // When editing, toggle the read status
        const response = await api
          .notifications({ id: notification.id })
          .patch({ read: !notification.read })
        if (response.error) {
          toast.error("Failed to update notification")
          return
        }
        toast.success(notification.read ? "Marked as unread" : "Marked as read")
      } else {
        const response = await api.notifications.post({
          userId: data.userId,
          type: data.type,
          title: data.title,
          message: data.message,
        })
        if (response.error) {
          toast.error("Failed to send notification")
          return
        }
        toast.success("Notification sent successfully")
      }
      onSuccess()
    } catch (error) {
      toast.error(
        isEditing
          ? "Failed to update notification"
          : "Failed to send notification"
      )
      console.error(error)
    }
  }

  // For editing, we just toggle read status immediately
  React.useEffect(() => {
    if (isEditing && open) {
      onSubmit(form.getValues())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, open])

  // Don't show dialog for editing - just toggle and close
  if (isEditing) {
    return null
  }

  return (
    <DataTableFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Send Notification'
      description='Send a notification to a user.'
      form={form}
      onSubmit={onSubmit}
      submitText='Send'
    >
      <div className='grid gap-4'>
        <FormField
          control={form.control}
          name='userId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>User ID</FormLabel>
              <FormControl>
                <Input placeholder='User ID' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select notification type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='tour_confirmed'>Tour Confirmed</SelectItem>
                  <SelectItem value='tour_cancelled'>Tour Cancelled</SelectItem>
                  <SelectItem value='payment_received'>
                    Payment Received
                  </SelectItem>
                  <SelectItem value='payment_failed'>Payment Failed</SelectItem>
                  <SelectItem value='property_update'>
                    Property Update
                  </SelectItem>
                  <SelectItem value='system'>System</SelectItem>
                  <SelectItem value='general'>General</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='Notification title' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='message'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Notification message...'
                  className='resize-none'
                  rows={4}
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
