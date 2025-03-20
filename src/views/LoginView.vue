<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">Welcome Back</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email Address</label>
          <input 
            id="email" 
            type="email" 
            v-model="email" 
            placeholder="your.email@example.com" 
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password" 
            type="password" 
            v-model="password" 
            placeholder="Enter your password" 
            required
          />
        </div>
        <button type="submit" :disabled="loading" class="primary-button">
          <span v-if="loading" class="spinner small"></span>
          <span v-else>Login</span>
        </button>
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabase'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')
const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  errorMsg.value = ''
  
  // Optionally sign out any existing session
  await supabase.auth.signOut()

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    errorMsg.value = error.message
  } else {
    router.push('/admin')
  }
  loading.value = false
}
</script>

<style scoped>
/* Container centering background */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: linear-gradient(135deg, #f4f4f9 0%, #e0e5ec 100%);
}

/* Card for login form */
.login-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 15px 25px rgba(0,0,0,0.1);
  padding: 2rem 3rem;
  width: 100%;
  max-width: 400px;
  animation: fadeIn 0.5s ease-out;
}

/* Title styling */
.login-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-size: 1.75rem;
  font-weight: bold;
}

/* Form groups styling */
.login-form .form-group {
  margin-bottom: 1.25rem;
}

.login-form .form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.login-form .form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccd1d9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border 0.3s ease;
}

.login-form .form-group input:focus {
  outline: none;
  border-color: #d35400;
  box-shadow: 0 0 0 3px rgba(211,84,0,0.1);
}

/* Primary button styling */
.primary-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #d35400;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.primary-button:hover:not(:disabled) {
  background-color: #e67e22;
  transform: translateY(-2px);
}

.primary-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Error message styling */
.error {
  color: #dc3545;
  text-align: center;
  margin-top: 1rem;
}

/* Spinner styles */
.spinner.small {
  width: 16px;
  height: 16px;
  border-width: 2px;
  border-radius: 50%;
  border: 2px solid white;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
  margin-right: 4px;
}

/* Animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>