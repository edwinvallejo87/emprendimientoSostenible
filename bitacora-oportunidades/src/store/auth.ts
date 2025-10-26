import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  sendMagicLink: (email: string) => Promise<void>
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,

      signIn: async (email: string, password: string) => {
        set({ loading: true })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          if (error) throw error
          set({ user: data.user, loading: false })
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      signUp: async (email: string, password: string) => {
        set({ loading: true })
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          })
          if (error) throw error
          set({ user: data.user, loading: false })
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      signOut: async () => {
        set({ loading: true })
        try {
          const { error } = await supabase.auth.signOut()
          if (error) throw error
          set({ user: null, loading: false })
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      sendMagicLink: async (email: string) => {
        set({ loading: true })
        try {
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`
            }
          })
          if (error) throw error
          set({ loading: false })
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
)