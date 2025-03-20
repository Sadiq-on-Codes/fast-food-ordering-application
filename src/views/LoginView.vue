<template>
  <div class="login-view">
    <div class="login-container">
      <h1>Login</h1>
      <form @submit.prevent="loginHandler">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">Login</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/auth'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()

const loginHandler = async () => {
  try {
    errorMessage.value = ''
    await login(email.value, password.value)
    router.push({ name: 'admin' })
  } catch (error) {
    errorMessage.value = 'Invalid credentials'
    console.error('Login failed:', error.message)
  }
}
</script>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f5f5;
  padding: 1rem;
}

.login-container {
  max-width: 400px;
  width: 100%;
  padding: 2rem;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
}

h1 {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #d35400;
  outline: none;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #d35400;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
}

button:hover {
  background: #e67e22;
}

.error-message {
  color: red;
  margin-top: 1rem;
}
</style>