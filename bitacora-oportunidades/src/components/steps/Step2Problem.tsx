import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useJournalStore } from '../../store/journal'
import { step2ProblemSchema, type Step2ProblemData } from '../../lib/validators/step2'
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'

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

  const getFieldStatus = (fieldName: keyof Step2ProblemData, minLength = 200) => {
    const value = watchedValues[fieldName]
    if (!value) return 'empty'
    if (fieldName === 'title') return value.trim().length > 0 ? 'complete' : 'empty'
    return value.trim().length >= minLength ? 'complete' : 'incomplete'
  }

  const getFieldIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'incomplete':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <div className="h-4 w-4 border border-gray-300 rounded-full" />
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6">
      <div className="mb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl text-stone-900 mb-3">Problema o Necesidad (Affordable Loss)</h1>
          <p className="text-stone-600 text-lg">
            Identifica el problema que resuelve tu idea. ¿Cuánto puedes permitirte perder explorando esta oportunidad?
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
          {saving && (
            <div className="text-center py-2 text-stone-500 text-sm">
              Guardando...
            </div>
          )}
            {/* Title Field */}
            <div>
              <label className="block text-stone-900 mb-6 text-lg">
                Título del problema
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
                    placeholder="Describe el problema en una frase clara"
                  />
                )}
              />
              {errors.title && (
                <p className="mt-3 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-stone-900 mb-6 text-lg">
                Descripción del problema
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
                    placeholder="Describe en detalle las manifestaciones, frecuencia, contexto e impacto del problema..."
                  />
                )}
              />
              {errors.description && (
                <p className="mt-3 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Affected Field */}
            <div>
              <label className="block text-stone-900 mb-6 text-lg">
                ¿Quiénes se ven afectados?
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
                    placeholder="Grupos de personas, organizaciones o sectores afectados..."
                  />
                )}
              />
              {errors.affected && (
                <p className="mt-3 text-sm text-red-600">{errors.affected.message}</p>
              )}
            </div>

            {/* Relevance Field */}
            <div>
              <label className="block text-stone-900 mb-6 text-lg">
                ¿Por qué es relevante?
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
                    placeholder="Explica el impacto económico, social o ambiental..."
                  />
                )}
              />
              {errors.relevance && (
                <p className="mt-3 text-sm text-red-600">{errors.relevance.message}</p>
              )}
            </div>

            {/* Link to Means Field */}
            <div>
              <label className="block text-stone-900 mb-6 text-lg">
                Relación con tus medios personales
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
                    placeholder="Conecta con tus conocimientos, contactos y recursos del Paso 1..."
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
                {saving ? 'Guardando...' : 'Continuar al Paso 3'}
              </button>
            </div>
        </form>
      </div>
    </div>
  )
}