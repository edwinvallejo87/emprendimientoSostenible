import { useState, useEffect, useMemo } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useJournalStore } from '../../store/journal'
import { step3TrendSchema, trendTypes, type Step3TrendData, type TrendType } from '../../lib/validators/step3'
import { TrendingUp, ArrowRight, Plus, Trash2 } from 'lucide-react'

const trendsFormSchema = z.object({
  trends: z.array(step3TrendSchema).min(1, 'Debe tener al menos 1 tendencia')
})

type TrendsFormData = z.infer<typeof trendsFormSchema>

interface Step3TrendsProps {
  onNext?: () => void
}

export default function Step3Trends({ onNext }: Step3TrendsProps) {
  const {
    currentJournal,
    currentIdea,
    step3Data,
    saveStep3Data,
    saveStep3DataForIdea,
  } = useJournalStore()

  const [saving, setSaving] = useState(false)

  const formValues = useMemo(() => {
    if (step3Data.length > 0) {
      return {
        trends: step3Data.map(trend => ({
          name: trend.name || '',
          type: trend.type || 'Social' as TrendType,
          brief: trend.brief || '',
          example: trend.example || '',
          source_apa: trend.source_apa || '',
          comment: trend.comment || '',
        }))
      }
    }
    return {
      trends: [
        {
          name: '',
          type: 'Social' as TrendType,
          brief: '',
          example: '',
          source_apa: '',
          comment: '',
        }
      ]
    }
  }, [step3Data])

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TrendsFormData>({
    resolver: zodResolver(trendsFormSchema),
    values: formValues,
    mode: 'onChange'
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'trends',
  })

  const addTrend = () => {
    append({
      name: '',
      type: 'Social' as TrendType,
      brief: '',
      example: '',
      source_apa: '',
      comment: '',
    })
  }

  const removeTrend = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  const onSubmit = async (data: TrendsFormData) => {
    if (!currentIdea) return
    
    setSaving(true)
    try {
      await saveStep3DataForIdea(currentIdea.id, data.trends)
      if (onNext) {
        onNext()
      }
    } catch (error) {
      console.error('Error saving step 3 data:', error)
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
          <h1 className="text-3xl text-gray-900 mb-3">Tendencias de Mercado</h1>
          <p className="text-lg text-gray-600">
            Que esta cambiando en tu industria?
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
          {saving && (
            <div className="text-center py-2 text-gray-500 text-sm">
              Guardando...
            </div>
          )}

          {fields.map((field, index) => (
            <div key={field.id} className="space-y-8 p-6 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-xl text-gray-900">Tendencia {index + 1}</h2>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTrend(index)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar tendencia"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tendencia *
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
                    Categoria *
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
                    En que consiste *
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
                    Ejemplo real *
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
                    Fuente (opcional)
                  </label>
                  <Controller
                    name={`trends.${index}.source_apa`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="input"
                        placeholder="Ej: McKinsey Report 2024, Statista.com"
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
                    Tu analisis (opcional)
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
          ))}

          {/* Add Trend Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={addTrend}
              className="flex items-center space-x-2 px-6 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-900 transition-colors"
            >
              <Plus size={20} />
              <span>Agregar nueva tendencia</span>
            </button>
          </div>

        {errors.trends && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">
              {errors.trends.message || 'Por favor completa todas las tendencias requeridas'}
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!isValid || saving}
            className="btn btn-primary"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>

        </form>

      </div>
    </div>
  )
}