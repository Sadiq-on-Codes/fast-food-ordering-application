import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    currentOrder: [],
    orders: [],
    loading: false,
    error: null
  }),

  actions: {
    addToOrder(item) {
      this.currentOrder.push(item)
    },

    async submitOrder(orderDetails) {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('orders')
          .insert({
            ...orderDetails,
            items: this.currentOrder,
            status: 'pending'
          })
          .select()
        
        if (error) throw error
        this.currentOrder = []
        return data[0]
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
})