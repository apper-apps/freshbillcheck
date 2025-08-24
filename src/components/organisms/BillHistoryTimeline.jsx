import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import StatusBadge from "@/components/molecules/StatusBadge"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { formatCurrency, formatMonthYear, getMonthsRange, formatDate } from "@/utils/formatters"
import { cn } from "@/utils/cn"

const BillHistoryTimeline = ({ 
  consumerId, 
  onClose, 
  onBillSelect,
  billHistory = [],
  loading = false,
  error = null 
}) => {
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [filteredBills, setFilteredBills] = useState([])
  
  // Generate last 12 months for selector
  const monthsRange = getMonthsRange(12)
  
  useEffect(() => {
    if (selectedMonth) {
      const filtered = billHistory.filter(bill => {
        const billDate = new Date(bill.billMonth)
        return billDate.getMonth() === selectedMonth.getMonth() && 
               billDate.getFullYear() === selectedMonth.getFullYear()
      })
      setFilteredBills(filtered)
    } else {
      setFilteredBills(billHistory)
    }
  }, [selectedMonth, billHistory])

  const handleMonthSelect = (month) => {
    setSelectedMonth(selectedMonth?.getTime() === month.getTime() ? null : month)
  }

  const getBillForMonth = (month) => {
    return billHistory.find(bill => {
      const billDate = new Date(bill.billMonth)
      return billDate.getMonth() === month.getMonth() && 
             billDate.getFullYear() === month.getFullYear()
    })
  }

  if (loading) {
    return <Loading message="Loading bill history..." />
  }

  if (error) {
    return <Error message={error} />
  }

  if (!billHistory.length) {
    return (
      <Empty 
        message="No bill history found"
        description="No previous bills available for this consumer ID"
        action={
          <Button variant="secondary" onClick={onClose}>
            Back to Search
          </Button>
        }
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ApperIcon name="Clock" size={24} />
            Bill History Timeline
          </h2>
          <p className="text-gray-600 mt-1">
            Consumer ID: {consumerId} • {billHistory.length} bills found
          </p>
        </div>
        <Button variant="secondary" onClick={onClose} className="gap-2">
          <ApperIcon name="ArrowLeft" size={16} />
          Back to Search
        </Button>
      </div>

      {/* Month Selector */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ApperIcon name="Calendar" size={18} />
          Filter by Month
          {selectedMonth && (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => setSelectedMonth(null)}
              className="ml-2"
            >
              Clear Filter
            </Button>
          )}
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {monthsRange.map((month, index) => {
            const bill = getBillForMonth(month)
            const isSelected = selectedMonth?.getTime() === month.getTime()
            const hasBill = !!bill
            
            return (
              <Button
                key={index}
                variant={isSelected ? "primary" : "secondary"}
                size="sm"
                onClick={() => handleMonthSelect(month)}
                className={cn(
                  "flex flex-col items-center p-3 h-auto relative",
                  !hasBill && "opacity-50",
                  hasBill && !isSelected && "hover:bg-gray-50"
                )}
                disabled={!hasBill}
              >
                <div className="text-xs font-medium">
                  {formatMonthYear(month)}
                </div>
                {hasBill && (
                  <div className="text-xs mt-1 opacity-75">
                    {formatCurrency(bill.totalAmount || bill.billAmount)}
                  </div>
                )}
                {hasBill && (
                  <div className={cn(
                    "absolute -top-1 -right-1 w-3 h-3 rounded-full",
                    bill.status === "paid" && "bg-success",
                    bill.status === "unpaid" && "bg-warning", 
                    bill.status === "overdue" && "bg-error"
                  )} />
                )}
              </Button>
            )
          })}
        </div>
      </Card>

      {/* Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedMonth ? `Bills for ${formatMonthYear(selectedMonth)}` : 'All Bills'}
          </h3>
          <div className="text-sm text-gray-600">
            {filteredBills.length} bill{filteredBills.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {filteredBills.length === 0 ? (
          <Empty 
            message="No bills found"
            description={selectedMonth ? `No bills available for ${formatMonthYear(selectedMonth)}` : "No bills match the current filter"}
          />
        ) : (
          <div className="space-y-4">
            {filteredBills.map((bill, index) => (
              <motion.div
                key={bill.consumerId + bill.billMonth}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-hover transition-all duration-200">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Timeline indicator */}
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "w-4 h-4 rounded-full",
                          bill.status === "paid" && "bg-success",
                          bill.status === "unpaid" && "bg-warning",
                          bill.status === "overdue" && "bg-error"
                        )} />
                        {index < filteredBills.length - 1 && (
                          <div className="w-0.5 h-12 bg-gray-200 mt-2" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {formatMonthYear(new Date(bill.billMonth))}
                          </h4>
                          <StatusBadge status={bill.status} />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Amount:</span>
                            <div className="font-semibold text-gray-900">
                              {formatCurrency(bill.totalAmount || bill.billAmount)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Due Date:</span>
                            <div className="font-semibold text-gray-900">
                              {formatDate(bill.dueDate)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Units:</span>
                            <div className="font-semibold text-gray-900">
                              {bill.unitsConsumed || 0} kWh
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Reading:</span>
                            <div className="font-semibold text-gray-900">
                              {bill.meterReading || "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onBillSelect?.(bill)}
                        className="gap-2"
                      >
                        <ApperIcon name="Eye" size={16} />
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default BillHistoryTimeline