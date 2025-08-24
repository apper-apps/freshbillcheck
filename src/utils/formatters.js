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
  // Return consumer ID without space formatting
  return id.toString()
}

export const validateConsumerId = (id) => {
  if (!id || typeof id !== "string") return false
  // Remove spaces and check if it's exactly 10, 11, or 12 digits (includes 10-digit support)
  const cleanId = id.replace(/\s/g, "")
  return /^\d{10}$/.test(cleanId) || /^\d{11}$/.test(cleanId) || /^\d{12}$/.test(cleanId)
}

export const validateReferenceNumber = (ref) => {
  if (!ref || typeof ref !== "string") return false
  // Reference numbers can be alphanumeric, 8-16 characters
  const cleanRef = ref.replace(/\s/g, "")
  return /^[A-Za-z0-9]{8,16}$/.test(cleanRef)
}

export const cleanConsumerId = (id) => {
  if (!id) return ""
  return id.replace(/\s/g, "").replace(/[^0-9]/g, "")
}

export const cleanReferenceNumber = (ref) => {
  if (!ref) return ""
  return ref.replace(/\s/g, "").replace(/[^A-Za-z0-9]/g, "")
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

export const formatMonthYear = (date) => {
  if (!date) return "N/A"
  try {
    const parsedDate = typeof date === "string" ? new Date(date) : date
    return format(parsedDate, "MMM yyyy")
  } catch (error) {
    return "Invalid Date"
  }
}

export const getMonthsRange = (count = 12) => {
  const months = []
  const currentDate = new Date()
  
  for (let i = 0; i < count; i++) {
    const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    months.push(month)
  }
  
  return months
}

export const getMonthName = (monthIndex) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  return months[monthIndex] || "Unknown"
}