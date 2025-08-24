import React, { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import BillSearchForm from "@/components/organisms/BillSearchForm"
import BillDisplay from "@/components/organisms/BillDisplay"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { useBillLookup } from "@/hooks/useBillLookup"
import BillHistoryTimeline from "@/components/organisms/BillHistoryTimeline"

const BillCheckerPage = () => {
  const [lastSearchedId, setLastSearchedId] = useState("")
  const { billData, loading, error, searchBill, resetSearch, retrySearch } = useBillLookup()
  
  const handleSearch = async (consumerId) => {
    setLastSearchedId(consumerId)
    await searchBill(consumerId)
  }
  
  const handlePrint = () => {
    window.print()
    toast.info("Print dialog opened", {
      position: "top-right",
      autoClose: 2000
    })
  }
  
  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    const billInfo = `
BillCheck Pro - Electricity Bill
Consumer ID: ${billData.consumerId}
Bill Month: ${billData.billMonth}
Amount Due: ₹${billData.totalAmount || billData.billAmount}
Due Date: ${new Date(billData.dueDate).toLocaleDateString()}
Status: ${billData.status}
Units Consumed: ${billData.unitsConsumed} kWh
    `.trim()
    
    const blob = new Blob([billInfo], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `electricity-bill-${billData.consumerId}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success("Bill downloaded successfully!", {
      position: "top-right",
      autoClose: 3000
    })
  }
  
  const handleRetry = () => {
    if (lastSearchedId) {
      retrySearch(lastSearchedId)
    }
  }
  
const renderContent = () => {
    if (loading) {
      return <Loading message="Checking your bill..." />
    }
    
    if (error) {
      let suggestion = "Please try again or contact support if the problem persists."
      
      if (error.includes("not found") || error.includes("Bill not found")) {
        suggestion = "Double-check your consumer ID format:\n• Must be 10-12 digits only\n• Remove any spaces or special characters\n• Try a different consumer ID if you have multiple connections"
      } else if (error.includes("network") || error.includes("connection") || error.includes("internet")) {
        suggestion = "Please check your internet connection and try again."
      } else if (error.includes("required")) {
        suggestion = "Please enter your consumer ID to search for your bill."
      }
      
      return (
        <Error
          message={error}
          suggestion={suggestion}
          onRetry={lastSearchedId ? handleRetry : undefined}
          onReset={resetSearch}
        />
      )
    }
    
    if (billData) {
      return (
        <BillDisplay
          billData={billData}
          onPrint={handlePrint}
          onDownload={handleDownload}
          onNewSearch={resetSearch}
        />
      )
    }
    
    return <BillSearchForm onSearch={handleSearch} />
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 py-8 px-4"
    >
      <div className="max-w-4xl mx-auto">
{renderContent()}
      </div>
    </motion.div>
  )
}

export default BillCheckerPage