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

import type { Property } from "./columns"

const propertyFormSchema = z.object({
  ownerId: z.string().min(1, "Owner ID is required"),
  title: z.string().min(1, "Title is required").max(255),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  status: z
    .enum(["draft", "published", "sold", "rented", "archived"])
    .optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  zipCode: z.string().min(1, "Zip code is required").max(20),
  country: z.string().optional(),
  size: z.number().min(1, "Size is required"),
  bedrooms: z.number().min(0, "Bedrooms must be 0 or more"),
  bathrooms: z.string().min(1, "Bathrooms is required"),
})

type PropertyFormValues = z.infer<typeof propertyFormSchema>

interface PropertyFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  property: Property | null
  onSuccess: () => void
}

export function PropertyFormDialog({
  open,
  onOpenChange,
  property,
  onSuccess,
}: PropertyFormDialogProps) {
  const isEditing = !!property

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      ownerId: "",
      title: "",
      description: "",
      price: "",
      status: "draft",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
      size: 0,
      bedrooms: 0,
      bathrooms: "1",
    },
  })

  React.useEffect(() => {
    if (property) {
      form.reset({
        ownerId: property.ownerId,
        title: property.title,
        description: property.description ?? "",
        price: property.price,
        status: property.status,
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zipCode,
        country: property.country,
        size: property.size,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
      })
    } else {
      form.reset({
        ownerId: "",
        title: "",
        description: "",
        price: "",
        status: "draft",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "ID",
        size: 0,
        bedrooms: 0,
        bathrooms: "1",
      })
    }
  }, [property, form])

  const onSubmit = async (data: PropertyFormValues) => {
    try {
      if (isEditing && property) {
        const response = await api.properties({ id: property.id }).patch(data)
        if (response.error) {
          toast.error("Failed to update property")
          return
        }
        toast.success("Property updated successfully")
      } else {
        const response = await api.properties.post(data)
        if (response.error) {
          toast.error("Failed to create property")
          return
        }
        toast.success("Property created successfully")
      }
      onSuccess()
    } catch (error) {
      toast.error(
        isEditing ? "Failed to update property" : "Failed to create property"
      )
      console.error(error)
    }
  }

  return (
    <DataTableFormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit Property" : "Create Property"}
      description={
        isEditing
          ? "Update the property details below."
          : "Fill in the details to create a new property."
      }
      form={form}
      onSubmit={onSubmit}
      submitText={isEditing ? "Update" : "Create"}
    >
      <div className='grid grid-cols-2 gap-4'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem className='col-span-2'>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='Beautiful Home in Downtown' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='ownerId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner ID</FormLabel>
              <FormControl>
                <Input placeholder='Owner user ID' {...field} />
              </FormControl>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='draft'>Draft</SelectItem>
                  <SelectItem value='published'>Published</SelectItem>
                  <SelectItem value='sold'>Sold</SelectItem>
                  <SelectItem value='rented'>Rented</SelectItem>
                  <SelectItem value='archived'>Archived</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='price'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  step='0.01'
                  placeholder='250000.00'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='size'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size (sqft)</FormLabel>
              <FormControl>
                <Input type='number' placeholder='1500' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='bedrooms'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bedrooms</FormLabel>
              <FormControl>
                <Input type='number' placeholder='3' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='bathrooms'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bathrooms</FormLabel>
              <FormControl>
                <Input type='number' step='0.5' placeholder='2' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem className='col-span-2'>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Describe the property...'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem className='col-span-2'>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder='123 Main Street' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='city'
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder='New York' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='state'
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input placeholder='NY' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='zipCode'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input placeholder='10001' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='country'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder='USA' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </DataTableFormDialog>
  )
}
