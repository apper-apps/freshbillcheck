import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const Loading = ({ message = "Loading...", fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-12 space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="relative"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-electric-blue to-sky-blue rounded-2xl flex items-center justify-center shadow-lg">
          <ApperIcon 
            name="Zap" 
            size={28} 
            className="text-white lightning-icon" 
          />
        </div>
        
        {/* Animated rings */}
        <div className="absolute inset-0 rounded-2xl border-4 border-electric-blue/20 animate-ping"></div>
        <div className="absolute inset-0 rounded-2xl border-2 border-sky-blue/30 animate-pulse"></div>
      </motion.div>
      
      <div className="text-center space-y-2">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-semibold text-gray-900"
        >
          {message}
        </motion.h3>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-gray-600"
        >
          Fetching your bill information...
        </motion.p>
        
        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center space-x-1 mt-4"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-electric-blue rounded-full"
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      {content}
    </motion.div>
  )
}

export default Loading