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

import type { Notification } from "./columns"

// Query key factory - must match the one in data-table
const notificationsKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationsKeys.all, "list"] as const,
}

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
  const queryClient = useQueryClient()

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

  // Create mutation with optimistic update
  const createMutation = useMutation({
    mutationFn: async (data: NotificationFormValues) => {
      const response = await api.notifications.post({
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
      })
      if (response.error) {
        throw new Error("Failed to send notification")
      }
      return response.data
    },
    onMutate: async (newNotification) => {
      await queryClient.cancelQueries({ queryKey: notificationsKeys.lists() })

      const previousNotifications = queryClient.getQueryData<Notification[]>(
        notificationsKeys.lists()
      )

      if (previousNotifications) {
        const optimisticNotification: Notification = {
          id: `temp-${Date.now()}`,
          userId: newNotification.userId,
          type: newNotification.type,
          title: newNotification.title,
          message: newNotification.message,
          read: false,
          data: null,
          createdAt: new Date(),
        }
        queryClient.setQueryData<Notification[]>(notificationsKeys.lists(), [
          optimisticNotification,
          ...previousNotifications,
        ])
      }

      return { previousNotifications }
    },
    onError: (_err, _newNotification, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          notificationsKeys.lists(),
          context.previousNotifications
        )
      }
      toast.error("Failed to send notification")
    },
    onSuccess: () => {
      toast.success("Notification sent successfully")
      onSuccess()
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all })
    },
  })

  // Toggle read status mutation with optimistic update
  const toggleReadMutation = useMutation({
    mutationFn: async (notificationToUpdate: Notification) => {
      const response = await api
        .notifications({ id: notificationToUpdate.id })
        .patch({ read: !notificationToUpdate.read })
      if (response.error) {
        throw new Error("Failed to update notification")
      }
      return response.data
    },
    onMutate: async (notificationToUpdate) => {
      await queryClient.cancelQueries({ queryKey: notificationsKeys.lists() })

      const previousNotifications = queryClient.getQueryData<Notification[]>(
        notificationsKeys.lists()
      )

      if (previousNotifications) {
        queryClient.setQueryData<Notification[]>(
          notificationsKeys.lists(),
          previousNotifications.map((n) =>
            n.id === notificationToUpdate.id ? { ...n, read: !n.read } : n
          )
        )
      }

      return { previousNotifications }
    },
    onError: (_err, _notificationToUpdate, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(
          notificationsKeys.lists(),
          context.previousNotifications
        )
      }
      toast.error("Failed to update notification")
    },
    onSuccess: (_, notificationToUpdate) => {
      toast.success(
        notificationToUpdate.read ? "Marked as unread" : "Marked as read"
      )
      onSuccess()
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all })
    },
  })

  // Handle toggle for editing
  React.useEffect(() => {
    if (isEditing && open && notification) {
      toggleReadMutation.mutate(notification)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, open])

  const onSubmit = async (data: NotificationFormValues) => {
    createMutation.mutate(data)
  }

  const isPending = createMutation.isPending || toggleReadMutation.isPending

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
