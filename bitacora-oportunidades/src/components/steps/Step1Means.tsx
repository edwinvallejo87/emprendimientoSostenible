import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useJournalStore } from '../../store/journal'
import { useAuthStore } from '../../store/auth'
import { step1MeansSchema, type Step1MeansData } from '../../lib/validators/step1'
import { User, ArrowRight } from 'lucide-react'

interface Step1MeansProps {
  onNext?: () => void
}

export default function Step1Means({ onNext }: Step1MeansProps) {
  const { user } = useAuthStore()
  const {
    currentJournal,
    step1Data,
    saveStep1Data,
  } = useJournalStore()

  const [saving, setSaving] = useState(false)

  // Use demo user ID for development
  const demoUserId = '00000000-0000-0000-0000-000000000000'
  const currentUserData = step1Data.find(data => data.member_id === demoUserId) || {}

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step1MeansData>({
    resolver: zodResolver(step1MeansSchema),
    defaultValues: {
      who_i_am: currentUserData.who_i_am || '',
      what_i_know: currentUserData.what_i_know || '',
      who_i_know: currentUserData.who_i_know || '',
      what_i_have: currentUserData.what_i_have || '',
    },
    mode: 'onChange'
  })

  const onSubmit = async (data: Step1MeansData) => {
    if (!currentJournal) return
    
    setSaving(true)
    try {
      await saveStep1Data(currentJournal.id, demoUserId, data)
      if (onNext) {
        onNext()
      }
    } catch (error) {
      console.error('Error saving step 1 data:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!currentJournal) {
    return <div>No hay bitácora seleccionada</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-card p-8 mb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            Paso 1: Medios Personales
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Según la Teoría Efectual, antes de identificar oportunidades debemos conocer nuestros medios personales.
          </p>
        </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {saving && (
          <div className="flex items-center space-x-2 text-primary-600 bg-primary-50 p-3 rounded-lg animate-fade-in mb-6">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
            <span className="text-sm font-medium">Guardando...</span>
          </div>
        )}
        <div className="flex items-center space-x-3 mb-8 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200">
          <div className="flex items-center justify-center w-12 h-12 bg-primary-500 rounded-full">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Usuario Demo</h3>
            <p className="text-sm text-primary-700">Completa tu información personal para el análisis efectual</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <label className="text-lg font-semibold text-gray-900 mb-4 block">
              ¿Quién soy?
            </label>
            <p className="text-sm text-gray-600 mb-4">Identidad, formación, experiencia</p>
            <Controller
              name="who_i_am"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  value={field.value || ''}
                  rows={4}
                  className="textarea"
                  placeholder="Describe tu identidad profesional, formación académica, experiencia laboral..."
                />
              )}
            />
            {errors.who_i_am && (
              <p className="mt-2 text-sm text-error-600 font-medium">{errors.who_i_am.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Qué sé? (Conocimientos, habilidades, competencias)
            </label>
            <Controller
              name="what_i_know"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  value={field.value || ''}
                  rows={4}
                  className="textarea"
                  placeholder="Lista tus conocimientos técnicos, habilidades blandas, expertise en áreas específicas..."
                />
              )}
            />
            {errors.what_i_know && (
              <p className="mt-1 text-sm text-red-600">{errors.what_i_know.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿A quién conozco? (Red de contactos)
            </label>
            <Controller
              name="who_i_know"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  value={field.value || ''}
                  rows={4}
                  className="textarea"
                  placeholder="Describe tu red de contactos profesionales, mentores, colegas, familiares con experiencia..."
                />
              )}
            />
            {errors.who_i_know && (
              <p className="mt-1 text-sm text-red-600">{errors.who_i_know.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Qué tengo? (Recursos físicos, financieros, tecnológicos)
            </label>
            <Controller
              name="what_i_have"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  value={field.value || ''}
                  rows={4}
                  className="textarea"
                  placeholder="Lista tus recursos disponibles: capital, equipos, herramientas, espacios, tiempo..."
                />
              )}
            />
            {errors.what_i_have && (
              <p className="mt-1 text-sm text-red-600">{errors.what_i_have.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">💡 Consejos para completar este paso:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Sé honesto y específico sobre tus capacidades actuales</li>
            <li>• Incluye tanto recursos tangibles como intangibles</li>
            <li>• Piensa en contactos que podrían ser relevantes para emprendimiento</li>
            <li>• Considera habilidades que has desarrollado fuera del ámbito profesional</li>
          </ul>
        </div>

        {/* Team members summary */}
        {step1Data.length > 1 && (
          <div className="mt-8">
            <h4 className="font-medium text-gray-900 mb-4">Otros miembros del equipo:</h4>
            <div className="space-y-4">
              {step1Data
                .filter(data => data.member_id !== demoUserId)
                .map(data => (
                  <div key={data.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900">Miembro del equipo</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {data.who_i_am && (
                        <div>
                          <span className="font-medium text-gray-700">Quién es:</span>
                          <p className="text-gray-600 mt-1">{data.who_i_am}</p>
                        </div>
                      )}
                      {data.what_i_know && (
                        <div>
                          <span className="font-medium text-gray-700">Qué sabe:</span>
                          <p className="text-gray-600 mt-1">{data.what_i_know}</p>
                        </div>
                      )}
                      {data.who_i_know && (
                        <div>
                          <span className="font-medium text-gray-700">A quién conoce:</span>
                          <p className="text-gray-600 mt-1">{data.who_i_know}</p>
                        </div>
                      )}
                      {data.what_i_have && (
                        <div>
                          <span className="font-medium text-gray-700">Qué tiene:</span>
                          <p className="text-gray-600 mt-1">{data.what_i_have}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center pt-8 mt-8 border-t border-gray-200">
          <button
            type="submit"
            disabled={!isValid || saving}
            className="btn btn-primary btn-lg px-8 py-4 text-lg font-semibold flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Guardando paso 1...</span>
              </>
            ) : (
              <>
                <span>Continuar al Paso 2</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </form>
      </div>
    </div>
  )
}