<template>
  <div>
    <h2>Edit Menu Item</h2>
    <form @submit.prevent="updateMenuItem">
      <div>
        <label for="name">Name:</label>
        <input type="text" v-model="menuItem.name" id="name" required />
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea v-model="menuItem.description" id="description" required></textarea>
      </div>
      <div>
        <label for="price">Price:</label>
        <input type="number" v-model="menuItem.price" id="price" required />
      </div>
      <button type="submit">Update Menu Item</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSupabase } from '@/composables/useSupabase';

const { supabase } = useSupabase();
const menuItem = ref({
  name: '',
  description: '',
  price: 0,
});

const updateMenuItem = async () => {
  const { data, error } = await supabase
    .from('menu')
    .update(menuItem.value)
    .match({ id: menuItem.value.id });

  if (error) {
    console.error('Error updating menu item:', error);
  } else {
    console.log('Menu item updated:', data);
  }
};
</script>

<style scoped>
/* Add any specific styles for MenuEditor here */
</style>