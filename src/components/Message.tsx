import { Message as MessageType } from '@/types/chat'

interface MessageProps {
  message: MessageType
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === 'user'
  
  const renderResults = (data: any) => {
    if (!data) return null

    // Email results
    if (data.intent === 'emails_by_region' && data.results) {
      return (
        <div className="mt-3 space-y-2">
          {data.results.map((result: any, index: number) => (
            <div key={index} className="bg-white border rounded p-2 text-xs">
              <div className="font-semibold">{result.BusNm}</div>
              <div className="text-blue-600">{result.email}</div>
              <div className="text-gray-500">{result.website}</div>
            </div>
          ))}
        </div>
      )
    }

    // Firm lookup results
    if (data.intent === 'firm_lookup' && data.rows) {
      return (
        <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
          {data.rows.slice(0, 5).map((firm: any, index: number) => (
            <div key={index} className="bg-white border rounded p-2 text-xs">
              <div className="font-semibold">{firm.BusNm}</div>
              <div className="text-gray-600">CRD: {firm.FirmCrdNb}</div>
              <div className="text-gray-500">{firm.City}, {firm.State}</div>
              {firm.WebAddr && <div className="text-blue-600 text-xs">{firm.WebAddr}</div>}
              {firm.total_clients > 0 && <div className="text-green-600">Clients: {firm.total_clients}</div>}
              {firm.total_reg_aum && <div className="text-green-600">AUM: ${(firm.total_reg_aum / 1000000).toFixed(1)}M</div>}
            </div>
          ))}
          {data.rows.length > 5 && (
            <div className="text-xs text-gray-500">... and {data.rows.length - 5} more firms</div>
          )}
        </div>
      )
    }

    // AUM results
    if (data.intent === 'aum_filter' && data.rows) {
      return (
        <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
          {data.rows.slice(0, 5).map((firm: any, index: number) => (
            <div key={index} className="bg-white border rounded p-2 text-xs">
              <div className="font-semibold">{firm.BusNm}</div>
              <div className="text-gray-600">{firm.City}, {firm.State}</div>
              <div className="text-green-600">AUM: ${(firm.aum / 1000000).toFixed(1)}M</div>
              {firm.WebAddr && <div className="text-blue-600 text-xs">{firm.WebAddr}</div>}
            </div>
          ))}
          {data.rows.length > 5 && (
            <div className="text-xs text-gray-500">... and {data.rows.length - 5} more firms</div>
          )}
        </div>
      )
    }

    // Count results
    if ((data.kind === 'count_firms_by_clients' || data.kind === 'count_firms_by_total_clients') && data.count !== undefined) {
      return (
        <div className="mt-3 bg-white border rounded p-3">
          <div className="text-lg font-bold text-green-600">{data.count.toLocaleString()}</div>
          <div className="text-sm text-gray-600">firms match your criteria</div>
        </div>
      )
    }

    // Vector search results
    if (data.results && Array.isArray(data.results)) {
      return (
        <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
          {data.results.slice(0, 3).map((result: any, index: number) => (
            <div key={index} className="bg-white border rounded p-2 text-xs">
              <div className="font-semibold">{result.business_name || result.BusNm}</div>
              <div className="text-gray-600">{result.city}, {result.state}</div>
              <div className="text-gray-500 line-clamp-2">{result.content_text?.substring(0, 150)}...</div>
            </div>
          ))}
        </div>
      )
    }

    return null
  }
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
        isUser 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        <div className="text-sm">{message.content}</div>
        {message.data && renderResults(message.data)}
      </div>
    </div>
  )
}
