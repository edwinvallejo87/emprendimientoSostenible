import { useState, useEffect } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useJournalStore } from '../../store/journal-demo'
import { step3TrendSchema, trendTypes, type Step3TrendData, type TrendType } from '../../lib/validators/step3'
import { debounce } from '../../lib/utils'
import { TrendingUp, Plus, Trash2, Save, CheckCircle, AlertTriangle } from 'lucide-react'

const trendsFormSchema = z.object({
  trends: z.array(step3TrendSchema).length(5, 'Debe tener exactamente 5 tendencias')
})

type TrendsFormData = z.infer<typeof trendsFormSchema>

export default function Step3Trends() {
  const {
    currentJournal,
    step3Data,
    saveStep3Data,
    saving,
  } = useJournalStore()

  const [localSaving, setLocalSaving] = useState(false)

  const initialTrends = step3Data.length > 0 
    ? step3Data.map(trend => ({
        name: trend.name || '',
        type: trend.type || 'Social' as TrendType,
        brief: trend.brief || '',
        example: trend.example || '',
        source_apa: trend.source_apa || '',
        comment: trend.comment || '',
      }))
    : Array.from({ length: 5 }, () => ({
        name: '',
        type: 'Social' as TrendType,
        brief: '',
        example: '',
        source_apa: '',
        comment: '',
      }))

  const {
    control,
    watch,
    formState: { errors },
  } = useForm<TrendsFormData>({
    resolver: zodResolver(trendsFormSchema),
    defaultValues: {
      trends: initialTrends
    },
  })

  const { fields } = useFieldArray({
    control,
    name: 'trends',
  })

  const watchedValues = watch()

  const debouncedSave = debounce(async (data: TrendsFormData) => {
    if (!currentJournal) return
    
    setLocalSaving(true)
    try {
      await saveStep3Data(currentJournal.id, data.trends)
    } catch (error) {
      console.error('Error saving step 3 data:', error)
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

  const getTrendStatus = (trend: Partial<Step3TrendData>) => {
    try {
      step3TrendSchema.parse(trend)
      return 'complete'
    } catch {
      const hasPartialData = trend.name || trend.brief || trend.example || trend.source_apa
      return hasPartialData ? 'incomplete' : 'empty'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'incomplete':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <div className="h-5 w-5 border border-gray-300 rounded-full" />
    }
  }

  const completedTrends = watchedValues.trends.filter(trend => getTrendStatus(trend) === 'complete').length

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Paso 3: Tendencias</h2>
        <p className="mt-2 text-gray-600">
          Identifica exactamente 5 tendencias que podrían influir en el problema identificado o crear nuevas oportunidades.
        </p>
        <div className="flex items-center space-x-4 mt-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary-500" />
            <span className="text-sm font-medium">
              Progreso: {completedTrends}/5 tendencias completas
            </span>
          </div>
          {completedTrends === 5 && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">¡Paso completado!</span>
            </div>
          )}
        </div>
      </div>

      {(saving || localSaving) && (
        <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
          <Save className="h-4 w-4 animate-pulse" />
          <span className="text-sm">Guardando automáticamente...</span>
        </div>
      )}

      <div className="space-y-6">
        {fields.map((field, index) => {
          const trendData = watchedValues.trends[index]
          const status = getTrendStatus(trendData)
          
          return (
            <div key={field.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(status)}
                  <h3 className="text-lg font-semibold text-gray-900">
                    Tendencia {index + 1}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    status === 'complete' ? 'bg-green-100 text-green-800' :
                    status === 'incomplete' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {status === 'complete' ? 'Completa' : 
                     status === 'incomplete' ? 'Incompleta' : 'Vacía'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la tendencia *
                  </label>
                  <Controller
                    name={`trends.${index}.name`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="input"
                        placeholder="Ej: Trabajo remoto híbrido"
                      />
                    )}
                  />
                  {errors.trends?.[index]?.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.trends[index]?.name?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de tendencia *
                  </label>
                  <Controller
                    name={`trends.${index}.type`}
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="input">
                        {trendTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.trends?.[index]?.type && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.trends[index]?.type?.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción breve *
                  </label>
                  <Controller
                    name={`trends.${index}.brief`}
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        className="textarea"
                        placeholder="Describe brevemente en qué consiste esta tendencia..."
                      />
                    )}
                  />
                  {errors.trends?.[index]?.brief && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.trends[index]?.brief?.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ejemplo específico *
                  </label>
                  <Controller
                    name={`trends.${index}.example`}
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={2}
                        className="textarea"
                        placeholder="Proporciona un ejemplo concreto de esta tendencia..."
                      />
                    )}
                  />
                  {errors.trends?.[index]?.example && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.trends[index]?.example?.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuente APA *
                  </label>
                  <Controller
                    name={`trends.${index}.source_apa`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="input"
                        placeholder="Ej: García, J. (2024). El futuro del trabajo remoto. Revista de Innovación, 15(3), 45-62."
                      />
                    )}
                  />
                  {errors.trends?.[index]?.source_apa && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.trends[index]?.source_apa?.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentarios adicionales (opcional)
                  </label>
                  <Controller
                    name={`trends.${index}.comment`}
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={2}
                        className="textarea"
                        placeholder="Agrega cualquier observación o conexión relevante..."
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          )
        })}

        {errors.trends && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">
              {errors.trends.message || 'Por favor completa todas las tendencias requeridas'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-2">📋 Criterios de validación:</h4>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Exactamente 5 tendencias (ni más, ni menos)</li>
              <li>• Cada tendencia debe tener nombre, tipo, descripción, ejemplo y fuente APA</li>
              <li>• Las fuentes deben estar en formato APA</li>
              <li>• Deben ser tendencias actuales y relevantes</li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Tipos de tendencias:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Social:</strong> Cambios en comportamientos y valores</li>
              <li>• <strong>Tecnológica:</strong> Innovaciones y avances técnicos</li>
              <li>• <strong>Ambiental:</strong> Sostenibilidad y medio ambiente</li>
              <li>• <strong>Cultural:</strong> Evolución de costumbres y tradiciones</li>
              <li>• <strong>Consumo:</strong> Patrones de compra y preferencias</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">📚 Fuentes recomendadas:</h4>
          <p className="text-sm text-green-800 mb-2">
            Consulta fuentes confiables como revistas académicas, informes de consultoras reconocidas, 
            estudios de organizaciones internacionales, etc.
          </p>
          <p className="text-sm text-green-700">
            <strong>Ejemplo de formato APA:</strong> Autor, A. (Año). Título del artículo. 
            <em>Nombre de la revista</em>, volumen(número), páginas.
          </p>
        </div>
      </div>
    </div>
  )
}