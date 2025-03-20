<template>
  <header class="header">
    <div class="header-content">
      <div class="header-left">
        <h1 class="brand">Pork Chops</h1>
        <p class="tagline">Delicious pork dishes made with love</p>
      </div>
      
      <nav class="nav">
        <router-link to="/" class="nav-link" active-class="active">
          <i class="fas fa-utensils"></i>
          Menu
        </router-link>
        <router-link to="/order" class="nav-link" active-class="active">
          <i class="fas fa-shopping-cart"></i>
          Order
        </router-link>
        <router-link to="/admin" class="nav-link admin-link" active-class="active">
          <i class="fas fa-cog"></i>
          Admin
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
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

.header-left {
  display: flex;
  flex-direction: column;
}

.brand {
  color: #d35400;
  font-size: 2rem;
  margin: 0;
  font-weight: bold;
}

.tagline {
  color: #666;
  margin: 0.25rem 0 0 0;
  font-size: 0.9rem;
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
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link i {
  font-size: 1.1rem;
}

.nav-link:hover, .nav-link.active {
  background-color: #d35400;
  color: white;
  transform: translateY(-2px);
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