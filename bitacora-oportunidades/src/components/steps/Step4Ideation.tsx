import { useState } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useJournalStore } from '../../store/journal'
import { step4IdeaSchema, type Step4IdeaData } from '../../lib/validators/step4'
import { Lightbulb, ArrowRight, Plus, Trash2 } from 'lucide-react'

const ideasFormSchema = z.object({
  ideas: z.array(step4IdeaSchema).min(3, 'Debe tener al menos 3 ideas')
})

type IdeasFormData = z.infer<typeof ideasFormSchema>

interface Step4IdeationProps {
  onNext?: () => void
}

export default function Step4Ideation({ onNext }: Step4IdeationProps) {
  const {
    currentJournal,
    step4Data,
    saveStep4Data,
  } = useJournalStore()

  const [saving, setSaving] = useState(false)

  const formValues = {
    ideas: step4Data.length > 0 ? step4Data.map(idea => ({
      idea: idea.idea || '',
      innovation_level: idea.innovation_level || 'Media' as const,
      feasibility: idea.feasibility || 'Media' as const,
      justification: idea.justification || '',
      selected: idea.selected || false,
    })) : [
      {
        idea: '',
        innovation_level: 'Media' as const,
        feasibility: 'Media' as const,
        justification: '',
        selected: false,
      }
    ]
  }

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<IdeasFormData>({
    resolver: zodResolver(ideasFormSchema),
    values: formValues,
    mode: 'onChange'
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ideas',
  })

  const watchedIdeas = watch('ideas')

  const addIdea = () => {
    append({
      idea: '',
      innovation_level: 'Media',
      feasibility: 'Media',
      justification: '',
      selected: false,
    })
  }

  const removeIdea = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  const onSubmit = async (data: IdeasFormData) => {
    if (!currentJournal) return
    
    setSaving(true)
    try {
      await saveStep4Data(currentJournal.id, data.ideas)
      if (onNext) {
        onNext()
      }
    } catch (error) {
      console.error('Error saving step 4 data:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!currentJournal) {
    return <div>No hay bitácora seleccionada</div>
  }

  const selectedCount = watchedIdeas?.filter(idea => idea.selected).length || 0

  return (
    <div className="max-w-3xl mx-auto px-6">
      <div className="mb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl text-gray-900 mb-3">Ideación</h1>
          <p className="text-lg text-gray-600">
            Genera al menos 3 ideas de oportunidades emprendedoriales y selecciona la más prometedora
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
                <h2 className="text-xl text-gray-900 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Idea {index + 1}
                </h2>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIdea(index)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar idea"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción de la idea *
                  </label>
                  <Controller
                    name={`ideas.${index}.idea`}
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={4}
                        className="textarea"
                        placeholder="Describe detalladamente tu idea de oportunidad emprendedorial..."
                      />
                    )}
                  />
                  {errors.ideas?.[index]?.idea && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.ideas[index]?.idea?.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nivel de innovación *
                    </label>
                    <Controller
                      name={`ideas.${index}.innovation_level`}
                      control={control}
                      render={({ field }) => (
                        <select {...field} className="input">
                          <option value="Baja">Baja - Mejora incremental</option>
                          <option value="Media">Media - Innovación moderada</option>
                          <option value="Alta">Alta - Innovación disruptiva</option>
                        </select>
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Factibilidad *
                    </label>
                    <Controller
                      name={`ideas.${index}.feasibility`}
                      control={control}
                      render={({ field }) => (
                        <select {...field} className="input">
                          <option value="Baja">Baja - Muy difícil de implementar</option>
                          <option value="Media">Media - Moderadamente factible</option>
                          <option value="Alta">Alta - Fácil de implementar</option>
                        </select>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Justificación *
                  </label>
                  <Controller
                    name={`ideas.${index}.justification`}
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        className="textarea"
                        placeholder="Explica por qué esta idea es viable y prometedora..."
                      />
                    )}
                  />
                  {errors.ideas?.[index]?.justification && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.ideas[index]?.justification?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <Controller
                      name={`ideas.${index}.selected`}
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => {
                            // Only allow one selected idea
                            if (e.target.checked) {
                              // Uncheck all other ideas
                              watchedIdeas?.forEach((_, i) => {
                                if (i !== index) {
                                  field.onChange(false)
                                }
                              })
                            }
                            field.onChange(e.target.checked)
                          }}
                          className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                        />
                      )}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Seleccionar esta idea para desarrollar
                    </span>
                  </label>
                </div>
              </div>
            </div>
          ))}

          {/* Add Idea Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={addIdea}
              className="flex items-center space-x-2 px-6 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 hover:text-gray-900 transition-colors"
            >
              <Plus size={20} />
              <span>Agregar nueva idea</span>
            </button>
          </div>

          {/* Selection Warning */}
          {selectedCount === 0 && watchedIdeas?.length > 0 && (
            <div className="rounded-md bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ Debes seleccionar exactamente una idea para continuar al siguiente paso
              </p>
            </div>
          )}

          {selectedCount > 1 && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">
                ❌ Solo puedes seleccionar una idea. Desmarca las demás opciones.
              </p>
            </div>
          )}

          {errors.ideas && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">
                {errors.ideas.message || 'Por favor completa todas las ideas requeridas'}
              </p>
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!isValid || saving || selectedCount !== 1}
              className="btn btn-primary disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Continuar al Paso 5'}
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-2">📋 Criterios de validación:</h4>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Al menos 3 ideas (puedes agregar más si necesitas)</li>
              <li>• Cada idea debe tener descripción, niveles y justificación</li>
              <li>• Exactamente una idea debe estar seleccionada</li>
              <li>• La justificación debe ser sólida y realista</li>
            </ul>
          </div>

          <div className="p-4 bg-primary-50 rounded-lg">
            <h4 className="font-medium text-primary-900 mb-2">💡 Consejos para idear:</h4>
            <ul className="text-sm text-primary-800 space-y-1">
              <li>• Conecta las ideas con tus medios personales del Paso 1</li>
              <li>• Considera el problema identificado en el Paso 2</li>
              <li>• Aprovecha las tendencias del Paso 3</li>
              <li>• Piensa en soluciones realistas y factibles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}