<template>
  <div class="admin-container">
    <div class="admin-section">
      <h2>Menu Management</h2>
      <form @submit.prevent="addMenuItem" class="add-item-form">
        <input v-model="newItem.name" type="text" placeholder="Item Name" required>
        <textarea v-model="newItem.description" placeholder="Description" required></textarea>
        <input v-model="newItem.price" type="number" step="0.01" placeholder="Price" required>
        <input v-model="newItem.category" type="text" placeholder="Category" required>
        <input v-model="newItem.image_url" type="url" placeholder="Image URL">
        <button type="submit" :disabled="loading">Add Menu Item</button>
      </form>
    </div>

    <div class="admin-section">
      <h2>Current Menu Items</h2>
      <div class="menu-items-grid">
        <div v-for="item in menuItems" :key="item.id" class="menu-item-card">
          <img v-if="item.image_url" :src="item.image_url" :alt="item.name">
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <p class="price">${{ item.price.toFixed(2) }}</p>
            <p class="category">{{ item.category }}</p>
          </div>
          <div class="item-actions">
            <button @click="toggleItemAvailability(item)">
              {{ item.available ? 'Disable' : 'Enable' }}
            </button>
            <button @click="deleteItem(item.id)" class="delete-button">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMenuStore } from '../stores/menu'
import { storeToRefs } from 'pinia'

const menuStore = useMenuStore()
const { items: menuItems, loading } = storeToRefs(menuStore)

const newItem = ref({
  name: '',
  description: '',
  price: '',
  category: '',
  image_url: '',
  available: true
})

onMounted(() => {
  menuStore.fetchMenuItems()
})

const addMenuItem = async () => {
  await menuStore.addMenuItem({
    ...newItem.value,
    price: parseFloat(newItem.value.price)
  })
  
  // Reset form
  newItem.value = {
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    available: true
  }
}

const toggleItemAvailability = async (item) => {
  await menuStore.updateMenuItem(item.id, {
    available: !item.available
  })
}

const deleteItem = async (itemId) => {
  if (confirm('Are you sure you want to delete this item?')) {
    await menuStore.deleteMenuItem(itemId)
  }
}
</script>

<style scoped>
.admin-container {
  padding: 2rem;
}

.admin-section {
  margin-bottom: 3rem;
}

.add-item-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 2rem 0;
}

.add-item-form input,
.add-item-form textarea {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.menu-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.menu-item-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.menu-item-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.item-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.delete-button {
  background: var(--primary-color);
  color: white;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: var(--secondary-color);
  color: white;
}

button:hover {
  opacity: 0.9;
}
</style>