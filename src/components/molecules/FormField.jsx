import React from "react"
import Label from "@/components/atoms/Label"
import Input from "@/components/atoms/Input"
import { cn } from "@/utils/cn"

const FormField = ({ 
  label, 
  error, 
  required = false,
  className,
  inputClassName,
  ...inputProps 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label required={required}>
          {label}
        </Label>
      )}
      <Input
        error={!!error}
        className={inputClassName}
        {...inputProps}
      />
      {error && (
        <p className="text-error text-sm font-medium animate-shake">
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField