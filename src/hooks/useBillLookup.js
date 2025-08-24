import { useState, useCallback } from "react"
import billService from "@/services/api/billService"
import { toast } from "react-toastify"

export const useBillLookup = () => {
  const [billData, setBillData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Bill history state
  const [billHistory, setBillHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState("")
  
const searchBill = useCallback(async (consumerId) => {
    if (!consumerId) {
      setError("Consumer ID is required")
      return
    }
    
    setLoading(true)
    setError("")
    setBillData(null)
    
try {
      const bill = await billService.getBillByConsumerId(consumerId)
      setBillData(bill)
      toast.success("Bill found successfully!", {
        position: "top-right",
        autoClose: 2000
      })
    } catch (err) {
      let errorMessage = err.message || "Failed to fetch bill information"
      
      // Provide more specific and helpful error messages
      if (errorMessage.includes("Bill not found")) {
        errorMessage = `No bill found for Consumer ID: ${consumerId}

Please check:
• Consumer ID should be 10-12 digits
• Remove spaces, dashes, or special characters
• Verify ID from your latest electricity bill
• Try entering without any formatting

If you have multiple connections, try a different Consumer ID.`
      } else if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
        errorMessage = "Connection failed. Please check your internet connection and try again."
      } else if (errorMessage.includes("Invalid format")) {
        errorMessage = `Invalid Consumer ID format: ${consumerId}

Required format:
• Must be 10-12 digits only
• No letters or special characters
• Examples: 1234567890, 123456789012`
      } else if (errorMessage.includes("timeout")) {
        errorMessage = "Search timed out. Please try again or check your connection."
      }
      
      setError(errorMessage)
      toast.error("Search failed", {
        position: "top-right",
        autoClose: 5000
      })
    } finally {
      setLoading(false)
    }
  }, [])
  
  const resetSearch = useCallback(() => {
    setBillData(null)
    setError("")
    setLoading(false)
  }, [])
  
  const retrySearch = useCallback((consumerId) => {
    searchBill(consumerId)
  }, [searchBill])
  
const fetchBillHistory = useCallback(async (consumerId, months = 12) => {
    if (!consumerId) {
      setHistoryError("Consumer ID is required")
      return
    }
    
    setHistoryLoading(true)
    setHistoryError("")
    setBillHistory([])
    
    try {
      const history = await billService.getBillHistory(consumerId, months)
      setBillHistory(history)
      toast.success(`Found ${history.length} historical bills`, {
        position: "top-right",
        autoClose: 2000
      })
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch bill history"
      setHistoryError(errorMessage)
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000
      })
    } finally {
      setHistoryLoading(false)
    }
  }, [])
  
  const resetHistory = useCallback(() => {
    setBillHistory([])
    setHistoryError("")
    setHistoryLoading(false)
  }, [])

  return {
    billData,
    loading,
    error,
    searchBill,
    resetSearch,
    retrySearch,
    // History functionality
    billHistory,
    historyLoading,
    historyError,
    fetchBillHistory,
    resetHistory
  }
}