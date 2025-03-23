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

      <menu-management v-if="activeTab === 'menu'" />
      <order-management v-else />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useMenuStore } from '../stores/menu'
import { useOrdersStore } from '../stores/orders'
import MenuManagement from '../components/admin/MenuManagement.vue'
import OrderManagement from '../components/admin/OrderManagement.vue'

const menuStore = useMenuStore()
const ordersStore = useOrdersStore()
const activeTab = ref('menu')

onMounted(async () => {
  await menuStore.fetchMenuItems()
  await ordersStore.fetchOrders()
})
</script>

<style scoped>
.admin-view {
  min-height: 100vh;
  background-color: #ecf0f1;
  color: #333;
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

@media (max-width: 768px) {
  .admin-header {
    padding: 2rem 1rem;
  }

  .admin-header h1 {
    font-size: 2rem;
  }

  .tabs {
    flex-direction: column;
  }

  .tabs button {
    width: 100%;
    text-align: center;
  }
}
</style>