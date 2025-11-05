import { useState } from 'react'
import { CompleteIdeaGenerator } from '../lib/ai/completeIdeaGenerator'
import { createCompleteIdeaFromAI } from '../scripts/createCompleteIdeaFromAI'
import { useJournalStore } from '../store/journal'
import { loadSustainabilityData } from '../utils/loadSustainabilityData'

export default function AIIdeaCreator() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [ideaInput, setIdeaInput] = useState('')
  const { loadTeams, loadJournals, loadIdeas, loadIdeaData, setCurrentTeam, setCurrentJournal, setCurrentIdea } = useJournalStore()

  const handleCreateAIIdea = async () => {
    if (!ideaInput.trim()) {
      setMessage('❌ Por favor describe tu idea primero')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    setLoading(true)
    setMessage('🤖 Generando análisis completo con IA...')

    try {
      const result = await createCompleteIdeaFromAI(ideaInput.trim())
      
      if (result?.success && result.team && result.journal && result.idea) {
        setMessage('✅ Idea creada! Cargando en la interfaz...')
        
        // Recargar equipos y seleccionar el nuevo
        await loadTeams()
        setCurrentTeam(result.team)
        
        // Cargar bitácoras del equipo
        await loadJournals(result.team.id)
        setCurrentJournal(result.journal)
        
        // Cargar ideas de la bitácora
        await loadIdeas(result.journal.id)
        
        // Establecer la idea actual y cargar sus datos específicos
        setCurrentIdea(result.idea)
        
        // Extended delay to ensure all database transactions are committed (including sustainability data)
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Load idea data and specifically load sustainability data
        await loadIdeaData(result.idea.id)
        
        // Additional load for sustainability data with extra delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        const sustainabilityData = await loadSustainabilityData(result.idea.id)
        
        // Final reload to ensure all data is in the store
        await loadIdeaData(result.idea.id)
        
        if (sustainabilityData) {
          setMessage(`🎉 ¡Listo! Análisis completo de 13 pasos generado por IA`)
        } else {
          setMessage(`🎉 ¡Listo! Análisis efectual generado - datos de sostenibilidad cargándose...`)
        }
        setIdeaInput('')
        
        // Auto-hide después de 5 segundos
        setTimeout(() => {
          setMessage('')
        }, 5000)
      } else {
        setMessage('❌ Error generando idea con IA')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error completo creando idea con IA:', error)
      
      // More detailed error reporting
      let errorMessage = 'Error desconocido'
      if (error instanceof Error) {
        errorMessage = error.message
        console.error('Error stack:', error.stack)
      } else if (typeof error === 'string') {
        errorMessage = error
      } else {
        errorMessage = JSON.stringify(error, null, 2)
      }
      
      setMessage(`❌ Error creando idea: ${errorMessage}`)
      setTimeout(() => setMessage(''), 10000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm">
      <div className="text-center">
        <h3 className="text-blue-900 font-semibold mb-2 text-lg">🤖 Generador IA de Ideas</h3>
        <p className="text-blue-800 text-sm mb-4">
          Describe tu idea básica y la IA creará un análisis completo de 13 pasos con metodología efectual y emprendimiento sostenible
        </p>
        
        <div className="mb-4">
          <textarea
            value={ideaInput}
            onChange={(e) => setIdeaInput(e.target.value)}
            placeholder="Ejemplo: Una app para conectar agricultores con consumidores locales de forma sostenible..."
            className="w-full p-3 border border-blue-300 rounded-lg text-sm"
            rows={3}
            disabled={loading}
          />
        </div>

        <div className="text-xs text-blue-700 mb-4 space-y-1">
          <p>🎯 <strong>La IA generará análisis completo de 13 pasos:</strong></p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
            <div>
              <p className="font-semibold mb-1">📊 Metodología Efectual (Pasos 1-7):</p>
              <p>• Medios personales del equipo</p>
              <p>• Problema y relevancia</p>
              <p>• Tendencias del mercado</p>
              <p>• Evaluación FODA</p>
              <p>• Usuario objetivo y propuesta de valor</p>
            </div>
            <div>
              <p className="font-semibold mb-1">🌱 Emprendimiento Sostenible (Pasos 8-13):</p>
              <p>• Canvas sostenible interactivo</p>
              <p>• Patrones de innovación</p>
              <p>• Prototipo y MVP</p>
              <p>• Estrategia de validación</p>
              <p>• Mapa del ecosistema</p>
              <p>• Reflexión de sostenibilidad</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleCreateAIIdea}
          disabled={loading || !ideaInput.trim()}
          className="btn btn-primary text-base px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-transform bg-blue-600 hover:bg-blue-700"
        >
          {loading ? '🤖 Generando con IA...' : '🚀 Crear Análisis Completo'}
        </button>
        
        {message && (
          <div className="mt-4 p-3 bg-white rounded-lg border shadow-sm">
            <p className="text-sm text-gray-700 font-medium">{message}</p>
          </div>
        )}
      </div>
    </div>
  )
}