import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-electric-blue via-sky-blue to-electric-blue shadow-lg no-print"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <ApperIcon name="Zap" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                BillCheck Pro
              </h1>
              <p className="text-white/80 text-sm">
                Instant Electricity Bill Checker
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-white/90 text-sm">
            <div className="flex items-center gap-2">
              <ApperIcon name="Shield" size={16} />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Zap" size={16} />
              <span>Instant</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Smartphone" size={16} />
              <span>Mobile Friendly</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header