// Levenshtein distance algorithm for fuzzy matching
export const levenshteinDistance = (str1, str2) => {
  const matrix = []
  const len1 = str1.length
  const len2 = str2.length

  if (len1 === 0) return len2
  if (len2 === 0) return len1

  // Initialize matrix
  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j
  }

  // Fill matrix
  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        )
      }
    }
  }

  return matrix[len2][len1]
}

// Normalize consumer ID by removing common separators
export const normalizeConsumerId = (consumerId) => {
  if (!consumerId) return ""
  return consumerId.toString().replace(/[\s\-_.]/g, '')
}

// Check if two consumer IDs are similar enough
export const areConsumerIdsSimilar = (id1, id2, threshold = 2) => {
  const normalized1 = normalizeConsumerId(id1)
  const normalized2 = normalizeConsumerId(id2)
  
  // Exact match after normalization
  if (normalized1 === normalized2) return true
  
  // Length difference too large
  if (Math.abs(normalized1.length - normalized2.length) > threshold) return false
  
  // Calculate edit distance
  const distance = levenshteinDistance(normalized1, normalized2)
  return distance <= threshold
}

export default {
  levenshteinDistance,
  normalizeConsumerId,
  areConsumerIdsSimilar
}