import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Service de recherche locale d'aéroports
 * Charge le fichier airport-codes.json au démarrage et maintient une liste optimisée en mémoire
 */

let airportsData = []
let isLoaded = false

/**
 * Charge et filtre les données d'aéroports au démarrage
 * Ne garde que les aéroports avec un code IATA et les champs essentiels
 */
export function loadAirports() {
  if (isLoaded) return

  try {
    // Le dataset peut exister dans src-vue (historique) ou src (future migration)
    const datasetCandidates = [
      path.join(__dirname, '../src-vue/assets/data/airport-codes.json'),
      path.join(__dirname, '../src/assets/data/airport-codes.json')
    ]
    const jsonPath = datasetCandidates.find(filePath => fs.existsSync(filePath))

    if (!jsonPath) {
      throw new Error('Fichier airport-codes.json introuvable (src-vue/assets/data ou src/assets/data)')
    }

    console.log('📍 Chargement des données d\'aéroports...')
    let rawData = fs.readFileSync(jsonPath, 'utf-8')

    // Nettoyer les caractères parasites au début du fichier si nécessaire
    const jsonStart = rawData.indexOf('[')
    if (jsonStart > 0) {
      console.log('⚠️  Caractères parasites détectés, nettoyage...')
      rawData = rawData.substring(jsonStart)
    }

    const allAirports = JSON.parse(rawData)

    // Filtrer et transformer les données
    airportsData = allAirports
      .filter(airport =>
        airport.iata_code &&
        airport.iata_code.length === 3 &&
        airport.type !== 'closed' // Exclure les aéroports fermés
      )
      .map(airport => ({
        code: airport.iata_code.toUpperCase(),
        name: airport.name || airport.airport_name || '',
        city: airport.municipality || '',
        country: airport.iso_country || ''
      }))
      // Supprimer les doublons basés sur le code IATA
      .reduce((unique, airport) => {
        if (!unique.find(a => a.code === airport.code)) {
          unique.push(airport)
        }
        return unique
      }, [])

    // Ajouter une liste de hubs internationaux si absents du dataset principal
    const curatedCandidates = [
      path.join(__dirname, '../src-vue/assets/data/airports-min.json'),
      path.join(__dirname, '../src/assets/data/airports-min.json')
    ]
    const curatedPath = curatedCandidates.find(filePath => fs.existsSync(filePath))

    if (curatedPath && fs.existsSync(curatedPath)) {
      try {
        const curatedAirports = JSON.parse(fs.readFileSync(curatedPath, 'utf-8'))

        for (const airport of curatedAirports) {
          const exists = airportsData.find(item => item.code === airport.code)
          if (!exists) {
            airportsData.push({
              code: airport.code,
              name: airport.name || '',
              city: airport.city || '',
              country: airport.country || ''
            })
          }
        }
      } catch (error) {
        console.warn('⚠️  Impossible de charger la liste des hubs internationaux:', error.message)
      }
    }

    isLoaded = true
    console.log(`✅ ${airportsData.length} aéroports chargés avec succès`)
  } catch (error) {
    console.error('❌ Erreur lors du chargement des aéroports:', error.message)
    airportsData = []
  }
}

/**
 * Recherche des aéroports par requête
 * @param {string} query - Terme de recherche (ville, nom d'aéroport ou code IATA)
 * @param {number} limit - Nombre maximum de résultats (défaut: 10)
 * @returns {Array} Liste des aéroports correspondants
 */
export function searchAirports(query, limit = 10) {
  if (!isLoaded) {
    loadAirports()
  }

  if (!query || query.trim().length < 2) {
    return []
  }

  const searchTerm = query.trim().toLowerCase()
  const results = []

  // Recherche avec priorité :
  // 1. Code IATA exact (priorité maximale)
  // 2. Code IATA commence par
  // 3. Ville commence par
  // 4. Nom d'aéroport commence par
  // 5. Ville contient
  // 6. Nom d'aéroport contient

  for (const airport of airportsData) {
    const code = airport.code.toLowerCase()
    const city = airport.city.toLowerCase()
    const name = airport.name.toLowerCase()

    let priority = 0

    // Code IATA exact
    if (code === searchTerm) {
      priority = 1000
    }
    // Code IATA commence par
    else if (code.startsWith(searchTerm)) {
      priority = 900
    }
    // Ville commence par
    else if (city.startsWith(searchTerm)) {
      priority = 800
    }
    // Nom d'aéroport commence par
    else if (name.startsWith(searchTerm)) {
      priority = 700
    }
    // Ville contient
    else if (city.includes(searchTerm)) {
      priority = 600
    }
    // Nom d'aéroport contient
    else if (name.includes(searchTerm)) {
      priority = 500
    }

    if (priority > 0) {
      results.push({ ...airport, priority })
    }
  }

  // Trier par priorité décroissante
  return results
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit)
    .map(({ priority, ...airport }) => airport) // Retirer le champ priority
}

/**
 * Obtenir un aéroport par son code IATA
 * @param {string} code - Code IATA à 3 lettres
 * @returns {Object|null} L'aéroport trouvé ou null
 */
export function getAirportByCode(code) {
  if (!isLoaded) {
    loadAirports()
  }

  if (!code || code.length !== 3) {
    return null
  }

  return airportsData.find(airport =>
    airport.code.toUpperCase() === code.toUpperCase()
  ) || null
}

// Charger les données au démarrage du serveur
loadAirports()
