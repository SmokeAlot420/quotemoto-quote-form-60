
"use client"
import React from "react";
import { Toaster as Sonner } from "sonner";
import { type ToasterProps } from "sonner";

// Export the Toaster component with proper typing
export function Toaster(props: ToasterProps) {
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
      {...props}
    />
  );
}
