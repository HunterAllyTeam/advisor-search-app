# Intelligent Financial Advisor Search

A powerful search interface for financial advisors with natural language query capabilities.

## Features

- **Email Queries**: Find firm emails by state/city
- **AUM Filtering**: Search firms by Assets Under Management with various operators
- **Client Count Analysis**: Filter firms by client types and counts
- **Firm Lookup**: Fuzzy search for specific firms
- **Vector Search**: Semantic search through website content
- **Natural Language Processing**: Ask questions in plain English

## Examples

### Email Queries
- "emails of firms in California"
- "firm emails in Miami FL"
- "emails of firms in Texas"

### AUM Queries
- "firms in montana with aum under 20 million"
- "firms with discretionary AUM over 100 million"
- "firms with HNW AUM over 50 billion"

### Client Count Queries
- "firms with more than 100 individual clients"
- "firms with HNW clients equal to 0"
- "firms in NY with pension clients over 50"

### Firm Lookup
- "montebello"
- "find firm goldman"
- "morgan stanley"

### Vector Search
- "401k rollover"
- "estate planning"
- "retirement planning"

## Technology

- **Frontend**: Pure HTML/CSS/JavaScript
- **Backend**: Supabase Edge Functions
- **Database**: PostgreSQL with vector search
- **Deployment**: Vercel (Static Site)

## Development

This is a static HTML application that can be served from any web server. Simply open `index.html` in a browser to run locally.

## Deployment

The application is automatically deployed to Vercel on every push to the main branch.

## API

The search interface connects to a Supabase Edge Function that provides natural language query processing and database access.
