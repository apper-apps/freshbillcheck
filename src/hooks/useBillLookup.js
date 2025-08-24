import { useState, useCallback } from "react"
import billService from "@/services/api/billService"
import { toast } from "react-toastify"

export const useBillLookup = () => {
  const [billData, setBillData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
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
      const errorMessage = err.message || "Failed to fetch bill information"
      setError(errorMessage)
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000
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
  
  return {
    billData,
    loading,
    error,
    searchBill,
    resetSearch,
    retrySearch
  }
}