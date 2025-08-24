import { format } from "date-fns"

export const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "₹0.00"
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export const formatDate = (date) => {
  if (!date) return "N/A"
  try {
    const parsedDate = typeof date === "string" ? new Date(date) : date
    return format(parsedDate, "dd MMM yyyy")
  } catch (error) {
    return "Invalid Date"
  }
}

export const formatConsumerId = (id) => {
  if (!id) return ""
  // Format consumer ID with spaces for better readability
  return id.toString().replace(/(.{4})/g, "$1 ").trim()
}

export const validateConsumerId = (id) => {
  if (!id || typeof id !== "string") return false
  // Remove spaces and check if it's 10-12 digits
  const cleanId = id.replace(/\s/g, "")
  return /^\d{10,12}$/.test(cleanId)
}

export const cleanConsumerId = (id) => {
  if (!id) return ""
  return id.replace(/\s/g, "").replace(/[^0-9]/g, "")
}

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "text-success bg-success/10 border-success/20"
    case "unpaid":
      return "text-warning bg-warning/10 border-warning/20"
    case "overdue":
      return "text-error bg-error/10 border-error/20"
    default:
      return "text-gray-600 bg-gray/10 border-gray/20"
  }
}