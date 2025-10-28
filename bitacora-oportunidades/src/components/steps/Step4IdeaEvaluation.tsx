import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useJournalStore } from '../../store/journal'
import { Target, TrendingUp, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'

const step4EvaluationSchema = z.object({
  strengths: z.string().min(50, 'Describe al menos 50 caracteres sobre las fortalezas'),
  weaknesses: z.string().min(50, 'Describe al menos 50 caracteres sobre las debilidades'),
  opportunities: z.string().min(50, 'Describe al menos 50 caracteres sobre las oportunidades'),
  threats: z.string().min(50, 'Describe al menos 50 caracteres sobre las amenazas'),
  success_factors: z.string().min(50, 'Describe al menos 50 caracteres sobre los factores de éxito'),
  risk_mitigation: z.string().min(50, 'Describe al menos 50 caracteres sobre la mitigación de riesgos'),
})

type Step4EvaluationData = z.infer<typeof step4EvaluationSchema>

interface Step4IdeaEvaluationProps {
  onNext?: () => void
}

export default function Step4IdeaEvaluation({ onNext }: Step4IdeaEvaluationProps) {
  const {
    currentIdea,
    step4EvaluationData,
    saveStep4EvaluationData,
  } = useJournalStore()

  const [saving, setSaving] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<Step4EvaluationData>({
    resolver: zodResolver(step4EvaluationSchema),
    values: step4EvaluationData || {},
    mode: 'onChange'
  })

  const watchedValues = watch()

  const onSubmit = async (data: Step4EvaluationData) => {
    if (!currentIdea) return
    
    setSaving(true)
    try {
      await saveStep4EvaluationData(currentIdea.id, data)
      if (onNext) {
        onNext()
      }
    } catch (error) {
      console.error('Error saving step 4 evaluation data:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!currentIdea) {
    return <div>No hay idea seleccionada</div>
  }

  const getFieldStatus = (fieldName: keyof Step4EvaluationData, minLength = 50) => {
    const value = watchedValues[fieldName]
    if (!value) return 'empty'
    if (value.length < minLength) return 'partial'
    return 'complete'
  }

  const fieldStatuses = {
    strengths: getFieldStatus('strengths'),
    weaknesses: getFieldStatus('weaknesses'),
    opportunities: getFieldStatus('opportunities'),
    threats: getFieldStatus('threats'),
    success_factors: getFieldStatus('success_factors'),
    risk_mitigation: getFieldStatus('risk_mitigation'),
  }

  const completedFields = Object.values(fieldStatuses).filter(status => status === 'complete').length
  const totalFields = Object.keys(fieldStatuses).length
  const progressPercentage = Math.round((completedFields / totalFields) * 100)

  return (
    <div className="max-w-4xl mx-auto px-6">
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <Target className="w-8 h-8 text-green-600" />
          <div>
            <h2 className="text-3xl text-stone-900 mb-2">Evaluación (Lemonade)</h2>
            <p className="text-stone-600">
              Analiza tu idea "{currentIdea.title}". ¿Cómo puedes convertir contingencias y sorpresas en oportunidades?
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-stone-600">Progreso de evaluación</span>
            <span className="text-sm font-medium text-stone-900">{progressPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-stone-200 rounded">
            <div
              className="h-2 bg-green-600 rounded transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Idea Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2">Idea a Evaluar:</h3>
          <p className="text-blue-800 mb-2"><strong>{currentIdea.title}</strong></p>
          <p className="text-blue-700 text-sm">{currentIdea.description}</p>
          <div className="flex gap-4 mt-3 text-xs">
            <span className="bg-blue-100 px-2 py-1 rounded">
              Mercado: {currentIdea.market_potential}
            </span>
            <span className="bg-blue-100 px-2 py-1 rounded">
              Complejidad: {currentIdea.implementation_complexity}
            </span>
            <span className="bg-blue-100 px-2 py-1 rounded">
              Alineación: {currentIdea.alignment_score}%
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* SWOT Analysis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">Fortalezas</h3>
              {fieldStatuses.strengths === 'complete' && (
                <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
              )}
            </div>
            <Controller
              name="strengths"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={4}
                  className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="¿Qué ventajas tiene tu idea? ¿Qué recursos únicos posees? ¿Qué hace bien tu propuesta?"
                />
              )}
            />
            {errors.strengths && (
              <p className="text-red-600 text-sm mt-1">{errors.strengths.message}</p>
            )}
          </div>

          {/* Weaknesses */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Debilidades</h3>
              {fieldStatuses.weaknesses === 'complete' && (
                <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
              )}
            </div>
            <Controller
              name="weaknesses"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={4}
                  className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="¿Qué limitaciones tiene tu idea? ¿Qué recursos te faltan? ¿Qué puede mejorar?"
                />
              )}
            />
            {errors.weaknesses && (
              <p className="text-red-600 text-sm mt-1">{errors.weaknesses.message}</p>
            )}
          </div>

          {/* Opportunities */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Oportunidades</h3>
              {fieldStatuses.opportunities === 'complete' && (
                <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
              )}
            </div>
            <Controller
              name="opportunities"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={4}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="¿Qué tendencias favorecen tu idea? ¿Qué cambios en el mercado son positivos? ¿Qué oportunidades externas existen?"
                />
              )}
            />
            {errors.opportunities && (
              <p className="text-red-600 text-sm mt-1">{errors.opportunities.message}</p>
            )}
          </div>

          {/* Threats */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-yellow-900">Amenazas</h3>
              {fieldStatuses.threats === 'complete' && (
                <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
              )}
            </div>
            <Controller
              name="threats"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={4}
                  className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="¿Qué obstáculos externos existen? ¿Qué competencia hay? ¿Qué factores del mercado son riesgosos?"
                />
              )}
            />
            {errors.threats && (
              <p className="text-red-600 text-sm mt-1">{errors.threats.message}</p>
            )}
          </div>
        </div>

        {/* Success Factors and Risk Mitigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Success Factors */}
          <div className="bg-white border border-stone-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-stone-900">Factores Críticos de Éxito</h3>
              {fieldStatuses.success_factors === 'complete' && (
                <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
              )}
            </div>
            <Controller
              name="success_factors"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={4}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="¿Qué debe ocurrir para que tu idea sea exitosa? ¿Qué factores son absolutamente críticos?"
                />
              )}
            />
            {errors.success_factors && (
              <p className="text-red-600 text-sm mt-1">{errors.success_factors.message}</p>
            )}
          </div>

          {/* Risk Mitigation */}
          <div className="bg-white border border-stone-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-stone-900">Mitigación de Riesgos</h3>
              {fieldStatuses.risk_mitigation === 'complete' && (
                <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
              )}
            </div>
            <Controller
              name="risk_mitigation"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={4}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="¿Cómo vas a reducir los riesgos identificados? ¿Qué estrategias tienes para mitigar amenazas?"
                />
              )}
            />
            {errors.risk_mitigation && (
              <p className="text-red-600 text-sm mt-1">{errors.risk_mitigation.message}</p>
            )}
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-center pt-8">
          <button
            type="submit"
            disabled={!isValid || saving}
            className="btn btn-primary flex items-center gap-2 px-8 py-3 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Continuar al siguiente paso'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}