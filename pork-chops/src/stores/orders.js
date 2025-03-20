// filepath: /pork-chops/pork-chops/src/stores/orders.js
import { createStore } from 'vuex';

const ordersStore = createStore({
  state: {
    orders: [],
  },
  mutations: {
    ADD_ORDER(state, order) {
      state.orders.push(order);
    },
    REMOVE_ORDER(state, orderId) {
      state.orders = state.orders.filter(order => order.id !== orderId);
    },
    SET_ORDERS(state, orders) {
      state.orders = orders;
    },
  },
  actions: {
    addOrder({ commit }, order) {
      commit('ADD_ORDER', order);
    },
    removeOrder({ commit }, orderId) {
      commit('REMOVE_ORDER', orderId);
    },
    fetchOrders({ commit }) {
      // Fetch orders from Supabase or other backend
      // Example: supabase.from('orders').select('*').then(response => commit('SET_ORDERS', response.data));
    },
  },
  getters: {
    allOrders: (state) => state.orders,
  },
});

export default ordersStore;