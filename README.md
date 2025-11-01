# Flight Timing Advisor - Backend

Backend API for the Flight Timing Advisor application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file (copy from `.env.example`):
```bash
cp .env.example .env.local
```

3. Configure your Amadeus credentials and FlightAPI key in `.env.local`:
```env
AMADEUS_API_KEY=your_amadeus_api_key
AMADEUS_API_SECRET_KEY=your_amadeus_api_secret
FLIGHT_API_KEY=your_actual_api_key_here
```

## Development

Start the development server with auto-reload:
```bash
npm run dev
```

Start the production server:
```bash
npm start
```

The server runs on `http://localhost:5000` by default.

## API Endpoints

### Health Check
```
GET /health
Response: { "status": "ok" }
```

### Get Flight Prices
```
GET /api/flights/prices?from=CDG&to=JFK&date=2025-12-01&passengers=1&currency=EUR&cabin=Economy&children=0&infants=0

Parameters:
- from (required): Departure airport IATA code (3 letters)
- to (required): Arrival airport IATA code (3 letters)
- date (required): Departure date (YYYY-MM-DD format)
- passengers (optional): Number of adult passengers (default: 1)
- currency (optional): Price currency (default: EUR)
- cabin (optional): Cabin class - Economy/Business/First (default: Economy)
- children (optional): Number of children (default: 0)
- infants (optional): Number of infants (default: 0)

Response:
{
  "route": {
    "from": "CDG",
    "to": "JFK",
    "date": "2025-12-01",
    "currency": "EUR",
    "cabin": "Economy"
  },
  "prices": [
    { "daysBefore": 60, "price": 790 },
    { "daysBefore": 45, "price": 740 },
    { "daysBefore": 30, "price": 670 },
    { "daysBefore": 21, "price": 685 },
    { "daysBefore": 14, "price": 720 },
    { "daysBefore": 7, "price": 780 },
    { "daysBefore": 3, "price": 850 }
  ],
  "fallback": false
}
```

## Features

- **FlightAPI Integration**: Fetches real flight pricing data from FlightAPI
- **Smart Fallback**: Generates realistic mock data when API is unavailable
- **Caching**: 30-minute cache to reduce API calls and improve performance
- **Error Handling**: Graceful degradation with meaningful error messages
- **CORS**: Configured for frontend integration

## Configuration

All configuration is managed through environment variables:

- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment mode (development/production)
- `CLIENT_ORIGINS`: Allowed CORS origins (comma-separated)
- `FLIGHT_API_BASE_URL`: FlightAPI base URL
- `FLIGHT_API_KEY`: Your FlightAPI key
- `FLIGHT_API_CURRENCY`: Default currency (EUR, USD, etc.)
- `FLIGHT_API_CABIN_CLASS`: Default cabin class (Economy, Business, First)
- `FLIGHT_API_CHILDREN`: Default number of children
- `FLIGHT_API_INFANTS`: Default number of infants

## Security

- API keys are stored server-side only (never exposed to frontend)
- CORS configured with specific origins
- Input validation on all parameters
- No sensitive data in repository (.env.local is gitignored)
