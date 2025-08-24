import React from "react"
import { cn } from "@/utils/cn"

const Button = React.forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  disabled = false,
  loading = false,
  className,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 ease-out focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
  
  const variants = {
    primary: "bg-gradient-to-r from-electric-blue to-sky-blue text-white shadow-lg hover:shadow-xl focus:ring-electric-blue/20",
    secondary: "bg-white text-electric-blue border-2 border-electric-blue hover:bg-electric-blue hover:text-white focus:ring-electric-blue/20",
    outline: "border-2 border-gray-300 text-gray-700 hover:border-electric-blue hover:text-electric-blue focus:ring-electric-blue/20",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray/20",
    danger: "bg-gradient-to-r from-error to-red-600 text-white shadow-lg hover:shadow-xl focus:ring-error/20"
  }
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  }
  
  const variantClasses = variants[variant]
  const sizeClasses = sizes[size]
  
  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses,
        sizeClasses,
        loading && "cursor-wait",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button