import React, { useState } from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import { validateConsumerId, cleanConsumerId, formatConsumerId } from "@/utils/formatters"
import { toast } from "react-toastify"

const BillSearchForm = ({ onSearch, loading = false }) => {
  const [consumerId, setConsumerId] = useState("")
  const [error, setError] = useState("")
  
  const handleInputChange = (e) => {
    const value = e.target.value
    const cleaned = cleanConsumerId(value)
    
    // Limit to 12 digits
    if (cleaned.length <= 12) {
      setConsumerId(formatConsumerId(cleaned))
      setError("")
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const cleaned = cleanConsumerId(consumerId)
    
    if (!cleaned) {
      setError("Please enter your consumer ID")
      return
    }
    
    if (!validateConsumerId(cleaned)) {
      setError("Consumer ID must be 10-12 digits")
      return
    }
    
    setError("")
    onSearch(cleaned)
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Check Your <span className="gradient-text">Electricity Bill</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Enter your consumer ID to get instant bill information
            </p>
          </div>
        </div>
        
        <FormField
          label="Consumer ID"
          placeholder="Enter 10-12 digit consumer ID"
          value={consumerId}
          onChange={handleInputChange}
          error={error}
          required
          inputClassName="text-center text-xl tracking-wider"
          maxLength="14" // Account for spaces in formatting
        />
        
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
        
        <div className="text-center text-sm text-gray-500">
          <ApperIcon name="Shield" size={16} className="inline mr-1" />
          Your data is secure and not stored
        </div>
      </form>
    </motion.div>
  )
}

export default BillSearchForm