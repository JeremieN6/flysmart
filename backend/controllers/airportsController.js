import { searchAirports } from '../services/airportSearchService.js'

/**
 * Recherche d'aéroports par ville, nom ou code IATA
 * Utilise la base de données locale pour une recherche rapide et sans limite d'API
 */
export async function findAirports(req, res, next) {
  try {
    const { query } = req.query

    if (!query || query.trim().length < 2) {
      return res.json({ results: [] })
    }

    // Recherche locale (pas d'appel API externe)
    const results = searchAirports(query, 10)
    res.json({ results })
  } catch (error) {
    console.error('Erreur lors de la recherche d\'aéroports:', error)
    next(error)
  }
}
