import React, { useEffect, useState } from "react"
import { formatCurrency } from "@/utils/formatters"
import { cn } from "@/utils/cn"

const BillAmount = ({ amount, className, animate = false }) => {
  const [displayAmount, setDisplayAmount] = useState(animate ? 0 : amount)
  
  useEffect(() => {
    if (animate && amount > 0) {
      let start = 0
      const end = amount
      const duration = 800
      const startTime = Date.now()
      
      const updateAmount = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Ease-out animation
        const easeOut = 1 - Math.pow(1 - progress, 3)
        const current = start + (end - start) * easeOut
        
        setDisplayAmount(current)
        
        if (progress < 1) {
          requestAnimationFrame(updateAmount)
        }
      }
      
      requestAnimationFrame(updateAmount)
    } else {
      setDisplayAmount(amount)
    }
  }, [amount, animate])
  
  return (
    <div className={cn("text-center", className)}>
      <div className="text-4xl md:text-6xl font-bold gradient-text animate-count-up">
        {formatCurrency(displayAmount)}
      </div>
      <div className="text-gray-600 text-lg font-medium mt-2">
        Total Amount Due
      </div>
    </div>
  )
}

export default BillAmount