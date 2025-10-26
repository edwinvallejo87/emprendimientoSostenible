import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useJournalStore } from '../../store/journal-demo'
import { step2ProblemSchema, type Step2ProblemData } from '../../lib/validators/step2'
import { debounce } from '../../lib/utils'
import { AlertTriangle, Save, CheckCircle } from 'lucide-react'

export default function Step2Problem() {
  const {
    currentJournal,
    step2Data,
    saveStep2Data,
    saving,
  } = useJournalStore()

  const [localSaving, setLocalSaving] = useState(false)

  const {
    control,
    watch,
    formState: { errors },
  } = useForm<Step2ProblemData>({
    resolver: zodResolver(step2ProblemSchema),
    defaultValues: step2Data || {},
  })

  const watchedValues = watch()

  const debouncedSave = debounce(async (data: Partial<Step2ProblemData>) => {
    if (!currentJournal) return
    
    setLocalSaving(true)
    try {
      await saveStep2Data(currentJournal.id, data)
    } catch (error) {
      console.error('Error saving step 2 data:', error)
    } finally {
      setLocalSaving(false)
    }
  }, 600)

  useEffect(() => {
    debouncedSave(watchedValues)
  }, [watchedValues, debouncedSave])

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
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Paso 2: Problema o Necesidad</h2>
        <p className="mt-2 text-gray-600">
          Identifica un problema específico o necesidad en el mercado que podría convertirse en una oportunidad de negocio.
        </p>
      </div>

      {(saving || localSaving) && (
        <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
          <Save className="h-4 w-4 animate-pulse" />
          <span className="text-sm">Guardando automáticamente...</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Title Field */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            {getFieldIcon(getFieldStatus('title'))}
            <label className="block text-sm font-medium text-gray-700">
              Título del problema o necesidad *
            </label>
          </div>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                value={field.value || ''}
                type="text"
                className="input"
                placeholder="Ej: Dificultad para encontrar espacios de trabajo colaborativo en zonas residenciales"
              />
            )}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {getFieldIcon(getFieldStatus('description'))}
              <label className="block text-sm font-medium text-gray-700">
                Descripción detallada del problema *
              </label>
            </div>
            <span className="text-xs text-gray-500">
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
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
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

        <div className="mt-6 p-4 bg-orange-50 rounded-lg">
          <h4 className="font-medium text-orange-900 mb-2">📋 Criterios de validación:</h4>
          <ul className="text-sm text-orange-800 space-y-1">
            <li>• Título claro y específico</li>
            <li>• Descripción, afectados, relevancia y vínculo con medios: mínimo 200 caracteres cada uno</li>
            <li>• El problema debe estar conectado con tus medios personales</li>
            <li>• Debe ser un problema real y verificable</li>
          </ul>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">💡 Consejos para identificar problemas:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Observa frustraciones recurrentes en tu entorno</li>
            <li>• Identifica ineficiencias en procesos existentes</li>
            <li>• Considera necesidades no cubiertas o mal cubiertas</li>
            <li>• Piensa en problemas que tú mismo has experimentado</li>
            <li>• Busca oportunidades en cambios sociales, tecnológicos o regulatorios</li>
          </ul>
        </div>
      </div>
    </div>
  )
}