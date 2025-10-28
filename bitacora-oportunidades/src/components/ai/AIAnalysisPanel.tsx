import { useState } from 'react'
import { AIAnalysisService } from '../../lib/ai/openai'
import { useJournalStore } from '../../store/journal'
import { Brain, TrendingUp, AlertTriangle, Target, Lightbulb, CheckCircle, Loader2 } from 'lucide-react'

interface AIAnalysisResult {
  overallAssessment: string
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  recommendations: string[]
  riskAssessment: string
  nextSteps: string[]
  viabilityScore: number
}

export default function AIAnalysisPanel() {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    currentJournal,
    currentTeam,
    step1Data,
    step2Data,
    step3Data,
    step4Data,
    step5BuyerData,
    step5VPData,
  } = useJournalStore()

  const handleAnalyze = async () => {
    if (!currentJournal || !currentTeam) return

    setLoading(true)
    setError(null)

    try {
      const aiService = new AIAnalysisService()
      
      const journalData = {
        journal: currentJournal,
        team: currentTeam,
        step1: step1Data,
        step2: step2Data,
        step3: step3Data,
        step4: step4Data,
        step5Buyer: step5BuyerData,
        step5VP: step5VPData,
      }

      // Try real API first, fallback to mock
      let result: AIAnalysisResult
      try {
        result = await aiService.analyzeJournal(journalData)
      } catch (apiError) {
        console.warn('Using mock analysis:', apiError)
        result = aiService.getMockAnalysis()
      }

      setAnalysis(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar análisis')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Alta Viabilidad'
    if (score >= 60) return 'Viabilidad Media'
    return 'Requiere Mejoras'
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 shadow-lg">
      <div className="p-6 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-900">Análisis IA</h3>
              <p className="text-blue-700">Evaluación inteligente de tu bitácora</p>
            </div>
          </div>
          
          {!analysis && (
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="btn btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analizando...</span>
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  <span>Generar Análisis IA</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-red-800 font-medium">Error</p>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        {!analysis && !loading && !error && (
          <div className="text-center py-12">
            <Brain className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-blue-900 mb-2">
              Análisis IA Disponible
            </h4>
            <p className="text-blue-700 mb-6 max-w-md mx-auto">
              Genera un análisis inteligente de tu bitácora que incluye evaluación de viabilidad, 
              fortalezas, oportunidades y recomendaciones personalizadas.
            </p>
            <button
              onClick={handleAnalyze}
              className="btn btn-primary inline-flex items-center space-x-2"
            >
              <Brain className="h-4 w-4" />
              <span>Iniciar Análisis</span>
            </button>
          </div>
        )}

        {analysis && (
          <div className="space-y-8">
            {/* Viability Score */}
            <div className="text-center">
              <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold ${getScoreColor(analysis.viabilityScore)}`}>
                <Target className="h-5 w-5 mr-2" />
                Puntuación de Viabilidad: {analysis.viabilityScore}/100
              </div>
              <p className="text-gray-600 mt-2">{getScoreLabel(analysis.viabilityScore)}</p>
            </div>

            {/* Overall Assessment */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                Evaluación General
              </h4>
              <div className="prose prose-gray max-w-none">
                {analysis.overallAssessment.split('\n').map((paragraph, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Fortalezas
                </h4>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-green-800">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                <h4 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Áreas de Mejora
                </h4>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((weakness, i) => (
                    <li key={i} className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-orange-600 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-orange-800">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Opportunities */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Oportunidades
              </h4>
              <ul className="grid md:grid-cols-2 gap-2">
                {analysis.opportunities.map((opportunity, i) => (
                  <li key={i} className="flex items-start">
                    <Target className="h-4 w-4 text-blue-600 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-blue-800">{opportunity}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk Assessment */}
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <h4 className="text-lg font-semibold text-red-900 mb-3 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Evaluación de Riesgos
              </h4>
              <p className="text-red-800 leading-relaxed">{analysis.riskAssessment}</p>
            </div>

            {/* Recommendations */}
            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <h4 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                Recomendaciones
              </h4>
              <ul className="space-y-3">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start">
                    <Lightbulb className="h-4 w-4 text-purple-600 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-purple-800">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Próximos Pasos
              </h4>
              <ol className="space-y-2">
                {analysis.nextSteps.map((step, i) => (
                  <li key={i} className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-600 text-white text-sm font-medium rounded-full mr-3 mt-0.5 flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-gray-800">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Regenerate button */}
            <div className="text-center pt-4">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="btn btn-outline inline-flex items-center space-x-2"
              >
                <Brain className="h-4 w-4" />
                <span>Regenerar Análisis</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}