import { useState, useEffect } from 'react'
import { useJournalStore } from '../../store/journal'
import { supabase } from '../../lib/supabase'
import { Plus, Trash2, Users, Building, GraduationCap, Heart, Landmark, Save } from 'lucide-react'
import type { Database } from '../../lib/database.types'

type EcosystemActor = Database['public']['Tables']['ecosystem_actors']['Row']
type EcosystemActorInsert = Database['public']['Tables']['ecosystem_actors']['Insert']

interface Props {
  onNext?: () => void
}

const ACTOR_TYPES = [
  { 
    value: 'financial', 
    label: 'Financiadores',
    icon: Building,
    color: 'green',
    description: 'Inversores, bancos, fondos, microfinancieras',
    examples: 'VCs, bancos, crowdfunding, inversionistas ángel'
  },
  { 
    value: 'academic', 
    label: 'Educacion e Investigacion',
    icon: GraduationCap,
    color: 'blue',
    description: 'Universidades, centros de investigación, think tanks',
    examples: 'Universidades, SENA, MinCiencias, institutos'
  },
  { 
    value: 'business', 
    label: 'Aliados de Negocio',
    icon: Building,
    color: 'purple',
    description: 'Empresas, corporaciones, cámaras de comercio',
    examples: 'Grandes empresas, startups, cámaras, gremios'
  },
  { 
    value: 'social', 
    label: 'Impacto Social',
    icon: Heart,
    color: 'pink',
    description: 'ONGs, fundaciones, comunidades, movimientos',
    examples: 'ONGs, fundaciones, comunidades locales'
  },
  { 
    value: 'institutional', 
    label: 'Gobierno y Reguladores',
    icon: Landmark,
    color: 'indigo',
    description: 'Gobierno, entidades públicas, reguladores',
    examples: 'MinComercio, alcaldías, SIC, reguladores'
  }
]

const SUPPORT_TYPES = [
  { value: 'funding', label: '💰 Financiación', description: 'Capital, créditos, subvenciones' },
  { value: 'mentorship', label: '🧭 Mentoría', description: 'Guía estratégica y experiencia' },
  { value: 'infrastructure', label: '🏢 Infraestructura', description: 'Espacios, equipos, laboratorios' },
  { value: 'networking', label: '🤝 Networking', description: 'Conexiones y redes de contacto' },
  { value: 'technical', label: '🔧 Técnico', description: 'Conocimiento especializado, I+D' },
  { value: 'legal', label: '⚖️ Legal', description: 'Asesoría jurídica y regulatoria' },
  { value: 'marketing', label: '📢 Marketing', description: 'Promoción, canales, validación' }
]

const RELATIONSHIP_STATUS = [
  { value: 'potential', label: 'Potencial', color: 'gray' },
  { value: 'contacted', label: 'Contactado', color: 'yellow' },
  { value: 'committed', label: 'Comprometido', color: 'green' }
]

export default function Step11EcosystemMap({ onNext }: Props) {
  const { currentIdea } = useJournalStore()
  const [actors, setActors] = useState<EcosystemActor[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingActor, setEditingActor] = useState<Partial<EcosystemActor> | null>(null)

  // Load existing ecosystem actors
  useEffect(() => {
    if (!currentIdea) return

    const loadActors = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('ecosystem_actors')
          .select('*')
          .eq('idea_id', currentIdea.id)
          .order('created_at', { ascending: true })

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading ecosystem actors:', error)
        } else if (data) {
          setActors(data)
        }
      } catch (error) {
        console.error('Error loading ecosystem actors:', error)
      } finally {
        setLoading(false)
      }
    }

    loadActors()
  }, [currentIdea])

  const saveActor = async (actorData: Partial<EcosystemActor>) => {
    if (!currentIdea) return

    setSaving(true)
    try {
      if (actorData.id) {
        // Update existing actor
        const { data, error } = await supabase
          .from('ecosystem_actors')
          .update(actorData)
          .eq('id', actorData.id)
          .select()
          .single()

        if (error) {
          console.error('Error updating actor:', error)
        } else if (data) {
          setActors(prev => prev.map(a => a.id === data.id ? data : a))
        }
      } else {
        // Create new actor
        const insertData: EcosystemActorInsert = {
          idea_id: currentIdea.id,
          actor_name: actorData.actor_name || '',
          actor_type: actorData.actor_type || 'business',
          role_description: actorData.role_description || null,
          support_types: actorData.support_types || [],
          benefit_to_venture: actorData.benefit_to_venture || null,
          benefit_to_actor: actorData.benefit_to_actor || null,
          contact_info: actorData.contact_info || null,
          relationship_status: actorData.relationship_status || 'potential'
        }

        const { data, error } = await supabase
          .from('ecosystem_actors')
          .insert(insertData)
          .select()
          .single()

        if (error) {
          console.error('Error creating actor:', error)
        } else if (data) {
          setActors(prev => [...prev, data])
        }
      }
    } catch (error) {
      console.error('Error saving actor:', error)
    } finally {
      setSaving(false)
      setEditingActor(null)
    }
  }

  const deleteActor = async (actorId: string) => {
    try {
      const { error } = await supabase
        .from('ecosystem_actors')
        .delete()
        .eq('id', actorId)

      if (error) {
        console.error('Error deleting actor:', error)
      } else {
        setActors(prev => prev.filter(a => a.id !== actorId))
      }
    } catch (error) {
      console.error('Error deleting actor:', error)
    }
  }

  const handleSupportTypeToggle = (supportType: string) => {
    if (!editingActor) return
    
    const currentTypes = editingActor.support_types || []
    const newTypes = currentTypes.includes(supportType as any)
      ? currentTypes.filter(t => t !== supportType)
      : [...currentTypes, supportType as any]
    
    setEditingActor(prev => prev ? {
      ...prev,
      support_types: newTypes
    } : null)
  }

  // Group actors by type for visualization
  const actorsByType = ACTOR_TYPES.map(type => ({
    ...type,
    actors: actors.filter(actor => actor.actor_type === type.value)
  }))

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    // At least 2 actors per category (ideally), minimum 8 total
    const minActorsPerType = 1
    const totalActorsNeeded = ACTOR_TYPES.length * minActorsPerType
    const actualActors = actors.length
    
    return Math.min(100, Math.round((actualActors / totalActorsNeeded) * 100))
  }

  // Get ecosystem insights
  const getEcosystemInsights = () => {
    const totalActors = actors.length
    const committedActors = actors.filter(a => a.relationship_status === 'committed').length
    const contactedActors = actors.filter(a => a.relationship_status === 'contacted').length
    const typeCoverage = ACTOR_TYPES.filter(type => 
      actors.some(actor => actor.actor_type === type.value)
    ).length
    
    return {
      totalActors,
      committedActors,
      contactedActors,
      typeCoverage,
      coveragePercentage: Math.round((typeCoverage / ACTOR_TYPES.length) * 100)
    }
  }

  if (!currentIdea) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Selecciona una idea para trabajar en el Mapa del Ecosistema</p>
      </div>
    )
  }

  const completion = getCompletionPercentage()
  const insights = getEcosystemInsights()

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl text-gray-900 mb-2">Red de Aliados y Soporte</h2>
            <p className="text-gray-600">
              Organizaciones y personas clave que pueden ayudarte a crecer
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {saving && (
              <span className="text-gray-500 text-sm flex items-center">
                <Save size={16} className="mr-1" />
                Guardando...
              </span>
            )}
            <div className="text-right">
              <div className="text-sm text-gray-600">Progreso</div>
              <div className="text-lg font-semibold text-gray-900">{completion}%</div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-orange-500 rounded transition-all duration-300"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {/* Ecosystem Insights */}
      <div className="bg-orange-50 p-6 rounded-lg border border-orange-200 mb-8">
        <h3 className="text-lg font-semibold text-orange-900 mb-4">Resumen de tu Red</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-700">{insights.totalActors}</div>
            <div className="text-sm text-orange-600">Total Actores</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">{insights.committedActors}</div>
            <div className="text-sm text-green-600">Comprometidos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-700">{insights.contactedActors}</div>
            <div className="text-sm text-yellow-600">Contactados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-700">{insights.typeCoverage}/5</div>
            <div className="text-sm text-primary-600">Tipos Cubiertos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-700">{insights.coveragePercentage}%</div>
            <div className="text-sm text-purple-600">Cobertura</div>
          </div>
        </div>
      </div>

      {/* Ecosystem Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {actorsByType.map((typeGroup) => {
          const IconComponent = typeGroup.icon
          return (
            <div key={typeGroup.value} className="bg-white p-6 rounded-lg border border-gray-300">
              <div className="flex items-center mb-4">
                <div className={`p-2 rounded-lg bg-${typeGroup.color}-100 mr-3`}>
                  <IconComponent size={20} className={`text-${typeGroup.color}-600`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{typeGroup.label}</h3>
                  <p className="text-xs text-gray-600">{typeGroup.examples}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                {typeGroup.actors.map((actor) => (
                  <div
                    key={actor.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h4 className="font-medium text-gray-900 text-sm">{actor.actor_name}</h4>
                          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                            actor.relationship_status === 'committed' 
                              ? 'bg-green-100 text-green-700'
                              : actor.relationship_status === 'contacted'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {RELATIONSHIP_STATUS.find(s => s.value === actor.relationship_status)?.label}
                          </span>
                        </div>
                        {actor.role_description && (
                          <p className="text-xs text-gray-600 mb-2">{actor.role_description}</p>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {actor.support_types.map((type) => {
                            const supportType = SUPPORT_TYPES.find(s => s.value === type)
                            return (
                              <span key={type} className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                                {supportType?.label}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <button
                          onClick={() => setEditingActor(actor)}
                          className="p-1 text-gray-400 hover:text-primary-600 rounded transition-colors"
                          title="Editar actor"
                        >
                          <Users size={14} />
                        </button>
                        <button
                          onClick={() => deleteActor(actor.id)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                          title="Eliminar actor"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setEditingActor({
                  actor_type: typeGroup.value as any,
                  actor_name: '',
                  support_types: [],
                  relationship_status: 'potential'
                })}
                className="w-full text-sm text-gray-600 border border-dashed border-gray-300 rounded-lg py-2 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center"
              >
                <Plus size={16} className="mr-1" />
                Agregar {typeGroup.label}
              </button>
            </div>
          )
        })}
      </div>

      {/* Add Actor Modal */}
      {editingActor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingActor.id ? 'Editar Actor' : 'Nuevo Actor del Ecosistema'}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Nombre del Actor *
                  </label>
                  <input
                    type="text"
                    value={editingActor.actor_name || ''}
                    onChange={(e) => setEditingActor(prev => prev ? {
                      ...prev,
                      actor_name: e.target.value
                    } : null)}
                    className="input w-full"
                    placeholder="Ej: Universidad EAN, Bancolombia, Ruta N..."
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Tipo de Actor *
                  </label>
                  <select
                    value={editingActor.actor_type || ''}
                    onChange={(e) => setEditingActor(prev => prev ? {
                      ...prev,
                      actor_type: e.target.value as any
                    } : null)}
                    className="input w-full"
                  >
                    {ACTOR_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Rol y Descripción
                </label>
                <textarea
                  value={editingActor.role_description || ''}
                  onChange={(e) => setEditingActor(prev => prev ? {
                    ...prev,
                    role_description: e.target.value
                  } : null)}
                  className="input w-full"
                  rows={2}
                  placeholder="Describe el rol específico que cumple este actor..."
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-3">
                  Tipos de Apoyo que Proporciona *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SUPPORT_TYPES.map((support) => (
                    <div
                      key={support.value}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        editingActor.support_types?.includes(support.value as any)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-300 bg-white hover:border-primary-300'
                      }`}
                      onClick={() => handleSupportTypeToggle(support.value)}
                    >
                      <h4 className="text-sm font-medium text-gray-900">{support.label}</h4>
                      <p className="text-xs text-gray-600">{support.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Beneficio para el Emprendimiento
                  </label>
                  <textarea
                    value={editingActor.benefit_to_venture || ''}
                    onChange={(e) => setEditingActor(prev => prev ? {
                      ...prev,
                      benefit_to_venture: e.target.value
                    } : null)}
                    className="input w-full"
                    rows={3}
                    placeholder="¿Cómo nos beneficia específicamente este actor?"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Beneficio para el Actor (Reciprocidad)
                  </label>
                  <textarea
                    value={editingActor.benefit_to_actor || ''}
                    onChange={(e) => setEditingActor(prev => prev ? {
                      ...prev,
                      benefit_to_actor: e.target.value
                    } : null)}
                    className="input w-full"
                    rows={3}
                    placeholder="¿Qué valor podemos ofrecer a este actor?"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Información de Contacto
                  </label>
                  <input
                    type="text"
                    value={editingActor.contact_info || ''}
                    onChange={(e) => setEditingActor(prev => prev ? {
                      ...prev,
                      contact_info: e.target.value
                    } : null)}
                    className="input w-full"
                    placeholder="Email, teléfono, LinkedIn..."
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Estado de la Relación
                  </label>
                  <select
                    value={editingActor.relationship_status || 'potential'}
                    onChange={(e) => setEditingActor(prev => prev ? {
                      ...prev,
                      relationship_status: e.target.value
                    } : null)}
                    className="input w-full"
                  >
                    {RELATIONSHIP_STATUS.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => setEditingActor(null)}
                className="btn btn-outline"
              >
                Cancelar
              </button>
              <button
                onClick={() => saveActor(editingActor)}
                disabled={!editingActor.actor_name || !editingActor.support_types?.length}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingActor.id ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requirement Notice */}
      {actors.length < 5 && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-8">
          <p className="text-yellow-800 text-sm">
            Mapea al menos 5 contactos o organizaciones que puedan apoyarte.
            Actualmente tienes {actors.length} mapeados.
          </p>
        </div>
      )}

    </div>
  )
}