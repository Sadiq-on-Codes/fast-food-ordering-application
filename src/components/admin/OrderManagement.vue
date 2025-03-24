<template>
  <div class="admin-section">
    <div class="section-header">
      <h2>Orders Management</h2>
      <div class="order-filters">
        <select v-model="orderStatus">
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input type="date" v-model="orderDate" placeholder="Filter by Date">
      </div>
    </div>

    <div class="orders-list">
      <div v-for="order in filteredOrders" :key="order.id" class="order-card">
        <div class="order-header">
          <h3>Order #{{ order.id }}</h3>
          <span :class="['status-badge', order.status]">{{ order.status }}</span>
        </div>
        
        <div class="order-details">
          <div class="customer-info">
            <p><strong>Customer:</strong> {{ order.customer_name }}</p>
            <p><strong>Phone Number:</strong> {{ order.customer_phone }}</p>
            <p><strong>Location:</strong> {{ order.customer_location }}</p>
          </div>
          
          <div class="order-items">
            <h4>Items</h4>
            <ul>
              <li v-for="item in order.items" :key="item.id">
                {{ item.name }} x{{ item.quantity }} - ₵{{ (item.price * item.quantity).toFixed(2) }}
              </li>
            </ul>
          </div>
          
          <div class="order-summary">
            <p><strong>Total:</strong> ₵{{ order.subtotal.toFixed(2) }}</p>
            <p v-if="order.notes"><strong>Notes:</strong> {{ order.notes }}</p>
          </div>
        </div>
        
        <div class="order-actions">
          <button 
            v-if="order.status === 'pending'"
            @click="updateOrderStatus(order.id, 'completed')"
            class="complete-btn"
          >
            Mark as Completed
          </button>
          <button 
            v-if="order.status === 'pending'"
            @click="updateOrderStatus(order.id, 'cancelled')"
            class="cancel-btn"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useOrdersStore } from '../../stores/orders'

const ordersStore = useOrdersStore()
const { orders } = storeToRefs(ordersStore)

const orderStatus = ref('all')
const orderDate = ref('')

const filteredOrders = computed(() => {
  let filtered = orders.value
  if (orderStatus.value !== 'all') {
    filtered = filtered.filter(order => order.status === orderStatus.value)
  }
  if (orderDate.value) {
    const selectedDate = new Date(orderDate.value)
    filtered = filtered.filter(order => {
      const orderDateObj = new Date(order.created_at)
      return orderDateObj.toLocaleDateString() === selectedDate.toLocaleDateString()
    })
  }
  return filtered
})

const updateOrderStatus = async (orderId, status) => {
  await ordersStore.updateOrderStatus(orderId, status)
}
</script>

<style scoped>
.order-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.order-filters select,
.order-filters input {
  padding: 0.5rem 1rem;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
}

.orders-list {
  display: grid;
  gap: 2rem;
}

.order-card {
  background: white;
  color: #333;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.completed {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.order-details {
  display: grid;
  gap: 1.5rem;
}

.order-items ul {
  list-style: none;
  padding: 0;
}

.order-items li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.order-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.complete-btn,
.cancel-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.complete-btn {
  background: #22c55e;
  color: white;
}

.cancel-btn {
  background: #fee2e2;
  color: #ef4444;
}
</style>