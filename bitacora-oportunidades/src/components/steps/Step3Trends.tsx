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
          <h1 className="text-3xl text-stone-900 mb-3">Tendencias (Crazy Quilt)</h1>
          <p className="text-lg text-stone-600">
            Identifica tendencias y posibles alianzas que apoyen tu idea. ¿Qué colaboraciones puedes tejer?
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-16">
          {saving && (
            <div className="text-center py-2 text-stone-500 text-sm">
              Guardando...
            </div>
          )}

          {fields.map((field, index) => (
            <div key={field.id} className="space-y-8 p-6 bg-white border border-stone-200 rounded-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-xl text-stone-900">Tendencia {index + 1}</h2>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTrend(index)}
                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar tendencia"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
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
          ))}

          {/* Add Trend Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={addTrend}
              className="flex items-center space-x-2 px-6 py-3 border-2 border-dashed border-stone-300 text-stone-600 rounded-lg hover:border-stone-400 hover:text-stone-900 transition-colors"
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
            {saving ? 'Guardando...' : 'Siguiente'}
          </button>
        </div>

        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-2">📋 Criterios de validación:</h4>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Al menos 3 tendencias (puedes agregar más si necesitas)</li>
              <li>• Cada tendencia debe tener nombre, tipo, descripción y ejemplo</li>
              <li>• La fuente es opcional pero recomendada para mayor credibilidad</li>
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