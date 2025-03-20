<template>
  <div class="admin-view">
    <h1>Admin Panel</h1>
    <MenuEditor />
    <OrderManagement />
  </div>
</template>

<script setup>
import MenuEditor from '@/components/admin/MenuEditor.vue';
import OrderManagement from '@/components/admin/OrderManagement.vue';
</script>

<style scoped>
.admin-view {
  padding: 20px;
}
</style>