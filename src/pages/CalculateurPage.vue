<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <LP_Header />

    <div class="py-8 px-4 mx-auto max-w-screen-lg sm:py-16 lg:px-6" id="calculateur">
      <div class="title">
        <h1
          class="mb-4 text-3xl font-extrabold text-center tracking-tight leading-none text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
          Analyseur de prix de vols ✈️
        </h1>
        <p
          class="mb-8 text-lg font-normal text-center text-gray-500 lg:text-xl sm:px-16 xl:px-28 dark:text-gray-400">
Découvrez le meilleur moment pour acheter votre billet d'avion.
        </p>
      </div>
    </div>

    <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-6">
      <!-- Search Form -->
      <div class="mb-8">
        <SearchForm
          ref="searchFormRef"
          @search="handleSearch"
          @error="handleError" />
      </div>

      <!-- Loading Indicator -->
      <div v-if="loading" class="mb-8">
        <div class="w-full h-2 bg-blue-100 rounded-full overflow-hidden dark:bg-blue-900/30">
          <div
            class="progress-bar"
            :style="{ width: Math.min(progress, 100) + '%' }">
          </div>
        </div>
        <p class="mt-2 text-sm text-center font-medium text-blue-600 dark:text-blue-300">
          Analyse des prix en cours, merci de patienter... ({{ Math.min(progress, 100) }}%)
        </p>
      </div>

      <!-- Results -->
      <div v-if="priceData" class="space-y-8">
        <!-- Price Chart -->
        <PriceChart :chartData="analysis" />

        <!-- Advice Message -->
        <AdviceMessage :analysis="analysis" />
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading" class="text-center py-16">
        <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          Aucune analyse disponible
        </h3>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          Recherchez un vol pour voir l'analyse des prix et nos recommandations
        </p>
      </div>
    </div>

    <LP_Footer />
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import axios from 'axios'
import LP_Header from '../components/Landing/LP_Header.vue'
import LP_Footer from '../components/Landing/LP_Footer.vue'
import SearchForm from '../components/Calculateur/SearchForm.vue'
import PriceChart from '../components/Calculateur/PriceChart.vue'
import AdviceMessage from '../components/Calculateur/AdviceMessage.vue'
import { usePricingAnalysis } from '../composables/usePricingAnalysis.js'

const searchFormRef = ref(null)
const priceData = ref(null)
const loading = ref(false)
const progress = ref(0)

const progressTimer = ref(null)

const clearProgressTimer = () => {
  if (progressTimer.value) {
    clearInterval(progressTimer.value)
    progressTimer.value = null
  }
}

const startProgressTimer = () => {
  clearProgressTimer()
  progress.value = 0
  const start = Date.now()
  progressTimer.value = setInterval(() => {
    const elapsed = Date.now() - start
    let target = progress.value

    if (elapsed <= 10000) {
      // 0 ➝ 60% in 10 seconds
      target = Math.floor((elapsed / 10000) * 60)
    } else if (elapsed <= 35000) {
      const stageElapsed = elapsed - 10000

      if (stageElapsed <= 15000) {
        // 60% ➝ 85% over the next 15 seconds
        target = 60 + Math.floor((stageElapsed / 15000) * 25)
      } else {
        // 85% ➝ 95%, 1 point per second (slow)
        const slowElapsed = stageElapsed - 15000
        target = 85 + Math.min(10, Math.floor(slowElapsed / 1000))
      }
    } else {
      target = 95
    }

    // Ensure the percentage never goes backward and stays within bounds
    progress.value = Math.min(95, Math.max(progress.value, target))

    if (progress.value >= 95) {
      clearProgressTimer()
    }
  }, 200)
}

// Use the pricing analysis composable
const { analysis } = usePricingAnalysis(priceData)

const handleSearch = async (formData) => {
  loading.value = true
  priceData.value = null
  startProgressTimer()

  try {
    // Build query params for period analysis
    const params = new URLSearchParams({
      from: formData.from,
      to: formData.to,
      startDate: formData.startDate,
      endDate: formData.endDate,
      currency: formData.currency || 'EUR'
    })

    console.log('🔍 Recherche en cours:', formData)

    // Call backend API
    const response = await axios.get(`/api/flights/prices?${params.toString()}`)

    console.log('✅ Résultats reçus:', response.data)

    // Update price data
    priceData.value = response.data

    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.querySelector('.space-y-8')
      if (resultsElement) {
        window.scrollTo({
          top: resultsElement.offsetTop - 100,
          behavior: 'smooth'
        })
      }
    }, 100)

  } catch (error) {
    console.error('❌ Erreur lors de la recherche:', error)

    const errorMessage = error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Une erreur est survenue lors de l\'analyse des prix'

    if (searchFormRef.value) {
      searchFormRef.value.setError(errorMessage)
    }
  } finally {
    progress.value = 100
    clearProgressTimer()
    loading.value = false
    if (searchFormRef.value) {
      searchFormRef.value.setLoading(false)
    }
  }
}

const handleError = (error) => {
  console.error('Form error:', error)
}

onBeforeUnmount(() => {
  clearProgressTimer()
})
</script>

<style scoped>
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, rgba(59,130,246,0.6) 0%, rgba(37,99,235,0.9) 100%);
  transition: width 0.2s ease-in-out;
}
</style>
