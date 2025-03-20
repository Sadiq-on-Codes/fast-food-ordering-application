<template>
  <div>
    <h1>Place Your Order</h1>
    <OrderForm @order-placed="handleOrderPlaced" />
    <OrderSummary v-if="orderDetails" :order="orderDetails" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import OrderForm from '../components/orders/OrderForm.vue';
import OrderSummary from '../components/orders/OrderSummary.vue';

const orderDetails = ref(null);

function handleOrderPlaced(order) {
  orderDetails.value = order;
}
</script>

<style scoped>
/* Add any specific styles for the OrderView here */
</style>