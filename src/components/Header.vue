<template>
  <header class="header">
    <div class="header-content">
      <h1 class="brand">Pork Chops</h1>
      <nav class="nav">
        <router-link to="/" class="nav-link" active-class="active">
          Menu
        </router-link>
        <router-link to="/order" class="nav-link" active-class="active">
          Order
        </router-link>
        <router-link v-if="isUserAuthenticated" to="/admin" class="nav-link admin-link" active-class="active">
          Admin
        </router-link>
        <router-link v-else to="/login" class="nav-link" active-class="active">
          Login
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { isAuthenticated as checkAuth } from '../services/auth'

const isUserAuthenticated = ref(false)

onMounted(async () => {
  isUserAuthenticated.value = await checkAuth()
})
</script>

<style scoped>
.header {
  background-color: #ecf0f1;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  width: 80%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  color: #d35400;
  font-size: 2rem;
  margin: 0;
  font-weight: bold;
}

.nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.nav-link:hover, .nav-link.active {
  background-color: #d35400;
  color: white;
}

.admin-link {
  background-color: #8e44ad;
  color: white;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }

  .nav {
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
  }

  .nav-link {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>