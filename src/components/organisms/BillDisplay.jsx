import React from "react"
import { motion } from "framer-motion"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import BillAmount from "@/components/molecules/BillAmount"
import StatusBadge from "@/components/molecules/StatusBadge"
import ApperIcon from "@/components/ApperIcon"
import { formatDate, formatCurrency } from "@/utils/formatters"

const BillDisplay = ({ billData, onPrint, onDownload, onNewSearch }) => {
  const {
    consumerId,
    billAmount,
    dueDate,
    status,
    billMonth,
    unitsConsumed,
    meterReading,
    taxes,
    surcharges,
    totalAmount
  } = billData
  
  const billDetails = [
    { label: "Consumer ID", value: consumerId || "N/A" },
    { label: "Bill Month", value: billMonth || "N/A" },
    { label: "Units Consumed", value: `${unitsConsumed || 0} kWh` },
    { label: "Meter Reading", value: meterReading || "N/A" },
    { label: "Base Amount", value: formatCurrency(billAmount || 0) },
    { label: "Taxes & Fees", value: formatCurrency(taxes || 0) },
    { label: "Surcharges", value: formatCurrency(surcharges || 0) }
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Header Card */}
      <Card className="p-8 text-center">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Electricity Bill
              </h2>
              <p className="text-gray-600">Consumer ID: {consumerId}</p>
            </div>
            <StatusBadge status={status} />
          </div>
          
          <BillAmount amount={totalAmount || billAmount} animate />
          
          <div className="flex justify-center items-center gap-2 text-lg">
            <ApperIcon name="Calendar" size={20} className="text-gray-500" />
            <span className="font-semibold">Due Date:</span>
            <span className={`font-bold ${status === "overdue" ? "text-error" : "text-gray-900"}`}>
              {formatDate(dueDate)}
            </span>
          </div>
        </div>
      </Card>
      
      {/* Bill Details Card */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ApperIcon name="FileText" size={20} />
          Bill Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {billDetails.map((detail, index) => (
            <div 
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
            >
              <span className="text-gray-600 font-medium">{detail.label}:</span>
              <span className="text-gray-900 font-semibold">{detail.value}</span>
            </div>
          ))}
        </div>
        
        {/* Total Amount Highlight */}
        <div className="mt-6 pt-4 border-t-2 border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">Total Amount:</span>
            <span className="text-2xl font-bold gradient-text">
              {formatCurrency(totalAmount || billAmount)}
            </span>
          </div>
        </div>
      </Card>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 no-print">
        <Button 
          variant="secondary" 
          size="lg" 
          onClick={onPrint}
          className="flex-1 gap-2"
        >
          <ApperIcon name="Printer" size={20} />
          Print Bill
        </Button>
        
        <Button 
          variant="secondary" 
          size="lg" 
          onClick={onDownload}
          className="flex-1 gap-2"
        >
          <ApperIcon name="Download" size={20} />
          Download PDF
        </Button>
        
        <Button 
          variant="primary" 
          size="lg" 
          onClick={onNewSearch}
          className="flex-1 gap-2"
        >
          <ApperIcon name="Search" size={20} />
          New Search
        </Button>
      </div>
      
      {/* Print-only header */}
      <div className="hidden print-only">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">BillCheck Pro</h1>
          <p className="text-gray-600">Electricity Bill Statement</p>
          <p className="text-sm text-gray-500 mt-2">
            Generated on {formatDate(new Date())}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default BillDisplay