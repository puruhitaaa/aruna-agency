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
import { api } from "@/lib/eden"

import type { Payment } from "./columns"

const paymentsKeys = {
  all: ["payments"] as const,
  lists: () => [...paymentsKeys.all, "list"] as const,
}

const paymentFormSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  propertyId: z.string().optional(),
  amount: z.string().min(1, "Amount is required"),
  currency: z.string().optional(),
  planType: z.enum(["full_payment", "installment"]).optional(),
  installmentsTotal: z.number().optional(),
  installmentNumber: z.number().optional(),
  gateway: z.string().min(1, "Gateway is required"),
  gatewayTransactionId: z.string().optional(),
  status: z.enum(["pending", "completed", "failed", "refunded"]).optional(),
})

type PaymentFormValues = z.infer<typeof paymentFormSchema>

interface PaymentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment: Payment | null
  onSuccess: () => void
}

export function PaymentFormDialog({
  open,
  onOpenChange,
  payment,
  onSuccess,
}: PaymentFormDialogProps) {
  const isEditing = !!payment
  const queryClient = useQueryClient()

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      userId: "",
      propertyId: "",
      amount: "",
      currency: "IDR",
      planType: "full_payment",
      installmentsTotal: undefined,
      installmentNumber: undefined,
      gateway: "",
      gatewayTransactionId: "",
      status: "pending",
    },
  })

  const planType = form.watch("planType")

  React.useEffect(() => {
    if (payment) {
      form.reset({
        userId: payment.userId,
        propertyId: payment.propertyId ?? "",
        amount: payment.amount,
        currency: payment.currency,
        planType: payment.planType,
        installmentsTotal: payment.installmentsTotal ?? undefined,
        installmentNumber: payment.installmentNumber ?? undefined,
        gateway: payment.gateway,
        gatewayTransactionId: payment.gatewayTransactionId ?? "",
        status: payment.status,
      })
    } else {
      form.reset({
        userId: "",
        propertyId: "",
        amount: "",
        currency: "IDR",
        planType: "full_payment",
        installmentsTotal: undefined,
        installmentNumber: undefined,
        gateway: "",
        gatewayTransactionId: "",
        status: "pending",
      })
    }
  }, [payment, form])

  const createMutation = useMutation({
    mutationFn: async (data: PaymentFormValues) => {
      const payload = {
        ...data,
        propertyId: data.propertyId || undefined,
        gatewayTransactionId: data.gatewayTransactionId || undefined,
        installmentsTotal:
          data.planType === "installment" ? data.installmentsTotal : undefined,
        installmentNumber:
          data.planType === "installment" ? data.installmentNumber : undefined,
      }
      const response = await api.payments.post(payload)
      if (response.error) throw new Error("Failed to create payment")
      return response.data
    },
    onMutate: async (newPayment) => {
      await queryClient.cancelQueries({ queryKey: paymentsKeys.lists() })
      const prev = queryClient.getQueryData<Payment[]>(paymentsKeys.lists())
      if (prev) {
        const opt: Payment = {
          id: `temp-${Date.now()}`,
          userId: newPayment.userId,
          propertyId: newPayment.propertyId ?? null,
          amount: newPayment.amount,
          currency: newPayment.currency ?? "IDR",
          planType: newPayment.planType ?? "full_payment",
          installmentsTotal:
            newPayment.planType === "installment"
              ? newPayment.installmentsTotal ?? null
              : null,
          installmentNumber:
            newPayment.planType === "installment"
              ? newPayment.installmentNumber ?? null
              : null,
          gateway: newPayment.gateway,
          gatewayTransactionId: newPayment.gatewayTransactionId ?? null,
          status: newPayment.status ?? "pending",
          metadata: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        queryClient.setQueryData<Payment[]>(paymentsKeys.lists(), [
          opt,
          ...prev,
        ])
      }
      return { prev }
    },
    onError: (_err, _new, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(paymentsKeys.lists(), ctx.prev)
      toast.error("Failed to create payment")
    },
    onSuccess: () => {
      toast.success("Payment recorded successfully")
      onSuccess()
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: paymentsKeys.all })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: PaymentFormValues) => {
      if (!payment) throw new Error("No payment to update")
      const response = await api.payments({ id: payment.id }).patch({
        status: data.status,
        gatewayTransactionId: data.gatewayTransactionId || undefined,
      })
      if (response.error) throw new Error("Failed to update payment")
      return response.data
    },
    onMutate: async (upd) => {
      await queryClient.cancelQueries({ queryKey: paymentsKeys.lists() })
      const prev = queryClient.getQueryData<Payment[]>(paymentsKeys.lists())
      if (prev && payment) {
        queryClient.setQueryData<Payment[]>(
          paymentsKeys.lists(),
          prev.map((p) =>
            p.id === payment.id
              ? {
                  ...p,
                  status: upd.status ?? p.status,
                  gatewayTransactionId:
                    upd.gatewayTransactionId ?? p.gatewayTransactionId,
                  updatedAt: new Date(),
                }
              : p
          )
        )
      }
      return { prev }
    },
    onError: (_err, _upd, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(paymentsKeys.lists(), ctx.prev)
      toast.error("Failed to update payment")
    },
    onSuccess: () => {
      toast.success("Payment updated successfully")
      onSuccess()
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: paymentsKeys.all })
    },
  })

  const onSubmit = (data: PaymentFormValues) => {
    isEditing ? updateMutation.mutate(data) : createMutation.mutate(data)
  }
  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <DataTableFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit Payment" : "Record Payment"}
      description={
        isEditing
          ? "Update the payment status and details."
          : "Fill in the details to record a new payment."
      }
      form={form}
      onSubmit={onSubmit}
      submitText={isEditing ? "Update" : "Record"}
      isSubmitting={isPending}
    >
      <div className='grid gap-4'>
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='userId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>User ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder='User ID'
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
            name='propertyId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property ID (Optional)</FormLabel>
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
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='amount'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    placeholder='1000.00'
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
            name='currency'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isEditing}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select currency' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='USD'>USD</SelectItem>
                    <SelectItem value='IDR'>IDR</SelectItem>
                    <SelectItem value='EUR'>EUR</SelectItem>
                    <SelectItem value='GBP'>GBP</SelectItem>
                    <SelectItem value='IDR'>IDR</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='gateway'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Gateway</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isEditing}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select gateway' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='stripe'>Stripe</SelectItem>
                    <SelectItem value='paypal'>PayPal</SelectItem>
                    <SelectItem value='bank_transfer'>Bank Transfer</SelectItem>
                    <SelectItem value='cash'>Cash</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    <SelectItem value='completed'>Completed</SelectItem>
                    <SelectItem value='failed'>Failed</SelectItem>
                    <SelectItem value='refunded'>Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name='planType'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Plan</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isEditing}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select plan type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='full_payment'>Full Payment</SelectItem>
                  <SelectItem value='installment'>Installment</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {planType === "installment" && !isEditing && (
          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='installmentsTotal'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Installments</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='12' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='installmentNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Installment Number</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='1' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        <FormField
          control={form.control}
          name='gatewayTransactionId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction ID (Optional)</FormLabel>
              <FormControl>
                <Input placeholder='Gateway transaction ID' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </DataTableFormDialog>
  )
}
