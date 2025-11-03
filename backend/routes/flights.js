import express from 'express';
import { getPrices } from '../controllers/flightsController.js';

const router = express.Router();

// GET /api/flights/prices?from=CDG&to=JFK&startDate=2025-12-01&endDate=2025-12-15&currency=EUR&cabin=Economy
router.get('/prices', getPrices);

export default router;
