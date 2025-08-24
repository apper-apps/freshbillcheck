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
    default: "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-card",
    glass: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-white/20 dark:border-gray-700/20 shadow-soft",
    outlined: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 shadow-none hover:shadow-card",
    elevated: "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-hover"
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