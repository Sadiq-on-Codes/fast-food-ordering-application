<template>
  <div class="app-container">
    <Header />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<style scoped>
:root {
  --primary-color: #d35400; /* Orange color from the image */
  --secondary-color: #8e44ad; /* Purple color from the image */
  --dark-color: #2c3e50; /* Dark color from the image */
  --light-color: #ecf0f1; /* Light color from the image */
  --header-height: 80px;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 99vw;
  margin: 0 auto;
  justify-content: center;
}

.main-content {
  flex: 1;
  /* width: 80%;
  max-width: 1400px;
  margin: 0 auto; */
  position: relative;
}

@media (max-width: 768px) {
  .main-content {
    width: 95%;
    padding: 1rem;
  }
}
</style>
