import { useState, useEffect } from 'react'
import { useJournalStore } from '../../store/journal'
import { supabase } from '../../lib/supabase'
import { Upload, ExternalLink, Sparkles, Save, FileImage, Video, Link } from 'lucide-react'

import type { Database } from '../../lib/database.types'

type Prototype = Database['public']['Tables']['prototypes']['Row']
type PrototypeUpdate = Database['public']['Tables']['prototypes']['Update']

interface Props {
  onNext?: () => void
}

const PROTOTYPE_TYPES = [
  { value: 'concept', label: 'Concepto', description: 'Descripción o documento conceptual' },
  { value: 'wireframe', label: 'Wireframe', description: 'Esquemas de estructura e interfaz' },
  { value: 'mockup', label: 'Mockup', description: 'Diseño visual detallado' },
  { value: 'mvp', label: 'MVP', description: 'Producto mínimo viable funcional' },
  { value: 'physical', label: 'Prototipo Físico', description: 'Modelo físico o maqueta' },
  { value: 'digital', label: 'Prototipo Digital', description: 'App, web o software funcional' },
  { value: 'service', label: 'Prototipo de Servicio', description: 'Simulación de proceso de servicio' }
]

export default function Step9PrototypeMVP({ onNext }: Props) {
  const { currentIdea } = useJournalStore()
  const [prototype, setPrototype] = useState<Partial<Prototype>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)

  // Load existing prototype data
  useEffect(() => {
    if (!currentIdea) return

    const loadPrototype = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('prototypes')
          .select('*')
          .eq('idea_id', currentIdea.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading prototype:', error)
        } else if (data) {
          setPrototype(data)
        }
      } catch (error) {
        console.error('Error loading prototype:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPrototype()
  }, [currentIdea])

  // Auto-save functionality
  useEffect(() => {
    if (!currentIdea || loading || !prototype.name) return

    const savePrototype = async () => {
      setSaving(true)
      try {
        const updateData: PrototypeUpdate = {
          idea_id: currentIdea.id,
          ...prototype,
          updated_at: new Date().toISOString()
        }

        const { data, error } = await supabase
          .from('prototypes')
          .upsert(updateData, { onConflict: 'idea_id' })
          .select()
          .single()

        if (error) {
          console.error('Error saving prototype:', error)
        } else if (data) {
          setPrototype(data)
        }
      } catch (error) {
        console.error('Error saving prototype:', error)
      } finally {
        setSaving(false)
      }
    }

    const timeoutId = setTimeout(savePrototype, 1000)
    return () => clearTimeout(timeoutId)
  }, [prototype, currentIdea, loading])

  const handleFieldChange = (field: string, value: any) => {
    setPrototype(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateMVPSuggestion = async () => {
    if (!currentIdea || !prototype.type) return

    setGenerating(true)
    try {
      // Get additional context from other steps if available
      const { data: canvasData } = await supabase
        .from('sustainable_canvas')
        .select('value_propositions, customer_segments')
        .eq('idea_id', currentIdea.id)
        .single()

      const { data: patternsData } = await supabase
        .from('innovation_patterns')
        .select('pattern_name, is_primary')
        .eq('idea_id', currentIdea.id)
        .eq('is_primary', true)
        .single()

      // Generate MVP suggestion based on prototype type and context
      let suggestion = ''
      
      switch (prototype.type) {
        case 'concept':
          suggestion = `Tu PMV ideal es un **landing page** que valide el interés inicial mediante:
          
• Registro de emails con descripción del concepto
• Encuesta corta sobre necesidades del problema
• Botón de "notify me" para lanzamiento
• Métricas: % conversión registro, feedback cualitativo

Tiempo estimado: 1-2 semanas, Presupuesto: $50-200`
          break
          
        case 'digital':
        case 'mvp':
          suggestion = `Tu PMV ideal es una **versión simplificada funcional** con:
          
• Una funcionalidad core que resuelva el problema principal
• Onboarding básico y métricas de uso
• Feedback directo de usuarios (formulario/chat)
• Testing A/B de una característica clave
• Métricas: DAU, retención día 7, NPS

Tiempo estimado: 4-8 semanas, Presupuesto: $500-2000`
          break
          
        case 'service':
          suggestion = `Tu PMV ideal es un **piloto manual** del servicio:
          
• Atención personalizada a 10-20 clientes iniciales
• Proceso manual simulando la experiencia final
• Entrevistas de seguimiento con cada cliente
• Documentación de procesos y dolor points
• Métricas: satisfacción cliente, willingness to pay

Tiempo estimado: 2-4 semanas, Presupuesto: $100-500`
          break
          
        case 'physical':
          suggestion = `Tu PMV ideal es un **prototipo funcional limitado**:
          
• Versión simplificada con materiales básicos
• Testing con 5-10 usuarios target
• Observación directa de uso y comportamiento
• Iteración rápida basada en feedback
• Métricas: usabilidad, disposición a comprar

Tiempo estimado: 3-6 semanas, Presupuesto: $200-1000`
          break
          
        default:
          suggestion = `Tu PMV ideal debería **validar las hipótesis más riesgosas** mediante:
          
• Experimento de bajo costo y rápida ejecución
• Interacción directa con usuarios target
• Métricas claras de éxito/fracaso
• Aprendizaje sobre disposición a pagar
• Iteración basada en datos reales

Tiempo estimado: 2-4 semanas, Presupuesto: $100-500`
      }

      // Add context-specific suggestions
      if (canvasData?.value_propositions) {
        suggestion += `\n\n**Enfoque especial:** Valida específicamente tu propuesta de valor: "${canvasData.value_propositions.substring(0, 100)}..."`
      }

      if (patternsData?.pattern_name) {
        suggestion += `\n\n**Consideración del patrón:** Tu patrón principal "${patternsData.pattern_name}" sugiere validar la mecánica de monetización desde el PMV.`
      }

      setPrototype(prev => ({
        ...prev,
        ai_mvp_suggestion: suggestion
      }))
    } catch (error) {
      console.error('Error generating MVP suggestion:', error)
      alert('Error al generar sugerencia de PMV. Intenta de nuevo.')
    } finally {
      setGenerating(false)
    }
  }

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    const requiredFields = ['name', 'type', 'description', 'hypothesis_to_validate']
    const filledFields = requiredFields.filter(field => {
      const value = prototype[field as keyof Prototype]
      return value && String(value).trim().length > 0
    })
    
    // Bonus points for having media or MVP suggestion
    let bonus = 0
    if (prototype.image_url || prototype.video_url || prototype.external_link) bonus += 10
    if (prototype.ai_mvp_suggestion) bonus += 10
    
    return Math.min(100, Math.round((filledFields.length / requiredFields.length) * 80) + bonus)
  }

  if (!currentIdea) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-600">Selecciona una idea para trabajar en Prototipo y PMV</p>
      </div>
    )
  }

  const completion = getCompletionPercentage()

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl text-stone-900 mb-2">🧠 Prototipo y PMV</h2>
            <p className="text-stone-600">
              Diseña tu prototipo y define el Producto Mínimo Viable para validar hipótesis
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {saving && (
              <span className="text-stone-500 text-sm flex items-center">
                <Save size={16} className="mr-1" />
                Guardando...
              </span>
            )}
            <div className="text-right">
              <div className="text-sm text-stone-600">Progreso</div>
              <div className="text-lg font-semibold text-stone-900">{completion}%</div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-stone-200 rounded">
          <div
            className="h-2 bg-purple-500 rounded transition-all duration-300"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      <div className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg border border-stone-300">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">
            📋 Información Básica del Prototipo
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-stone-700 font-medium mb-2">
                Nombre del Prototipo *
              </label>
              <input
                type="text"
                value={prototype.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                placeholder="Ej: App EcoTracker v1.0, Mockup Dashboard..."
                className="input w-full"
              />
            </div>
            
            <div>
              <label className="block text-stone-700 font-medium mb-2">
                Tipo de Prototipo *
              </label>
              <select
                value={prototype.type || ''}
                onChange={(e) => handleFieldChange('type', e.target.value)}
                className="input w-full"
              >
                <option value="">Selecciona el tipo...</option>
                {PROTOTYPE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {prototype.type && (
                <p className="text-xs text-stone-600 mt-1">
                  {PROTOTYPE_TYPES.find(t => t.value === prototype.type)?.description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-stone-700 font-medium mb-2">
              Descripción del Prototipo *
            </label>
            <textarea
              value={prototype.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Describe las características principales, funcionalidades y alcance de tu prototipo..."
              className="input w-full"
              rows={4}
            />
          </div>
        </div>

        {/* Validation Hypotheses */}
        <div className="bg-white p-6 rounded-lg border border-stone-300">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">
            🎯 Hipótesis de Validación
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-stone-700 font-medium mb-2">
                Hipótesis a Validar *
              </label>
              <textarea
                value={prototype.hypothesis_to_validate || ''}
                onChange={(e) => handleFieldChange('hypothesis_to_validate', e.target.value)}
                placeholder="Ej: Los usuarios están dispuestos a pagar $10/mes por una app que les ayude a reducir su huella de carbono en 20%..."
                className="input w-full"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-stone-700 font-medium mb-2">
                Métricas de Aprendizaje Esperadas
              </label>
              <textarea
                value={prototype.expected_learning_metrics || ''}
                onChange={(e) => handleFieldChange('expected_learning_metrics', e.target.value)}
                placeholder="Ej: Tasa de conversión >5%, NPS >7, tiempo de uso >10min/día, willingness to pay >60%..."
                className="input w-full"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Media Attachments */}
        <div className="bg-white p-6 rounded-lg border border-stone-300">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">
            📎 Materiales del Prototipo
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-stone-700 font-medium mb-2 flex items-center">
                <FileImage size={16} className="mr-2" />
                URL de Imagen
              </label>
              <input
                type="url"
                value={prototype.image_url || ''}
                onChange={(e) => handleFieldChange('image_url', e.target.value)}
                placeholder="https://..."
                className="input w-full"
              />
              {prototype.image_url && (
                <a
                  href={prototype.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center mt-1"
                >
                  <ExternalLink size={12} className="mr-1" />
                  Ver imagen
                </a>
              )}
            </div>
            
            <div>
              <label className="block text-stone-700 font-medium mb-2 flex items-center">
                <Video size={16} className="mr-2" />
                URL de Video
              </label>
              <input
                type="url"
                value={prototype.video_url || ''}
                onChange={(e) => handleFieldChange('video_url', e.target.value)}
                placeholder="https://youtube.com/..."
                className="input w-full"
              />
              {prototype.video_url && (
                <a
                  href={prototype.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center mt-1"
                >
                  <ExternalLink size={12} className="mr-1" />
                  Ver video
                </a>
              )}
            </div>
            
            <div>
              <label className="block text-stone-700 font-medium mb-2 flex items-center">
                <Link size={16} className="mr-2" />
                Enlace Externo
              </label>
              <input
                type="url"
                value={prototype.external_link || ''}
                onChange={(e) => handleFieldChange('external_link', e.target.value)}
                placeholder="https://figma.com/..."
                className="input w-full"
              />
              <input
                type="text"
                value={prototype.link_description || ''}
                onChange={(e) => handleFieldChange('link_description', e.target.value)}
                placeholder="Descripción del enlace..."
                className="input w-full mt-2 text-xs"
              />
              {prototype.external_link && (
                <a
                  href={prototype.external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center mt-1"
                >
                  <ExternalLink size={12} className="mr-1" />
                  {prototype.link_description || 'Abrir enlace'}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* AI MVP Suggestion */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-purple-900">
              🤖 Sugerencia de PMV por IA
            </h3>
            <button
              onClick={generateMVPSuggestion}
              disabled={generating || !prototype.type}
              className="btn btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {generating ? (
                <>
                  <Sparkles size={16} className="mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles size={16} className="mr-2" />
                  Generar PMV IA
                </>
              )}
            </button>
          </div>
          
          <textarea
            value={prototype.ai_mvp_suggestion || ''}
            onChange={(e) => handleFieldChange('ai_mvp_suggestion', e.target.value)}
            placeholder="La IA generará una sugerencia personalizada de Producto Mínimo Viable basada en tu tipo de prototipo y contexto..."
            className="w-full p-4 border border-purple-300 rounded-lg text-sm bg-white"
            rows={8}
            readOnly={generating}
          />
          
          {!prototype.type && (
            <p className="text-sm text-purple-700 mt-2">
              💡 Selecciona un tipo de prototipo para generar sugerencias personalizadas
            </p>
          )}
        </div>

        {/* Completion Notice */}
        {completion < 80 && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 text-sm">
              📋 <strong>Completa los campos requeridos:</strong> nombre, tipo, descripción e hipótesis para avanzar al siguiente paso.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      {onNext && completion >= 80 && (
        <div className="flex justify-end mt-8">
          <button onClick={onNext} className="btn btn-primary">
            Continuar al siguiente paso →
          </button>
        </div>
      )}
    </div>
  )
}