<template>
  <div class="order-summary">
    <h2>Order Summary</h2>
    <div v-if="order">
      <h3>Your Order</h3>
      <ul>
        <li v-for="item in order.items" :key="item.id">
          {{ item.name }} - Quantity: {{ item.quantity }}
        </li>
      </ul>
      <p>Total: {{ order.total }}</p>
    </div>
    <div v-else>
      <p>No order details available.</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.order-summary {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}
</style>