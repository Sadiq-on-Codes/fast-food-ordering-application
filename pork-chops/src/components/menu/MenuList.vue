<template>
  <div class="menu-list">
    <h2>Menu</h2>
    <ul>
      <MenuItem v-for="item in menuItems" :key="item.id" :item="item" />
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSupabase } from '@/composables/useSupabase';
import MenuItem from './MenuItem.vue';

const { supabase } = useSupabase();
const menuItems = ref([]);

const fetchMenuItems = async () => {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*');

  if (error) {
    console.error('Error fetching menu items:', error);
  } else {
    menuItems.value = data;
  }
};

onMounted(() => {
  fetchMenuItems();
});
</script>

<style scoped>
.menu-list {
  padding: 20px;
}
</style>