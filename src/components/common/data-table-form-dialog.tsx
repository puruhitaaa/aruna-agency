import * as React from "react"
import { UseFormReturn, FieldValues } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"

interface DataTableFormDialogProps<T extends FieldValues> {
  trigger?: React.ReactNode
  title: string
  description?: string
  form: UseFormReturn<T>
  onSubmit: (data: T) => Promise<void> | void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  submitText?: string
}

export function DataTableFormDialog<T extends FieldValues>({
  trigger,
  title,
  description,
  form,
  onSubmit,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  children,
  submitText = "Save",
}: DataTableFormDialogProps<T>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (data: T) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
      setOpen(false)
      form.reset()
    } catch (error) {
      console.error("Form submission error", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className='sm:max-w-[425px] md:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <div className='grid gap-4 py-4'>{children}</div>
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : submitText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
