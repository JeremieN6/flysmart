<template>
  <div class="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
    <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
      Évolution des prix
    </h3>

    <div v-if="chartData">
      <apexchart
        type="line"
        height="350"
        :options="chartOptions"
        :series="chartSeries">
      </apexchart>
    </div>

    <div v-else class="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
      <p>Aucune donnée à afficher</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  chartData: {
    type: Object,
    default: null
  }
})

const chartSeries = computed(() => {
  if (!props.chartData || !props.chartData.sortedPrices) {
    return []
  }

  return [{
    name: 'Prix',
    data: props.chartData.sortedPrices.map(p => ({
      x: `J-${p.daysBefore}`,
      y: p.price
    }))
  }]
})

const chartOptions = computed(() => {
  if (!props.chartData) {
    return {}
  }

  const minPrice = props.chartData.cheapest
  const bestDay = props.chartData.bestPurchaseDate

  return {
    chart: {
      type: 'line',
      toolbar: {
        show: true,
        tools: {
          download: true,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false
        }
      },
      fontFamily: 'system-ui, sans-serif'
    },
    colors: ['#3B82F6'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    markers: {
      size: 6,
      colors: ['#3B82F6'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 8
      }
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['transparent', 'transparent'],
        opacity: 0.5
      }
    },
    xaxis: {
      categories: props.chartData.sortedPrices.map(p => `J-${p.daysBefore}`),
      title: {
        text: 'Jours avant le départ',
        style: {
          fontSize: '14px',
          fontWeight: 600
        }
      },
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: `Prix (${props.chartData.route?.currency || 'EUR'})`,
        style: {
          fontSize: '14px',
          fontWeight: 600
        }
      },
      labels: {
        formatter: (value) => {
          return Math.round(value) + ' ' + (props.chartData.route?.currency || 'EUR')
        },
        style: {
          fontSize: '12px'
        }
      }
    },
    tooltip: {
      x: {
        formatter: (value, opts) => {
          const point = props.chartData.sortedPrices?.[opts.dataPointIndex]
          if (!point?.departureDate) {
            return value
          }

          const parsed = new Date(point.departureDate)
          if (Number.isNaN(parsed.getTime())) {
            return value
          }

          return `${value} • ${parsed.toLocaleDateString('fr-FR')}`
        }
      },
      y: {
        formatter: (value) => {
          const currency = props.chartData.route?.currency || 'EUR'
          return `${Math.round(value)} ${currency}`
        }
      }
    },
    annotations: {
      yaxis: [{
        y: minPrice,
        borderColor: '#10B981',
        label: {
          borderColor: '#10B981',
          style: {
            color: '#fff',
            background: '#10B981'
          },
          text: `Prix minimum: ${minPrice} ${props.chartData.route?.currency || 'EUR'}`
        }
      }],
      xaxis: [{
        x: `J-${bestDay}`,
        borderColor: '#10B981',
        label: {
          borderColor: '#10B981',
          style: {
            color: '#fff',
            background: '#10B981'
          },
          text: 'Meilleur moment'
        }
      }]
    },
    theme: {
      mode: 'light'
    }
  }
})
</script>
