import SearchDemo from '@/components/SearchDemo'

export default function Home() {
  return (
    <main style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <SearchDemo />
    </main>
  )
}
