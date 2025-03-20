<template>
  <div class="menu-view">
    <div class="hero-section">
      <h1>Our Delicious Menu</h1>
      <p class="subtitle">We offer a variety of tasty options for lunch and dinner, carefully crafted to satisfy any craving. 🍲 🥗 🍗</p>
    </div>

    <div class="categories-nav">
      <button 
        v-for="category in categories" 
        :key="category"
        :class="['category-btn', { active: selectedCategory === category }]"
        @click="selectedCategory = category"
      >
        {{ category }}
      </button>
    </div>

    <div class="menu-container">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading our delicious menu...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="menuStore.fetchMenuItems">Try Again</button>
      </div>

      <div v-else class="menu-grid">
        <div 
          v-for="item in activeMenuItems" 
          :key="item.id" 
          class="menu-card"
          :class="{ 'unavailable': !item.active }"
        >
          <div class="menu-card-image">
            <img 
              :src="item.image_url || '/default-dish.jpg'" 
              :alt="item.name"
              @error="handleImageError"
            >
            <div v-if="!item.active" class="unavailable-badge">
              Currently Unavailable
            </div>
          </div>
          
          <div class="menu-card-content">
            <h3>{{ item.name }}</h3>
            <p class="description">{{ item.description }}</p>
            <div class="price-row">
              <span class="price">₵{{ item.price.toFixed(2) }}</span>
              <button 
                @click="addToOrder(item)"
                :disabled="!item.active"
                class="add-btn"
              >
                Add to Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMenuStore } from '../stores/menu'
import { useOrdersStore } from '../stores/orders'

const menuStore = useMenuStore()
const orderStore = useOrdersStore()
const { items, loading, error } = storeToRefs(menuStore)

const selectedCategory = ref('All')
const categories = computed(() => {
  const cats = ['All', ...new Set(items.value.map(item => item.category))]
  return cats.sort()
})

const filteredItems = computed(() => {
  if (selectedCategory.value === 'All') return items.value
  return items.value.filter(item => item.category === selectedCategory.value)
})

const activeMenuItems = computed(() => {
  if (selectedCategory.value === 'All') {
    return items.value.filter(item => item.active)
  }
  return items.value.filter(item => 
    item.active && item.category === selectedCategory.value
  )
})

const handleImageError = (e) => {
  e.target.src = '/order.jpg'
}

const addToOrder = (item) => {
  orderStore.addToOrder(item)
}

onMounted(() => {
  menuStore.fetchMenuItems()
})
</script>

<style scoped>
.menu-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('/hero-bg.jpg') center/cover;
  color: white;
  text-align: center;
  padding: 4rem 2rem;
  margin-bottom: 2rem;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.categories-nav {
  display: flex;
  gap: 1rem;
  padding: 1rem 2rem;
  overflow-x: auto;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.category-btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 20px;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.category-btn.active {
  background: #d35400;
  color: white;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

/* Enhanced Menu Card Styles */
.menu-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.menu-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
}

.menu-card-image {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.menu-card-image img {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
  transition: transform 0.3s ease;
}

.menu-card:hover .menu-card-image img {
  transform: scale(1.05);
}

.unavailable-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
}

.menu-card-content {
  padding: 1.5rem;
  color: #333;
}

.menu-card-content h3 {
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.description {
  color: #666;
  margin: 0.5rem 0;
  line-height: 1.5;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.price {
  font-size: 1.25rem;
  font-weight: bold;
  color: #d35400;
}

.add-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  background: #8e44ad;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
}

.add-btn:hover:not(:disabled) {
  background: #d35400;
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-state, .error-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #d35400;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2rem;
  }
  
  .menu-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
}
</style>