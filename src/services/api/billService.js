import billsData from "@/services/mockData/bills.json";

const DELAY_MS = 300

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Helper function to calculate Levenshtein distance for fuzzy matching
const levenshteinDistance = (str1, str2) => {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

class BillService {
async getBillByConsumerId(consumerId) {
    await delay(DELAY_MS)
    
    // Clean and validate the consumer ID
    const cleanId = consumerId.toString().replace(/\D/g, '')
    
    // Normalize the input consumer ID
    const normalizedInput = cleanId.replace(/[\s\-_]/g, '')
    
    // Try exact match first (supporting 10-digit IDs)
    let bill = billsData.find(bill => {
      const normalizedBill = bill.consumerId.replace(/[\s\-_]/g, '')
      return normalizedBill === normalizedInput || 
             normalizedBill === consumerId.toString().replace(/[\s\-_]/g, '')
    })
    
    // If no exact match, try partial matches (for typos or incomplete IDs)
    if (!bill) {
      bill = billsData.find(bill => {
        const normalizedBill = bill.consumerId.replace(/[\s\-_]/g, '')
        // Check if the input is contained within the bill ID (for partial matches)
        return normalizedBill.includes(normalizedInput) || 
               normalizedInput.includes(normalizedBill)
      })
    }
    
    // If still no match, try fuzzy matching (allow 1-2 character differences)
    if (!bill) {
      bill = billsData.find(bill => {
        const normalizedBill = bill.consumerId.replace(/[\s\-_]/g, '')
        return levenshteinDistance(normalizedBill, normalizedInput) <= 2 &&
               Math.abs(normalizedBill.length - normalizedInput.length) <= 1
      })
    }
    
    if (!bill) {
      throw new Error("Bill not found for the provided consumer ID. Please verify your consumer ID and try again. Make sure it's exactly 10, 11, or 12 digits without spaces.")
    }
    
    return { ...bill }
  }

  async getBillByReferenceNumber(referenceNumber) {
    await delay(DELAY_MS)
    
    // Clean the reference number
    const cleanRef = referenceNumber.toString().replace(/[\s\-_]/g, '').toUpperCase()
    
    // Try to find bill by reference number (simulate reference number search)
    // For demo purposes, we'll try to match against a generated reference pattern
    let bill = billsData.find(bill => {
      // Generate a reference number pattern based on consumer ID
      const refPattern = `REF${bill.consumerId.slice(-8)}`.toUpperCase()
      return refPattern === cleanRef || 
             bill.consumerId.includes(cleanRef.replace(/[A-Z]/g, ''))
    })
    
    if (!bill) {
      throw new Error("Bill not found for the provided reference number. Please verify your reference number and try again.")
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

async getBillHistory(searchValue, months = 12, searchType = "consumer") {
    await delay(800) // Simulate API delay
    
    if (!searchValue) {
      throw new Error(`${searchType === "consumer" ? "Consumer ID" : "Reference Number"} is required`)
    }
    
    // Find bills based on search type
    let consumerBills = []
    
    if (searchType === "consumer") {
      consumerBills = billsData.filter(bill => 
        bill.consumerId === searchValue
      )
    } else if (searchType === "reference") {
      // Simulate reference number to consumer ID mapping
      consumerBills = billsData.filter(bill => {
        const refPattern = `REF${bill.consumerId.slice(-8)}`.toUpperCase()
        return refPattern === searchValue.toUpperCase()
      })
    }
    
    if (consumerBills.length === 0) {
      throw new Error(`No bill history found for this ${searchType === "consumer" ? "consumer ID" : "reference number"}`)
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
    
    // Support exactly 10, 11, or 12 digits
    if (!/^(\d{10}|\d{11}|\d{12})$/.test(cleaned)) {
      return { 
        valid: false, 
        message: "Consumer ID must be exactly 10, 11, or 12 digits" 
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