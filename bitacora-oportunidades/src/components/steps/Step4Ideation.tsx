import { useState, useEffect } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useJournalStore } from '../../store/journal-demo'
import { 
  step4IdeaSchema, 
  innovationLevels, 
  feasibilityLevels,
  type Step4IdeaData, 
  type InnovationLevel, 
  type FeasibilityLevel 
} from '../../lib/validators/step4'
import { debounce } from '../../lib/utils'
import { Lightbulb, Plus, Trash2, Save, CheckCircle, AlertTriangle, Star } from 'lucide-react'

const ideasFormSchema = z.object({
  ideas: z.array(step4IdeaSchema).min(5, 'Debe tener al menos 5 ideas')
})

type IdeasFormData = z.infer<typeof ideasFormSchema>

export default function Step4Ideation() {
  const {
    currentJournal,
    step4Data,
    saveStep4Data,
    saving,
  } = useJournalStore()

  const [localSaving, setLocalSaving] = useState(false)

  const initialIdeas = step4Data.length > 0 
    ? step4Data.map(idea => ({
        idea: idea.idea || '',
        kind: idea.kind || '',
        innovation_level: idea.innovation_level || 'Incremental' as InnovationLevel,
        feasibility: idea.feasibility || 'Media' as FeasibilityLevel,
        selected: idea.selected || false,
        justification: idea.justification || '',
      }))
    : Array.from({ length: 5 }, () => ({
        idea: '',
        kind: '',
        innovation_level: 'Incremental' as InnovationLevel,
        feasibility: 'Media' as FeasibilityLevel,
        selected: false,
        justification: '',
      }))

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IdeasFormData>({
    resolver: zodResolver(ideasFormSchema),
    defaultValues: {
      ideas: initialIdeas
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ideas',
  })

  const watchedValues = watch()

  const debouncedSave = debounce(async (data: IdeasFormData) => {
    if (!currentJournal) return
    
    setLocalSaving(true)
    try {
      await saveStep4Data(currentJournal.id, data.ideas)
    } catch (error) {
      console.error('Error saving step 4 data:', error)
    } finally {
      setLocalSaving(false)
    }
  }, 600)

  useEffect(() => {
    debouncedSave(watchedValues)
  }, [watchedValues, debouncedSave])

  const handleSelectIdea = (index: number) => {
    // Unselect all other ideas
    watchedValues.ideas.forEach((_, i) => {
      if (i !== index) {
        setValue(`ideas.${i}.selected`, false)
      }
    })
    // Toggle the selected idea
    setValue(`ideas.${index}.selected`, !watchedValues.ideas[index].selected)
  }

  const addNewIdea = () => {
    append({
      idea: '',
      kind: '',
      innovation_level: 'Incremental',
      feasibility: 'Media',
      selected: false,
      justification: '',
    })
  }

  if (!currentJournal) {
    return <div>No hay bitácora seleccionada</div>
  }

  const getIdeaStatus = (idea: Partial<Step4IdeaData>) => {
    try {
      step4IdeaSchema.parse(idea)
      return 'complete'
    } catch {
      const hasPartialData = idea.idea || idea.kind
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

  const validIdeas = watchedValues.ideas.filter(idea => getIdeaStatus(idea) === 'complete')
  const selectedIdeas = validIdeas.filter(idea => idea.selected)
  const selectedIdea = selectedIdeas[0]
  const hasValidJustification = selectedIdea?.justification && selectedIdea.justification.trim().length >= 200

  const isStepComplete = validIdeas.length >= 5 && selectedIdeas.length === 1 && hasValidJustification

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Paso 4: Ideación</h2>
        <p className="mt-2 text-gray-600">
          Genera al menos 5 ideas de solución, clasifícalas y selecciona la más prometedora con su justificación.
        </p>
        <div className="flex items-center space-x-4 mt-3">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-primary-500" />
            <span className="text-sm font-medium">
              Ideas válidas: {validIdeas.length}/5 mínimo
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium">
              Seleccionadas: {selectedIdeas.length}/1
            </span>
          </div>
          {isStepComplete && (
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

      <div className="space-y-4">
        {fields.map((field, index) => {
          const ideaData = watchedValues.ideas[index]
          const status = getIdeaStatus(ideaData)
          const isSelected = ideaData.selected
          
          return (
            <div 
              key={field.id} 
              className={`border rounded-lg p-6 ${
                isSelected ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(status)}
                  <h3 className="text-lg font-semibold text-gray-900">
                    Idea {index + 1}
                  </h3>
                  {isSelected && (
                    <div className="flex items-center space-x-1 text-yellow-600">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">Seleccionada</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {validIdeas.length > 5 && index >= 5 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  {status === 'complete' && (
                    <button
                      type="button"
                      onClick={() => handleSelectIdea(index)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        isSelected 
                          ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {isSelected ? 'Deseleccionar' : 'Seleccionar'}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción de la idea *
                  </label>
                  <Controller
                    name={`ideas.${index}.idea`}
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        rows={3}
                        className="textarea"
                        placeholder="Describe detalladamente tu idea de solución..."
                      />
                    )}
                  />
                  {errors.ideas?.[index]?.idea && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.ideas[index]?.idea?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de idea *
                  </label>
                  <Controller
                    name={`ideas.${index}.kind`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="input"
                        placeholder="Ej: Producto digital, Servicio, Plataforma..."
                      />
                    )}
                  />
                  {errors.ideas?.[index]?.kind && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.ideas[index]?.kind?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nivel de innovación *
                  </label>
                  <Controller
                    name={`ideas.${index}.innovation_level`}
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="input">
                        {innovationLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Viabilidad *
                  </label>
                  <Controller
                    name={`ideas.${index}.feasibility`}
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="input">
                        {feasibilityLevels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    )}
                  />
                </div>

                {isSelected && (
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Justificación de selección *
                      </label>
                      <span className="text-xs text-gray-500">
                        {ideaData.justification?.length || 0}/200 min
                      </span>
                    </div>
                    <Controller
                      name={`ideas.${index}.justification`}
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          rows={4}
                          className="textarea"
                          placeholder="Explica por qué seleccionaste esta idea. Considera su potencial de mercado, viabilidad técnica, recursos necesarios, ventajas competitivas..."
                        />
                      )}
                    />
                    {errors.ideas?.[index]?.justification && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.ideas[index]?.justification?.message}
                      </p>
                    )}
                    {ideaData.justification && ideaData.justification.length < 200 && (
                      <p className="mt-1 text-sm text-yellow-600">
                        La justificación debe tener al menos 200 caracteres
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        <button
          type="button"
          onClick={addNewIdea}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-300 hover:bg-primary-50 transition-colors"
        >
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <Plus className="h-5 w-5" />
            <span>Agregar nueva idea</span>
          </div>
        </button>

        {errors.ideas && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">
              {errors.ideas.message || 'Por favor completa al menos 5 ideas válidas'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-2">📋 Criterios de validación:</h4>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Mínimo 5 ideas completas</li>
              <li>• Exactamente 1 idea seleccionada</li>
              <li>• Justificación de mínimo 200 caracteres</li>
              <li>• Clasificación de innovación y viabilidad</li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Técnicas de ideación:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Lluvia de ideas sin censura inicial</li>
              <li>• Combina diferentes perspectivas</li>
              <li>• Considera soluciones digitales y físicas</li>
              <li>• Piensa en modelos de negocio diversos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}