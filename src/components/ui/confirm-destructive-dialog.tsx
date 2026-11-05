import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export interface ConfirmDestructiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  className?: string
}

export const ConfirmDestructiveDialog: React.FC<ConfirmDestructiveDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Volver',
  onConfirm,
  className,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'max-w-[var(--dialog-sm-max-width)] rounded-[var(--radius-card-lg)] border-[var(--dashboard-card-border)] bg-[var(--neutral-surface)] p-6',
          className
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-[var(--neutral-emphasis)]">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs text-[var(--neutral-muted)] mt-1">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[var(--neutral-border-subtle)] mt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex h-9.5 items-center justify-center rounded-[var(--dashboard-btn-radius)] border border-[var(--neutral-border)] bg-[var(--neutral-surface)] px-4 text-xs font-medium text-[var(--neutral-muted)] hover:text-[var(--neutral-emphasis)] hover:bg-[var(--neutral-subtle)] transition-all cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
            className="inline-flex h-9.5 items-center justify-center rounded-[var(--dashboard-btn-radius)] bg-[var(--destructive)] px-5 text-xs font-medium text-[var(--destructive-foreground)] hover:opacity-90 active:scale-98 transition-all cursor-pointer shadow-xs"
          >
            {confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
