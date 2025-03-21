<template>
  <div class="admin-view">
    <div class="admin-header">
      <h1>Admin Dashboard</h1>
      <p class="subtitle">Manage your menu and orders</p>
    </div>

    <div class="admin-content">
      <div class="tabs">
        <button 
          @click="activeTab = 'menu'" 
          :class="{ active: activeTab === 'menu' }"
        >
          Menu Management
        </button>
        <button 
          @click="activeTab = 'orders'" 
          :class="{ active: activeTab === 'orders' }"
        >
          Orders
        </button>
      </div>

      <!-- Menu Management Section -->
      <div v-if="activeTab === 'menu'" class="admin-section">
        <div class="section-header">
          <h2>Menu Items</h2>
          <button v-show="!showAddForm" @click="showAddForm = !showAddForm" class="primary-button">
            {{ showAddForm ? '' : 'Add New Item' }}
          </button>
        </div>

        <form v-if="showAddForm" @submit.prevent="addMenuItem" class="add-item-form">
          <h3 class="form-title">Add New Menu Item</h3>
          
          <div class="form-container">
            <div class="form-fields">
              <div class="form-grid">
                <div class="form-group">
                  <label for="itemName">Item Name</label>
                  <input 
                    id="itemName"
                    v-model="newItem.name" 
                    type="text" 
                    placeholder="Enter item name"
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label for="itemPrice">Price (₵)</label>
                  <input 
                    id="itemPrice"
                    v-model="newItem.price" 
                    type="number" 
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    required
                  >
                </div>

                <div class="form-group">
                  <label for="itemCategory">Category</label>
                  <select 
                    id="itemCategory"
                    v-model="newItem.category" 
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="mains">Mains</option>
                    <option value="sides">Sides</option>
                    <option value="drinks">Drinks</option>
                    <option value="desserts">Desserts</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="itemImage">Image Upload</label>
                  <input 
                    id="itemImage"
                    type="file" 
                    accept="image/*"
                    @change="handleFileUpload"
                  >
                </div>

                <div class="form-group full-width">
                  <label for="itemDescription">Description</label>
                  <textarea 
                    id="itemDescription"
                    v-model="newItem.description" 
                    rows="3"
                    placeholder="Describe the menu item"
                    required
                  ></textarea>
                </div>
              </div>

              <div class="form-actions">
                <button type="button" @click="showAddForm = false" class="cancel-button">
                  Cancel
                </button>
                <button type="submit" :disabled="loading" class="primary-button">
                  <span v-if="loading" class="spinner"></span>
                  <span v-else>Add Menu Item</span>
                </button>
              </div>
            </div>

            <div class="form-preview">
              <h4>Preview</h4>
              <div class="preview-card">
                <div class="preview-image">
                  <img :src="newItem.image_url || '../assets/order.jpg'" :alt="newItem.name || 'Preview'">
                  <span v-if="newItem.category" :class="['category-badge', newItem.category]">
                    {{ newItem.category }}
                  </span>
                </div>
                <div class="preview-content">
                  <h3>{{ newItem.name || 'Item Name' }}</h3>
                  <p class="preview-description">{{ newItem.description || 'Item description will appear here' }}</p>
                  <div class="preview-footer">
                    <span class="preview-price">₵{{ newItem.price ? Number(newItem.price).toFixed(2) : '0.00' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

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

      <!-- Orders Section -->
      <div v-else class="admin-section">
        <div class="section-header">
          <h2>Orders Management</h2>
          <div class="order-filters">
            <select v-model="orderStatus">
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div class="orders-list">
          <div v-for="order in filteredOrders" :key="order.id" class="order-card">
            <div class="order-header">
              <h3>Order #{{ order.id.slice(0, 8) }}</h3>
              <span :class="['status-badge', order.status]">{{ order.status }}</span>
            </div>
            <div class="order-info">
              <p><strong>Customer:</strong> {{ order.customer_name }}</p>
              <p><strong>Email:</strong> {{ order.customer_email }}</p>
              <p><strong>Location:</strong> {{ order.customer_location }}</p>
              <p><strong>Date:</strong> {{ new Date(order.created_at).toLocaleString() }}</p>
            </div>
            <div class="order-items">
              <div v-for="(item, index) in order.items" :key="index" class="order-item">
                <span>{{ item.name }} x {{ item.quantity }}</span>
               <span>{{ order.notes }}</span>
                <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
            <div class="order-summary">
              <p><strong>Subtotal:</strong> ${{ order.subtotal.toFixed(2) }}</p>
              <p><strong>Tax:</strong> ${{ order.tax.toFixed(2) }}</p>
              <p><strong>Total:</strong> ${{ order.total_amount.toFixed(2) }}</p>
            </div>
            <div class="order-actions">
              <button 
                v-if="order.status === 'pending'"
                @click="updateOrderStatus(order.id, 'completed')"
                class="primary-button"
              >
                Complete Order
              </button>
              <button 
                v-if="order.status === 'pending'"
                @click="updateOrderStatus(order.id, 'cancelled')"
                class="delete-button"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMenuStore } from '../stores/menu'
import { useOrdersStore } from '../stores/orders'
import { storeToRefs } from 'pinia'
import defaultImage from '../assets/order.jpg'
import { supabase } from '../lib/supabase' // make sure to set up your Supabase client

const menuStore = useMenuStore()
const ordersStore = useOrdersStore()
const { items: menuItems, loading } = storeToRefs(menuStore)
const { orders } = storeToRefs(ordersStore)

const activeTab = ref('menu')
const showAddForm = ref(false)
const orderStatus = ref('all')

const newItem = ref({
  name: '',
  description: '',
  price: '',
  category: '',
  image_url: '',
  active: true  // Changed from available to active
})

const uploadedImageUrl = ref('')

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Set a local preview first
  newItem.value.image_url = URL.createObjectURL(file)

  // Create a unique file name
  const fileName = `${Date.now()}_${file.name}`
  
  // Upload the file to the "menu-images" bucket
  let { data, error } = await supabase.storage
    .from('menu-images')
    .upload(fileName, file)

  if (error) {
    console.error("File upload error:", error)
    return
  }

  // Retrieve the public URL for the uploaded file
  const { publicURL, error: urlError } = supabase.storage
    .from('menu-images')
    .getPublicUrl(data.path)
  
  if (urlError) {
    console.error("Error getting public URL:", urlError)
    return
  }

  // Update the image_url with the public URL once the upload is finished
  newItem.value.image_url = publicURL
}

const filteredOrders = computed(() => {
  if (orderStatus.value === 'all') return orders.value
  return orders.value.filter(order => order.status === orderStatus.value)
})

onMounted(async () => {
  await menuStore.fetchMenuItems()
  await ordersStore.fetchOrders()
})

const addMenuItem = async () => {
  await menuStore.addMenuItem({
    ...newItem.value,
    price: parseFloat(newItem.value.price),
    active: true  // Ensure active is set when adding new items
  })
  
  // Reset form
  newItem.value = {
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    active: true  // Reset with active instead of available
  }
  showAddForm.value = false
}

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

const updateOrderStatus = async (orderId, status) => {
  await ordersStore.updateOrderStatus(orderId, status)
}
</script>

<style scoped>
.admin-view {
  min-height: 100vh;
  background-color: #ecf0f1;
}

.admin-header {
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
              url('/order-bg.jpg') center/cover;
  color: white;
  text-align: center;
  padding: 3rem 2rem;
}

.admin-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.admin-content {
  max-width: 1200px;
  margin: -2rem auto 2rem;
  padding: 0 1rem;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.tabs button {
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  color: #6c757d;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
}

.tabs button.active {
  background: #d35400;
  color: white;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.menu-item-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.menu-item-card:hover {
  transform: translateY(-5px);
}

.menu-item-card.inactive {
  opacity: 0.7;
}

.menu-item-image {
  position: relative;
  height: 200px;
}

.menu-item-image img {
  width: 100%;
  height: 100%;
  object-fit: scale-down;
}

.category-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
}

.category-badge.mains {
  background: #ffd700;
  color: #000;
}

.category-badge.sides {
  background: #98fb98;
  color: #000;
}

.category-badge.drinks {
  background: #87ceeb;
  color: #000;
}

.category-badge.desserts {
  background: #ffc0cb;
  color: #000;
}

.availability-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.availability-badge.active {
  background: #d4edda;
  color: #155724;
}

.availability-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.menu-item-content {
  padding: 1.5rem;
}

.menu-item-content h3 {
  margin: 0 0 0.5rem;
  color: #2c3e50;
}

.description {
  color: #6c757d;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.menu-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
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

.status-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.status-btn.active {
  background: #d4edda;
  color: #155724;
}

.status-btn:not(.active) {
  background: #f8d7da;
  color: #721c24;
}

.delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.delete-btn:hover {
  background: #c82333;
}

.orders-list {
  display: grid;
  gap: 1.5rem;
  
}

.order-card {
  background: white;
  color: #333;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.completed {
  background: #d4edda;
  color: #155724;
}

.status-badge.cancelled {
  background: #f8d7da;
  color: #721c24;
}

.order-items {
  margin: 1rem 0;
  padding: 1rem 0;
  border-top: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
}

.order-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.order-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.primary-button {
  background: #d35400;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s ease;
}

.primary-button:hover {
  background: #e67e22;
}

.delete-button {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s ease;
}

.delete-button:hover {
  background: #c82333;
}

.add-item-form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
  overflow: hidden;
}

.form-title {
  background: #f8f9fa;
  color: #2c3e50;
  padding: 1.5rem;
  margin: 0;
  border-bottom: 1px solid #dee2e6;
}

.form-container {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 2rem;
  padding: 2rem;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #d35400;
  background: white;
  box-shadow: 0 0 0 3px rgba(211, 84, 0, 0.1);
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-preview {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid #dee2e6;
}

.form-preview h4 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.preview-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.preview-image {
  position: relative;
  height: 200px;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-content {
  padding: 1.5rem;
}

.preview-content h3 {
  color: #2c3e50;
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
}

.preview-description {
  color: #6c757d;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.preview-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-price {
  color: #d35400;
  font-size: 1.25rem;
  font-weight: 600;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #dee2e6;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid #dee2e6;
  background: white;
  color: #6c757d;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button:hover {
  background: #f8f9fa;
  border-color: #c1c9d0;
}

.primary-button {
  padding: 0.75rem 1.5rem;
  background: #d35400;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-button:hover:not(:disabled) {
  background: #e67e22;
  transform: translateY(-1px);
}

.primary-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

.spinner.small {
  width: 16px;
  height: 16px;
  border-width: 1px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.availability-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  background: #f8d7da;
  color: #721c24;
}

.availability-btn.active {
  background: #d4edda;
  color: #155724;
}

.availability-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  pointer-events: none;
}

.availability-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

@media (max-width: 1024px) {
  .form-container {
    grid-template-columns: 1fr;
  }

  .form-preview {
    order: -1;
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>