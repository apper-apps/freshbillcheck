import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { useTheme } from "@/contexts/ThemeContext"
const Header = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-electric-blue via-sky-blue to-electric-blue dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 shadow-lg no-print transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 dark:bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <ApperIcon name="Zap" size={24} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-lg md:text-xl font-bold text-white">
                  Instant Electricity Bill Checker
                </h1>
              </div>
              <p className="text-white/80 text-xs md:text-sm font-medium">
                by Marij Maryam
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <ApperIcon 
                name={theme === 'light' ? 'Moon' : 'Sun'} 
                size={20} 
                className="text-white" 
              />
            </Button>

            {/* Features - Hidden on mobile */}
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
      </div>
    </motion.header>
  )
}

export default Header