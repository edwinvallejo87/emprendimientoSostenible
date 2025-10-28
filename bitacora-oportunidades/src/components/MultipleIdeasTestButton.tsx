import { useState } from 'react'
import { createMultipleIdeasTestData } from '../scripts/createMultipleIdeasTestData'
import { useJournalStore } from '../store/journal'

export default function MultipleIdeasTestButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { loadTeams, loadJournals, loadIdeas, setCurrentTeam, setCurrentJournal } = useJournalStore()

  const handleCreateMultipleIdeas = async () => {
    setLoading(true)
    setMessage('🚀 Creando bitácora con múltiples ideas...')

    try {
      const result = await createMultipleIdeasTestData()
      
      if (result?.success && result.team && result.journal && result.ideas) {
        setMessage('✅ Ideas creadas! Cargando en la interfaz...')
        
        // Recargar equipos y seleccionar el nuevo
        await loadTeams()
        setCurrentTeam(result.team)
        
        // Cargar bitácoras del equipo
        await loadJournals(result.team.id)
        setCurrentJournal(result.journal)
        
        // Cargar ideas de la bitácora
        await loadIdeas(result.journal.id)
        
        setMessage(`🎉 ¡Listo! Bitácora creada con ${result.ideas.length} ideas de prueba`)
        
        // Auto-hide después de 5 segundos
        setTimeout(() => {
          setMessage('')
        }, 5000)
      } else {
        setMessage('❌ Error creando ideas de prueba')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error completo:', error)
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
      setMessage(`❌ Error: ${errorMessage}`)
      setTimeout(() => setMessage(''), 8000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 shadow-sm">
      <div className="text-center">
        <h3 className="text-purple-900 font-semibold mb-2 text-lg">🎯 Portfolio de Ideas</h3>
        <p className="text-purple-800 text-sm mb-4">
          Crea una bitácora completa con múltiples ideas para probar la nueva estructura
        </p>
        <div className="text-xs text-purple-700 mb-4 space-y-1">
          <p>✨ <strong>Idea 1:</strong> EcoScore App (Sostenibilidad)</p>
          <p>🚁 <strong>Idea 2:</strong> AgriDrone (AgriTech)</p> 
          <p>🎓 <strong>Idea 3:</strong> EduConnect (EdTech)</p>
          <p className="text-purple-600 font-medium mt-2">Cada una con medios, problema y tendencias específicas</p>
        </div>
        
        <button
          onClick={handleCreateMultipleIdeas}
          disabled={loading}
          className="btn btn-primary text-base px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-transform bg-purple-600 hover:bg-purple-700"
        >
          {loading ? '🚀 Creando Portfolio...' : '🎯 Crear Portfolio de Ideas'}
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