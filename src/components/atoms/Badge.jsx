import React from "react"
import { cn } from "@/utils/cn"

const Badge = React.forwardRef(({ 
  children,
  variant = "default",
  size = "md",
  className,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-full border"
  
  const variants = {
    default: "bg-gray-100 text-gray-700 border-gray-200",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    error: "bg-error/10 text-error border-error/20",
    info: "bg-info/10 text-info border-info/20"
  }
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  }
  
  return (
    <span
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = "Badge"

export default Badge