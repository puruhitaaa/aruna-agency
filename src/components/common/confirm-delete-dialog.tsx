import { Trash2 } from "lucide-react"
import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface ConfirmDeleteDialogProps {
  trigger?: React.ReactNode
  title?: string
  description?: string
  onConfirm: () => Promise<void> | void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ConfirmDeleteDialog({
  trigger,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete the record.",
  onConfirm,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: ConfirmDeleteDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      setIsDeleting(true)
      await onConfirm()
      setOpen(false)
    } catch (error) {
      console.error("Delete error", error)
    } finally {
      setIsDeleting(false)
    }
  }

  // Determine if we're in controlled mode
  const isControlled = controlledOpen !== undefined

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* Only render trigger in uncontrolled mode */}
      {!isControlled &&
        (trigger ? (
          <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        ) : (
          <AlertDialogTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 text-destructive'
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </AlertDialogTrigger>
        ))}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
