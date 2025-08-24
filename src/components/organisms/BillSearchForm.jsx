import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { cleanConsumerId, cleanReferenceNumber, formatConsumerId, validateConsumerId, validateReferenceNumber } from "@/utils/formatters";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";

const BillSearchForm = ({ onSearch, loading = false }) => {
const [searchType, setSearchType] = useState("consumer") // consumer, reference
  const [consumerId, setConsumerId] = useState("")
  const [referenceNumber, setReferenceNumber] = useState("")
  const [error, setError] = useState("")

const handleConsumerIdChange = (e) => {
    const value = e.target.value
    const cleaned = cleanConsumerId(value)
    
    // Limit to 12 digits and provide real-time validation
    if (cleaned.length <= 12) {
      setConsumerId(formatConsumerId(cleaned))
      
      // Real-time validation feedback - accept 10, 11, or 12 digits
      if (cleaned.length > 0 && cleaned.length < 10) {
        setError("Consumer ID should be at least 10 digits")
      } else {
        setError("")
      }
    }
  }

  const handleReferenceChange = (e) => {
    const value = e.target.value
    const cleaned = cleanReferenceNumber(value)
    
    if (cleaned.length <= 16) {
      setReferenceNumber(cleaned)
      
      if (cleaned.length > 0 && cleaned.length < 8) {
        setError("Reference number should be at least 8 characters")
      } else if (cleaned.length > 16) {
        setError("Reference number cannot exceed 16 characters")
      } else {
        setError("")
      }
    }
  }

  
  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    
    if (searchType === "consumer") {
      const cleaned = cleanConsumerId(consumerId)
      
      if (!cleaned) {
        setError("Please enter your consumer ID to search")
        toast.error("Consumer ID is required", { 
          position: "top-right", 
          autoClose: 3000 
        })
        return
      }
      
      if (!validateConsumerId(cleaned)) {
const errorMsg = cleaned.length < 10 
          ? `Consumer ID too short (${cleaned.length} digits). Please enter exactly 10-12 digits.`
          : `Consumer ID too long (${cleaned.length} digits). Please enter exactly 10-12 digits.`
        setError(errorMsg)
        toast.error("Invalid Consumer ID format", { 
          position: "top-right", 
          autoClose: 3000 
        })
        return
      }
      
      onSearch(cleaned, "consumer")
    } else if (searchType === "reference") {
      const cleaned = cleanReferenceNumber(referenceNumber)
      
      if (!cleaned) {
        setError("Please enter your reference number to search")
        toast.error("Reference number is required", { 
          position: "top-right", 
          autoClose: 3000 
        })
        return
      }
      
      if (!validateReferenceNumber(cleaned)) {
        setError("Reference number must be 8-16 alphanumeric characters")
        toast.error("Invalid reference number format", { 
          position: "top-right", 
          autoClose: 3000 
        })
        return
      }
      
      onSearch(cleaned, "reference")
}
  }

  const getTabClass = (type) => {
    return `px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
      searchType === type
        ? 'bg-electric-blue text-white shadow-md'
        : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
    }`
  }
  
  return (
<motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto bg-gradient-to-br from-electric-blue to-sky-blue rounded-2xl flex items-center justify-center shadow-lg"
          >
            <ApperIcon name="Zap" size={32} className="text-white" />
          </motion.div>
          
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Check Your <span className="gradient-text">Electricity Bill</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Enter your details to get instant bill information
            </p>
          </div>
        </div>

        {/* Search Type Tabs */}
        <div className="flex space-x-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <button
            type="button"
            onClick={() => setSearchType("consumer")}
            className={getTabClass("consumer")}
          >
            Consumer ID
          </button>
          <button
            type="button"
            onClick={() => setSearchType("reference")}
            className={getTabClass("reference")}
          >
            Reference No.
          </button>
        </div>
        
        {/* Consumer ID Form */}
        {searchType === "consumer" && (
<FormField
            label="Consumer ID"
            placeholder="Enter your 10-12 digit consumer ID"
            value={consumerId}
            onChange={handleConsumerIdChange}
            error={error}
            required
            inputClassName="text-center text-xl tracking-wider dark:bg-gray-800 dark:text-white dark:border-gray-600"
            maxLength="14"
          />
        )}

        {/* Reference Number Form */}
        {searchType === "reference" && (
          <FormField
            label="Reference Number"
            placeholder="Enter 8-16 character reference number"
            value={referenceNumber}
            onChange={handleReferenceChange}
            error={error}
            required
            inputClassName="text-center text-xl tracking-wider dark:bg-gray-800 dark:text-white dark:border-gray-600"
            maxLength="16"
          />
        )}

        {/* API Key Form */}
        
        <Button
          type="submit"
          size="lg"
          loading={loading}
          className="w-full gap-2"
        >
          {loading ? (
            <>
              <ApperIcon name="Loader2" size={20} className="animate-spin" />
              Checking Bill...
            </>
          ) : (
            <>
              <ApperIcon name="Search" size={20} />
              Check Bill
            </>
          )}
        </Button>
        
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <ApperIcon name="Shield" size={16} className="inline mr-1" />
          Your data is secure and not stored
        </div>
      </form>
    </motion.div>
  )
}

export default BillSearchForm