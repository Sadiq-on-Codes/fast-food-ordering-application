import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export const useOrdersStore = defineStore('orders', () => {
  const currentOrder = ref([])
  const orders = ref([])
  const loading = ref(false)

  // Load initial state from session storage
  const savedOrder = sessionStorage.getItem('currentOrder')
  if (savedOrder) {
    currentOrder.value = JSON.parse(savedOrder)
  }

  const addToOrder = (item) => {
    const existingItem = currentOrder.value.find(i => i.id === item.id)
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1
    } else {
      currentOrder.value.push({ ...item, quantity: 1 })
    }
    sessionStorage.setItem('currentOrder', JSON.stringify(currentOrder.value))
  }

  const removeFromOrder = (index) => {
    currentOrder.value.splice(index, 1)
    sessionStorage.setItem('currentOrder', JSON.stringify(currentOrder.value))
  }

  const updateQuantity = (index, quantity) => {
    if (quantity < 1) {
      removeFromOrder(index)
    } else {
      currentOrder.value[index].quantity = quantity
      sessionStorage.setItem('currentOrder', JSON.stringify(currentOrder.value))
    }
  }

  const clearOrder = () => {
    currentOrder.value = []
    sessionStorage.removeItem('currentOrder')
  }

  const submitOrder = async (orderDetails) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          customer_name: orderDetails.customer_name,
          customer_email: orderDetails.customer_email,
          customer_location: orderDetails.customer_location,
          notes: orderDetails.notes,
          total_amount: orderDetails.total_amount,
          subtotal: orderDetails.subtotal,
          tax: orderDetails.tax,
          items: orderDetails.items,
          status: 'pending',
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      // Clear the current order after successful submission
      currentOrder.value = []
      sessionStorage.removeItem('currentOrder')
      
      return data
    } catch (error) {
      console.error('Error submitting order:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchOrders = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      orders.value = data
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      loading.value = false
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

      if (error) throw error
      await fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  return {
    currentOrder,
    orders,
    loading,
    addToOrder,
    removeFromOrder,
    updateQuantity,
    clearOrder,
    submitOrder,
    fetchOrders,
    updateOrderStatus
  }
})