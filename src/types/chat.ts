export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  data?: any // Search results data
}

export interface SearchResult {
  intent?: string
  kind?: string
  count?: number
  rows?: any[]
  results?: any[]
  filters?: any
  error?: string
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
}
