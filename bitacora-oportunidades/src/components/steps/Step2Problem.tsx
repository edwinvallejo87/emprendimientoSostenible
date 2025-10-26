import { useState } from 'react'
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
    step2Data,
    saveStep2Data,
  } = useJournalStore()

  const [saving, setSaving] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<Step2ProblemData>({
    resolver: zodResolver(step2ProblemSchema),
    defaultValues: step2Data || {},
    mode: 'onChange'
  })

  const watchedValues = watch()

  const onSubmit = async (data: Step2ProblemData) => {
    if (!currentJournal) return
    
    setSaving(true)
    try {
      await saveStep2Data(currentJournal.id, data)
      if (onNext) {
        onNext()
      }
    } catch (error) {
      console.error('Error saving step 2 data:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!currentJournal) {
    return <div>No hay bitácora seleccionada</div>
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-card p-8 mb-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            Paso 2: Problema o Necesidad
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Identifica un problema específico o necesidad en el mercado que podría convertirse en una oportunidad de negocio sostenible.
          </p>
        </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {saving && (
          <div className="flex items-center space-x-2 text-primary-600 bg-primary-50 p-3 rounded-lg animate-fade-in mb-6">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
            <span className="text-sm font-medium">Guardando...</span>
          </div>
        )}

        <div className="space-y-8">
        {/* Title Field */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            {getFieldIcon(getFieldStatus('title'))}
            <label className="text-lg font-semibold text-gray-900">
              Título del problema o necesidad
            </label>
            <span className="text-red-500">*</span>
          </div>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                value={field.value || ''}
                type="text"
                className="input text-lg"
                placeholder="Ej: Dificultad para encontrar espacios de trabajo colaborativo en zonas residenciales"
              />
            )}
          />
          {errors.title && (
            <p className="mt-2 text-sm text-error-600 font-medium">{errors.title.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getFieldIcon(getFieldStatus('description'))}
              <label className="text-lg font-semibold text-gray-900">
                Descripción detallada del problema
              </label>
              <span className="text-red-500">*</span>
            </div>
            <span className="text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-full">
              {watchedValues.description?.length || 0}/200 min
            </span>
          </div>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                value={field.value || ''}
                rows={5}
                className="textarea"
                placeholder="Describe en detalle el problema identificado, sus manifestaciones, frecuencia y contexto en el que se presenta..."
              />
            )}
          />
          {errors.description && (
            <p className="mt-2 text-sm text-error-600 font-medium">{errors.description.message}</p>
          )}
        </div>

        {/* Affected Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {getFieldIcon(getFieldStatus('affected'))}
              <label className="block text-sm font-medium text-gray-700">
                ¿Quiénes se ven afectados por este problema? *
              </label>
            </div>
            <span className="text-xs text-gray-500">
              {watchedValues.affected?.length || 0}/200 min
            </span>
          </div>
          <Controller
            name="affected"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                value={field.value || ''}
                rows={4}
                className="textarea"
                placeholder="Identifica los grupos de personas, organizaciones o sectores que experimentan este problema. Sé específico sobre demografía, comportamientos, contextos..."
              />
            )}
          />
          {errors.affected && (
            <p className="mt-1 text-sm text-red-600">{errors.affected.message}</p>
          )}
        </div>

        {/* Relevance Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {getFieldIcon(getFieldStatus('relevance'))}
              <label className="block text-sm font-medium text-gray-700">
                ¿Por qué es relevante este problema? *
              </label>
            </div>
            <span className="text-xs text-gray-500">
              {watchedValues.relevance?.length || 0}/200 min
            </span>
          </div>
          <Controller
            name="relevance"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                value={field.value || ''}
                rows={4}
                className="textarea"
                placeholder="Explica por qué este problema merece atención, su impacto económico, social o ambiental, tendencias que lo amplifican..."
              />
            )}
          />
          {errors.relevance && (
            <p className="mt-1 text-sm text-red-600">{errors.relevance.message}</p>
          )}
        </div>

        {/* Link to Means Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {getFieldIcon(getFieldStatus('link_to_means'))}
              <label className="block text-sm font-medium text-gray-700">
                ¿Cómo se relaciona con tus medios personales? *
              </label>
            </div>
            <span className="text-xs text-gray-500">
              {watchedValues.link_to_means?.length || 0}/200 min
            </span>
          </div>
          <Controller
            name="link_to_means"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                value={field.value || ''}
                rows={4}
                className="textarea"
                placeholder="Conecta este problema con tus medios personales del Paso 1. ¿Qué conocimientos, contactos o recursos tienes que te permitirían abordar este problema?..."
              />
            )}
          />
          {errors.link_to_means && (
            <p className="mt-1 text-sm text-red-600">{errors.link_to_means.message}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <h4 className="font-bold text-orange-900">Criterios de validación</h4>
            </div>
            <ul className="text-sm text-orange-800 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Título claro y específico</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Descripción, afectados, relevancia y vínculo: mín. 200 caracteres</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Conectado con tus medios personales</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Problema real y verificable</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-6 rounded-xl border border-primary-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">💡</span>
              </div>
              <h4 className="font-bold text-primary-900">Consejos para identificar problemas</h4>
            </div>
            <ul className="text-sm text-primary-800 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>Observa frustraciones recurrentes</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>Identifica ineficiencias en procesos</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>Necesidades no cubiertas o mal cubiertas</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>Problemas que tú mismo has experimentado</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary-500 mt-1">•</span>
                <span>Cambios sociales, tecnológicos o regulatorios</span>
              </li>
            </ul>
          </div>
        </div>

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
                <span>Guardando paso 2...</span>
              </>
            ) : (
              <>
                <span>Continuar al Paso 3</span>
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