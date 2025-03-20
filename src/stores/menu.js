import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchMenuItems() {
      this.loading = true
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .order('category')
        
        if (error) throw error
        this.items = data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async addMenuItem(item) {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .insert(item)
          .select()
        
        if (error) throw error
        this.items.push(data[0])
        return data[0]
      } catch (error) {
        this.error = error.message
        return null
      }
    },

    async updateMenuItem(id, updates) {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .update(updates)
          .eq('id', id)
          .select()
        
        if (error) throw error
        
        const index = this.items.findIndex(item => item.id === id)
        if (index !== -1) {
          this.items[index] = { ...this.items[index], ...updates }
        }
        
        return data[0]
      } catch (error) {
        this.error = error.message
        return null
      }
    },

    async deleteMenuItem(id) {
      try {
        const { error } = await supabase
          .from('menu_items')
          .delete()
          .eq('id', id)
        
        if (error) throw error
        
        this.items = this.items.filter(item => item.id !== id)
        return true
      } catch (error) {
        this.error = error.message
        return false
      }
    }
  }
})