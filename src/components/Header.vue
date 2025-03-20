<template>
  <header class="header">
    <div class="header-content">
      <h1 class="brand">Pork Chops</h1>
      <nav class="nav">
        <router-link to="/" class="nav-link" active-class="active">
          Menu
        </router-link>
        <router-link to="/order" class="nav-link" active-class="active">
          Orders <span v-if="orderCount > 0" class="order-count">{{ orderCount }}</span>
        </router-link>
        <router-link v-if="isUserAuthenticated" to="/admin" class="nav-link admin-link" active-class="active">
          Admin
        </router-link>
        <button 
          v-if="isUserAuthenticated" 
          @click="logout" 
          class="nav-link logout-button"
        >
          Logout
        </button>
        <router-link v-else to="/login" class="nav-link" active-class="active">
          Login
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useOrdersStore } from '../stores/orders'
import { storeToRefs } from 'pinia'

const router = useRouter()
const isUserAuthenticated = ref(false)

const orderStore = useOrdersStore()
const { currentOrder } = storeToRefs(orderStore)
  
// Automatically update auth status when it changes.
onMounted(() => {
  // Initially check for a session.
  supabase.auth.getSession().then(({ data: { session } }) => {
    isUserAuthenticated.value = session ? true : false
  })
  
  // Subscribe to auth state changes.
  const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    isUserAuthenticated.value = session ? true : false
  })
})

// Logout function: sign out via Supabase, update state and redirect.
const logout = async () => {
  await supabase.auth.signOut()
  isUserAuthenticated.value = false
  router.push('/')
}
  
// Compute order count (if needed).
const orderCount = computed(() => {
  return currentOrder.value.reduce((sum, item) => sum + (item.quantity || 1), 0)
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
  background: none;
  border: none;
}

.nav-link:hover, .nav-link.active {
  background-color: #d35400;
  color: white;
}

.admin-link {
  background-color: #8e44ad;
  color: white;
}

/* Style the logout button to match the nav links */
.logout-button {
  cursor: pointer;
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  font-weight: 500;
  color: #2c3e50;
  transition: all 0.3s ease;
  border-radius: 5px;
}

.logout-button:hover {
  background-color: #d35400;
  color: white;
}

.order-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: white;
  color: #d35400;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  font-size: 0.8rem;
  margin-left: 0.5rem;
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