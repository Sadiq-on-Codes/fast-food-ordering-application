import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export const useMenuStore = defineStore('menu', () => {
  const items = ref([])
  const loading = ref(false)

  const fetchMenuItems = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category')
      
      if (error) throw error
      items.value = data
    } catch (error) {
      console.error('Error fetching menu items:', error)
    } finally {
      loading.value = false
    }
  }

  const addMenuItem = async (item) => {
    const { data, error } = await supabase
      .from('menu_items')
      .insert([
        {
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          image_url: item.image_url, // store directly without modifications
          active: item.active
        }
      ])
      .select()

    if (error) throw error
    return data
  }

  const toggleItemAvailability = async (item) => {
    try {
      loading.value = true
      const newActive = !item.active

      // Update in Supabase
      const { error } = await supabase
        .from('menu_items')
        .update({ active: newActive })
        .eq('id', item.id)

      if (error) throw error

      // Fetch the updated item to ensure sync
      const { data: updatedItem, error: fetchError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', item.id)
        .single()

      if (fetchError) throw fetchError

      // Update local state with fresh data
      const index = items.value.findIndex(i => i.id === item.id)
      if (index !== -1 && updatedItem) {
        items.value[index] = updatedItem
      }

    } catch (error) {
      console.error('Error toggling availability:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteMenuItem = async (itemId) => {
    try {
      loading.value = true

      // Delete in Supabase
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error

      // Update local state
      items.value = items.value.filter(item => item.id !== itemId)

    } catch (error) {
      console.error('Error deleting menu item:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    fetchMenuItems,
    addMenuItem,
    toggleItemAvailability,
    deleteMenuItem
  }
})