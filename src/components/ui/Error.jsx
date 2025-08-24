import React from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ 
  message = "Something went wrong", 
  suggestion = "Please try again or contact support if the problem persists.",
  onRetry,
  onReset 
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
          className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-error to-red-600 rounded-2xl flex items-center justify-center shadow-lg"
        >
          <ApperIcon name="AlertTriangle" size={28} className="text-white" />
        </motion.div>
        
        <div className="space-y-4">
          <div>
<h3 className="text-xl font-bold text-gray-900 mb-2">
              {message.includes("not found") ? "Bill Not Found" : "Oops! Something went wrong"}
            </h3>
            <p className="text-gray-600 font-medium">
              {message.includes("not found") 
                ? "We couldn't locate a bill with the provided Consumer ID." 
                : message
              }
            </p>
          </div>
          
          <div className="bg-error/5 border border-error/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <ApperIcon name="Info" size={16} className="text-error mt-0.5 flex-shrink-0" />
              <div className="text-sm text-error font-medium text-left">
                {suggestion.includes('\n') ? (
                  <div className="space-y-2">
                    {suggestion.split('\n').filter(line => line.trim()).map((line, index) => (
                      <div key={index} className="flex items-start gap-1">
                        {line.startsWith('•') ? (
                          <>
                            <span className="text-error">•</span>
                            <span>{line.substring(1).trim()}</span>
                          </>
                        ) : (
                          <span className="font-semibold">{line}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>{suggestion}</p>
                )}
              </div>
            </div>
          </div>
          
          {message.includes("not found") && (
            <div className="bg-amber/5 border border-amber/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <ApperIcon name="Lightbulb" size={16} className="text-amber mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber font-medium text-left">
                  <p className="font-semibold mb-1">Common Consumer ID formats:</p>
                  <div className="space-y-1 text-xs">
                    <div>• 10 digits: 1234567890</div>
                    <div>• 11 digits: 12345678901</div>
                    <div>• 12 digits: 123456789012</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {onRetry && (
              <Button 
                variant="primary" 
                onClick={onRetry}
                className="flex-1 gap-2"
              >
                <ApperIcon name="RefreshCw" size={16} />
                Try Again
              </Button>
            )}
            
            {onReset && (
              <Button 
                variant="secondary" 
                onClick={onReset}
                className="flex-1 gap-2"
              >
                <ApperIcon name="Home" size={16} />
                Start Over
              </Button>
            )}
          </div>
          
          <div className="text-xs text-gray-500 pt-2">
            <ApperIcon name="Clock" size={12} className="inline mr-1" />
            Error occurred at {new Date().toLocaleTimeString()}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default Error