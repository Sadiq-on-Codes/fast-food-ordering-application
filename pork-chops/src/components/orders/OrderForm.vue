<template>
  <form @submit.prevent="submitOrder">
    <h2>Place Your Order</h2>
    <div>
      <label for="customerName">Name:</label>
      <input type="text" id="customerName" v-model="order.customerName" required />
    </div>
    <div>
      <label for="menuItem">Menu Item:</label>
      <select id="menuItem" v-model="order.menuItem" required>
        <option v-for="item in menuItems" :key="item.id" :value="item.name">{{ item.name }}</option>
      </select>
    </div>
    <div>
      <label for="quantity">Quantity:</label>
      <input type="number" id="quantity" v-model="order.quantity" min="1" required />
    </div>
    <button type="submit">Submit Order</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const order = ref({
  customerName: '',
  menuItem: '',
  quantity: 1,
});

const menuItems = store.state.menu.items;

const submitOrder = () => {
  store.dispatch('orders/placeOrder', order.value);
  order.value = { customerName: '', menuItem: '', quantity: 1 }; // Reset form
};
</script>

<style scoped>
/* Add any specific styles for the OrderForm component here */
</style>