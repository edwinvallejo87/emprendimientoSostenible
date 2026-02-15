import { useState, useEffect, useMemo } from 'react'
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
    currentIdea,
    step1Data,
    saveStep1Data,
    saveStep1DataForIdea,
  } = useJournalStore()

  const [saving, setSaving] = useState(false)

  // Use demo user ID for development
  const demoUserId = '00000000-0000-0000-0000-000000000000'
  
  const formValues = useMemo(() => {
    const currentUserData = step1Data.find(data => data.member_id === demoUserId) || {}
    return {
      who_i_am: currentUserData.who_i_am || '',
      what_i_know: currentUserData.what_i_know || '',
      who_i_know: currentUserData.who_i_know || '',
      what_i_have: currentUserData.what_i_have || '',
    }
  }, [step1Data, demoUserId])

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<Step1MeansData>({
    resolver: zodResolver(step1MeansSchema),
    values: formValues,
    mode: 'onChange'
  })

  const onSubmit = async (data: Step1MeansData) => {
    if (!currentIdea) return
    
    setSaving(true)
    try {
      await saveStep1DataForIdea(currentIdea.id, demoUserId, data)
      if (onNext) {
        onNext()
      }
    } catch (error) {
      console.error('Error saving step 1 data:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!currentIdea) {
    return <div>No hay idea seleccionada</div>
  }

  return (
    <div className="max-w-3xl mx-auto px-6">
      <div className="mb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl text-gray-900 mb-3">Tus Recursos como Emprendedor</h1>
          <p className="text-gray-600 text-lg">
            Haz un inventario de lo que ya tienes para arrancar
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
          {saving && (
            <div className="text-center py-2 text-gray-500 text-sm">
              Guardando...
            </div>
          )}
            <div>
              <label className="block text-gray-900 mb-6 text-lg">
                Tu perfil profesional
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
                    placeholder="Ej: Ingeniero de software con 5 anos en startups, apasionado por la sostenibilidad..."
                  />
                )}
              />
              {errors.who_i_am && (
                <p className="mt-3 text-sm text-red-600">{errors.who_i_am.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-900 mb-6 text-lg">
                Tus habilidades y conocimientos
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
                    placeholder="Ej: Desarrollo web, marketing digital, gestion de proyectos agiles, analisis de datos..."
                  />
                )}
              />
              {errors.what_i_know && (
                <p className="mt-3 text-sm text-red-600">{errors.what_i_know.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-900 mb-6 text-lg">
                Tu red de contactos
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
                    placeholder="Ej: 3 mentores en la industria, contacto en un fondo de inversion, comunidad de 200 emprendedores..."
                  />
                )}
              />
              {errors.who_i_know && (
                <p className="mt-3 text-sm text-red-600">{errors.who_i_know.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-900 mb-6 text-lg">
                Tus recursos disponibles
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
                    placeholder="Ej: Laptop, $2,000 de ahorro, acceso a coworking, 20 horas semanales libres..."
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
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
        </form>
      </div>
    </div>
  )
}