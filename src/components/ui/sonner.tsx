"use client"
import { Toaster as Sonner } from "sonner"

// Remove next-themes dependency for now
export function Toaster() {
  return (
    <Sonner
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "bg-background text-foreground border shadow-lg",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
        }
      }}
    />
  )
}
