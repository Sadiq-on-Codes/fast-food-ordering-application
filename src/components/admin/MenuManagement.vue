<template>
  <div class="admin-section">
    <div class="section-header">
      <h2>Menu Items</h2>
      <button v-show="!showAddForm" @click="showAddForm = !showAddForm" class="primary-button">
        {{ showAddForm ? '' : 'Add New Item' }}
      </button>
    </div>

    <add-menu-item-form 
      v-if="showAddForm" 
      @close="showAddForm = false"
      @item-added="handleItemAdded"
    />

    <div class="menu-grid">
      <div v-for="item in menuItems" :key="item.id" class="menu-item-card" :class="{ 'inactive': !item.active }">
        <div class="menu-item-image">
          <img :src="item.image_url || defaultImage" :alt="item.name">
          <span :class="['category-badge', item.category]">{{ item.category }}</span>
          <span :class="['availability-badge', item.active ? 'active' : 'inactive']">
            {{ item.active ? 'Available ' : 'Unavailable' }}
          </span>
        </div>
        <div class="menu-item-content">
          <h3>{{ item.name }}</h3>
          <p class="description">{{ item.description }}</p>
          <div class="menu-item-footer">
            <span class="price">₵{{ item.price.toFixed(2) }}</span>
            <div class="item-actions">
              <button 
                @click.prevent="toggleItemAvailability(item)"
                :class="['availability-btn', { 'active': item.active }]"
                :disabled="loading"
              >
                <span v-if="loading" class="spinner small"></span>
                <span v-else>{{ item.active ? 'Set Unavailable' : 'Set Available' }}</span>
              </button>
              <button @click="deleteItem(item.id)" class="delete-btn">
                <span class="material-icons">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMenuStore } from '../../stores/menu'
import defaultImage from '../../assets/order.jpg'
import AddMenuItemForm from './AddMenuItemForm.vue'

const menuStore = useMenuStore()
const { items: menuItems, loading } = storeToRefs(menuStore)
const showAddForm = ref(false)

const toggleItemAvailability = async (item) => {
  try {
    await menuStore.toggleItemAvailability(item)
  } catch (error) {
    console.error('Failed to toggle availability:', error)
  }
}

const deleteItem = async (itemId) => {
  if (confirm('Are you sure you want to delete this item?')) {
    try {
      await menuStore.deleteMenuItem(itemId)
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
  }
}

const handleItemAdded = () => {
  showAddForm.value = false
}
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.menu-item-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.menu-item-image {
  position: relative;
  height: 200px;
}

.menu-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-badge,
.availability-badge {
  position: absolute;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
}

.category-badge {
  top: 1rem;
  left: 1rem;
  background: rgba(0,0,0,0.7);
  color: white;
}

.availability-badge {
  top: 1rem;
  right: 1rem;
  background: white;
}

.availability-badge.active {
  color: #22c55e;
}

.availability-badge.inactive {
  color: #ef4444;
}

.menu-item-content {
  padding: 1.5rem;
}

.menu-item-content h3 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
}

.description {
  color: #6b7280;
  margin-bottom: 1rem;
}

.menu-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 1.25rem;
  font-weight: 600;
  color: #d35400;
}

.item-actions {
  display: flex;
  gap: 0.5rem;
}

.availability-btn,
.delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.availability-btn {
  background: #f3f4f6;
  color: #374151;
}

.availability-btn.active {
  background: #22c55e;
  color: white;
}

.delete-btn {
  background: #fee2e2;
  color: #ef4444;
}

.primary-button {
  padding: 0.75rem 1.5rem;
  background: #d35400;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-button:hover {
  background: #9a3412;
}
</style>