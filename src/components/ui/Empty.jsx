import React from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No bills found",
  message = "We couldn't find any billing information for the provided consumer ID.",
  actionText = "Try Different ID",
  onAction
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <Card className="p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg"
        >
          <ApperIcon name="FileSearch" size={28} className="text-white" />
        </motion.div>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-600">
              {message}
            </p>
          </div>
          
<div className="bg-amber/10 border border-amber/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <ApperIcon name="Lightbulb" size={16} className="text-amber mt-0.5 flex-shrink-0" />
              <div className="text-left space-y-3">
                <p className="text-sm text-amber font-semibold">
                  Troubleshooting Tips:
                </p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-amber font-medium mb-1">✓ Check Consumer ID Format:</p>
                    <ul className="text-xs text-amber/80 space-y-0.5 ml-3">
                      <li>• Must be exactly 10-12 digits</li>
                      <li>• Remove all spaces and dashes</li>
                      <li>• No letters or special characters</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-amber font-medium mb-1">✓ Where to Find Your ID:</p>
                    <ul className="text-xs text-amber/80 space-y-0.5 ml-3">
                      <li>• Top-right corner of your electricity bill</li>
                      <li>• Previous month's bill statement</li>
                      <li>• Electricity board connection documents</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-amber font-medium mb-1">✓ Still Not Working?</p>
                    <ul className="text-xs text-amber/80 space-y-0.5 ml-3">
                      <li>• Double-check for typos</li>
                      <li>• Try a different connection if you have multiple</li>
                      <li>• Contact your electricity provider</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {onAction && (
            <Button 
              variant="primary" 
              size="lg"
              onClick={onAction}
              className="w-full gap-2"
            >
              <ApperIcon name="Search" size={20} />
              {actionText}
            </Button>
          )}
          
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-4">
            <div className="flex items-center gap-1">
              <ApperIcon name="Shield" size={12} />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Zap" size={12} />
              <span>Instant</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Clock" size={12} />
              <span>24/7</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default Empty