import { useState, useEffect } from 'react'
import { useJournalStore } from '../../store/journal'
import { supabase } from '../../lib/supabase'
import type { Database } from '../../lib/database.types'
import { Sparkles, RefreshCw, Save } from 'lucide-react'

type SustainableCanvas = Database['public']['Tables']['sustainable_canvas']['Row']
type SustainableCanvasUpdate = Database['public']['Tables']['sustainable_canvas']['Update']

interface Props {
  onNext?: () => void
}

export default function Step7SustainableCanvas({ onNext }: Props) {
  const { currentIdea } = useJournalStore()
  const [canvas, setCanvas] = useState<Partial<SustainableCanvas>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [dbError, setDbError] = useState<string | null>(null)

  // Canvas structure - 14 blocks according to EAN Sustainable Canvas
  const canvasBlocks = [
    // Customer Side (Left) - 8 blocks
    {
      key: 'customer_segments',
      title: 'Clientes',
      description: '¿Quiénes son nuestros clientes más importantes?',
      placeholder: 'Ej: Consumidores eco-conscientes, empresas B2B sostenibles...',
      section: 'customer'
    },
    {
      key: 'value_propositions',
      title: 'Propuesta de Valor',
      description: '¿Qué valor entregamos a cada segmento?',
      placeholder: 'Ej: Productos eco-friendly con impacto positivo...',
      section: 'customer'
    },
    {
      key: 'products_services',
      title: 'Productos / Servicios',
      description: '¿Qué productos/servicios ofrecemos específicamente?',
      placeholder: 'Ej: App de tracking de huella de carbono, consultorías...',
      section: 'customer'
    },
    {
      key: 'channels',
      title: 'Canales',
      description: '¿Cómo llegamos y entregamos valor a nuestros clientes?',
      placeholder: 'Ej: Plataforma digital, tiendas físicas, partners...',
      section: 'customer'
    },
    {
      key: 'customer_relationships',
      title: 'Relacion con Clientes',
      description: '¿Qué tipo de relación establecemos?',
      placeholder: 'Ej: Comunidad activa, soporte personalizado, self-service...',
      section: 'customer'
    },
    {
      key: 'revenue_streams',
      title: 'Ingresos',
      description: '¿Cómo generamos ingresos?',
      placeholder: 'Ej: Suscripciones, comisiones, licencias, ventas directas...',
      section: 'customer'
    },
    {
      key: 'social_benefits',
      title: 'Impacto Social +',
      description: '¿Qué impacto social positivo generamos?',
      placeholder: 'Ej: Empleos dignos, educación ambiental, inclusión social...',
      section: 'customer'
    },
    {
      key: 'environmental_benefits',
      title: 'Impacto Ambiental +',
      description: '¿Qué impacto ambiental positivo creamos?',
      placeholder: 'Ej: Reducción CO2, economía circular, conservación...',
      section: 'customer'
    },
    // Business Side (Right) - 6 blocks
    {
      key: 'key_resources',
      title: 'Recursos Clave',
      description: '¿Qué recursos son indispensables?',
      placeholder: 'Ej: Tecnología, equipo especializado, certificaciones...',
      section: 'business'
    },
    {
      key: 'key_activities',
      title: 'Actividades Clave',
      description: '¿Qué actividades son más importantes?',
      placeholder: 'Ej: I+D sostenible, marketing digital, operaciones...',
      section: 'business'
    },
    {
      key: 'key_partnerships',
      title: 'Alianzas Clave',
      description: '¿Quiénes son nuestros socios estratégicos?',
      placeholder: 'Ej: ONGs, proveedores sostenibles, instituciones...',
      section: 'business'
    },
    {
      key: 'cost_structure',
      title: 'Costos',
      description: '¿Cuáles son nuestros costos más importantes?',
      placeholder: 'Ej: Desarrollo tecnológico, marketing, operaciones...',
      section: 'business'
    },
    {
      key: 'social_costs',
      title: 'Riesgo Social',
      description: '¿Qué costos sociales pueden surgir?',
      placeholder: 'Ej: Capacitación, cambio cultural, resistencia al cambio...',
      section: 'business'
    },
    {
      key: 'environmental_costs',
      title: 'Riesgo Ambiental',
      description: '¿Qué costos ambientales debemos considerar?',
      placeholder: 'Ej: Certificaciones verdes, materiales eco-friendly...',
      section: 'business'
    }
  ]

  // Load existing canvas data
  useEffect(() => {
    if (!currentIdea) return

    const loadCanvas = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('sustainable_canvas')
          .select('*')
          .eq('idea_id', currentIdea.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading sustainable canvas:', error)
          // If table doesn't exist, just continue with empty state
          if (error.message?.includes('relation "sustainable_canvas" does not exist')) {
            console.warn('Sustainable canvas table not found - migration may be needed')
            setDbError('La tabla de Canvas Sostenible no existe. Es necesario ejecutar la migración de base de datos.')
          }
        } else if (data) {
          setCanvas(data)
        }
      } catch (error) {
        console.error('Error loading sustainable canvas:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCanvas()
  }, [currentIdea])

  // Manual save function
  const saveCanvas = async () => {
    if (!currentIdea) return
    
    setSaving(true)
    try {
      const updateData: SustainableCanvasUpdate = {
        idea_id: currentIdea.id,
        ...canvas,
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('sustainable_canvas')
        .upsert(updateData, { onConflict: 'idea_id' })
        .select()
        .single()

      if (error) {
        console.error('Error saving canvas:', error)
        alert('Error al guardar el canvas')
      } else if (data) {
        setCanvas(data)
        alert('Canvas guardado exitosamente')
      }
    } catch (error) {
      console.error('Error saving canvas:', error)
      alert('Error al guardar el canvas')
    } finally {
      setSaving(false)
    }
  }

  const handleFieldChange = (field: string, value: string) => {
    setCanvas(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateSustainabilityReflection = async () => {
    if (!currentIdea) return

    setGenerating(true)
    try {
      // Check if we have enough data for meaningful reflection
      const filledBlocks = canvasBlocks.filter(block => 
        canvas[block.key as keyof SustainableCanvas] && 
        String(canvas[block.key as keyof SustainableCanvas]).trim().length > 10
      )

      if (filledBlocks.length < 6) {
        alert('Completa al menos 6 bloques del canvas para generar una reflexión de sostenibilidad')
        return
      }

      // Generate AI reflection prompt
      const prompt = `Basándote en el siguiente Canvas Sostenible, genera una reflexión académica sobre cómo este modelo de negocio equilibra la viabilidad financiera, el impacto ambiental y el beneficio social:

      Segmentos: ${canvas.customer_segments || 'N/A'}
      Propuesta de Valor: ${canvas.value_propositions || 'N/A'}
      Beneficios Sociales: ${canvas.social_benefits || 'N/A'}
      Beneficios Ambientales: ${canvas.environmental_benefits || 'N/A'}
      Ingresos: ${canvas.revenue_streams || 'N/A'}
      Costos: ${canvas.cost_structure || 'N/A'}

      Genera una reflexión de 2-3 párrafos que explique cómo este modelo equilibra los tres pilares de la sostenibilidad.`

      // Here you would call your AI service
      // For now, we'll generate a basic template
      const reflection = `El modelo equilibra viabilidad financiera, impacto ambiental y beneficio social porque integra ${canvas.social_benefits ? 'beneficios sociales claros' : 'elementos sociales'} y ${canvas.environmental_benefits ? 'beneficios ambientales específicos' : 'consideraciones ambientales'} dentro de una estructura de ingresos sostenible.

      La propuesta de valor conecta directamente con segmentos de clientes que valoran la sostenibilidad, permitiendo generar ingresos mientras se crea impacto positivo. Los costos asociados a la sostenibilidad se compensan con la diferenciación en el mercado y la lealtad de clientes conscientes.

      Este enfoque asegura que el crecimiento del negocio esté alineado con objetivos de desarrollo sostenible, creando un círculo virtuoso donde el éxito comercial refuerza el impacto positivo social y ambiental.`

      setCanvas(prev => ({
        ...prev,
        sustainability_reflection: reflection
      }))
    } catch (error) {
      console.error('Error generating reflection:', error)
      alert('Error al generar la reflexión. Intenta de nuevo.')
    } finally {
      setGenerating(false)
    }
  }

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    const filledBlocks = canvasBlocks.filter(block => {
      const value = canvas[block.key as keyof SustainableCanvas]
      return value && String(value).trim().length > 0
    })
    return Math.round((filledBlocks.length / canvasBlocks.length) * 100)
  }

  if (!currentIdea) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Selecciona una idea para trabajar en el Canvas Sostenible</p>
      </div>
    )
  }

  const completion = getCompletionPercentage()

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl text-gray-900 mb-2">Modelo de Negocio Sostenible</h2>
            <p className="text-gray-600">
              Como creas, entregas y capturas valor de forma sostenible
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={saveCanvas}
              disabled={saving || !currentIdea}
              className="btn btn-primary text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Guardar Canvas
                </>
              )}
            </button>
            <div className="text-right">
              <div className="text-sm text-gray-600">Progreso</div>
              <div className="text-lg font-semibold text-gray-900">{completion}%</div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-green-500 rounded transition-all duration-300"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      {/* Database Error Notice */}
      {dbError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Migración de Base de Datos Requerida</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>{dbError}</p>
                <p className="mt-1">La interfaz funciona, pero los datos no se guardarán hasta ejecutar la migración SQL.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Canvas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Customer Side */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Valor para el Cliente
          </h3>
          {canvasBlocks
            .filter(block => block.section === 'customer')
            .map((block) => (
              <div key={block.key} className="bg-white p-4 rounded-lg border border-gray-300">
                <h4 className="font-medium text-gray-900 mb-2">{block.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{block.description}</p>
                <textarea
                  value={String(canvas[block.key as keyof SustainableCanvas] || '')}
                  onChange={(e) => handleFieldChange(block.key, e.target.value)}
                  placeholder={block.placeholder}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none"
                  rows={3}
                />
              </div>
            ))}
        </div>

        {/* Business Side */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Operaciones del Negocio
          </h3>
          {canvasBlocks
            .filter(block => block.section === 'business')
            .map((block) => (
              <div key={block.key} className="bg-white p-4 rounded-lg border border-gray-300">
                <h4 className="font-medium text-gray-900 mb-2">{block.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{block.description}</p>
                <textarea
                  value={String(canvas[block.key as keyof SustainableCanvas] || '')}
                  onChange={(e) => handleFieldChange(block.key, e.target.value)}
                  placeholder={block.placeholder}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none"
                  rows={3}
                />
              </div>
            ))}
        </div>
      </div>

    </div>
  )
}