import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/auth'
import { supabase } from '../../lib/supabase'
import LoginForm from './LoginForm'

interface AuthGuardProps {
  children: React.ReactNode
}

// Demo mode: Skip auth for development/testing
const DEMO_MODE = true

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, setUser, setLoading } = useAuthStore()
  const [showDemoPrompt, setShowDemoPrompt] = useState(() => {
    if (!DEMO_MODE) return false
    // Check if user has already entered demo mode
    return !localStorage.getItem('demo-mode-entered')
  })

  useEffect(() => {
    if (DEMO_MODE) {
      // If user already entered demo mode, auto-login
      if (localStorage.getItem('demo-mode-entered')) {
        const demoUser = {
          id: 'demo-user-123',
          email: 'demo@ean.edu.co',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setUser(demoUser as any)
        setLoading(false)
        setShowDemoPrompt(false)
      } else {
        setLoading(false)
      }
      return
    }

    // Real auth flow
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [setUser, setLoading])

  const enterDemoMode = () => {
    const demoUser = {
      id: 'demo-user-123',
      email: 'demo@ean.edu.co',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setUser(demoUser as any)
    localStorage.setItem('demo-mode-entered', 'true')
    setShowDemoPrompt(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (DEMO_MODE && showDemoPrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              🎯 Modo Demo
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Bitácora de Oportunidades - Universidad EAN
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Esta es una versión de demostración. Puedes explorar toda la funcionalidad 
              sin necesidad de configurar Supabase.
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={enterDemoMode}
              className="w-full btn btn-primary"
            >
              🚀 Entrar al Demo
            </button>
            
            <div className="text-center">
              <p className="text-xs text-gray-400">
                Para uso en producción, configura las credenciales reales de Supabase
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user && !DEMO_MODE) {
    return <LoginForm />
  }

  return <>{children}</>
}