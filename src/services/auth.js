import { supabase } from '../lib/supabase'

export const isAuthenticated = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  console.log('isAuthenticated check:', user)
  return !!user
}

export const login = async (email, password) => {
  console.log('Attempting to log in with email:', email)
  const { user, error } = await supabase.auth.signIn({ email, password })
  if (error) {
    console.error('Login error:', error.message)
    throw error
  }
  console.log('User logged in:', user)
  return user
}

export const logout = async () => {
  console.log('Attempting to log out')
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Logout error:', error.message)
    throw error
  }
  console.log('User logged out')
}