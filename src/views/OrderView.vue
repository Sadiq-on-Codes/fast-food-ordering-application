<template>
    <div class="order-view">
      <div class="order-header">
        <h1>Your Order</h1>
        <p class="subtitle">Review and complete your order</p>
      </div>
  
      <div class="order-content">
        <div class="order-summary">
          <div v-if="currentOrder.length === 0" class="empty-order">
            <div class="empty-illustration">🍽️</div>
            <h2>Your order is empty</h2>
            <p>Browse our delicious menu and add items to your order</p>
            <router-link to="/" class="browse-menu-btn">Browse Menu</router-link>
          </div>
  
          <template v-else>
            <div class="order-items">
              <div v-for="(item, index) in currentOrder" 
                  :key="index" 
                  class="order-item"
                  :class="{ 'removing': removingIndex === index }"
              >
                <div class="item-info">
                  <img :src="item.image_url || '/default-dish.jpg'" :alt="item.name">
                  <div class="item-details">
                    <h3>{{ item.name }}</h3>
                    <p class="item-description">{{ item.description }}</p>
                  </div>
                </div>
                <div class="item-actions">
                  <span class="item-price">${{ item.price.toFixed(2) }}</span>
                  <button @click="removeItem(index)" class="remove-button">
                    <span class="remove-icon">×</span>
                  </button>
                </div>
              </div>
            </div>
  
            <div class="order-summary-card">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>${{ orderTotal.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>Tax (10%)</span>
                <span>${{ (orderTotal * 0.1).toFixed(2) }}</span>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <span>${{ (orderTotal * 1.1).toFixed(2) }}</span>
              </div>
            </div>
  
            <div class="checkout-form">
              <h3>Customer Details</h3>
              <form @submit.prevent="submitOrder" class="form-grid">
                <div class="form-group">
                  <label for="customerName">Name</label>
                  <input 
                    id="customerName"
                    v-model="customerName" 
                    type="text" 
                    required
                  >
                </div>
                
                <div class="form-group">
                  <label for="customerEmail">Email</label>
                  <input 
                    id="customerEmail"
                    v-model="customerEmail" 
                    type="email"
                    required
                  >
                </div>
                
                <div class="form-group full-width">
                  <label for="customerNotes">Special Instructions</label>
                  <textarea 
                    id="customerNotes"
                    v-model="orderNotes" 
                    rows="3"
                    placeholder="Any special requests or allergies?"
                  ></textarea>
                </div>
  
                <div class="form-actions">
                  <router-link to="/" class="back-button">Add More Items</router-link>
                  <button type="submit" class="submit-button" :disabled="loading">
                    <span v-if="loading" class="spinner small"></span>
                    <span v-else>Place Order • ${{ (orderTotal * 1.1).toFixed(2) }}</span>
                  </button>
                </div>
              </form>
            </div>
          </template>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { useOrdersStore } from '../stores/orders'
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const orderStore = useOrdersStore()
  const { currentOrder, loading } = storeToRefs(orderStore)
  
  const customerName = ref('')
  const customerEmail = ref('')
  const orderNotes = ref('')
  const removingIndex = ref(null)
  
  const orderTotal = computed(() => {
    return currentOrder.value.reduce((sum, item) => sum + item.price, 0)
  })
  
  const removeItem = async (index) => {
    removingIndex.value = index
    await new Promise(resolve => setTimeout(resolve, 300))
    currentOrder.value.splice(index, 1)
    removingIndex.value = null
  }
  
  const submitOrder = async () => {
    const orderDetails = {
      customer_name: customerName.value,
      customer_email: customerEmail.value,
      notes: orderNotes.value,
      total_amount: orderTotal.value * 1.1,
      subtotal: orderTotal.value,
      tax: orderTotal.value * 0.1
    }
  
    const result = await orderStore.submitOrder(orderDetails)
    if (result) {
      router.push({
        name: 'order-confirmation',
        params: { orderId: result.id }
      })
    }
  }
  </script>
  
  <style scoped>
  .order-view {
    min-height: 100vh;
    background-color: #ecf0f1;
  }
  
  .order-header {
    background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
                url('/order-bg.jpg') center/cover;
    color: white;
    text-align: center;
    padding: 3rem 2rem;
  }
  
  .order-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  
  .order-content {
    max-width: 800px;
    margin: -2rem auto 2rem;
    padding: 0 1rem;
  }
  
  .order-summary {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    padding: 2rem;
  }
  
  .empty-order {
    text-align: center;
    padding: 3rem 1rem;
  }
  
  .empty-illustration {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .browse-menu-btn {
    display: inline-block;
    padding: 0.75rem 2rem;
    background: #d35400;
    color: white;
    text-decoration: none;
    border-radius: 25px;
    margin-top: 1rem;
    transition: transform 0.2s;
  }
  
  .browse-menu-btn:hover {
    transform: translateY(-2px);
  }
  
  .order-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    margin-bottom: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    transition: all 0.3s ease;
  }
  
  .removing {
    transform: translateX(100%);
    opacity: 0;
  }
  
  .item-info {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  .item-info img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
  }
  
  .item-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .remove-button {
    background: none;
    border: none;
    color: #d35400;
    cursor: pointer;
    padding: 0.5rem;
    font-size: 1.5rem;
    opacity: 0.7;
    transition: opacity 0.2s;
  }
  
  .remove-button:hover {
    opacity: 1;
  }
  
  .order-summary-card {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
    margin: 2rem 0;
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
  }
  
  .total {
    border-top: 2px solid #dee2e6;
    margin-top: 0.5rem;
    padding-top: 1rem;
    font-weight: bold;
    font-size: 1.2rem;
  }
  
  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-group.full-width {
    grid-column: 1 / -1;
  }
  
  .form-group label {
    font-weight: 500;
    color: #495057;
  }
  
  .form-group input,
  .form-group textarea {
    padding: 0.75rem;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    font-size: 1rem;
  }
  
  .form-actions {
    grid-column: 1 / -1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
  
  .back-button {
    padding: 0.75rem 1.5rem;
    color: #2c3e50;
    text-decoration: none;
    border: 1px solid #dee2e6;
    border-radius: 25px;
    transition: all 0.2s;
  }
  
  .back-button:hover {
    background: #f8f9fa;
  }
  
  .submit-button {
    padding: 0.75rem 2rem;
    background: #8e44ad;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .submit-button:hover:not(:disabled) {
    background: #d35400;
    transform: translateY(-2px);
  }
  
  .spinner.small {
    width: 20px;
    height: 20px;
    border-width: 2px;
  }
  
  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
    
    .item-info img {
      width: 60px;
      height: 60px;
    }
    
    .form-actions {
      flex-direction: column;
      gap: 1rem;
    }
    
    .back-button,
    .submit-button {
      width: 100%;
      text-align: center;
    }
  }
  </style>