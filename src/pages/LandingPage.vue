<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <LP_Header />
    <LP_Hero />
    <LP_Features />
    <LP_FAQ />
    <LP_Testimonials />
    <Newsletter />
    <LP_Footer />
  </div>
</template>

<script setup>
import LP_Header from '../components/Landing/LP_Header.vue'
import LP_Hero from '../components/Landing/LP_Hero.vue'
import LP_Features from '../components/Landing/LP_Features.vue'
import LP_FAQ from '../components/Landing/LP_FAQ.vue'
import LP_Testimonials from '../components/Landing/LP_Testimonials.vue'
import Newsletter from '../components/Landing/Newsletter.vue'
import LP_Footer from '../components/Landing/LP_Footer.vue'
</script>
