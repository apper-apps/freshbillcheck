import React from "react"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const StatusBadge = ({ status, className }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return {
          variant: "success",
          icon: "CheckCircle",
          text: "Paid"
        }
      case "unpaid":
        return {
          variant: "warning",
          icon: "Clock",
          text: "Unpaid"
        }
      case "overdue":
        return {
          variant: "error",
          icon: "AlertTriangle",
          text: "Overdue"
        }
      default:
        return {
          variant: "default",
          icon: "Help",
          text: "Unknown"
        }
    }
  }
  
  const config = getStatusConfig(status)
  
  return (
    <Badge 
      variant={config.variant} 
      size="md"
      className={cn("gap-1.5", className)}
    >
      <ApperIcon name={config.icon} size={14} />
      {config.text}
    </Badge>
  )
}

export default StatusBadge