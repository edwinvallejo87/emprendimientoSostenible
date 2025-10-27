import { useState } from 'react'
import { createCompleteTestData } from '../scripts/createCompleteTestData'
import { useJournalStore } from '../store/journal'

export default function TestDataButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { loadTeams, loadJournals, setCurrentTeam, setCurrentJournal } = useJournalStore()

  const handleCreateTestData = async () => {
    setLoading(true)
    setMessage('🚀 Creando equipo y bitácora...')

    try {
      const result = await createCompleteTestData()
      
      if (result?.success && result.team && result.journal) {
        setMessage('✅ Datos creados! Cargando en la interfaz...')
        
        // Recargar equipos y seleccionar el nuevo
        await loadTeams()
        setCurrentTeam(result.team)
        
        // Cargar bitácoras del equipo
        await loadJournals(result.team.id)
        setCurrentJournal(result.journal)
        
        setMessage('🎉 ¡Listo! Datos de prueba cargados exitosamente')
        
        // Auto-hide después de 5 segundos
        setTimeout(() => {
          setMessage('')
        }, 5000)
      } else {
        setMessage('❌ Error creando datos de prueba')
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
    <div className="p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200 shadow-sm">
      <div className="text-center">
        <h3 className="text-blue-900 font-semibold mb-2 text-lg">🧪 Datos de Prueba</h3>
        <p className="text-blue-800 text-sm mb-4">
          Crea un equipo completo con bitácora y contenido realista para todos los pasos
        </p>
        
        <button
          onClick={handleCreateTestData}
          disabled={loading}
          className="btn btn-primary text-base px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-transform"
        >
          {loading ? '🚀 Creando...' : '✨ Crear Datos de Prueba'}
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