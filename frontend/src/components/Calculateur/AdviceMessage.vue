<template>
  <div v-if="analysis" class="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
    <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
      Analyse et recommandations
    </h3>

    <!-- Score -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Score d'opportunité</span>
        <span class="text-2xl font-bold" :class="scoreColorClass">{{ analysis.score }}/100</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
        <div
          class="h-3 rounded-full transition-all duration-500"
          :class="scoreBarColorClass"
          :style="{ width: analysis.score + '%' }">
        </div>
      </div>
    </div>

    <!-- Status Badge -->
    <div class="mb-4">
      <span
        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
        :class="statusBadgeClass">
        <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        {{ statusText }}
      </span>
    </div>

    <!-- Message and Recommendation -->
    <div class="mb-6 p-4 rounded-lg" :class="messageBgClass">
      <p class="text-sm font-semibold mb-2" :class="messageTextClass">
        {{ analysis.message }}
      </p>
      <p class="text-sm" :class="messageTextClass">
        {{ analysis.recommendation }}
      </p>
    </div>

    <!-- Statistics Grid -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Prix minimum</p>
        <p class="text-lg font-bold text-gray-900 dark:text-white">
          {{ analysis.cheapest }} {{ analysis.route.currency }}
        </p>
      </div>

      <div class="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Prix moyen</p>
        <p class="text-lg font-bold text-gray-900 dark:text-white">
          {{ analysis.average }} {{ analysis.route.currency }}
        </p>
      </div>

      <div class="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Meilleur moment</p>
        <p class="text-lg font-bold text-gray-900 dark:text-white">
          J-{{ analysis.bestPurchaseDate }}
        </p>
      </div>

      <div class="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Économies potentielles</p>
        <p class="text-lg font-bold text-green-600 dark:text-green-400">
          {{ analysis.savingsPotential }} {{ analysis.route.currency }}
          <span class="text-sm">({{ analysis.savingsPercentage }}%)</span>
        </p>
      </div>
    </div>

    <!-- Optimal Window -->
    <div class="p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
      <p class="text-sm font-medium text-blue-300 dark:text-blue-600 mb-1">
        Fenêtre d'achat optimale
      </p>
      <p class="text-lg font-bold text-blue-300 dark:text-blue-600">
        Entre J-{{ analysis.windowMax }} et J-{{ analysis.windowMin }}
      </p>
    </div>

    <!-- Route Info -->
    <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <p class="text-xs text-gray-500 dark:text-gray-400">
        Route: {{ analysis.route.from }} → {{ analysis.route.to }} |
        Date: {{ formatDate(analysis.route.date) }} |
        Classe: {{ analysis.route.cabin }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  analysis: {
    type: Object,
    default: null
  }
})

const statusText = computed(() => {
  const status = props.analysis?.status
  const texts = {
    early: 'Trop tôt',
    stable: 'Prix stables',
    optimal: 'Moment idéal',
    late: 'Dernière minute'
  }
  return texts[status] || 'Analyse'
})

const statusBadgeClass = computed(() => {
  const status = props.analysis?.status
  const classes = {
    early: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    stable: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    optimal: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    late: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return classes[status] || classes.stable
})

const messageBgClass = computed(() => {
  const status = props.analysis?.status
  const classes = {
    early: 'bg-blue-50 dark:bg-blue-900/20',
    stable: 'bg-gray-50 dark:bg-gray-700/20',
    optimal: 'bg-green-50 dark:bg-green-900/20',
    late: 'bg-red-50 dark:bg-red-900/20'
  }
  return classes[status] || classes.stable
})

const messageTextClass = computed(() => {
  const status = props.analysis?.status
  const classes = {
    early: 'text-blue-900 dark:text-blue-600',
    stable: 'text-gray-900 dark:text-gray-600',
    optimal: 'text-green-900 dark:text-green-600',
    late: 'text-red-900 dark:text-red-600'
  }
  return classes[status] || classes.stable
})

const scoreColorClass = computed(() => {
  const score = props.analysis?.score || 0
  if (score >= 80) return 'text-green-600 dark:text-green-400'
  if (score >= 60) return 'text-blue-600 dark:text-blue-400'
  if (score >= 40) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
})

const scoreBarColorClass = computed(() => {
  const score = props.analysis?.score || 0
  if (score >= 80) return 'bg-green-600'
  if (score >= 60) return 'bg-blue-600'
  if (score >= 40) return 'bg-yellow-600'
  return 'bg-red-600'
})

const formatDate = (dateString) => {
  if (!dateString) {
    return 'Date inconnue'
  }

  const parsed = new Date(dateString)

  if (Number.isNaN(parsed.getTime())) {
    return 'Date inconnue'
  }

  return parsed.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
