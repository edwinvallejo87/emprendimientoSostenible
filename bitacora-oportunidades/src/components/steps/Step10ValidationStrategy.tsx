import { useState, useEffect } from 'react'
import { useJournalStore } from '../../store/journal'
import { supabase } from '../../lib/supabase'
import { CheckCircle, Clock, Target, DollarSign, Save, BarChart3 } from 'lucide-react'
import type { Database } from '../../lib/database.types'

type ValidationStrategy = Database['public']['Tables']['validation_strategies']['Row']
type ValidationStrategyUpdate = Partial<ValidationStrategy>

interface Props {
  onNext?: () => void
}

const VALIDATION_METHODS = [
  { 
    value: 'interview', 
    label: 'Entrevistas', 
    description: 'Conversaciones directas con usuarios target',
    time: '1-2 semanas',
    cost: 'Bajo ($0-100)',
    reliability: 'Alta'
  },
  { 
    value: 'survey', 
    label: 'Encuestas', 
    description: 'Cuestionarios estructurados a gran escala',
    time: '1 semana',
    cost: 'Muy bajo ($0-50)',
    reliability: 'Media'
  },
  { 
    value: 'landing_page', 
    label: 'Landing Page', 
    description: 'Página de aterrizaje para medir interés',
    time: '3-5 días',
    cost: 'Bajo ($50-200)',
    reliability: 'Media'
  },
  { 
    value: 'ab_test', 
    label: 'A/B Testing', 
    description: 'Pruebas comparativas de versiones',
    time: '2-4 semanas',
    cost: 'Medio ($100-500)',
    reliability: 'Alta'
  },
  { 
    value: 'observation', 
    label: 'Observación', 
    description: 'Observar comportamiento natural de usuarios',
    time: '1-3 semanas',
    cost: 'Bajo ($0-100)',
    reliability: 'Alta'
  },
  { 
    value: 'focus_group', 
    label: 'Focus Groups', 
    description: 'Sesiones grupales de discusión',
    time: '1-2 semanas',
    cost: 'Medio ($200-800)',
    reliability: 'Media'
  },
  { 
    value: 'prototype_test', 
    label: 'Test de Prototipo', 
    description: 'Pruebas de usabilidad con prototipo',
    time: '1-2 semanas',
    cost: 'Medio ($100-300)',
    reliability: 'Alta'
  }
]

export default function Step10ValidationStrategy({ onNext }: Props) {
  const { currentIdea } = useJournalStore()
  const [strategy, setStrategy] = useState<Partial<ValidationStrategy>>({
    validation_methods: [],
    progress_percentage: 0
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Load existing validation strategy
  useEffect(() => {
    if (!currentIdea) return

    const loadStrategy = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('validation_strategies')
          .select('*')
          .eq('idea_id', currentIdea.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading validation strategy:', error)
        } else if (data) {
          setStrategy(data)
        }
      } catch (error) {
        console.error('Error loading validation strategy:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStrategy()
  }, [currentIdea])

  // Manual save only

  const handleFieldChange = (field: string, value: any) => {
    setStrategy(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMethodToggle = (method: string) => {
    setStrategy(prev => {
      const currentMethods = prev.validation_methods || []
      const newMethods = currentMethods.includes(method as any)
        ? currentMethods.filter(m => m !== method)
        : [...currentMethods, method as any]
      
      return {
        ...prev,
        validation_methods: newMethods
      }
    })
  }

  const getSelectedMethodsInfo = () => {
    const methods = strategy.validation_methods || []
    const selectedMethods = VALIDATION_METHODS.filter(m => methods.includes(m.value as any))
    
    const totalTime = selectedMethods.length * 2 // Rough estimate in weeks
    const totalCost = selectedMethods.reduce((sum, method) => {
      if (method.cost.includes('0-50')) return sum + 25
      if (method.cost.includes('50-200')) return sum + 125
      if (method.cost.includes('100-500')) return sum + 300
      if (method.cost.includes('200-800')) return sum + 500
      return sum + 50
    }, 0)
    
    return { totalTime, totalCost, count: selectedMethods.length }
  }

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    const requiredFields = ['hypothesis', 'target_segments', 'validation_methods', 'expected_learnings']
    const filledFields = requiredFields.filter(field => {
      const value = strategy[field as keyof ValidationStrategy]
      if (field === 'validation_methods') {
        return Array.isArray(value) && value.length > 0
      }
      return value && String(value).trim().length > 0
    })
    
    // Bonus for optional fields
    let bonus = 0
    if (strategy.success_criteria) bonus += 10
    if (strategy.timeline_weeks) bonus += 10
    if (strategy.budget_estimate) bonus += 10
    
    return Math.min(100, Math.round((filledFields.length / requiredFields.length) * 70) + bonus)
  }

  if (!currentIdea) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-600">Selecciona una idea para trabajar en Estrategia de Validación</p>
      </div>
    )
  }

  const completion = getCompletionPercentage()
  const methodsInfo = getSelectedMethodsInfo()

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl text-stone-900 mb-2">✅ Estrategia de Validación</h2>
            <p className="text-stone-600">
              Define cómo validarás las hipótesis más críticas de tu modelo de negocio
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
            className="h-2 bg-indigo-500 rounded transition-all duration-300"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      <div className="space-y-8">
        {/* Hypothesis and Segments */}
        <div className="bg-white p-6 rounded-lg border border-stone-300">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">
            🎯 Hipótesis Central y Segmentos
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-stone-700 font-medium mb-2">
                Hipótesis Principal a Validar *
              </label>
              <textarea
                value={strategy.hypothesis || ''}
                onChange={(e) => handleFieldChange('hypothesis', e.target.value)}
                placeholder="Ej: Los millennials urbanos están dispuestos a pagar $15/mes por una app que reduzca su huella de carbono en 25%..."
                className="input w-full"
                rows={3}
              />
              <p className="text-xs text-stone-600 mt-1">
                💡 Incluye quién, qué, cuándo y por qué de tu hipótesis principal
              </p>
            </div>
            
            <div>
              <label className="block text-stone-700 font-medium mb-2">
                Segmentos Target para Validación *
              </label>
              <textarea
                value={strategy.target_segments || ''}
                onChange={(e) => handleFieldChange('target_segments', e.target.value)}
                placeholder="Ej: Millennials urbanos (25-35 años), profesionales con ingresos >$50k, usuarios activos de apps de fintech..."
                className="input w-full"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Validation Methods */}
        <div className="bg-white p-6 rounded-lg border border-stone-300">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">
            🔬 Métodos de Validación
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {VALIDATION_METHODS.map((method) => {
              const isSelected = strategy.validation_methods?.includes(method.value as any)
              return (
                <div
                  key={method.value}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-stone-300 bg-white hover:border-indigo-300'
                  }`}
                  onClick={() => handleMethodToggle(method.value)}
                >
                  <div className="flex items-start">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 mt-0.5 flex items-center justify-center ${
                      isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-stone-300'
                    }`}>
                      {isSelected && <CheckCircle size={12} className="text-white" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-stone-900 mb-1">{method.label}</h4>
                      <p className="text-sm text-stone-600 mb-2">{method.description}</p>
                      <div className="flex justify-between text-xs text-stone-500">
                        <span>⏱️ {method.time}</span>
                        <span>💰 {method.cost}</span>
                        <span>📊 {method.reliability}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Methods Summary */}
          {methodsInfo.count > 0 && (
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <h4 className="font-medium text-indigo-900 mb-2">📊 Resumen de Métodos Seleccionados</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-indigo-700 font-semibold">{methodsInfo.count}</div>
                  <div className="text-indigo-600">Métodos</div>
                </div>
                <div className="text-center">
                  <div className="text-indigo-700 font-semibold">~{methodsInfo.totalTime} sem</div>
                  <div className="text-indigo-600">Tiempo est.</div>
                </div>
                <div className="text-center">
                  <div className="text-indigo-700 font-semibold">${methodsInfo.totalCost}</div>
                  <div className="text-indigo-600">Costo est.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Learning and Success */}
        <div className="bg-white p-6 rounded-lg border border-stone-300">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">
            📚 Aprendizajes y Éxito
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-stone-700 font-medium mb-2">
                Aprendizajes Esperados *
              </label>
              <textarea
                value={strategy.expected_learnings || ''}
                onChange={(e) => handleFieldChange('expected_learnings', e.target.value)}
                placeholder="Ej: Validar disposición a pagar, identificar características más valoradas, entender barriers de adopción..."
                className="input w-full"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-stone-700 font-medium mb-2">
                Criterios de Éxito
              </label>
              <textarea
                value={strategy.success_criteria || ''}
                onChange={(e) => handleFieldChange('success_criteria', e.target.value)}
                placeholder="Ej: >60% muestra interés, >30% disposición a pagar, <20% abandono en onboarding..."
                className="input w-full"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Timeline and Budget */}
        <div className="bg-white p-6 rounded-lg border border-stone-300">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">
            ⏰ Planificación y Recursos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-stone-700 font-medium mb-2 flex items-center">
                <Clock size={16} className="mr-2" />
                Timeline (semanas)
              </label>
              <input
                type="number"
                value={strategy.timeline_weeks || ''}
                onChange={(e) => handleFieldChange('timeline_weeks', parseInt(e.target.value) || null)}
                placeholder="8"
                className="input w-full"
                min="1"
                max="52"
              />
            </div>
            
            <div>
              <label className="block text-stone-700 font-medium mb-2 flex items-center">
                <DollarSign size={16} className="mr-2" />
                Presupuesto (USD)
              </label>
              <input
                type="number"
                value={strategy.budget_estimate || ''}
                onChange={(e) => handleFieldChange('budget_estimate', parseFloat(e.target.value) || null)}
                placeholder="500"
                className="input w-full"
                min="0"
                step="50"
              />
            </div>
            
            <div>
              <label className="block text-stone-700 font-medium mb-2 flex items-center">
                <BarChart3 size={16} className="mr-2" />
                Progreso Actual (%)
              </label>
              <input
                type="number"
                value={strategy.progress_percentage || 0}
                onChange={(e) => handleFieldChange('progress_percentage', parseInt(e.target.value) || 0)}
                className="input w-full"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-white p-6 rounded-lg border border-stone-300">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">
            📈 Resumen de Resultados
          </h3>
          
          <div>
            <label className="block text-stone-700 font-medium mb-2">
              Resumen de Resultados de Validación
            </label>
            <textarea
              value={strategy.results_summary || ''}
              onChange={(e) => handleFieldChange('results_summary', e.target.value)}
              placeholder="Completa este campo conforme vayas ejecutando la validación. Ej: Completamos 15 entrevistas, encontramos que 73% estaría dispuesto a pagar..."
              className="input w-full"
              rows={4}
            />
            <p className="text-xs text-stone-600 mt-1">
              💡 Este campo se completa durante y después de ejecutar la validación
            </p>
          </div>
        </div>

        {/* Completion Notice */}
        {completion < 70 && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 text-sm">
              📋 <strong>Completa los campos requeridos:</strong> hipótesis, segmentos target, métodos de validación y aprendizajes esperados.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      {onNext && completion >= 70 && (
        <div className="flex justify-end mt-8">
          <button onClick={onNext} className="btn btn-primary">
            Continuar al siguiente paso →
          </button>
        </div>
      )}
    </div>
  )
}