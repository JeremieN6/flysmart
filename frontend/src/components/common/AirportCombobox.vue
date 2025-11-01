<template>
  <div ref="rootEl" class="relative">
    <label
      v-if="label"
      :for="id"
      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      {{ label }}
    </label>

    <div class="relative">
      <input
        :id="id"
        ref="inputEl"
        v-model="displayValue"
        type="text"
        :placeholder="placeholder"
        :required="required"
        @focus="open"
        @input="handleInput"
        @blur="handleBlur"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        autocomplete="off"
        role="combobox"
        :aria-expanded="isOpen ? 'true' : 'false'"
        aria-autocomplete="list"
        :aria-activedescendant="activeId"
      />
      <span
        v-if="loading"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 animate-spin"
      >
        ⏳
      </span>
      <button
        v-else-if="displayValue"
        type="button"
        @mousedown.prevent="clear"
        class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        aria-label="Effacer la sélection"
      >
        ×
      </button>
    </div>

    <p v-if="helper" class="mt-1 text-xs text-gray-500 dark:text-gray-400">
      {{ helper }}
    </p>

    <ul
      v-if="isOpen && suggestions.length"
      class="absolute z-20 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="listbox"
    >
      <li
        v-for="(item, index) in suggestions"
        :id="`${id}-option-${index}`"
        :key="`${item.code}-${index}`"
        @mousedown.prevent="select(item)"
        @mouseenter="activeIndex = index"
        :class="[
          'cursor-pointer select-none py-2 px-3 flex items-center justify-between transition-colors',
          index === activeIndex ? 'bg-blue-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
        ]"
        role="option"
        :aria-selected="index === activeIndex ? 'true' : 'false'"
      >
        <div>
          <div class="text-sm font-medium text-gray-900 dark:text-white">
            {{ item.city || item.name }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            {{ item.name }}<span v-if="item.country"> • {{ item.country }}</span>
          </div>
        </div>
        <span class="ml-3 inline-flex items-center justify-center rounded bg-gray-100 dark:bg-gray-700 px-2 py-1 text-xs font-mono text-gray-700 dark:text-gray-200">
          {{ item.code }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { searchAirports } from '../../services/airportService.js'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: 'Ville, aéroport ou code (ex: Paris, CDG)' },
  helper: { type: String, default: '' },
  required: { type: Boolean, default: false },
  id: { type: String, default: () => `airport-${Math.random().toString(36).slice(2, 8)}` }
})

const emit = defineEmits(['update:modelValue'])

const rootEl = ref(null)
const inputEl = ref(null)
const displayValue = ref('')
const suggestions = ref([])
const loading = ref(false)
const isOpen = ref(false)
const activeIndex = ref(-1)
const lastQuery = ref('')
const selectedOption = ref(null)

const activeId = computed(() => {
  if (!isOpen.value || activeIndex.value < 0) return undefined
  return `${props.id}-option-${activeIndex.value}`
})

const open = () => {
  isOpen.value = true
}

const close = () => {
  isOpen.value = false
  activeIndex.value = -1
}

const clear = () => {
  displayValue.value = ''
  suggestions.value = []
  selectedOption.value = null
  close()
  emit('update:modelValue', '')
  nextTick(() => inputEl.value?.focus())
}

const formatOption = (option) => {
  if (!option) return ''
  const cityOrName = option.city || option.name || option.code
  return `${cityOrName} (${option.code})`
}

const syncDisplayFromValue = (value) => {
  if (selectedOption.value?.code === value && value) {
    displayValue.value = formatOption(selectedOption.value)
    return
  }
  displayValue.value = value || ''
  if (!value) {
    selectedOption.value = null
  }
}

watch(() => props.modelValue, (newValue) => {
  if (newValue !== displayValue.value) {
    syncDisplayFromValue(newValue)
  }
})

const fetchSuggestions = async (query) => {
  const trimmed = query.trim()

  if (trimmed.length < 2) {
    suggestions.value = []
    return
  }

  try {
    loading.value = true
    const results = await searchAirports(trimmed)
    suggestions.value = results
    activeIndex.value = results.length ? 0 : -1
  } catch (error) {
    console.error('Autocomplete error:', error)
    suggestions.value = []
  } finally {
    loading.value = false
  }
}

let debounceTimer

const handleInput = (event) => {
  const value = event.target.value
  displayValue.value = value
  selectedOption.value = null
  open()

  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (value !== lastQuery.value) {
      lastQuery.value = value
      fetchSuggestions(value)
    }
  }, 250)
}

const handleBlur = () => {
  setTimeout(() => {
    if (!rootEl.value?.contains(document.activeElement)) {
      close()
    }
  }, 150)

  const trimmed = displayValue.value.trim()
  if (/^[a-z]{3}$/i.test(trimmed)) {
    emit('update:modelValue', trimmed.toUpperCase())
  }
}

const select = (item) => {
  selectedOption.value = item
  displayValue.value = formatOption(item)
  emit('update:modelValue', item.code)
  close()
}

const scrollIntoView = () => {
  const optionId = activeId.value
  if (!optionId) return
  const optionEl = document.getElementById(optionId)
  optionEl?.scrollIntoView({ block: 'nearest' })
}

const onArrowDown = () => {
  if (!isOpen.value) {
    open()
    return
  }
  activeIndex.value = Math.min(activeIndex.value + 1, suggestions.value.length - 1)
  scrollIntoView()
}

const onArrowUp = () => {
  activeIndex.value = Math.max(activeIndex.value - 1, 0)
  scrollIntoView()
}

const onEnter = () => {
  if (isOpen.value && suggestions.value[activeIndex.value]) {
    select(suggestions.value[activeIndex.value])
  }
}

const handleKeydown = (event) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      onArrowDown()
      break
    case 'ArrowUp':
      event.preventDefault()
      onArrowUp()
      break
    case 'Enter':
      if (isOpen.value) {
        event.preventDefault()
        onEnter()
      }
      break
    case 'Escape':
      close()
      break
    default:
      break
  }
}

const handleClickOutside = (event) => {
  if (!rootEl.value?.contains(event.target)) {
    close()
  }
}

onMounted(() => {
  syncDisplayFromValue(props.modelValue)
  inputEl.value?.addEventListener('keydown', handleKeydown)
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  inputEl.value?.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', handleClickOutside)
  clearTimeout(debounceTimer)
})
</script>
