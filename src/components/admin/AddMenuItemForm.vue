<template>
  <div class="add-item-form-container">
    <form @submit.prevent="handleSubmit" class="add-item-form">
      <h3>Add New Menu Item</h3>
      
      <div class="form-group">
        <label for="itemName">Name</label>
        <input 
          id="itemName"
          v-model="newItem.name"
          type="text"
          required
        />
      </div>

      <div class="form-group">
        <label for="itemDescription">Description</label>
        <textarea
          id="itemDescription"
          v-model="newItem.description"
          rows="3"
          required
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="itemPrice">Price (₵)</label>
          <input
            id="itemPrice"
            v-model="newItem.price"
            type="number"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div class="form-group">
          <label for="itemCategory">Category</label>
          <select 
            id="itemCategory"
            v-model="newItem.category"
            required
          >
            <option value="">Select Category</option>
            <option value="main">Main Course</option>
            <option value="side">Side Dish</option>
            <option value="dessert">Dessert</option>
            <option value="beverage">Beverage</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="itemImage">Image</label>
        <input
          type="file"
          id="itemImage"
          accept="image/*"
          @change="handleFileUpload"
          required
        />
        <div v-if="uploadInProgress" class="upload-status">
          Uploading image...
        </div>
      </div>

      <div v-if="previewImage || newItem.image_url" class="image-preview">
        <img 
          :src="newItem.image_url || previewImage" 
          :alt="newItem.name || 'Preview'"
          @error="(e) => e.target.src = defaultImage"
        />
        <div v-if="uploadInProgress" class="upload-overlay">
          <span class="spinner"></span>
          <span>Uploading...</span>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="$emit('close')" class="cancel-button">
          Cancel
        </button>
        <button 
          type="submit" 
          :disabled="loading || uploadInProgress || !newItem.image_url"
          class="submit-button"
        >
          <span v-if="uploadInProgress">Uploading Image...</span>
          <span v-else-if="loading">Adding Item...</span>
          <span v-else>Add Item</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMenuStore } from '../../stores/menu'
import { supabase } from '../../lib/supabase'

const emit = defineEmits(['close', 'item-added'])
const menuStore = useMenuStore()
const loading = ref(false)
const uploadInProgress = ref(false)
const previewImage = ref('')

const newItem = ref({
  name: '',
  description: '',
  price: '',
  category: '',
  image_url: '',
  active: true
})

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  previewImage.value = URL.createObjectURL(file)
  uploadInProgress.value = true

  try {
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`
    
    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from('menu-images')
      .getPublicUrl(fileName)

    if (!urlData?.publicUrl) throw new Error('Failed to get public URL')

    newItem.value.image_url = urlData.publicUrl
    console.log('Image uploaded successfully:', urlData.publicUrl)
  } catch (error) {
    console.error('Upload error:', error)
    newItem.value.image_url = ''
  } finally {
    uploadInProgress.value = false
  }
}

const handleSubmit = async () => {
  if (loading.value || uploadInProgress.value) return
  if (!newItem.value.image_url) {
    console.error('No image URL available')
    return
  }

  loading.value = true
  try {
    const itemToAdd = {
      ...newItem.value,
      price: parseFloat(newItem.value.price)
    }
    console.log('Submitting item:', itemToAdd)
    
    const addedItem = await menuStore.addMenuItem(itemToAdd)
    
    // Update local state with the newly added item
    menuStore.items.push(addedItem)
    
    if (previewImage.value) {
      URL.revokeObjectURL(previewImage.value)
      previewImage.value = ''
    }
    
    emit('item-added')
    emit('close')
  } catch (error) {
    console.error('Failed to add item:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.add-item-form-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  color: #333;
}

.add-item-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  font-weight: 500;
  color: #374151;
}

input,
textarea,
select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #d35400;
}

.image-preview {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #d1d5db;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-button,
.submit-button {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button {
  background: none;
  border: 1px solid #d1d5db;
  color: #374151;
}

.submit-button {
  background: #d35400;
  border: none;
  color: white;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>