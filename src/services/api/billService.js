import billsData from "@/services/mockData/bills.json"

const DELAY_MS = 300

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class BillService {
  async getBillByConsumerId(consumerId) {
    await delay(DELAY_MS)
    
    const bill = billsData.find(bill => 
      bill.consumerId === consumerId.toString()
    )
    
    if (!bill) {
      throw new Error("Bill not found for the provided consumer ID")
    }
    
    return { ...bill }
  }
  
  async getAllBills() {
    await delay(DELAY_MS)
    return billsData.map(bill => ({ ...bill }))
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