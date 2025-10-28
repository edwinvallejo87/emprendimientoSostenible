import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useJournalStore } from '../../store/journal'
import { Lightbulb, Save, X } from 'lucide-react'

const createIdeaSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  target_market: z.string().min(3, 'Describe el mercado objetivo'),
  unique_value: z.string().min(5, 'Describe la propuesta de valor única'),
  implementation_complexity: z.enum(['Low', 'Medium', 'High']),
  market_potential: z.enum(['Low', 'Medium', 'High']),
  alignment_score: z.number().min(0).max(100),
  reasoning: z.string().min(10, 'Explica tu razonamiento'),
})

type CreateIdeaFormData = z.infer<typeof createIdeaSchema>

interface CreateIdeaFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function CreateIdeaForm({ onSuccess, onCancel }: CreateIdeaFormProps) {
  const { currentJournal, createIdea } = useJournalStore()
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<CreateIdeaFormData>({
    resolver: zodResolver(createIdeaSchema),
    defaultValues: {
      title: '',
      description: '',
      target_market: '',
      unique_value: '',
      implementation_complexity: 'Medium',
      market_potential: 'Medium',
      alignment_score: 50,
      reasoning: '',
    },
    mode: 'onChange',
  })

  const alignmentScore = watch('alignment_score')

  const onSubmit = async (data: CreateIdeaFormData) => {
    if (!currentJournal) return

    setSaving(true)
    try {
      await createIdea(currentJournal.id, {
        ...data,
        resources_needed: [], // Por ahora vacío, se puede extender
        status: 'draft' as const,
      })
      onSuccess()
    } catch (error) {
      console.error('Error creating idea:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!currentJournal) {
    return <div>No hay bitácora seleccionada</div>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg border border-stone-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Título */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Título de la Idea *
          </label>
          <input
            {...register('title')}
            type="text"
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: App de gestión de inventarios para pequeños comercios"
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Descripción *
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe tu idea de manera detallada..."
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Mercado Objetivo */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Mercado Objetivo *
          </label>
          <input
            {...register('target_market')}
            type="text"
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Pequeños comerciantes, restaurantes"
          />
          {errors.target_market && (
            <p className="text-red-600 text-sm mt-1">{errors.target_market.message}</p>
          )}
        </div>

        {/* Propuesta de Valor */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Propuesta de Valor Única *
          </label>
          <input
            {...register('unique_value')}
            type="text"
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="¿Qué hace única tu idea?"
          />
          {errors.unique_value && (
            <p className="text-red-600 text-sm mt-1">{errors.unique_value.message}</p>
          )}
        </div>

        {/* Complejidad de Implementación */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Complejidad de Implementación
          </label>
          <select
            {...register('implementation_complexity')}
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Low">Baja</option>
            <option value="Medium">Media</option>
            <option value="High">Alta</option>
          </select>
        </div>

        {/* Potencial de Mercado */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Potencial de Mercado
          </label>
          <select
            {...register('market_potential')}
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Low">Bajo</option>
            <option value="Medium">Medio</option>
            <option value="High">Alto</option>
          </select>
        </div>

        {/* Alineación con Medios */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Alineación con tus Medios (0-100)
          </label>
          <div className="flex items-center gap-4">
            <input
              {...register('alignment_score', { valueAsNumber: true })}
              type="range"
              min="0"
              max="100"
              className="flex-1"
            />
            <span className="text-lg font-semibold text-stone-700 min-w-[60px]">
              {alignmentScore}%
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            ¿Qué tan bien se alinea esta idea con tus conocimientos, recursos y contactos?
          </p>
        </div>

        {/* Razonamiento */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Razonamiento *
          </label>
          <textarea
            {...register('reasoning')}
            rows={3}
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Explica por qué crees que esta idea es viable y está alineada contigo..."
          />
          {errors.reasoning && (
            <p className="text-red-600 text-sm mt-1">{errors.reasoning.message}</p>
          )}
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-stone-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline flex items-center gap-2"
          disabled={saving}
        >
          <X className="w-4 h-4" />
          Cancelar
        </button>
        
        <button
          type="submit"
          disabled={!isValid || saving}
          className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Guardando...' : 'Crear Idea'}
        </button>
      </div>
    </form>
  )
}