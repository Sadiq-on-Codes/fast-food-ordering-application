import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import OrderView from '../views/OrderView.vue'
import AdminView from '../views/AdminView.vue'
import LoginView from '../views/LoginView.vue'
import { supabase } from '../lib/supabase'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/order', name: 'order', component: OrderView },
  { 
    path: '/admin', 
    name: 'admin', 
    component: AdminView,
    meta: { requiresAuth: true }  // Secure admin route
  },
  { path: '/login', name: 'login', component: LoginView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Use Supabase session in your beforeEach guard
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      next()
    } else {
      next({ name: 'login' })
    }
  } else {
    next()
  }
})

export default router