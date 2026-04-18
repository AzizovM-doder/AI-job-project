"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import { CheckCircle2, AlertCircle, Info, XCircle } from "lucide-react"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:p-4 group-[.toaster]:font-sans",
          description: "group-[.toast]:text-gray-500 font-medium text-xs",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-bold rounded-lg",
          cancelButton: "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-600 font-bold rounded-lg",
          title: "font-bold text-sm tracking-tight",
        },
        icons: {
          success: <CheckCircle2 className="size-5 text-emerald-500" />,
          error: <XCircle className="size-5 text-red-500" />,
          info: <Info className="size-5 text-blue-500" />,
          warning: <AlertCircle className="size-5 text-amber-500" />,
        }
      }}
      {...props}
    />
  )
}

export { Toaster }
