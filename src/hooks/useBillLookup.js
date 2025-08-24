import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import billService from "@/services/api/billService";

export const useBillLookup = () => {
  const [billData, setBillData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Bill history state
  const [billHistory, setBillHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState("")
  
const searchBill = useCallback(async (searchValue, searchType = "consumer") => {
    if (!searchValue) {
      const fieldName = searchType === "consumer" ? "Consumer ID" : "Reference Number"
      setError(`${fieldName} is required`)
      return
    }
    
    setLoading(true)
    setError("")
    setBillData(null)
    
    try {
      let bill
      
      if (searchType === "consumer") {
        bill = await billService.getBillByConsumerId(searchValue)
      } else if (searchType === "reference") {
        bill = await billService.getBillByReferenceNumber(searchValue)
      }
      
      setBillData(bill)
      toast.success("Bill found successfully!", {
        position: "top-right",
        autoClose: 2000
      })
    } catch (err) {
      let errorMessage = err.message || "Failed to fetch bill information"
      
      // Provide more specific and helpful error messages
      if (errorMessage.includes("Bill not found")) {
        if (searchType === "consumer") {
          errorMessage = `No bill found for Consumer ID: ${searchValue}

Please verify:
• Consumer ID must be exactly 10-12 digits long
• Remove all spaces, dashes, or special characters
• Check your latest electricity bill for the correct ID
• Try entering the ID exactly as shown on your bill
• Contact your electricity provider if you're certain the ID is correct

Valid examples: 1234567890, 12345678901, 123456789012`
        } else if (searchType === "reference") {
          errorMessage = `No bill found for Reference Number: ${searchValue}

Please check:
• Reference number should be 8-16 alphanumeric characters
• Remove spaces and special characters
• Verify reference from your bill receipt
• Try the reference number exactly as shown on your bill`
        }
      } else if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
        errorMessage = "Connection failed. Please check your internet connection and try again."
      } else if (errorMessage.includes("Invalid format")) {
        if (searchType === "consumer") {
          errorMessage = `Invalid Consumer ID format: ${searchValue}

Required format:
• Must be exactly 10-12 digits only (no letters or symbols)
• No spaces, dashes, or special characters
• Examples: 1234567890, 12345678901, 123456789012`
        } else if (searchType === "reference") {
          errorMessage = `Invalid Reference Number format: ${searchValue}

Required format:  
• Must be 8-16 alphanumeric characters
• Letters and numbers only
• Examples: REF12345678, BIL987654321`
        }
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
  
  const retrySearch = useCallback((searchValue, searchType = "consumer") => {
    searchBill(searchValue, searchType)
  }, [searchBill])
const fetchBillHistory = useCallback(async (searchValue, searchType = "consumer", months = 12) => {
    if (!searchValue) {
      const fieldName = searchType === "consumer" ? "Consumer ID" : "Reference Number"
      setHistoryError(`${fieldName} is required`)
      return
    }
    
    setHistoryLoading(true)
    setHistoryError("")
    setBillHistory([])
    
    try {
      const history = await billService.getBillHistory(searchValue, months, searchType)
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