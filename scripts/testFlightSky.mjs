import dotenv from 'dotenv';
import { analyzePricesWithFlightSky } from '../services/flightsSkyService.js';

dotenv.config();
dotenv.config({ path: '.env.local' });

const params = {
  from: process.argv[2] || 'CDG',
  to: process.argv[3] || 'JFK',
  startDate: process.argv[4] || '2025-12-01',
  endDate: process.argv[5] || '2025-12-10'
};

console.log('Running FlightSky analysis with params:', params);

try {
  const result = await analyzePricesWithFlightSky(params);
  console.log('Summary:', result.summary);
  console.log('Cheapest date:', result.cheapestDate);
  console.log('Points:', result.prices.length);
} catch (error) {
  console.error('Error:', error.message);
  if (error.stack) {
    console.error(error.stack);
  }
  process.exitCode = 1;
}
