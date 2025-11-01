import express from 'express';
import { getPrices } from '../controllers/flightsController.js';

const router = express.Router();

// GET /api/flights/prices?from=CDG&to=JFK&date=2025-12-01&passengers=1&currency=EUR&cabin=Economy&children=0&infants=0
router.get('/prices', getPrices);

export default router;
