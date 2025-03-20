<template>
  <div>
    <h1>Order Management</h1>
    <ul>
      <li v-for="order in orders" :key="order.id">
        <p>Order ID: {{ order.id }}</p>
        <p>Customer Name: {{ order.customerName }}</p>
        <p>Items: {{ order.items.join(', ') }}</p>
        <button @click="deleteOrder(order.id)">Delete Order</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSupabase } from '@/composables/useSupabase';

const { supabase } = useSupabase();
const orders = ref([]);

const fetchOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*');

  if (error) {
    console.error('Error fetching orders:', error);
  } else {
    orders.value = data;
  }
};

const deleteOrder = async (orderId) => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId);

  if (error) {
    console.error('Error deleting order:', error);
  } else {
    fetchOrders(); // Refresh the order list
  }
};

onMounted(fetchOrders);
</script>

<style scoped>
/* Add any specific styles for the Order Management component here */
</style>