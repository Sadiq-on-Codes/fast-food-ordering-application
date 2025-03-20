<template>
  <div class="menu-item">
    <h3>{{ item.name }}</h3>
    <p>{{ item.description }}</p>
    <span>{{ item.price | currency }}</span>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.menu-item {
  border: 1px solid #ccc;
  padding: 16px;
  margin: 8px 0;
  border-radius: 8px;
}
</style>