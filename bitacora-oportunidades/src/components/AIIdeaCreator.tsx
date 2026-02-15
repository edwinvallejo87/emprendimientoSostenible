import { useState } from 'react'
import { CompleteIdeaGenerator } from '../lib/ai/completeIdeaGenerator'
import { createCompleteIdeaFromAI } from '../scripts/createCompleteIdeaFromAI'
import { useJournalStore } from '../store/journal'
import { loadSustainabilityData } from '../utils/loadSustainabilityData'
import { Sparkles, ArrowRight, Loader2, Check } from 'lucide-react'

export default function AIIdeaCreator() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [ideaInput, setIdeaInput] = useState('')
  const { currentTeam, loadTeams, loadJournals, loadIdeas, loadIdeaData, setCurrentTeam, setCurrentJournal, setCurrentIdea } = useJournalStore()

  const handleCreateAIIdea = async () => {
    if (!ideaInput.trim()) {
      setMessage('Por favor describe tu idea primero')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    setLoading(true)
    setMessage('Generando analisis completo con IA...')

    try {
      const result = await createCompleteIdeaFromAI(ideaInput.trim())

      if (result?.success && result.team && result.journal && result.idea) {
        setMessage('Idea creada. Cargando en la interfaz...')

        const team = useJournalStore.getState().currentTeam || result.team
        if (result.team.id !== team.id) {
          setCurrentTeam(result.team)
        }
        await loadJournals(result.team.id)
        setCurrentJournal(result.journal)
        await loadIdeas(result.journal.id)
        setCurrentIdea(result.idea)

        await new Promise(resolve => setTimeout(resolve, 2000))
        await loadIdeaData(result.idea.id)
        await new Promise(resolve => setTimeout(resolve, 1000))
        await loadIdeaData(result.idea.id)

        setMessage('Listo. Analisis completo de 7 pasos generado.')
        setIdeaInput('')
        setTimeout(() => setMessage(''), 5000)
      } else {
        setMessage('Error generando idea con IA')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error completo creando idea con IA:', error)
      let errorMessage = 'Error desconocido'
      if (error instanceof Error) {
        errorMessage = error.message
        console.error('Error stack:', error.stack)
      } else if (typeof error === 'string') {
        errorMessage = error
      } else {
        errorMessage = JSON.stringify(error, null, 2)
      }
      setMessage(`Error: ${errorMessage}`)
      setTimeout(() => setMessage(''), 10000)
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    'Recursos y problema',
    'Tendencias y FODA',
    'Cliente y propuesta',
    'Modelo de negocio',
    'MVP y validacion',
    'Red de aliados',
    'Impacto sostenible',
  ]

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200">
      {/* Dark header */}
      <div className="relative bg-gray-950 px-6 py-6 overflow-hidden">
        <div className="absolute top-[-50%] right-[-10%] w-[200px] h-[200px] bg-primary-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative flex items-start gap-4">
          <div className="p-2.5 bg-primary-600 rounded-md flex-shrink-0 shadow-glow-sm">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white">Genera tu Plan de Negocio con IA</h3>
            <p className="text-xs text-gray-400 mt-1">
              Describe tu idea y la IA completara automaticamente los 7 pasos del analisis.
            </p>
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="bg-white px-6 py-5">
        <textarea
          value={ideaInput}
          onChange={(e) => setIdeaInput(e.target.value)}
          placeholder="Ej: Una plataforma para conectar agricultores locales con restaurantes, reduciendo intermediarios y desperdicio de alimentos..."
          className="textarea text-sm"
          rows={3}
          disabled={loading}
        />

        {/* Steps that will be generated */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {steps.map((step, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-500">
              <Check className="h-3 w-3 text-primary-500" />
              {step}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-5">
          <button
            onClick={handleCreateAIIdea}
            disabled={loading || !ideaInput.trim()}
            className="btn btn-glow group"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generar Plan Completo
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>

          {message && (
            <p className="text-sm text-gray-500 animate-fade-in">{message}</p>
          )}
        </div>
      </div>
    </div>
  )
}
