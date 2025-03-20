<template>
  <div>
    <h1>Welcome to the Fast Food Application</h1>
    <MenuList />
  </div>
</template>

<script>
import MenuList from '../components/menu/MenuList.vue';

export default {
  components: {
    MenuList
  }
}
</script>

<style scoped>
/* Add any specific styles for HomeView here */
</style>