import billsData from "@/services/mockData/bills.json"

const DELAY_MS = 300

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class BillService {
  async getBillByConsumerId(consumerId) {
    await delay(DELAY_MS)
    
    // Clean and validate the consumer ID
    const cleanId = consumerId.toString().replace(/\D/g, '')
    
    const bill = billsData.find(bill => 
      bill.consumerId === cleanId || bill.consumerId === consumerId.toString()
    )
    
    if (!bill) {
      throw new Error("Bill not found for the provided consumer ID. Please verify your consumer ID and try again. Make sure it's 10-12 digits without spaces.")
    }
    
    return { ...bill }
  }
  
  async getAllBills() {
    await delay(DELAY_MS)
    return billsData.map(bill => ({ ...bill }))
  }
  
async getBillHistory(consumerId, months = 12) {
    await delay(800) // Simulate API delay
    
    if (!consumerId) {
      throw new Error("Consumer ID is required")
    }
    
    // Find all bills for the consumer
    const consumerBills = billsData.filter(bill => 
      bill.consumerId === consumerId
    )
    
    if (consumerBills.length === 0) {
      throw new Error("No bill history found for this consumer ID")
    }
    
    // Generate historical bills for the last 'months' months
    const currentDate = new Date()
    const historicalBills = []
    
    for (let i = 0; i < months; i++) {
      const billMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      
      // Use existing bill data as template but adjust for different months
      const templateBill = consumerBills[0]
      const monthVariation = i * 0.1 // Small variation in consumption
      
      const historicalBill = {
        ...templateBill,
        billMonth: billMonth.toISOString(),
        dueDate: new Date(billMonth.getFullYear(), billMonth.getMonth(), 25).toISOString(),
        unitsConsumed: Math.max(50, Math.round((templateBill.unitsConsumed || 250) * (1 + (Math.random() - 0.5) * monthVariation))),
        meterReading: (templateBill.meterReading || 1000) + i * 20,
        billAmount: templateBill.billAmount * (1 + (Math.random() - 0.5) * 0.2),
        totalAmount: templateBill.totalAmount * (1 + (Math.random() - 0.5) * 0.2),
        status: i === 0 ? "unpaid" : (Math.random() > 0.8 ? "overdue" : "paid")
      }
      
      historicalBills.push(historicalBill)
    }
    
    // Sort by bill month (newest first)
    return historicalBills.sort((a, b) => new Date(b.billMonth) - new Date(a.billMonth))
  }

  async validateConsumerId(consumerId) {
    await delay(100)
    
    if (!consumerId || typeof consumerId !== "string") {
      return { valid: false, message: "Consumer ID is required" }
    }
    
    const cleaned = consumerId.replace(/\s/g, "")
    
    if (!/^\d{10,12}$/.test(cleaned)) {
      return { 
        valid: false, 
        message: "Consumer ID must be 10-12 digits" 
      }
    }
    
    return { valid: true, message: "Valid consumer ID format" }
  }
  
  async searchBills(query) {
    await delay(DELAY_MS)
    
    if (!query) {
      return billsData.map(bill => ({ ...bill }))
    }
    
    const lowerQuery = query.toLowerCase()
    
    return billsData
      .filter(bill => 
        bill.consumerId.toLowerCase().includes(lowerQuery) ||
        bill.billMonth.toLowerCase().includes(lowerQuery) ||
        bill.status.toLowerCase().includes(lowerQuery)
      )
      .map(bill => ({ ...bill }))
  }
}

export default new BillService()