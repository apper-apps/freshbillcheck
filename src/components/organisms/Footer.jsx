import React from "react"
import ApperIcon from "@/components/ApperIcon"

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-electric-blue to-sky-blue rounded-xl flex items-center justify-center">
              <ApperIcon name="Zap" size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">BillCheck Pro</span>
          </div>
          
          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <ApperIcon name="Shield" size={16} className="text-electric-blue" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Zap" size={16} className="text-electric-blue" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Smartphone" size={16} className="text-electric-blue" />
              <span>Mobile Optimized</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Clock" size={16} className="text-electric-blue" />
              <span>24/7 Available</span>
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="max-w-2xl mx-auto">
            <h3 className="font-semibold text-gray-900 mb-2">Important Notice</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              BillCheck Pro provides electricity bill information for convenience. 
              Always verify payment status with your official electricity provider. 
              We do not store your personal data or consumer information.
            </p>
          </div>
          
          {/* Powered by */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Powered by <span className="font-semibold gradient-text">Marij Maryam</span> • 
              Made with <ApperIcon name="Heart" size={16} className="inline text-red-500 mx-1" /> 
              for electricity consumers
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer