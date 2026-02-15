import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../../store/auth'
import { Mail, Lock, Eye, EyeOff, Rocket, Leaf, ArrowRight } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres'),
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
        message: error.message || 'Error de autenticacion'
      })
    }
  }

  if (magicLinkSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 relative">
        <div className="relative z-10 max-w-md w-full p-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-primary-600 rounded-md flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Revisa tu email
            </h2>
            <p className="text-gray-600 mb-6">
              Te hemos enviado un enlace magico para iniciar sesion de forma segura
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
    <div className="min-h-screen flex">
      {/* Left: Hero panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-950">
        {/* Atmospheric orbs */}
        <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[5%] right-[10%] w-[300px] h-[300px] bg-primary-600/8 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            <div className="p-2.5 bg-primary-600 rounded-md inline-flex">
              <Rocket className="h-6 w-6 text-white" />
            </div>
          </div>

          <div className="animate-slide-up">
            <h1 className="text-5xl font-bold tracking-tight leading-[1.1] mb-5">
              Emprende con<br />
              <span className="text-gradient bg-gradient-to-r from-primary-400 to-primary-300">
                proposito
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-md leading-relaxed">
              Transforma tus ideas en negocios sostenibles. Analiza, valida y construye
              oportunidades que generan impacto positivo.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
              <span>7 Pasos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
              <span>Sostenibilidad</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
              <span>IA Integrada</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile-only branding */}
          <div className="lg:hidden text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-primary-600 rounded-md">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <div className="p-2 bg-primary-600 rounded-md">
                <Leaf className="h-5 w-5 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Emprendimiento Sostenible
            </h1>
            <p className="text-sm text-gray-500">
              Bitacora de Oportunidades
            </p>
          </div>

          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                {isSignUp ? 'Crear cuenta' : 'Bienvenido de vuelta'}
              </h2>
              <p className="text-gray-500">
                {isSignUp
                  ? 'Unete para crear bitacoras de oportunidades'
                  : 'Accede a tus bitacoras de oportunidades'
                }
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electronico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('email')}
                      type="email"
                      autoComplete="email"
                      className="input pl-11"
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
                      Contrasena
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        autoComplete={isSignUp ? 'new-password' : 'current-password'}
                        className="input pl-11 pr-11"
                        placeholder="Minimo 6 caracteres"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-600 transition-colors"
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
                <div className="rounded-md bg-error-50 border border-error-200 p-4">
                  <p className="text-sm text-error-800">{errors.root.message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full btn-lg group"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </div>
                ) : useMagicLink ? (
                  <span className="flex items-center gap-2">
                    Enviar enlace magico
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                ) : isSignUp ? (
                  <span className="flex items-center gap-2">
                    Crear mi cuenta
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Iniciar sesion
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>

              <div className="text-center space-y-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setUseMagicLink(!useMagicLink)}
                  className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
                >
                  {useMagicLink ? 'Usar contrasena' : 'Usar enlace magico'}
                </button>

                {!useMagicLink && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {isSignUp
                        ? 'Ya tienes cuenta? Inicia sesion'
                        : 'No tienes cuenta? Crear una nueva'
                      }
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
