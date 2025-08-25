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
  // Real GEPCO API call
  async getRealBillByReference(referenceNumber) {
    if (!referenceNumber) {
      throw new Error("Reference number is required")
    }

    const cleanRef = String(referenceNumber).replace(/[\s\-_]/g, '')
    
    if (cleanRef.length < 10 || cleanRef.length > 16) {
      throw new Error("Invalid reference number format. Must be 10-16 characters.")
    }

    try {
      const response = await fetch(`https://bill.pitc.com.pk/gbill.aspx?refno=${cleanRef}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
        },
        body: '',
        mode: 'cors'
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const htmlContent = await response.text()
      
      // Parse the HTML response to extract bill data
      const billData = this.parseGEPCOResponse(htmlContent, referenceNumber)
      
      return billData
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error("Unable to connect to GEPCO servers. Please check your internet connection and try again.")
      }
      
      if (error.message.includes('CORS')) {
        throw new Error("API access blocked by browser security. Please try using a different browser or contact support.")
      }
      
      throw new Error(`Failed to fetch bill: ${error.message}`)
    }
  }

  // Parse GEPCO HTML response
  parseGEPCOResponse(htmlContent, referenceNumber) {
    try {
      // Create a temporary DOM parser
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlContent, 'text/html')
      
      // Check for error messages
      const errorElement = doc.querySelector('.error, .alert-danger, [class*="error"]')
      if (errorElement && errorElement.textContent.toLowerCase().includes('not found')) {
        throw new Error(`Bill not found for reference number: ${referenceNumber}. Please verify the reference number.`)
      }
      
      // Extract bill information from common HTML patterns
      const billData = {
        consumerId: this.extractTextByLabel(doc, ['Consumer ID', 'Consumer No', 'Account No']),
        consumerName: this.extractTextByLabel(doc, ['Consumer Name', 'Customer Name', 'Name']),
        billMonth: this.extractTextByLabel(doc, ['Bill Month', 'Billing Month', 'Month']),
        dueDate: this.extractTextByLabel(doc, ['Due Date', 'Last Date']),
        billAmount: this.extractAmountByLabel(doc, ['Current Charges', 'Bill Amount', 'Amount']),
        totalAmount: this.extractAmountByLabel(doc, ['Total Amount', 'Net Amount', 'Payable']),
        unitsConsumed: this.extractNumberByLabel(doc, ['Units', 'kWh', 'Consumption']),
        meterReading: this.extractNumberByLabel(doc, ['Meter Reading', 'Present Reading']),
        status: 'unpaid', // Default status
        referenceNumber: referenceNumber,
        provider: 'GEPCO',
        source: 'real_api'
      }
      
      // Validate that we got essential data
      if (!billData.consumerId && !billData.consumerName && !billData.billAmount) {
        throw new Error("Unable to parse bill information from response. The bill data format may have changed.")
      }
      
      return billData
    } catch (error) {
      throw new Error(`Failed to parse bill data: ${error.message}`)
    }
  }

  // Helper method to extract text by label
  extractTextByLabel(doc, labels) {
    for (const label of labels) {
      const element = doc.querySelector(`td:contains("${label}"), th:contains("${label}"), label:contains("${label}")`)
      if (element) {
        const nextCell = element.nextElementSibling || element.parentElement?.nextElementSibling
        if (nextCell) {
          return nextCell.textContent.trim()
        }
      }
    }
    return null
  }

  // Helper method to extract amount by label
  extractAmountByLabel(doc, labels) {
    for (const label of labels) {
      const text = this.extractTextByLabel(doc, [label])
      if (text) {
        const amount = parseFloat(text.replace(/[^\d.]/g, ''))
        if (!isNaN(amount)) return amount
      }
    }
    return 0
  }

  // Helper method to extract number by label
  extractNumberByLabel(doc, labels) {
    for (const label of labels) {
      const text = this.extractTextByLabel(doc, [label])
      if (text) {
        const number = parseInt(text.replace(/[^\d]/g, ''))
        if (!isNaN(number)) return number
      }
    }
    return 0
  }

async getBillByConsumerId(consumerId) {
    await delay(DELAY_MS)
    
    if (!consumerId) {
      throw new Error("Consumer ID is required")
    }
    
    // Clean and validate the consumer ID - ensure it's a string first
    const cleanId = String(consumerId).replace(/\D/g, '')
    
    // Validate length - must be exactly 10, 11, or 12 digits
    if (!cleanId || cleanId.length < 10 || cleanId.length > 12) {
      throw new Error(`Invalid Consumer ID format. Expected 10-12 digits, got ${cleanId.length} digits.`)
    }
    
    // Try exact match first
    let bill = billsData.find(bill => {
      const normalizedBill = String(bill.consumerId).replace(/\D/g, '')
      return normalizedBill === cleanId
    })
    
    // If no exact match found, try partial matching for flexibility
    if (!bill) {
      bill = billsData.find(bill => {
        const normalizedBill = String(bill.consumerId).replace(/\D/g, '')
        // Allow matching if either ID contains the other (for cases where stored ID might have extra digits)
        return normalizedBill.includes(cleanId) || cleanId.includes(normalizedBill)
      })
    }
    
    // If still no match, try fuzzy matching (allow small differences)
    if (!bill) {
      bill = billsData.find(bill => {
        const normalizedBill = String(bill.consumerId).replace(/\D/g, '')
        return levenshteinDistance(normalizedBill, cleanId) <= 2 &&
               Math.abs(normalizedBill.length - cleanId.length) <= 1
      })
    }
    
    if (!bill) {
      throw new Error("Bill not found for the provided consumer ID. Please verify your consumer ID and try again. Make sure it's exactly 10-12 digits without spaces.")
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
  
async getBillHistory(searchValue, months = 12, searchType = "consumer") {
    await delay(800) // Simulate API delay
    
    if (!searchValue) {
      throw new Error(`${searchType === "consumer" ? "Consumer ID" : "Reference Number"} is required`)
    }
    
    // Find bills based on search type
    let consumerBills = []
    
    if (searchType === "consumer") {
      // Normalize the search value for consumer ID
      const normalizedSearch = String(searchValue).replace(/[\s\-_]/g, '').replace(/\D/g, '')
      
      consumerBills = billsData.filter(bill => {
        const normalizedBill = String(bill.consumerId).replace(/[\s\-_]/g, '').replace(/\D/g, '')
        return normalizedBill === normalizedSearch
      })
    } else if (searchType === "reference") {
      // Simulate reference number to consumer ID mapping
      consumerBills = billsData.filter(bill => {
        const refPattern = `REF${String(bill.consumerId).slice(-8)}`.toUpperCase()
        return refPattern === String(searchValue).toUpperCase()
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
        message: "Consumer ID must be exactly 10-12 digits" 
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