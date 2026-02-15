import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/auth'
import { supabase } from '../../lib/supabase'
import LoginForm from './LoginForm'
import { Rocket, ArrowRight } from 'lucide-react'

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-200 border-t-primary-600"></div>
          <p className="text-gray-500 text-sm font-medium">Cargando...</p>
        </div>
      </div>
    )
  }

  if (DEMO_MODE && showDemoPrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="relative z-10 max-w-lg w-full p-6 animate-fade-in">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-10 text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Rocket className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Bitacora de Oportunidades
            </h2>
            <p className="text-sm font-medium text-primary-600 mb-4">
              Universidad EAN - Emprendimiento Sostenible
            </p>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Explora toda la funcionalidad de la plataforma. Analiza ideas,
              valida oportunidades y construye modelos de negocio sostenibles.
            </p>

            <button
              onClick={enterDemoMode}
              className="btn btn-primary btn-lg w-full group mb-4"
            >
              <span className="flex items-center justify-center gap-2">
                Comenzar
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <p className="text-xs text-gray-400">
              Version demo - Para produccion, configura Supabase
            </p>
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
