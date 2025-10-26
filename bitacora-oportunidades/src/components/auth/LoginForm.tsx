import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../../store/auth'
import { Mail, Lock, Eye, EyeOff, BookOpen, Sparkles } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [useMagicLink, setUseMagicLink] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const { signIn, signUp, sendMagicLink, loading } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      if (useMagicLink) {
        await sendMagicLink(data.email)
        setMagicLinkSent(true)
        return
      }

      if (isSignUp) {
        await signUp(data.email, data.password)
      } else {
        await signIn(data.email, data.password)
      }
    } catch (error: any) {
      setError('root', { 
        message: error.message || 'Error de autenticación' 
      })
    }
  }

  if (magicLinkSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-success-50">
        <div className="max-w-md w-full">
          <div className="card card-body text-center animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              ¡Revisa tu email!
            </h2>
            <p className="text-gray-600 mb-6">
              Te hemos enviado un enlace mágico para iniciar sesión de forma segura
            </p>
            <button
              onClick={() => {
                setMagicLinkSent(false)
                setUseMagicLink(false)
              }}
              className="btn btn-outline"
            >
              Volver al login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-success-50 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div className="p-2 bg-gradient-to-br from-success-400 to-success-500 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-primary-700 to-success-700 bg-clip-text text-transparent mb-2">
            Emprendimiento Sostenible
          </h1>
          <p className="text-gray-600 font-medium">
            Bitácora de Oportunidades de Innovación
          </p>
        </div>
        
        <div className="card card-body animate-slide-up">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
            </h2>
            <p className="text-sm text-gray-600">
              {isSignUp 
                ? 'Únete para crear bitácoras de oportunidades'
                : 'Accede a tus bitácoras de oportunidades'
              }
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    autoComplete="email"
                    className="input pl-10"
                    placeholder="tu@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-error-600">{errors.email.message}</p>
                )}
              </div>

              {!useMagicLink && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={isSignUp ? 'new-password' : 'current-password'}
                      className="input pl-10 pr-10"
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-error-600">{errors.password.message}</p>
                  )}
                </div>
              )}
            </div>

            {errors.root && (
              <div className="rounded-lg bg-error-50 border border-error-200 p-4">
                <p className="text-sm text-error-800">{errors.root.message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full btn-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </div>
              ) : useMagicLink ? (
                <>Enviar enlace mágico ✨</>
              ) : isSignUp ? (
                'Crear mi cuenta'
              ) : (
                'Iniciar sesión'
              )}
            </button>

            <div className="text-center space-y-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setUseMagicLink(!useMagicLink)}
                className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                {useMagicLink ? '🔑 Usar contraseña' : '✨ Usar enlace mágico'}
              </button>

              {!useMagicLink && (
                <div>
                  <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {isSignUp 
                      ? '¿Ya tienes cuenta? Inicia sesión' 
                      : '¿No tienes cuenta? Crear una nueva'
                    }
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}