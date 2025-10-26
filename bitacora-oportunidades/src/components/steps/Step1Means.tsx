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

  const currentUserData = step1Data.find(data => data.member_id === user?.id) || {}

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Step1MeansData>({
    resolver: zodResolver(step1MeansSchema),
    defaultValues: {
      who_i_am: '',
      what_i_know: '',
      who_i_know: '',
      what_i_have: '',
    },
  })

  // Reset form when data changes
  useEffect(() => {
    if (currentUserData && Object.keys(currentUserData).length > 0) {
      reset(currentUserData)
    }
  }, [currentUserData, reset])

  const onSubmit = async (data: Step1MeansData) => {
    if (!currentJournal || !user) return
    
    setSaving(true)
    try {
      await saveStep1Data(currentJournal.id, user.id, data)
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
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Paso 1: Medios Personales</h2>
        <p className="mt-2 text-gray-600">
          Según la Teoría Efectual, antes de identificar oportunidades debemos conocer nuestros medios personales.
          Completa la información sobre ti mismo.
        </p>
      </div>


      <div className="bg-white">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full">
            <User className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user?.email}</h3>
            <p className="text-sm text-gray-500">Completa tu información personal</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Quién soy? (Identidad, formación, experiencia)
            </label>
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
              <p className="mt-1 text-sm text-red-600">{errors.who_i_am.message}</p>
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
                .filter(data => data.member_id !== user?.id)
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

        {/* Next button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            className="btn btn-primary flex items-center space-x-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <span>Siguiente</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}