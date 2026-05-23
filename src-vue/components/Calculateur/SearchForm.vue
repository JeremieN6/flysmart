<template>
  <div class="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
    <h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
      Rechercher un vol
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid gap-4 md:grid-cols-2">
        <!-- From -->
        <AirportCombobox
          v-model="form.from"
          label="Départ"
          placeholder="Ville, aéroport ou code (ex: Paris, CDG)"
          :required="true"
        />

        <!-- To -->
        <AirportCombobox
          v-model="form.to"
          label="Arrivée"
          placeholder="Ville, aéroport ou code (ex: New York, JFK)"
          :required="true"
        />
      </div>

      <!-- Date Range -->
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label for="startDate" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Date de départ (début de période)
          </label>
          <input
            type="date"
            id="startDate"
            v-model="form.startDate"
            :min="minDate"
            :max="form.endDate"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            required>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Début de la période à analyser
          </p>
        </div>

        <div>
          <label for="endDate" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Date de départ (fin de période)
          </label>
          <input
            type="date"
            id="endDate"
            v-model="form.endDate"
            :min="form.startDate || minDate"
            :max="maxDate"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            required>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Fin de la période (max 30 jours)
          </p>
        </div>
      </div>

      <!-- Optional parameters -->
      <div class="grid gap-4 md:grid-cols-3">
        <div>
          <label for="passengers" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Passagers
          </label>
          <input
            type="number"
            id="passengers"
            v-model.number="form.passengers"
            min="1"
            max="9"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
        </div>

        <div>
          <label for="currency" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Devise
          </label>
          <select
            id="currency"
            v-model="form.currency"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>

        <div>
          <label for="cabin" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Classe
          </label>
          <select
            id="cabin"
            v-model="form.cabin"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option value="Economy">Economy</option>
            <option value="Business">Business</option>
            <option value="First">First</option>
          </select>
        </div>
      </div>

      <!-- Submit button -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Analyse en cours...
        </span>
        <span v-else>Analyser les prix</span>
      </button>

      <!-- Error message -->
      <div v-if="error" class="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
        <span class="font-medium">Erreur:</span> {{ error }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AirportCombobox from '../common/AirportCombobox.vue'

const emit = defineEmits(['search', 'error'])

const form = ref({
  from: '',
  to: '',
  startDate: '',
  endDate: '',
  passengers: 1,
  currency: 'EUR',
  cabin: 'Economy'
})

const loading = ref(false)
const error = ref('')

// Calculate minimum date (tomorrow)
const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

// Calculate maximum date (30 days from start date or 90 days from today)
const maxDate = computed(() => {
  if (form.value.startDate) {
    const start = new Date(form.value.startDate)
    start.setDate(start.getDate() + 30)
    return start.toISOString().split('T')[0]
  }
  const maxFuture = new Date()
  maxFuture.setDate(maxFuture.getDate() + 90)
  return maxFuture.toISOString().split('T')[0]
})

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    // Validate IATA codes
    if (!/^[A-Z]{3}$/i.test(form.value.from) || !/^[A-Z]{3}$/i.test(form.value.to)) {
      throw new Error('Les codes aéroport doivent contenir exactement 3 lettres')
    }

    // Validate dates
    if (form.value.startDate >= form.value.endDate) {
      throw new Error('La date de fin doit être après la date de début')
    }

    // Check period is not too long (max 30 days)
    const start = new Date(form.value.startDate)
    const end = new Date(form.value.endDate)
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))

    if (daysDiff > 30) {
      throw new Error('La période ne peut pas dépasser 30 jours')
    }

    emit('search', {
      ...form.value,
      from: form.value.from.toUpperCase(),
      to: form.value.to.toUpperCase()
    })
  } catch (err) {
    error.value = err.message
    emit('error', err)
  } finally {
    loading.value = false
  }
}

defineExpose({
  setLoading: (value) => {
    loading.value = value
  },
  setError: (value) => {
    error.value = value
  }
})
</script>
