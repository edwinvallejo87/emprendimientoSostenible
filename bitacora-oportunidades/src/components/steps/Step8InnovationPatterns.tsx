import { useState, useEffect } from 'react'
import { useJournalStore } from '../../store/journal'
import { supabase } from '../../lib/supabase'
import type { Database } from '../../lib/database.types'
import { Plus, Trash2, Star, Lightbulb, Save } from 'lucide-react'

type InnovationPattern = Database['public']['Tables']['innovation_patterns']['Row']
type InnovationPatternInsert = Database['public']['Tables']['innovation_patterns']['Insert']

interface Props {
  onNext?: () => void
}

// Business Model Navigator patterns library
const PATTERN_LIBRARY = [
  {
    name: 'Suscripción',
    description: 'Los clientes pagan una tarifa recurrente para acceder continuo a un producto o servicio.',
    example: 'Netflix, Spotify, Software as a Service (SaaS)',
    applicability: 'Ideal para servicios digitales, contenido, software y servicios continuos.',
    sustainability_angle: 'Promueve uso eficiente de recursos y relaciones a largo plazo con clientes.'
  },
  {
    name: 'Producto como Servicio',
    description: 'En lugar de vender productos, se monetiza su uso o resultado.',
    example: 'Rolls-Royce vende "horas de vuelo" en lugar de motores',
    applicability: 'Productos duraderos, equipos industriales, transporte.',
    sustainability_angle: 'Incentiva durabilidad, mantenimiento y economía circular.'
  },
  {
    name: 'Plataforma',
    description: 'Conecta dos o más grupos de usuarios y se monetiza facilitando interacciones.',
    example: 'Airbnb, Uber, Amazon Marketplace',
    applicability: 'Mercados donde existen múltiples actores que pueden beneficiarse mutuamente.',
    sustainability_angle: 'Maximiza utilización de recursos existentes y reduce desperdicio.'
  },
  {
    name: 'Freemium',
    description: 'Ofrece servicios básicos gratuitos y cobra por funcionalidades premium.',
    example: 'LinkedIn, Canva, Zoom',
    applicability: 'Productos digitales escalables con funcionalidades diferenciadas.',
    sustainability_angle: 'Democratiza acceso básico mientras sostiene innovación continua.'
  },
  {
    name: 'Comunidad',
    description: 'Crea valor facilitando interacciones y colaboración entre miembros.',
    example: 'GitHub, Stack Overflow, grupos de Facebook',
    applicability: 'Cuando el valor principal viene de la interacción entre usuarios.',
    sustainability_angle: 'Fortalece tejido social y conocimiento compartido.'
  },
  {
    name: 'Economía Circular',
    description: 'Diseña productos para ser reutilizados, remanufacturados o reciclados.',
    example: 'Interface (alfombras), Patagonia, Ellen MacArthur Foundation',
    applicability: 'Productos físicos con materiales valiosos o impacto ambiental.',
    sustainability_angle: 'Minimiza residuos y maximiza valor de materiales a lo largo del tiempo.'
  },
  {
    name: 'Impacto Compartido',
    description: 'Alinea el éxito del negocio con resultados sociales o ambientales medibles.',
    example: 'Grameen Bank, TOMS Shoes, Kiva',
    applicability: 'Negocios que pueden crear valor social/ambiental mientras generan ingresos.',
    sustainability_angle: 'Integra propósito social directamente en el modelo de ingresos.'
  },
  {
    name: 'Open Source',
    description: 'Libera el producto principal y monetiza servicios complementarios.',
    example: 'Red Hat, MongoDB, WordPress',
    applicability: 'Software, tecnología, conocimiento donde la colaboración agrega valor.',
    sustainability_angle: 'Acelera innovación colectiva y democratiza acceso al conocimiento.'
  }
]

export default function Step8InnovationPatterns({ onNext }: Props) {
  const { currentIdea } = useJournalStore()
  const [patterns, setPatterns] = useState<InnovationPattern[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)
  const [editingPattern, setEditingPattern] = useState<Partial<InnovationPattern> | null>(null)

  // Load existing patterns
  useEffect(() => {
    if (!currentIdea) return

    const loadPatterns = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('innovation_patterns')
          .select('*')
          .eq('idea_id', currentIdea.id)
          .order('created_at', { ascending: true })

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading patterns:', error)
        } else if (data) {
          setPatterns(data)
        }
      } catch (error) {
        console.error('Error loading patterns:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPatterns()
  }, [currentIdea])

  const savePattern = async (patternData: Partial<InnovationPattern>) => {
    if (!currentIdea) return

    setSaving(true)
    try {
      if (patternData.id) {
        // Update existing pattern
        const { data, error } = await supabase
          .from('innovation_patterns')
          .update(patternData)
          .eq('id', patternData.id)
          .select()
          .single()

        if (error) {
          console.error('Error updating pattern:', error)
        } else if (data) {
          setPatterns(prev => prev.map(p => p.id === data.id ? data : p))
        }
      } else {
        // Create new pattern
        const insertData: InnovationPatternInsert = {
          idea_id: currentIdea.id,
          pattern_name: patternData.pattern_name || '',
          pattern_description: patternData.pattern_description || null,
          justification: patternData.justification || null,
          expected_impact: patternData.expected_impact || null,
          is_primary: patternData.is_primary || false
        }

        const { data, error } = await supabase
          .from('innovation_patterns')
          .insert(insertData)
          .select()
          .single()

        if (error) {
          console.error('Error creating pattern:', error)
        } else if (data) {
          setPatterns(prev => [...prev, data])
        }
      }
    } catch (error) {
      console.error('Error saving pattern:', error)
    } finally {
      setSaving(false)
      setEditingPattern(null)
    }
  }

  const deletePattern = async (patternId: string) => {
    try {
      const { error } = await supabase
        .from('innovation_patterns')
        .delete()
        .eq('id', patternId)

      if (error) {
        console.error('Error deleting pattern:', error)
      } else {
        setPatterns(prev => prev.filter(p => p.id !== patternId))
      }
    } catch (error) {
      console.error('Error deleting pattern:', error)
    }
  }

  const setPrimaryPattern = async (patternId: string) => {
    try {
      // First, set all patterns as non-primary
      await supabase
        .from('innovation_patterns')
        .update({ is_primary: false })
        .eq('idea_id', currentIdea?.id)

      // Then set the selected pattern as primary
      const { data, error } = await supabase
        .from('innovation_patterns')
        .update({ is_primary: true })
        .eq('id', patternId)
        .select()
        .single()

      if (error) {
        console.error('Error setting primary pattern:', error)
      } else {
        // Update local state
        setPatterns(prev => prev.map(p => ({
          ...p,
          is_primary: p.id === patternId
        })))
      }
    } catch (error) {
      console.error('Error setting primary pattern:', error)
    }
  }

  const addPatternFromLibrary = (libraryPattern: typeof PATTERN_LIBRARY[0]) => {
    setEditingPattern({
      pattern_name: libraryPattern.name,
      pattern_description: libraryPattern.description,
      justification: '',
      expected_impact: '',
      is_primary: patterns.length === 0 // First pattern is primary by default
    })
    setShowLibrary(false)
  }

  const getSuggestedPatterns = () => {
    // Simple logic to suggest patterns based on idea characteristics
    // In a real implementation, this could use AI or more sophisticated matching
    return PATTERN_LIBRARY.slice(0, 3)
  }

  if (!currentIdea) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-600">Selecciona una idea para trabajar con Patrones de Innovación</p>
      </div>
    )
  }

  const completionPercentage = Math.min(100, (patterns.length / 3) * 100)

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl text-stone-900 mb-2">💡 Patrones de Innovación</h2>
            <p className="text-stone-600">
              Aplica patrones del Business Model Navigator para innovar tu modelo de negocio
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
              <div className="text-lg font-semibold text-stone-900">{Math.round(completionPercentage)}%</div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-stone-200 rounded">
          <div
            className="h-2 bg-blue-500 rounded transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="text-xs text-stone-600 mt-1">Objetivo: Al menos 3 patrones aplicados</p>
      </div>

      {/* Suggested Patterns */}
      {patterns.length === 0 && (
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            🎯 Patrones Sugeridos para tu Idea
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getSuggestedPatterns().map((pattern, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">{pattern.name}</h4>
                <p className="text-sm text-blue-700 mb-3">{pattern.description}</p>
                <button
                  onClick={() => addPatternFromLibrary(pattern)}
                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                >
                  Aplicar Patrón
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {patterns.map((pattern) => (
          <div
            key={pattern.id}
            className={`p-6 rounded-lg border-2 ${
              pattern.is_primary
                ? 'border-yellow-400 bg-yellow-50'
                : 'border-stone-300 bg-white'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <h3 className="font-semibold text-stone-900">{pattern.pattern_name}</h3>
                {pattern.is_primary && (
                  <Star size={16} className="ml-2 text-yellow-500 fill-current" />
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPrimaryPattern(pattern.id)}
                  className={`p-1 rounded transition-colors ${
                    pattern.is_primary
                      ? 'text-yellow-600 hover:text-yellow-700'
                      : 'text-stone-400 hover:text-yellow-600'
                  }`}
                  title="Marcar como patrón principal"
                >
                  <Star size={16} />
                </button>
                <button
                  onClick={() => setEditingPattern(pattern)}
                  className="p-1 text-stone-400 hover:text-blue-600 rounded transition-colors"
                  title="Editar patrón"
                >
                  <Lightbulb size={16} />
                </button>
                <button
                  onClick={() => deletePattern(pattern.id)}
                  className="p-1 text-stone-400 hover:text-red-600 rounded transition-colors"
                  title="Eliminar patrón"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-stone-700 mb-1">Descripción</h4>
                <p className="text-sm text-stone-600">{pattern.pattern_description || 'Sin descripción'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-stone-700 mb-1">Justificación</h4>
                <p className="text-sm text-stone-600">{pattern.justification || 'Sin justificación'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-stone-700 mb-1">Impacto Esperado</h4>
                <p className="text-sm text-stone-600">{pattern.expected_impact || 'Sin impacto definido'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Pattern Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setEditingPattern({
            pattern_name: '',
            pattern_description: '',
            justification: '',
            expected_impact: '',
            is_primary: patterns.length === 0
          })}
          className="btn btn-outline flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Agregar Patrón Personalizado
        </button>
        
        <button
          onClick={() => setShowLibrary(true)}
          className="btn btn-primary flex items-center"
        >
          <Lightbulb size={16} className="mr-2" />
          Explorar Biblioteca de Patrones
        </button>
      </div>

      {/* Pattern Library Modal */}
      {showLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-stone-900">
                  Biblioteca de Patrones de Innovación
                </h3>
                <button
                  onClick={() => setShowLibrary(false)}
                  className="text-stone-400 hover:text-stone-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PATTERN_LIBRARY.map((pattern, index) => (
                  <div key={index} className="border border-stone-300 rounded-lg p-4">
                    <h4 className="font-semibold text-stone-900 mb-2">{pattern.name}</h4>
                    <p className="text-sm text-stone-600 mb-3">{pattern.description}</p>
                    
                    <div className="mb-3">
                      <span className="text-xs font-medium text-stone-700">Ejemplo: </span>
                      <span className="text-xs text-stone-600">{pattern.example}</span>
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-xs font-medium text-green-700">Sostenibilidad: </span>
                      <span className="text-xs text-green-600">{pattern.sustainability_angle}</span>
                    </div>
                    
                    <button
                      onClick={() => addPatternFromLibrary(pattern)}
                      className="btn btn-sm btn-primary w-full"
                    >
                      Aplicar este Patrón
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Pattern Modal */}
      {editingPattern && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold text-stone-900">
                {editingPattern.id ? 'Editar Patrón' : 'Nuevo Patrón'}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-stone-700 font-medium mb-2">
                  Nombre del Patrón *
                </label>
                <input
                  type="text"
                  value={editingPattern.pattern_name || ''}
                  onChange={(e) => setEditingPattern(prev => prev ? {
                    ...prev,
                    pattern_name: e.target.value
                  } : null)}
                  className="input w-full"
                  placeholder="Ej: Suscripción, Plataforma, Freemium..."
                />
              </div>
              
              <div>
                <label className="block text-stone-700 font-medium mb-2">
                  Descripción del Patrón
                </label>
                <textarea
                  value={editingPattern.pattern_description || ''}
                  onChange={(e) => setEditingPattern(prev => prev ? {
                    ...prev,
                    pattern_description: e.target.value
                  } : null)}
                  className="input w-full"
                  rows={3}
                  placeholder="Describe cómo funciona este patrón..."
                />
              </div>
              
              <div>
                <label className="block text-stone-700 font-medium mb-2">
                  Justificación *
                </label>
                <textarea
                  value={editingPattern.justification || ''}
                  onChange={(e) => setEditingPattern(prev => prev ? {
                    ...prev,
                    justification: e.target.value
                  } : null)}
                  className="input w-full"
                  rows={3}
                  placeholder="¿Por qué este patrón es relevante para tu idea?"
                />
              </div>
              
              <div>
                <label className="block text-stone-700 font-medium mb-2">
                  Impacto Esperado *
                </label>
                <textarea
                  value={editingPattern.expected_impact || ''}
                  onChange={(e) => setEditingPattern(prev => prev ? {
                    ...prev,
                    expected_impact: e.target.value
                  } : null)}
                  className="input w-full"
                  rows={3}
                  placeholder="¿Qué impacto esperas que tenga aplicar este patrón?"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_primary"
                  checked={editingPattern.is_primary || false}
                  onChange={(e) => setEditingPattern(prev => prev ? {
                    ...prev,
                    is_primary: e.target.checked
                  } : null)}
                  className="mr-2"
                />
                <label htmlFor="is_primary" className="text-stone-700">
                  Marcar como patrón principal
                </label>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => setEditingPattern(null)}
                className="btn btn-outline"
              >
                Cancelar
              </button>
              <button
                onClick={() => savePattern(editingPattern)}
                disabled={!editingPattern.pattern_name || !editingPattern.justification || !editingPattern.expected_impact}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingPattern.id ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requirement Notice */}
      {patterns.length < 3 && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-8">
          <p className="text-yellow-800 text-sm">
            📋 <strong>Requisito:</strong> Aplica al menos 3 patrones de innovación para completar este paso.
            Actualmente tienes {patterns.length} de 3 requeridos.
          </p>
        </div>
      )}

      {/* Navigation */}
      {onNext && patterns.length >= 3 && (
        <div className="flex justify-end">
          <button onClick={onNext} className="btn btn-primary">
            Continuar al siguiente paso →
          </button>
        </div>
      )}
    </div>
  )
}