import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useJournalStore } from '../../store/journal'
import { step2ProblemSchema, type Step2ProblemData } from '../../lib/validators/step2'
import { CheckCircle, ArrowRight } from 'lucide-react'

interface Step2ProblemProps {
  onNext?: () => void
}

export default function Step2Problem({ onNext }: Step2ProblemProps) {
  const {
    currentJournal,
    currentIdea,
    step2Data,
    saveStep2Data,
    saveStep2DataForIdea,
  } = useJournalStore()

  const [saving, setSaving] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<Step2ProblemData>({
    resolver: zodResolver(step2ProblemSchema),
    values: step2Data || {},
    mode: 'onChange'
  })

  const watchedValues = watch()

  const onSubmit = async (data: Step2ProblemData) => {
    if (!currentIdea) return
    
    setSaving(true)
    try {
      await saveStep2DataForIdea(currentIdea.id, data)
      if (onNext) {
        onNext()
      }
    } catch (error) {
      console.error('Error saving step 2 data:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!currentIdea) {
    return <div>No hay idea seleccionada</div>
  }

  const getFieldStatus = (fieldName: keyof Step2ProblemData) => {
    const value = watchedValues[fieldName]
    if (!value || value.trim().length < 10) return 'empty'
    return 'complete'
  }

  const getFieldIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <div className="h-4 w-4 border border-gray-300 rounded-full" />
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6">
      <div className="mb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl text-gray-900 mb-3">El Problema que Resuelves</h1>
          <p className="text-gray-600 text-lg">
            Define con claridad el problema real que tu idea soluciona
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
          {saving && (
            <div className="text-center py-2 text-gray-500 text-sm">
              Guardando...
            </div>
          )}
            {/* Title Field */}
            <div>
              <label className="block text-gray-900 mb-6 text-lg">
                Nombra el problema
              </label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    value={field.value || ''}
                    type="text"
                    className="input"
                    placeholder="Ej: Desperdicio de alimentos en restaurantes locales"
                  />
                )}
              />
              {errors.title && (
                <p className="mt-3 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-gray-900 mb-6 text-lg">
                Describe el problema
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    value={field.value || ''}
                    rows={6}
                    className="textarea"
                    placeholder="Ej: Los restaurantes desechan 30% de sus compras semanales. No hay forma eficiente de redistribuir excedentes..."
                  />
                )}
              />
              {errors.description && (
                <p className="mt-3 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Affected Field */}
            <div>
              <label className="block text-gray-900 mb-6 text-lg">
                A quien afecta?
              </label>
              <Controller
                name="affected"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    value={field.value || ''}
                    rows={5}
                    className="textarea"
                    placeholder="Ej: Restaurantes pequenos, familias de bajos ingresos, bancos de alimentos locales..."
                  />
                )}
              />
              {errors.affected && (
                <p className="mt-3 text-sm text-red-600">{errors.affected.message}</p>
              )}
            </div>

            {/* Relevance Field */}
            <div>
              <label className="block text-gray-900 mb-6 text-lg">
                Por que importa resolver esto?
              </label>
              <Controller
                name="relevance"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    value={field.value || ''}
                    rows={5}
                    className="textarea"
                    placeholder="Ej: Genera $50M en perdidas anuales, contribuye a 15% de emisiones CO2 de la cadena alimentaria..."
                  />
                )}
              />
              {errors.relevance && (
                <p className="mt-3 text-sm text-red-600">{errors.relevance.message}</p>
              )}
            </div>

            {/* Link to Means Field */}
            <div>
              <label className="block text-gray-900 mb-6 text-lg">
                Como conecta con tus recursos?
              </label>
              <Controller
                name="link_to_means"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    value={field.value || ''}
                    rows={5}
                    className="textarea"
                    placeholder="Ej: Mi experiencia en logistica me da ventaja para optimizar rutas de recoleccion..."
                  />
                )}
              />
              {errors.link_to_means && (
                <p className="mt-3 text-sm text-red-600">{errors.link_to_means.message}</p>
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