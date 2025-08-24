import React from "react"
import { cn } from "@/utils/cn"

const Input = React.forwardRef(({ 
  type = "text",
  error = false,
  disabled = false,
  className,
  ...props 
}, ref) => {
  const baseClasses = "w-full px-4 py-4 text-lg border-2 rounded-xl transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
  
  const stateClasses = error
    ? "border-error focus:border-error focus:ring-4 focus:ring-error/20"
    : "border-gray-200 focus:border-electric-blue focus:ring-4 focus:ring-electric-blue/20"
  
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        baseClasses,
        stateClasses,
        className
      )}
      disabled={disabled}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input