<template>
  <header class="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <nav class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <RouterLink to="/" class="flex items-center">
          <span class="self-center text-xl font-semibold text-gray-700 whitespace-nowrap dark:text-white">
            FlySmart ✈️
          </span>
        </RouterLink>

        <div class="flex items-center lg:order-2">
          <RouterLink
            to="/calculateur"
            class="text-white bg-blue-700 hover:bg-blue-900 hover:text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700">
            Analyser les prix
          </RouterLink>

          <button
            @click="toggleMenu"
            type="button"
            class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            :aria-expanded="isMenuOpen">
            <span class="sr-only">Ouvrir le menu</span>
            <svg :class="{'hidden': isMenuOpen, 'block': !isMenuOpen}" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
            </svg>
            <svg :class="{'hidden': !isMenuOpen, 'block': isMenuOpen}" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>

        <div :class="{'hidden': !isMenuOpen}" class="justify-between items-center w-full lg:flex lg:w-auto lg:order-1">
          <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
            <li>
              <RouterLink to="/" class="block py-2 pr-4 pl-3 text-gray-700 rounded lg:p-0 dark:text-white" aria-current="page">
                Accueil
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/calculateur" class="block py-2 pr-4 pl-3 text-gray-700 hover:text-blue-700 lg:p-0 dark:text-gray-400">
                Calculateur
              </RouterLink>
            </li>
          </ul>
        </div>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>
