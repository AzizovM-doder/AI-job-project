import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative w-full flex items-center group">
        <span className="absolute left-3 text-primary hidden terminal:block font-bold animate-pulse">{">"}</span>
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-[var(--radius)] border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            "terminal:rounded-none terminal:border-0 terminal:border-b-2 terminal:border-primary terminal:pl-8 terminal:placeholder:text-primary/30 terminal:focus-visible:ring-0 terminal:focus-visible:border-b-4",
            className
          )}
          ref={ref}
          {...props}
        />
        <div className="absolute right-3 w-2.5 h-5 bg-primary hidden terminal:block animate-terminal-blink pointer-events-none opacity-50 group-focus-within:opacity-100" />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
