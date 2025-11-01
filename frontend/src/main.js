import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router.js'
import VueApexCharts from 'vue3-apexcharts'

const setupThemeToggle = () => {
  const darkIcon = document.getElementById('theme-toggle-dark-icon')
  const lightIcon = document.getElementById('theme-toggle-light-icon')
  const toggleBtn = document.getElementById('theme-toggle')

  if (!toggleBtn || !darkIcon || !lightIcon) {
    return
  }

  if (toggleBtn.dataset.listenerAttached === 'true') {
    return
  }

  toggleBtn.dataset.listenerAttached = 'true'

  const storedTheme = localStorage.getItem('color-theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = storedTheme === 'dark' || (!storedTheme && prefersDark)

  if (isDark) {
    lightIcon.classList.remove('hidden')
  } else {
    darkIcon.classList.remove('hidden')
  }

  toggleBtn.addEventListener('click', () => {
    darkIcon.classList.toggle('hidden')
    lightIcon.classList.toggle('hidden')

    const currentTheme = localStorage.getItem('color-theme')

    if (currentTheme) {
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light'
      document.documentElement.classList.toggle('dark', nextTheme === 'dark')
      localStorage.setItem('color-theme', nextTheme)
    } else {
      const isCurrentlyDark = document.documentElement.classList.contains('dark')
      document.documentElement.classList.toggle('dark', !isCurrentlyDark)
      localStorage.setItem('color-theme', isCurrentlyDark ? 'light' : 'dark')
    }
  })
}

const app = createApp(App)

setupThemeToggle()

// Router meta tags update
router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = to.meta.title
  }

  if (to.meta?.description) {
    let descriptionTag = document.querySelector('meta[name="description"]')
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta')
      descriptionTag.setAttribute('name', 'description')
      document.head.appendChild(descriptionTag)
    }
    descriptionTag.setAttribute('content', to.meta.description)
  }
})

app.use(router)
app.use(VueApexCharts)
app.mount('#app')
