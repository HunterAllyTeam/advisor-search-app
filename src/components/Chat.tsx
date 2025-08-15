'use client'

import { useState } from 'react'
import { Message as MessageType, SearchResult } from '@/types/chat'
import { searchQuery } from '@/lib/supabase'
import Message from './Message'

export default function Chat() {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const result: SearchResult = await searchQuery(input)
      
      const assistantMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: formatResponse(result),
        timestamp: new Date(),
        data: result
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const formatResponse = (result: SearchResult): string => {
    if (result.error) {
      return `Error: ${result.error}`
    }

    if (result.intent === 'emails_by_region') {
      return `Found ${result.count || 0} email addresses in ${result.state || 'the specified region'}.`
    }

    if (result.intent === 'aum_filter') {
      return `Found ${result.count || 0} firms matching your AUM criteria.`
    }

    if (result.intent === 'firm_lookup') {
      return `Found ${result.count || 0} firms matching "${result.term}".`
    }

    if (result.kind === 'count_firms_by_clients' || result.kind === 'count_firms_by_total_clients') {
      return `Found ${result.count || 0} firms matching your client criteria.`
    }

    if (result.results && Array.isArray(result.results)) {
      return `Found ${result.results.length} relevant results.`
    }

    return 'I found some results for your query.'
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <h2 className="text-xl font-semibold mb-2">Financial Advisor Search</h2>
            <p>Ask me about firms, AUM, clients, emails, or any financial advisor data.</p>
            <div className="mt-4 space-y-2">
              <p className="text-sm">Try: "firms in Texas with AUM over 100M"</p>
              <p className="text-sm">Try: "emails of firms in California"</p>
              <p className="text-sm">Try: "firms with over 1000 clients"</p>
            </div>
          </div>
        )}
        
        {messages.map(message => (
          <Message key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="text-sm text-gray-600">Searching...</div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about financial advisors..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  )
}
