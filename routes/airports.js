import { Router } from 'express'
import { findAirports } from '../controllers/airportsController.js'

const router = Router()

router.get('/search', findAirports)

export default router
