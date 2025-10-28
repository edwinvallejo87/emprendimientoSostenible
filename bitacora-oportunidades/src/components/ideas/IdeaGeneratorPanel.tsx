import { useState } from 'react'
import { AIIdeaGenerator } from '../../lib/ai/ideaGenerator'
import type { GeneratedIdea, IdeaGenerationResult } from '../../lib/ai/ideaGenerator'
import { useJournalStore } from '../../store/journal'
import { 
  Brain, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  DollarSign,
  Users,
  Loader2,
  Plus,
  Sparkles
} from 'lucide-react'

export default function IdeaGeneratorPanel() {
  const [result, setResult] = useState<IdeaGenerationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [focusArea, setFocusArea] = useState('')
  const [ideaCount, setIdeaCount] = useState(5)

  const { currentTeam, currentJournal, step1Data, createIdea, setCurrentIdea } = useJournalStore()

  const handleGenerateIdeas = async () => {
    if (!currentTeam || !currentJournal || !step1Data || step1Data.length === 0) {
      setError('Se requiere un equipo con una bitácora activa y medios personales definidos')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const generator = new AIIdeaGenerator()
      
      const teamMembers = step1Data.map(member => ({
        who_i_am: member.who_i_am || '',
        what_i_know: member.what_i_know || '',
        who_i_know: member.who_i_know || '',
        what_i_have: member.what_i_have || ''
      }))

      const generatedResult = await generator.generateIdeas(
        currentTeam.name,
        teamMembers,
        focusArea || undefined,
        ideaCount
      )

      setResult(generatedResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar ideas')
    } finally {
      setLoading(false)
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'  
      case 'High': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'High': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Low': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getAlignmentColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const handleCreateIdea = async (generatedIdea: GeneratedIdea) => {
    console.log('Debug - currentJournal:', currentJournal)
    console.log('Debug - currentTeam:', currentTeam)
    
    if (!currentJournal) {
      setError('Se requiere un journal activo para crear ideas. Por favor selecciona una bitácora primero.')
      return
    }

    try {
      const newIdea = await createIdea(currentJournal.id, {
        title: generatedIdea.title,
        description: generatedIdea.description,
        target_market: generatedIdea.targetMarket,
        unique_value: generatedIdea.uniqueValue,
        resources_needed: generatedIdea.resourcesNeeded,
        implementation_complexity: generatedIdea.implementationComplexity,
        market_potential: generatedIdea.marketPotential,
        alignment_score: generatedIdea.alignmentScore,
        reasoning: generatedIdea.reasoning,
        status: 'draft'
      })
      
      setCurrentIdea(newIdea)
      
      // Navigate to the wizard to start the 5-step process
      window.location.hash = '#/wizard'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la idea')
    }
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 shadow-lg">
      <div className="p-6 border-b border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-600 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-purple-900">Generador de Ideas IA</h3>
              <p className="text-purple-700">Oportunidades basadas en metodología efectual</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {!currentTeam && (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-yellow-800">Selecciona un equipo para generar ideas</p>
          </div>
        )}

        {currentTeam && !currentJournal && (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-yellow-800">Selecciona una bitácora para generar ideas</p>
          </div>
        )}

        {currentTeam && currentJournal && (!step1Data || step1Data.length === 0) && (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-yellow-800">Completa el Paso 1 (Medios Personales) para generar ideas</p>
          </div>
        )}

        {currentTeam && currentJournal && step1Data && step1Data.length > 0 && !result && !loading && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Lightbulb className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-purple-900 mb-2">
                Genera Ideas de Oportunidades
              </h4>
              <p className="text-purple-700 mb-6 max-w-2xl mx-auto">
                Basándose en los medios personales de tu equipo, la IA generará oportunidades 
                emprendedoriales alineadas con metodología efectual.
              </p>
            </div>

            {/* Configuration */}
            <div className="bg-white rounded-lg p-6 border border-purple-200 space-y-4">
              <h5 className="font-semibold text-purple-900 mb-4">Configuración de Generación</h5>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Área de enfoque (opcional)
                </label>
                <input
                  type="text"
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  placeholder="ej: tecnología, sostenibilidad, salud, educación..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Deja vacío para ideas en cualquier sector
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de ideas: {ideaCount}
                </label>
                <input
                  type="range"
                  min="3"
                  max="8"
                  value={ideaCount}
                  onChange={(e) => setIdeaCount(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>3</span>
                  <span>8</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleGenerateIdeas}
                className="btn btn-primary inline-flex items-center space-x-2 text-lg px-8 py-3"
              >
                <Sparkles className="h-5 w-5" />
                <span>Generar Ideas</span>
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-spin" />
            <h4 className="text-lg font-semibold text-purple-900 mb-2">
              Generando ideas...
            </h4>
            <p className="text-purple-700">
              La IA está analizando los medios de tu equipo y generando oportunidades únicas
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p className="text-red-800 font-medium">Error</p>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-8">
            {/* Team Analysis */}
            <div className="bg-white rounded-lg p-6 border border-purple-200">
              <h4 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Análisis del Equipo
              </h4>
              <p className="text-gray-700 leading-relaxed">{result.teamAnalysis}</p>
              
              {result.recommendedFocus.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-gray-900 mb-2">Áreas recomendadas de enfoque:</h5>
                  <div className="flex flex-wrap gap-2">
                    {result.recommendedFocus.map((focus, i) => (
                      <span key={i} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {focus}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Generated Ideas */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-purple-900 flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                Ideas Generadas ({result.ideas.length})
              </h4>

              {result.ideas.map((idea, index) => (
                <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h5 className="text-xl font-semibold text-gray-900 mb-2">{idea.title}</h5>
                      <div className="flex items-center space-x-4 mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(idea.implementationComplexity)}`}>
                          Complejidad: {idea.implementationComplexity}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPotentialColor(idea.marketPotential)}`}>
                          Potencial: {idea.marketPotential}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAlignmentColor(idea.alignmentScore)}`}>
                          Alineación: {idea.alignmentScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h6 className="font-medium text-gray-900 mb-2">Descripción</h6>
                        <p className="text-gray-700 text-sm leading-relaxed">{idea.description}</p>
                      </div>

                      <div>
                        <h6 className="font-medium text-gray-900 mb-2 flex items-center">
                          <Target className="h-4 w-4 mr-1" />
                          Mercado Objetivo
                        </h6>
                        <p className="text-gray-700 text-sm">{idea.targetMarket}</p>
                      </div>

                      <div>
                        <h6 className="font-medium text-gray-900 mb-2">Valor Único</h6>
                        <p className="text-gray-700 text-sm">{idea.uniqueValue}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h6 className="font-medium text-gray-900 mb-2 flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Recursos Necesarios
                        </h6>
                        <ul className="text-gray-700 text-sm space-y-1">
                          {idea.resourcesNeeded.map((resource, i) => (
                            <li key={i} className="flex items-start">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                              {resource}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h6 className="font-medium text-gray-900 mb-2">¿Por qué para este equipo?</h6>
                        <p className="text-gray-700 text-sm italic">{idea.reasoning}</p>
                      </div>

                      <div className="pt-4">
                        <button 
                          onClick={() => handleCreateIdea(idea)}
                          className="w-full btn btn-outline inline-flex items-center justify-center space-x-2"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Iniciar Proceso Efectual</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Regenerate button */}
            <div className="text-center pt-4">
              <button
                onClick={handleGenerateIdeas}
                disabled={loading}
                className="btn btn-outline inline-flex items-center space-x-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>Generar Nuevas Ideas</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}