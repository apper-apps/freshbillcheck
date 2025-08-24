import React from "react"
import { cn } from "@/utils/cn"

const Card = React.forwardRef(({ 
  children,
  variant = "default",
  className,
  ...props 
}, ref) => {
  const baseClasses = "rounded-2xl border transition-all duration-200"
  
  const variants = {
    default: "bg-white border-gray-100 shadow-card",
    glass: "bg-white/80 backdrop-blur-sm border-white/20 shadow-soft",
    outlined: "bg-white border-gray-200 shadow-none hover:shadow-card",
    elevated: "bg-white border-gray-100 shadow-hover"
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

export default Card