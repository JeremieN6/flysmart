<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <LP_Header />

    <div class="py-8 px-4 mx-auto max-w-screen-lg sm:py-16 lg:px-6">
      <div class="text-center mb-10">
        <h1 class="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl dark:text-white">
          Calendrier Google Flights
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Explorez les tarifs aller-retour fournis par l'API Google Flights via RapidAPI sans impacter l'analyse existante.
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="departureId">
              Identifiant de départ (departureId)
            </label>
            <input
              id="departureId"
              v-model="form.departureId"
              type="text"
              class="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Ex: JFK"
              required>
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="arrivalId">
              Identifiant d'arrivée (arrivalId)
            </label>
            <input
              id="arrivalId"
              v-model="form.arrivalId"
              type="text"
              class="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              placeholder="Ex: LOS"
              required>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="departureDate">
              Date de départ
            </label>
            <input
              id="departureDate"
              v-model="form.departureDate"
              type="date"
              class="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required>
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="arrivalDate">
              Date d'arrivée
            </label>
            <input
              id="arrivalDate"
              v-model="form.arrivalDate"
              type="date"
              class="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required>
          </div>
        </div>

        <details class="bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700 p-4">
          <summary class="cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-300">
            Paramètres optionnels
          </summary>
          <div class="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label class="block mb-2 text-xs font-medium text-gray-900 dark:text-white" for="startDate">
                startDate (facultatif)
              </label>
              <input
                id="startDate"
                v-model="form.startDate"
                type="date"
                class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
            </div>

            <div>
              <label class="block mb-2 text-xs font-medium text-gray-900 dark:text-white" for="endDate">
                endDate (facultatif)
              </label>
              <input
                id="endDate"
                v-model="form.endDate"
                type="date"
                class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
            </div>

            <div>
              <label class="block mb-2 text-xs font-medium text-gray-900 dark:text-white" for="daysBetween">
                daysBetween (facultatif)
              </label>
              <input
                id="daysBetween"
                v-model="form.daysBetween"
                type="number"
                min="1"
                class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Ex: 3">
            </div>

            <div>
              <label class="block mb-2 text-xs font-medium text-gray-900 dark:text-white" for="language">
                language
              </label>
              <input
                id="language"
                v-model="form.language"
                type="text"
                class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
            </div>

            <div>
              <label class="block mb-2 text-xs font-medium text-gray-900 dark:text-white" for="location">
                location
              </label>
              <input
                id="location"
                v-model="form.location"
                type="text"
                class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
            </div>

            <div>
              <label class="block mb-2 text-xs font-medium text-gray-900 dark:text-white" for="currency">
                currency
              </label>
              <input
                id="currency"
                v-model="form.currency"
                type="text"
                class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
            </div>

            <div>
              <label class="block mb-2 text-xs font-medium text-gray-900 dark:text-white" for="adults">
                Adults
              </label>
              <input
                id="adults"
                v-model="form.adults"
                type="number"
                min="1"
                class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
            </div>

            <div>
              <label class="block mb-2 text-xs font-medium text-gray-900 dark:text-white" for="children">
                Children (2-11)
              </label>
              <input
                id="children"
                v-model="form.children"
                type="number"
                min="0"
                class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
            </div>

            <div>
              <label class="block mb-2 text-xs font-medium text-gray-900 dark:text-white" for="infantsInSeat">
                Infants in seat
              </label>
              <input
                id="infantsInSeat"
                v-model="form.infantsInSeat"
                type="number"
                min="0"
                class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
            </div>

            <div>
              <label class="block mb-2 text-xs font-medium text-gray-900 dark:text-white" for="infantsOnLap">
                Infants on lap
              </label>
              <input
                id="infantsOnLap"
                v-model="form.infantsOnLap"
                type="number"
                min="0"
                class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
            </div>

            <div>
              <label class="block mb-2 text-xs font-medium text-gray-900 dark:text-white" for="cabinClass">
                cabinClass
              </label>
              <select
                id="cabinClass"
                v-model="form.cabinClass"
                class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                <option value="1">Economy</option>
                <option value="2">Premium economy</option>
                <option value="3">Business</option>
                <option value="4">First</option>
              </select>
            </div>
          </div>
        </details>

        <div class="flex items-center gap-4">
          <button
            type="submit"
            :disabled="loading"
            class="inline-flex items-center justify-center rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <span v-if="loading" class="flex items-center">
              <svg class="mr-2 h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Chargement…
            </span>
            <span v-else>
              Lancer la recherche
            </span>
          </button>

          <button
            type="button"
            class="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            @click="resetForm"
            :disabled="loading">
            Réinitialiser
          </button>
        </div>

        <div v-if="error" class="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-600 dark:bg-red-900/30 dark:text-red-300">
          {{ error }}
        </div>
      </form>

      <div v-if="responseData" class="mt-10 space-y-6">
        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            Résumé
          </h2>
          <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm text-gray-700 dark:text-gray-300">
            <div>
              <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Résultats</p>
              <p class="mt-1 font-semibold">{{ responseData.meta.count }}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Prix minimum</p>
              <p class="mt-1 font-semibold">{{ formatPrice(responseData.meta.minPrice) }}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Prix moyen</p>
              <p class="mt-1 font-semibold">{{ formatPrice(responseData.meta.avgPrice) }}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Prix maximum</p>
              <p class="mt-1 font-semibold">{{ formatPrice(responseData.meta.maxPrice) }}</p>
            </div>
          </div>
          <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Fenêtre demandée :
            <span v-if="responseData.meta.requestedDepartureDate">départ {{ responseData.meta.requestedDepartureDate }}</span>
            <span v-if="responseData.meta.requestedArrivalDate"> — retour {{ responseData.meta.requestedArrivalDate }}</span>
          </p>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white text-sm dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
            <thead class="bg-gray-100 text-xs uppercase tracking-wide text-gray-600 dark:bg-gray-900 dark:text-gray-300">
              <tr>
                <th scope="col" class="px-4 py-3 text-left">Départ</th>
                <th scope="col" class="px-4 py-3 text-left">Retour</th>
                <th scope="col" class="px-4 py-3 text-right">Prix</th>
                <th scope="col" class="px-4 py-3 text-right">Durée (jours)</th>
                <th scope="col" class="px-4 py-3 text-right">Décalage départ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 text-gray-700 dark:divide-gray-700 dark:text-gray-200">
              <tr v-for="entry in responseData.results" :key="entry.departureDate + entry.arrivalDate">
                <td class="px-4 py-3">{{ entry.departureDate }}</td>
                <td class="px-4 py-3">{{ entry.arrivalDate }}</td>
                <td class="px-4 py-3 text-right font-semibold">{{ formatPrice(entry.price) }}</td>
                <td class="px-4 py-3 text-right">{{ entry.tripLengthDays }}</td>
                <td class="px-4 py-3 text-right">{{ formatOffset(entry.departureOffset) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <LP_Footer />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import LP_Header from '../components/Landing/LP_Header.vue'
import LP_Footer from '../components/Landing/LP_Footer.vue'
import { fetchGooglePriceCalendar } from '../services/googlePriceCalendarService.js'

const defaultFormState = () => ({
  departureId: '',
  arrivalId: '',
  departureDate: '',
  arrivalDate: '',
  startDate: '',
  endDate: '',
  daysBetween: '',
  language: 'en-US',
  location: 'US',
  currency: 'USD',
  adults: '1',
  children: '0',
  infantsInSeat: '0',
  infantsOnLap: '0',
  cabinClass: '1'
})

const form = reactive(defaultFormState())
const loading = ref(false)
const error = ref('')
const responseData = ref(null)

function resetForm() {
  Object.assign(form, defaultFormState())
  error.value = ''
  responseData.value = null
}

function buildParams() {
  const params = {}

  Object.entries(form).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return
    }

    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed !== '') {
        params[key] = trimmed
      }
    } else {
      params[key] = value
    }
  })

  return params
}

function validateForm() {
  if (!form.departureId.trim() || !form.arrivalId.trim()) {
    throw new Error('Les identifiants d\'aéroports sont requis')
  }

  const datePattern = /^\d{4}-\d{2}-\d{2}$/

  if (!datePattern.test(form.departureDate) || !datePattern.test(form.arrivalDate)) {
    throw new Error('Les dates doivent être au format YYYY-MM-DD')
  }

  const departure = new Date(`${form.departureDate}T00:00:00Z`)
  const arrival = new Date(`${form.arrivalDate}T00:00:00Z`)

  if (Number.isNaN(departure.getTime()) || Number.isNaN(arrival.getTime()) || arrival <= departure) {
    throw new Error('La date de retour doit être postérieure à la date de départ')
  }
}

async function handleSubmit() {
  error.value = ''
  responseData.value = null

  try {
    validateForm()
  } catch (validationError) {
    error.value = validationError.message
    return
  }

  loading.value = true

  try {
    const params = buildParams()
    const data = await fetchGooglePriceCalendar(params)

    if (!data.success) {
      throw new Error(data.error || 'La réponse du service Google Flights est invalide')
    }

    responseData.value = {
      results: data.results,
      meta: {
        count: data.meta?.count ?? data.results?.length ?? 0,
        currency: data.meta?.currency || params.currency,
        requestedDepartureDate: data.meta?.requestedDepartureDate || params.departureDate,
        requestedArrivalDate: data.meta?.requestedArrivalDate || params.arrivalDate,
        minPrice: data.meta?.minPrice,
        maxPrice: data.meta?.maxPrice,
        avgPrice: data.meta?.avgPrice
      }
    }
  } catch (err) {
    error.value = err.message || 'Une erreur est survenue lors de la récupération du calendrier de prix'
  } finally {
    loading.value = false
  }
}

function formatPrice(value) {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return '—'
  }

  const currency = responseData.value?.meta?.currency || form.currency || 'USD'

  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency
    }).format(Number(value))
  } catch (error) {
    return `${Number(value).toFixed(0)} ${currency}`
  }
}

function formatOffset(offset) {
  if (offset === null || offset === undefined || Number.isNaN(offset)) {
    return '—'
  }
  if (offset === 0) {
    return 'J0'
  }
  return offset > 0 ? `+${offset}` : `${offset}`
}
</script>
