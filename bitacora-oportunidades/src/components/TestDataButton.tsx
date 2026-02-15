import { useState } from 'react'
import { createCompleteTestData } from '../scripts/createCompleteTestData'
import { useJournalStore } from '../store/journal'

export default function TestDataButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { loadTeams, loadJournals, loadIdeas, setCurrentTeam, setCurrentJournal, setCurrentIdea } = useJournalStore()

  const handleCreateTestData = async () => {
    setLoading(true)
    setMessage('🚀 Creando equipo y bitácora...')

    try {
      const result = await createCompleteTestData()
      
      if (result?.success && result.team && result.journal && result.idea) {
        setMessage('✅ Datos creados! Cargando en la interfaz...')
        
        // Recargar equipos y seleccionar el nuevo
        await loadTeams()
        setCurrentTeam(result.team)
        
        // Cargar bitácoras del equipo
        await loadJournals(result.team.id)
        setCurrentJournal(result.journal)
        
        // Cargar ideas de la bitácora y seleccionar la creada
        await loadIdeas(result.journal.id)
        setCurrentIdea(result.idea)
        
        setMessage('🎉 ¡Listo! Datos de prueba cargados exitosamente con idea seleccionada')
        
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
    <div className="card shadow-sm p-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 mb-4">
          Datos de Prueba
        </div>
        <h3 className="text-gray-900 font-semibold mb-2 text-lg">Generar Contenido de Prueba</h3>
        <p className="text-gray-500 text-sm mb-5">
          Crea un equipo completo con bitacora y contenido realista para todos los pasos
        </p>

        <button
          onClick={handleCreateTestData}
          disabled={loading}
          className="btn btn-secondary btn-lg"
        >
          {loading ? 'Creando...' : 'Crear Datos de Prueba'}
        </button>

        {message && (
          <div className="mt-5 p-3 bg-white rounded-md border border-gray-200 text-center">
            <p className="text-sm text-gray-700 font-medium">{message}</p>
          </div>
        )}
      </div>
    </div>
  )
}