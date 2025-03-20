<template>
  <div class="app-container">
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

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Contact Us</h3>
          <p>📞 (555) 123-4567</p>
          <p>📧 info@porkchops.com</p>
        </div>
        <div class="footer-section">
          <h3>Hours</h3>
          <p>Mon-Fri: 11am - 10pm</p>
          <p>Sat-Sun: 12pm - 11pm</p>
        </div>
        <div class="footer-section">
          <h3>Follow Us</h3>
          <div class="social-links">
            <a href="#" class="social-link">
              <i class="fab fa-facebook"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 Pork Chops. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
:root {
  --primary-color: #ff6b6b;
  --secondary-color: #4ecdc4;
  --dark-color: #2d3436;
  --light-color: #f8f9fa;
  --header-height: 80px;
}

/* * {
  outline: 1px solid;
} */

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 90vw;
  justify-content: center;
}

.header {
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
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
  color: var(--primary-color);
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
  color: var(--dark-color);
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
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

.admin-link {
  background-color: var(--secondary-color);
  color: white;
}

.main-content {
  flex: 1;
  width: 100%;
  margin: 0 auto;
  position: relative;
}

.footer {
  background-color: var(--dark-color);
  color: var(--light-color);
  padding: 3rem 1rem 1rem;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  color: var(--secondary-color);
  margin-bottom: 1rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: var(--light-color);
  font-size: 1.5rem;
  transition: color 0.3s ease;
}

.social-link:hover {
  color: var(--secondary-color);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
  text-align: center;
}

/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
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

  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }
}
</style>
