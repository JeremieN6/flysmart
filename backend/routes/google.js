import express from 'express'
import { getGoogleRoundtripCalendar } from '../controllers/googlePriceCalendarController.js'

const router = express.Router()

router.get('/price-calendar', getGoogleRoundtripCalendar)

export default router
