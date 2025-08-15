import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nivkaxkqoylakkiodrgd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdmtheGtxb3lsYWtraW9kcmdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MzY1OTYsImV4cCI6MjA3MDExMjU5Nn0.OxLjEbasuHaz4ts0n5xATLZMPVI-3hjVVrYcx2mmgPs'

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function searchQuery(query: string) {
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        match_count: 10,
        match_threshold: 0.2
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Search error:', error)
    throw error
  }
}
