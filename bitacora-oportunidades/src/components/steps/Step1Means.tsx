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
    <div className="max-w-3xl mx-auto px-6">
      <div className="mb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl text-stone-900 mb-3">Medios Personales</h1>
          <p className="text-stone-600 text-lg">
            Identifica tus recursos, conocimientos y contactos disponibles
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
          {saving && (
            <div className="text-center py-2 text-stone-500 text-sm">
              Guardando...
            </div>
          )}
            <div>
              <label className="block text-stone-900 mb-6 text-lg">
                ¿Quién soy?
              </label>
              <Controller
                name="who_i_am"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    value={field.value || ''}
                    rows={5}
                    className="textarea"
                    placeholder="Describe tu identidad profesional, formación académica, experiencia laboral..."
                  />
                )}
              />
              {errors.who_i_am && (
                <p className="mt-3 text-sm text-red-600">{errors.who_i_am.message}</p>
              )}
            </div>

            <div>
              <label className="block text-stone-900 mb-6 text-lg">
                ¿Qué sé?
              </label>
              <Controller
                name="what_i_know"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    value={field.value || ''}
                    rows={5}
                    className="textarea"
                    placeholder="Lista tus conocimientos técnicos, habilidades blandas, expertise..."
                  />
                )}
              />
              {errors.what_i_know && (
                <p className="mt-3 text-sm text-red-600">{errors.what_i_know.message}</p>
              )}
            </div>

            <div>
              <label className="block text-stone-900 mb-6 text-lg">
                ¿A quién conozco?
              </label>
              <Controller
                name="who_i_know"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    value={field.value || ''}
                    rows={5}
                    className="textarea"
                    placeholder="Describe tu red de contactos profesionales, mentores, colegas..."
                  />
                )}
              />
              {errors.who_i_know && (
                <p className="mt-3 text-sm text-red-600">{errors.who_i_know.message}</p>
              )}
            </div>

            <div>
              <label className="block text-stone-900 mb-6 text-lg">
                ¿Qué tengo?
              </label>
              <Controller
                name="what_i_have"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    value={field.value || ''}
                    rows={5}
                    className="textarea"
                    placeholder="Lista tus recursos disponibles: capital, equipos, herramientas, espacios, tiempo..."
                  />
                )}
              />
              {errors.what_i_have && (
                <p className="mt-3 text-sm text-red-600">{errors.what_i_have.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center pt-8">
              <button
                type="submit"
                disabled={!isValid || saving}
                className="btn btn-primary disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Continuar al Paso 2'}
              </button>
            </div>
        </form>
      </div>
    </div>
  )
}