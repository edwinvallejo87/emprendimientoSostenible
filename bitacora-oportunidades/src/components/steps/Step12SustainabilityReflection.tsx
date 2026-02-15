import { useState, useEffect } from 'react'
import { useJournalStore } from '../../store/journal'
import { supabase } from '../../lib/supabase'
import { Sparkles, RefreshCw, Save, BookOpen, FileText, Download } from 'lucide-react'
import type { Database } from '../../lib/database.types'
import ExportButtons from '../export/ExportButtons'
import { calculateOverallProgress } from '../../lib/progress/calcProgress'

type SustainabilityReflection = Database['public']['Tables']['sustainability_reflections']['Row']
type SustainabilityReflectionUpdate = Partial<SustainabilityReflection>

interface Props {
  onNext?: () => void
}

const REFLECTION_PROMPTS = [
  {
    key: 'social_impact_balance',
    title: 'Triple Impacto: Social, Ambiental y Economico',
    question: 'Como genera tu negocio beneficios sociales y ambientales, ademas de economicos?',
    placeholder: 'Explica como tu negocio genera valor social y ambiental ademas de ingresos...',
    minLength: 100,
    tip: 'Conecta los beneficios sociales y ambientales con tus fuentes de ingresos.'
  },
  {
    key: 'sustainability_decisions',
    title: 'Decisiones Clave de Sostenibilidad',
    question: 'Que decisiones concretas tomaste para ser sostenible?',
    placeholder: 'Describe las decisiones de diseño, operacion y estrategia que hacen tu modelo sostenible...',
    minLength: 100,
    tip: 'Piensa en materiales, proveedores, procesos y alianzas que elegiste.'
  },
  {
    key: 'scaling_strategy',
    title: 'Crecer sin Perder el Proposito',
    question: 'Como planeas crecer sin sacrificar tu impacto positivo?',
    placeholder: 'Describe tu estrategia para crecer manteniendo los valores y el impacto sostenible...',
    minLength: 100,
    tip: 'Define metricas de impacto que crezcan junto con el negocio.'
  }
]

export default function Step12SustainabilityReflection({ onNext }: Props) {
  const { currentIdea } = useJournalStore()
  const [reflection, setReflection] = useState<Partial<SustainabilityReflection>>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [contextData, setContextData] = useState<any>({})

  // Load existing reflection and context data
  useEffect(() => {
    if (!currentIdea) return

    const loadData = async () => {
      setLoading(true)
      try {
        // Load existing reflection
        const { data: reflectionData, error: reflectionError } = await supabase
          .from('sustainability_reflections')
          .select('*')
          .eq('idea_id', currentIdea.id)
          .single()

        if (reflectionError && reflectionError.code !== 'PGRST116') {
          console.error('Error loading reflection:', reflectionError)
        } else if (reflectionData) {
          setReflection(reflectionData)
        }

        // Load context data from other modules
        const [canvasResult, patternsResult, ecosystemResult] = await Promise.allSettled([
          supabase
            .from('sustainable_canvas')
            .select('*')
            .eq('idea_id', currentIdea.id)
            .single(),
          supabase
            .from('innovation_patterns')
            .select('*')
            .eq('idea_id', currentIdea.id),
          supabase
            .from('ecosystem_actors')
            .select('*')
            .eq('idea_id', currentIdea.id)
        ])

        const context: any = {}
        
        if (canvasResult.status === 'fulfilled' && canvasResult.value.data) {
          context.canvas = canvasResult.value.data
        }
        
        if (patternsResult.status === 'fulfilled' && patternsResult.value.data) {
          context.patterns = patternsResult.value.data
        }
        
        if (ecosystemResult.status === 'fulfilled' && ecosystemResult.value.data) {
          context.ecosystem = ecosystemResult.value.data
        }

        setContextData(context)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [currentIdea])

  // Manual save only

  const handleFieldChange = (field: string, value: string) => {
    setReflection(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateAIReflection = async () => {
    if (!currentIdea) return

    setGenerating(true)
    try {
      // Create comprehensive reflection based on all modules
      let aiReflection = `# Reflexión Integral de Sostenibilidad\n## ${currentIdea.title}\n\n`

      // Social Impact Balance
      let socialBalance = `**Equilibrio de Triple Impacto**\n\n`
      
      if (contextData.canvas) {
        const canvas = contextData.canvas
        socialBalance += `Nuestro modelo equilibra la viabilidad financiera, el impacto ambiental y el beneficio social a través de una integración estratégica de los tres pilares de sostenibilidad:\n\n`
        
        if (canvas.social_benefits && canvas.environmental_benefits) {
          socialBalance += `• **Impacto Social**: ${canvas.social_benefits.substring(0, 150)}...\n`
          socialBalance += `• **Impacto Ambiental**: ${canvas.environmental_benefits.substring(0, 150)}...\n`
        }
        
        if (canvas.revenue_streams && canvas.cost_structure) {
          socialBalance += `• **Viabilidad Económica**: Nuestros flujos de ingresos (${canvas.revenue_streams.substring(0, 100)}...) están directamente alineados con la generación de impacto positivo, mientras que nuestra estructura de costos incluye inversiones conscientes en sostenibilidad.\n\n`
        }
        
        socialBalance += `Esta alineación asegura que a medida que el negocio crece financieramente, también se amplifica su impacto positivo social y ambiental, creando un círculo virtuoso de valor compartido.\n\n`
      }

      // Sustainability Decisions
      let sustainabilityDecisions = `**Decisiones Estratégicas de Sostenibilidad**\n\n`
      sustainabilityDecisions += `Las decisiones que hacen nuestro modelo inherentemente sostenible incluyen:\n\n`
      
      if (contextData.patterns && contextData.patterns.length > 0) {
        sustainabilityDecisions += `• **Patrones de Innovación**: Aplicamos patrones como "${contextData.patterns[0]?.pattern_name}" que promueven eficiencia de recursos y valor a largo plazo.\n`
      }
      
      if (contextData.ecosystem && contextData.ecosystem.length > 0) {
        const socialActors = contextData.ecosystem.filter((a: any) => a.actor_type === 'social').length
        const academicActors = contextData.ecosystem.filter((a: any) => a.actor_type === 'academic').length
        sustainabilityDecisions += `• **Alianzas Estratégicas**: Colaboramos con ${socialActors} organizaciones sociales y ${academicActors} instituciones académicas que refuerzan nuestro compromiso sostenible.\n`
      }
      
      if (contextData.canvas?.key_resources) {
        sustainabilityDecisions += `• **Recursos Conscientes**: Priorizamos recursos que apoyan la sostenibilidad: ${contextData.canvas.key_resources.substring(0, 100)}...\n`
      }
      
      sustainabilityDecisions += `\nEstas decisiones están integradas en nuestra operación diaria y no son iniciativas separadas, sino parte fundamental de cómo creamos y entregamos valor.\n\n`

      // Scaling Strategy
      let scalingStrategy = `**Estrategia de Escalabilidad con Propósito**\n\n`
      scalingStrategy += `Para escalar manteniendo nuestro propósito sostenible, implementamos:\n\n`
      scalingStrategy += `• **Métricas de Impacto Escalables**: Definimos KPIs que crecen proporcionalmente con el negocio, asegurando que el impacto positivo se amplifique con el crecimiento.\n\n`
      scalingStrategy += `• **Cultura Organizacional Sostenible**: Establecemos valores y procesos que mantienen la sostenibilidad como eje central independientemente del tamaño organizacional.\n\n`
      scalingStrategy += `• **Salvaguardas contra Mission Drift**: Implementamos sistemas de gobernanza que protegen el propósito sostenible, incluyendo métricas balanceadas y participación de stakeholders en decisiones estratégicas.\n\n`
      
      if (contextData.ecosystem) {
        scalingStrategy += `• **Red de Ecosistema**: Nuestra red de ${contextData.ecosystem.length} actores del ecosistema proporciona accountability y apoyo continuo para mantener estándares sostenibles durante el crecimiento.\n\n`
      }
      
      scalingStrategy += `Esta estrategia asegura que el crecimiento fortalezca, en lugar de diluir, nuestro impacto sostenible.\n\n`

      // Combine all sections
      aiReflection += socialBalance + sustainabilityDecisions + scalingStrategy

      // Add academic conclusion
      aiReflection += `**Conclusión**\n\n`
      aiReflection += `Este modelo de negocio representa un enfoque integral de sostenibilidad que va más allá del greenwashing o iniciativas superficiales. La integración profunda de consideraciones sociales, ambientales y económicas en cada aspecto del modelo - desde la propuesta de valor hasta la estructura de costos - demuestra un compromiso auténtico con la creación de valor compartido y el desarrollo sostenible.\n\n`
      aiReflection += `La aplicación de metodología efectual combinada con principios de sostenibilidad posiciona este emprendimiento para generar impacto positivo escalable y duradero en el tiempo.`

      setReflection(prev => ({
        ...prev,
        ai_generated_reflection: aiReflection
      }))
    } catch (error) {
      console.error('Error generating AI reflection:', error)
      alert('Error al generar reflexión automática. Intenta de nuevo.')
    } finally {
      setGenerating(false)
    }
  }

  const generateBasicReflections = async () => {
    if (!currentIdea) return

    setGenerating(true)
    try {
      // Generate basic content for the three main reflection fields
      let socialImpactBalance = ''
      let sustainabilityDecisions = ''
      let scalingStrategy = ''

      if (contextData.canvas) {
        const canvas = contextData.canvas
        
        // Social Impact Balance (600+ chars)
        socialImpactBalance = `${currentIdea.title} integra un modelo de triple impacto que equilibra viabilidad económica con beneficios sociales y ambientales. `
        
        if (canvas.social_benefits) {
          socialImpactBalance += `En el aspecto social, nuestro proyecto genera valor a través de: ${canvas.social_benefits.substring(0, 200)}... `
        }
        
        if (canvas.environmental_benefits) {
          socialImpactBalance += `Ambientalmente, contribuimos mediante: ${canvas.environmental_benefits.substring(0, 200)}... `
        }
        
        if (canvas.revenue_streams) {
          socialImpactBalance += `Económicamente, mantenemos sostenibilidad financiera a través de flujos de ingresos diversificados que incluyen ${canvas.revenue_streams.substring(0, 150)}... `
        }
        
        socialImpactBalance += `Esta integración asegura que el crecimiento empresarial amplifique el impacto positivo social y ambiental, creando un círculo virtuoso de valor compartido que beneficia a todos los stakeholders involucrados.`
        
        // Sustainability Decisions (600+ chars)
        sustainabilityDecisions = `Las decisiones estratégicas que hacen nuestro modelo inherentemente sostenible incluyen múltiples aspectos operativos y estratégicos. `
        
        if (contextData.patterns && contextData.patterns.length > 0) {
          sustainabilityDecisions += `Implementamos patrones de innovación específicos como "${contextData.patterns[0]?.pattern_name}", que nos permite optimizar el uso de recursos y generar valor a largo plazo. `
        }
        
        if (canvas.key_resources) {
          sustainabilityDecisions += `En términos de recursos, priorizamos aquellos que apoyan la sostenibilidad: ${canvas.key_resources.substring(0, 150)}... `
        }
        
        if (contextData.ecosystem && contextData.ecosystem.length > 0) {
          const socialCount = contextData.ecosystem.filter((a: any) => a.actor_type === 'social').length
          sustainabilityDecisions += `Establecemos alianzas estratégicas con ${contextData.ecosystem.length} actores del ecosistema, incluyendo ${socialCount} organizaciones sociales, lo que refuerza nuestro compromiso con la sostenibilidad. `
        }
        
        sustainabilityDecisions += `Estas decisiones están integradas en nuestra operación diaria como elementos fundamentales del modelo de negocio, no como iniciativas complementarias.`
        
        // Scaling Strategy (600+ chars)
        scalingStrategy = `Nuestra estrategia de escalabilidad mantiene el propósito sostenible mediante mecanismos específicos de gobernanza y operación. `
        scalingStrategy += `Implementamos métricas de impacto escalables que crecen proporcionalmente con el negocio, asegurando que el crecimiento amplifica el impacto positivo en lugar de diluirlo. `
        scalingStrategy += `Establecemos una cultura organizacional que mantiene la sostenibilidad como eje central independientemente del tamaño de la empresa. `
        
        if (contextData.ecosystem) {
          scalingStrategy += `Nuestra red de ${contextData.ecosystem.length} actores del ecosistema proporciona accountability continuo y apoyo para mantener estándares sostenibles durante el crecimiento. `
        }
        
        scalingStrategy += `Implementamos salvaguardas contra la deriva de misión (mission drift) mediante sistemas de gobernanza que protegen el propósito sostenible, incluyendo métricas balanceadas entre rentabilidad e impacto, y participación activa de stakeholders en decisiones estratégicas clave. Esta aproximación asegura que el escalamiento fortalece nuestro impacto sostenible.`
      } else {
        // Fallback content if no canvas data available
        socialImpactBalance = `${currentIdea.title} busca generar un impacto social positivo significativo en su mercado objetivo mientras mantiene viabilidad económica sólida. Nuestro modelo integra consideraciones sociales, ambientales y económicas desde el diseño inicial, asegurando que cada decisión empresarial contribuya al triple impacto. Esta integración estratégica permite que el crecimiento financiero amplique el beneficio social y ambiental, creando valor sostenible para todos los stakeholders. Implementamos métricas de impacto que nos permiten monitorear y optimizar constantemente nuestro equilibrio entre rentabilidad y propósito social.`
        
        sustainabilityDecisions = `Las decisiones que hacen nuestro modelo inherentemente sostenible incluyen la selección cuidadosa de procesos eficientes en recursos, el diseño de un modelo de negocio circular que minimiza desperdicios, y la consideración prioritaria del impacto en comunidades locales. Priorizamos proveedores y socios que comparten nuestros valores sostenibles, implementamos tecnologías que reducen nuestra huella ambiental, y diseñamos productos/servicios que educan y empoderan a nuestros usuarios hacia comportamientos más sostenibles. Estas decisiones están integradas en nuestra operación diaria como elementos fundamentales, no como iniciativas complementarias.`
        
        scalingStrategy = `Nuestra estrategia de escalamiento prioriza la preservación del impacto mediante certificaciones ambientales reconocidas, alianzas estratégicas con organizaciones que comparten nuestra misión, y un marco de gobernanza que protege nuestro propósito durante el crecimiento. Implementamos métricas de impacto escalables, mantenemos una cultura organizacional sostenible, y establecemos salvaguardas contra la deriva de misión. La expansión geográfica considerará mercados con marcos regulatorios similares y conciencia ambiental establecida, asegurando que el crecimiento fortalezca nuestro impacto sostenible en lugar de diluirlo.`
      }

      const updatedReflection = {
        ...reflection,
        social_impact_balance: socialImpactBalance,
        sustainability_decisions: sustainabilityDecisions,
        scaling_strategy: scalingStrategy
      }

      setReflection(updatedReflection)

      // Save to database
      await saveReflection(updatedReflection)
      
    } catch (error) {
      console.error('Error generating basic reflections:', error)
      alert('Error al generar reflexiones básicas. Intenta de nuevo.')
    } finally {
      setGenerating(false)
    }
  }

  const saveReflection = async (dataToSave: Partial<SustainabilityReflection>) => {
    if (!currentIdea) return

    setSaving(true)
    try {
      // Check if record exists first
      const { data: existingData, error: checkError } = await supabase
        .from('sustainability_reflections')
        .select('*')
        .eq('idea_id', currentIdea.id)
        .single()

      let result
      if (existingData && !checkError) {
        // Update existing record
        result = await supabase
          .from('sustainability_reflections')
          .update({
            social_impact_balance: dataToSave.social_impact_balance,
            sustainability_decisions: dataToSave.sustainability_decisions,
            scaling_strategy: dataToSave.scaling_strategy,
            ai_generated_reflection: dataToSave.ai_generated_reflection,
            updated_at: new Date().toISOString()
          })
          .eq('idea_id', currentIdea.id)
      } else {
        // Insert new record
        result = await supabase
          .from('sustainability_reflections')
          .insert({
            idea_id: currentIdea.id,
            social_impact_balance: dataToSave.social_impact_balance,
            sustainability_decisions: dataToSave.sustainability_decisions,
            scaling_strategy: dataToSave.scaling_strategy,
            ai_generated_reflection: dataToSave.ai_generated_reflection
          })
      }

      if (result.error) {
        console.error('Error saving reflection:', result.error)
        alert('Error al guardar la reflexión. Intenta de nuevo.')
      }
    } catch (error) {
      console.error('Error saving reflection:', error)
      alert('Error al guardar la reflexión. Intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    const requiredFields = REFLECTION_PROMPTS.map(p => p.key)
    const filledFields = requiredFields.filter(field => {
      const value = reflection[field as keyof SustainabilityReflection]
      return value && String(value).trim().length >= 50 // Minimum meaningful length
    })
    
    // Bonus for AI reflection
    let bonus = 0
    if (reflection.ai_generated_reflection && reflection.ai_generated_reflection.length > 500) {
      bonus = 20
    }
    
    return Math.min(100, Math.round((filledFields.length / requiredFields.length) * 80) + bonus)
  }

  if (!currentIdea) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Selecciona una idea para trabajar en la Reflexión Final</p>
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
            <h2 className="text-2xl text-gray-900 mb-2">Impacto Sostenible</h2>
            <p className="text-gray-600">
              Como tu negocio equilibra crecimiento con responsabilidad social y ambiental
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
            className="h-2 bg-primary-500 rounded transition-all duration-300"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      <div className="space-y-8">
        {/* Context Summary */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Datos Disponibles</h3>
            <button
              onClick={generateBasicReflections}
              disabled={generating}
              className="btn btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {generating ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles size={16} className="mr-2" />
                  Generar borrador con IA
                </>
              )}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-1">Canvas Sostenible</h4>
              <p className="text-gray-700">
                {contextData.canvas ? '✅ Completo' : '⏳ Pendiente'} - 14 bloques de modelo sostenible
              </p>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-1">Patrones de Innovación</h4>
              <p className="text-gray-700">
                {contextData.patterns?.length > 0 ? `✅ ${contextData.patterns.length} patrones` : '⏳ Pendiente'}
              </p>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-1">Ecosistema</h4>
              <p className="text-gray-700">
                {contextData.ecosystem?.length > 0 ? `✅ ${contextData.ecosystem.length} actores` : '⏳ Pendiente'}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Usa "Generar borrador con IA" para crear un borrador automatico basado en tus datos existentes.
          </p>
        </div>

        {/* Reflection Prompts */}
        {REFLECTION_PROMPTS.map((prompt) => (
          <div key={prompt.key} className="bg-white p-6 rounded-lg border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {prompt.title}
            </h3>
            <p className="text-gray-700 mb-4 font-medium">{prompt.question}</p>
            
            <textarea
              value={String(reflection[prompt.key as keyof SustainabilityReflection] || '')}
              onChange={(e) => handleFieldChange(prompt.key, e.target.value)}
              placeholder={prompt.placeholder}
              className="input w-full mb-4"
              rows={6}
            />
            
            <p className="text-xs text-gray-500 mt-2">{prompt.tip}</p>
          </div>
        ))}

        {/* AI Enhanced Reflection */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Resumen IA de tu Impacto
            </h3>
            <button
              onClick={generateAIReflection}
              disabled={generating || !contextData.canvas}
              className="btn btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {generating ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles size={16} className="mr-2" />
                  Generar Reflexión Integral
                </>
              )}
            </button>
          </div>
          
          <textarea
            value={reflection.ai_generated_reflection || ''}
            onChange={(e) => handleFieldChange('ai_generated_reflection', e.target.value)}
            placeholder="La IA generará una reflexión integral en formato académico basada en todos los módulos completados..."
            className="w-full p-4 border border-gray-300 rounded-lg text-sm bg-white font-mono"
            rows={12}
            readOnly={generating}
          />
          
          {!contextData.canvas && (
            <p className="text-sm text-gray-600 mt-2">
              💡 Completa el Canvas Sostenible y otros módulos para generar una reflexión más rica
            </p>
          )}
          
          {reflection.ai_generated_reflection && (
            <div className="mt-4 text-xs text-gray-600">
              ✨ Esta reflexión integra datos de todos los módulos completados en formato APA-friendly
            </div>
          )}
        </div>

        {/* Completion Notice */}
        {completion < 80 && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 text-sm">
              Completa las tres reflexiones para continuar.
            </p>
          </div>
        )}
      </div>

      {/* Final Export Section */}
      {completion >= 80 && (
        <div className="mt-8 bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="text-center">
            <h3 className="text-xl font-bold text-green-900 mb-3">
              🎉 ¡Bitácora Completa!
            </h3>
            <p className="text-green-800 mb-4">
              Has completado el analisis de tu idea.
            </p>
            
            <div className="flex flex-col items-center space-y-4 mb-4">
              <ExportButtons disabled={false} />
              
            </div>
            
            <div className="text-sm text-green-700 text-center">
              Tu análisis está completo. Puedes exportar una presentación profesional con todos los hallazgos.
            </div>
          </div>
        </div>
      )}
      
    </div>
  )
}