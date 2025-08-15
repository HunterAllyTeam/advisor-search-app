'use client'

import { useState } from 'react'

const SUPABASE_URL = 'https://nivkaxkqoylakkiodrgd.supabase.co/functions/v1/search'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdmtheGtxb3lsYWtraW9kcmdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MzY1OTYsImV4cCI6MjA3MDExMjU5Nn0.OxLjEbasuHaz4ts0n5xATLZMPVI-3hjVVrYcx2mmgPs'

interface SearchResult {
  intent?: string
  kind?: string
  count?: number
  rows?: unknown[]
  results?: unknown[]
  filters?: Record<string, unknown>
  error?: string
  state?: string
  city?: string
  term?: string
}

export default function SearchDemo() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)

  const setQueryValue = (value: string) => {
    setQuery(value)
  }

  const showError = (message: string) => {
    setError(message)
    setSuccess('')
  }

  // const showSuccess = (message: string) => {
  //   setSuccess(message)
  //   setError('')
  // }

  const hideMessages = () => {
    setError('')
    setSuccess('')
  }

  const showLoading = () => {
    setIsLoading(true)
    setResults(null)
    hideMessages()
  }

  const hideLoading = () => {
    setIsLoading(false)
  }

  const displayResults = (data: SearchResult) => {
    if (data.intent === 'emails_by_region') {
      return displayEmailResults(data)
    } else if (data.intent === 'aum_filter') {
      return displayAumResults(data)
    } else if (data.intent === 'firm_lookup') {
      return displayFirmLookupResults(data)
    } else if (data.kind === 'count_firms_by_total_clients' || data.kind === 'count_firms_by_clients') {
      return displayCountResults(data)
    } else if (data.results && Array.isArray(data.results)) {
      return displayVectorResults(data.results)
    } else {
      return displayGenericResults(data)
    }
  }

  const displayEmailResults = (data: SearchResult) => {
    return (
      <div>
        <div className="results-header">
          Email Results
          <span className="intent-badge">{data.intent}</span>
        </div>
        <div className="stats">
          <div className="stat-item">
            <div className="stat-value">{data.count}</div>
            <div className="stat-label">Emails Found</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{data.state || 'N/A'}</div>
            <div className="stat-label">State</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{data.city || 'All Cities'}</div>
            <div className="stat-label">City</div>
          </div>
        </div>
                 {data.results?.map((result: unknown, index: number) => {
           const r = result as Record<string, unknown>
           return (
                     <div key={index} className="result-card email-result">
             <div className="firm-info">
               <div className="firm-details">
                 <div className="firm-name">{r.firm_name as string}</div>
                 <div className="firm-location">{r.city as string}, {r.state as string}</div>
               </div>
               <div className="email-info">
                 <a href={`mailto:${r.email as string}`} className="email-address">{r.email as string}</a>
                 <div className="source-url">Source: {r.source_url as string}</div>
               </div>
             </div>
             <div className="result-crd">CRD: {r.firm_crd_number as string}</div>
           </div>
         )
       })}
      </div>
    )
  }

  const displayCountResults = (data: SearchResult) => {
    return (
      <div>
        <div className="results-header">
          Count Results
          <span className="intent-badge">{data.kind}</span>
        </div>
        <div className="result-card count-result">
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{data.count?.toLocaleString()}</div>
          <div style={{ color: '#6b7280' }}>
            Firms with {data.filters?.op} {data.filters?.n} {data.filters?.client_column ? 'clients' : 'total clients'}
            {data.filters?.city ? ` in ${data.filters.city}` : ''}
            {data.filters?.state ? ` in ${data.filters.state}` : ''}
          </div>
        </div>
      </div>
    )
  }

  const displayAumResults = (data: SearchResult) => {
    const formatAum = (value: number) => {
      if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`
      if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
      if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`
      return `$${value.toLocaleString()}`
    }

    const getColumnName = (column: string) => {
      const columnMap: Record<string, string> = {
        'Q5F2C': 'Total Regulatory AUM',
        'Q5F2A': 'Discretionary AUM',
        'Q5F2B': 'Non-Discretionary AUM',
        'Q5F3': 'Non-Regulatory AUM',
        'Q5DB3': 'HNW AUM',
        'Q5DA3': 'Individual AUM',
        'Q5DG3': 'Pension AUM'
      }
      return columnMap[column] || column
    }

    return (
      <div>
        <div className="results-header">
          AUM Filter Results
          <span className="intent-badge">{data.intent}</span>
        </div>
        
        <div className="filters-info">
          <strong>Filters Applied:</strong><br />
          • Column: {getColumnName(data.filters?.column)}<br />
          • Operator: {data.filters?.op}<br />
          • Value: {formatAum(data.filters?.value)}<br />
          {data.filters?.state ? `• State: ${data.filters.state}<br />` : ''}
          {data.filters?.city ? `• City: ${data.filters.city}<br />` : ''}
          • Results: {data.count} firms found
        </div>

        {data.rows?.map((result: unknown, index: number) => {
          const r = result as Record<string, unknown>
          return (
            <div key={index} className="result-card aum-result">
              <div className="result-header">
                <div className="firm-name">{r.BusNm as string}</div>
                <div className="result-crd">CRD: {r.FirmCrdNb as string}</div>
              </div>
              <div className="firm-location">{r.City as string || 'N/A'}, {r.State as string || 'N/A'}</div>
              <div className="aum-value">AUM: {formatAum(r.aum as number)}</div>
              {r.WebAddr && <div className="website"><a href={r.WebAddr as string} target="_blank" rel="noopener noreferrer">{r.WebAddr as string}</a></div>}
            </div>
          )
        })}
      </div>
    )
  }

  const displayFirmLookupResults = (data: SearchResult) => {
    const formatAum = (value: number) => {
      if (!value) return 'N/A'
      if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`
      if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
      if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`
      return `$${value.toLocaleString()}`
    }

    const formatClients = (value: number) => {
      if (!value) return 'N/A'
      return value.toLocaleString()
    }

    return (
      <div>
        <div className="results-header">
          Firm Lookup Results
          <span className="intent-badge">{data.intent}</span>
        </div>
        
        <div className="filters-info">
          <strong>Search Term:</strong> &quot;{data.term}&quot;<br />
          <strong>Results:</strong> {data.count} firms found
        </div>

        {data.rows?.map((result: unknown, index: number) => {
          const r = result as Record<string, unknown>
          return (
            <div key={index} className="result-card firm-lookup-result">
              <div className="result-header">
                <div className="firm-name">{r.BusNm as string}</div>
                <div className="result-crd">CRD: {r.FirmCrdNb as string}</div>
              </div>
              <div className="firm-details">
                <div className="firm-location">{r.City as string || 'N/A'}, {r.State as string || 'N/A'}</div>
                <div className="firm-legal">{r.LegalNm as string}</div>
                <div className="firm-org">{r.OrgFormNm as string}</div>
              </div>
              <div className="firm-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Clients:</span>
                  <span className="stat-value">{formatClients(r.total_clients as number)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total AUM:</span>
                  <span className="stat-value">{formatAum(r.total_reg_aum as number)}</span>
                </div>
              </div>
              <div className="firm-contact">
                {r.PhNb && <div className="phone">📞 {r.PhNb as string}</div>}
                {r.WebAddr && <div className="website">🌐 <a href={r.WebAddr as string} target="_blank" rel="noopener noreferrer">{r.WebAddr as string}</a></div>}
                {r.emails && Array.isArray(r.emails) ? 
                  <div className="emails">📧 {(r.emails as string[]).map((email: string, i: number) => <a key={i} href={`mailto:${email}`}>{email}</a>).join(', ')}</div> : 
                  <div className="emails">📧 No emails found</div>
                }
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const displayVectorResults = (results: unknown[]) => {
    if (results.length === 0) {
      return <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>No results found. Try a different search term.</p>
    }

    return (
      <div>
        <div className="results-header">
          Found {results.length} results
          <span className="intent-badge">Vector Search</span>
        </div>
        {results.map((result: unknown, index: number) => {
          const r = result as Record<string, unknown>
          return (
                      <div key={index} className="result-card">
              <div className="result-header">
                <a href={r.url as string} target="_blank" rel="noopener noreferrer" className="result-url">{r.url as string}</a>
                <span className="result-crd">CRD: {r.firm_crd_number as string}</span>
              </div>
              <div className="result-content">{r.content_text as string}</div>
              <div className="result-similarity">Similarity: {((r.similarity as number) * 100).toFixed(1)}%</div>
            </div>
          )
        })}
      </div>
    )
  }

  const displayGenericResults = (data: SearchResult) => {
    return (
      <div>
        <div className="results-header">
          Search Results
          <span className="intent-badge">Generic</span>
        </div>
        <div className="result-card">
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem' }}>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) return

    showLoading()

    try {
      const response = await fetch(SUPABASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          match_count: 5,
          match_threshold: 0.2,
        }),
      })

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        showError(data.error)
      } else {
        setResults(data)
      }
      
    } catch (error) {
      console.error('Search error:', error)
      showError('Search failed. Please try again.')
    } finally {
      hideLoading()
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Intelligent Financial Advisor Search</h1>
        <p>Ask questions in natural language to find advisors, emails, and firm information</p>
        <div className="subtitle">Now with AUM filtering, email extraction, and client count analysis</div>
        
        <div className="example-category">
          <h3>Email Queries</h3>
          <div className="examples">
            <div className="example-tag" onClick={() => setQueryValue('emails of firms in California')}>emails of firms in California</div>
            <div className="example-tag" onClick={() => setQueryValue('firm emails in Miami FL')}>firm emails in Miami FL</div>
            <div className="example-tag" onClick={() => setQueryValue('emails of firms in Texas')}>emails of firms in Texas</div>
          </div>
        </div>

        <div className="example-category">
          <h3>Client Count Queries</h3>
          <div className="examples">
            <div className="example-tag" onClick={() => setQueryValue('firms with more than 100 individual clients')}>firms with more than 100 individual clients</div>
            <div className="example-tag" onClick={() => setQueryValue('firms with HNW clients equal to 0')}>firms with HNW clients equal to 0</div>
            <div className="example-tag" onClick={() => setQueryValue('firms in NY with pension clients over 50')}>firms in NY with pension clients over 50</div>
          </div>
        </div>

        <div className="example-category">
          <h3>AUM Queries</h3>
          <div className="examples">
            <div className="example-tag" onClick={() => setQueryValue('firms in montana with aum under 20 million')}>firms in montana with aum under 20 million</div>
            <div className="example-tag" onClick={() => setQueryValue('firms with discretionary AUM over 100 million')}>firms with discretionary AUM over 100 million</div>
            <div className="example-tag" onClick={() => setQueryValue('firms with HNW AUM over 50 billion')}>firms with HNW AUM over 50 billion</div>
          </div>
        </div>

        <div className="example-category">
          <h3>Firm Lookup</h3>
          <div className="examples">
            <div className="example-tag" onClick={() => setQueryValue('montebello')}>montebello</div>
            <div className="example-tag" onClick={() => setQueryValue('find firm goldman')}>find firm goldman</div>
            <div className="example-tag" onClick={() => setQueryValue('morgan stanley')}>morgan stanley</div>
          </div>
        </div>

        <div className="example-category">
          <h3>Vector Search</h3>
          <div className="examples">
            <div className="example-tag" onClick={() => setQueryValue('401k rollover')}>401k rollover</div>
            <div className="example-tag" onClick={() => setQueryValue('estate planning')}>estate planning</div>
            <div className="example-tag" onClick={() => setQueryValue('retirement planning')}>retirement planning</div>
          </div>
        </div>
      </div>
      
      <div className="search-section">
        <form className="search-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            className="search-input" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try: 'emails of firms in California', 'firms with AUM over 100 million', 'firms with HNW clients equal to 0'..."
            required
          />
          <button type="submit" className="search-button" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        {isLoading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Searching through advisor database...</p>
          </div>
        )}
        
        <div className="results">
          {results && displayResults(results)}
        </div>
      </div>
    </div>
  )
}
