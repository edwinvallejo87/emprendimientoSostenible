import { useState, useEffect } from 'react'
import { useJournalStore } from '../../store/journal'
import { useAuthStore } from '../../store/auth'
import { Plus, BookOpen, Users, Calendar, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import TestDataButton from '../TestDataButton'
import MultipleIdeasTestButton from '../MultipleIdeasTestButton'

export default function HomePage() {
  const { user } = useAuthStore()
  const {
    teams,
    journals,
    currentTeam,
    loadTeams,
    loadJournals,
    setCurrentTeam,
    setCurrentJournal,
    setCurrentIdea,
    createTeam,
    createJournal,
    deleteTeam,
    deleteJournal,
  } = useJournalStore()

  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [showCreateJournal, setShowCreateJournal] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [journalTitle, setJournalTitle] = useState('')
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null)
  const [journalToDelete, setJournalToDelete] = useState<string | null>(null)

  useEffect(() => {
    loadTeams()
  }, [loadTeams])

  useEffect(() => {
    if (currentTeam) {
      loadJournals(currentTeam.id)
    }
  }, [currentTeam, loadJournals])

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamName.trim()) return

    try {
      const newTeam = await createTeam(teamName)
      setCurrentTeam(newTeam)
      setTeamName('')
      setShowCreateTeam(false)
    } catch (error) {
      console.error('Error creating team:', error)
    }
  }

  const handleCreateJournal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!journalTitle.trim() || !currentTeam) return

    try {
      await createJournal(currentTeam.id, journalTitle)
      setJournalTitle('')
      setShowCreateJournal(false)
    } catch (error) {
      console.error('Error creating journal:', error)
    }
  }

  const handleDeleteTeam = async () => {
    if (!teamToDelete) return

    try {
      await deleteTeam(teamToDelete)
      setTeamToDelete(null)
    } catch (error) {
      console.error('Error deleting team:', error)
    }
  }

  const handleDeleteJournal = async () => {
    if (!journalToDelete) return

    try {
      await deleteJournal(journalToDelete)
      setJournalToDelete(null)
    } catch (error) {
      console.error('Error deleting journal:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl text-stone-900 mb-4">
          Análisis de Oportunidades
        </h1>
        <p className="text-xl text-stone-600 mb-8">
          Evalúa ideas de negocio sostenible usando metodología efectual
        </p>
        
        {/* Test Data Buttons */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <TestDataButton />
            <MultipleIdeasTestButton />
          </div>
        </div>
      </div>

      {/* Teams Section */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl text-stone-900">Equipos</h2>
          <button
            onClick={() => setShowCreateTeam(true)}
            className="btn btn-primary"
          >
            Nuevo Equipo
          </button>
        </div>

        {showCreateTeam && (
          <div className="mb-8 p-6 bg-white border border-stone-300 rounded-lg">
            <form onSubmit={handleCreateTeam} className="space-y-6">
              <div>
                <label className="block text-stone-900 mb-3 text-lg">
                  Nombre del equipo
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Nombre del equipo"
                  className="input"
                  autoFocus
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn btn-primary">
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateTeam(false)
                    setTeamName('')
                  }}
                  className="btn btn-outline"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {teams.length === 0 ? (
          <div className="text-center py-16 text-stone-500">
            <p className="mb-4">Crea tu primer equipo para comenzar</p>
            <button
              onClick={() => setShowCreateTeam(true)}
              className="btn btn-outline"
            >
              Crear equipo
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {teams.map((team) => (
              <div
                key={team.id}
                className={`p-6 transition-colors border rounded-lg ${
                  currentTeam?.id === team.id
                    ? 'bg-stone-100 border-stone-400'
                    : 'bg-white border-stone-300 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => setCurrentTeam(team)}
                  >
                    <h3 className="text-lg text-stone-900">{team.name}</h3>
                    <p className="text-stone-600 mt-1">
                      {format(new Date(team.created_at), 'dd MMM yyyy', { locale: es })}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setTeamToDelete(team.id)
                    }}
                    className="ml-4 p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar equipo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Journals Section */}
      {currentTeam && (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl text-stone-900">Bitácoras de {currentTeam.name}</h2>
              <p className="text-stone-600 mt-1">Cada bitácora contiene ideas analizadas con metodología efectual</p>
            </div>
            <button
              onClick={() => setShowCreateJournal(true)}
              className="btn btn-primary"
            >
              Nueva Bitácora
            </button>
          </div>

          {showCreateJournal && (
            <div className="mb-8 p-6 bg-white border border-stone-300 rounded-lg">
              <form onSubmit={handleCreateJournal} className="space-y-6">
                <div>
                  <label className="block text-stone-900 mb-3 text-lg">
                    Título de la bitácora
                  </label>
                  <input
                    type="text"
                    value={journalTitle}
                    onChange={(e) => setJournalTitle(e.target.value)}
                    placeholder="Ej: Energías Renovables Q4 2024"
                    className="input"
                    autoFocus
                  />
                </div>
                <div className="flex space-x-3">
                  <button type="submit" className="btn btn-primary">
                    Crear
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateJournal(false)
                      setJournalTitle('')
                    }}
                    className="btn btn-outline"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {journals.length === 0 ? (
            <div className="text-center py-16 text-stone-500">
              <p className="mb-4">Crea tu primera bitácora para comenzar a analizar ideas</p>
              <button
                onClick={() => setShowCreateJournal(true)}
                className="btn btn-outline"
              >
                Crear bitácora
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {journals.map((journal) => (
                <div
                  key={journal.id}
                  className="p-6 bg-white border border-stone-300 rounded-lg hover:border-stone-400 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => {
                        setCurrentIdea(null) // Clear any selected idea
                        setCurrentJournal(journal)
                      }}
                    >
                      <h3 className="text-lg text-stone-900 mb-2">
                        {journal.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-stone-600">
                        <span>Progreso: {journal.progress}%</span>
                        <span>
                          {format(new Date(journal.updated_at), 'dd MMM yyyy', { locale: es })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-2 bg-stone-200 rounded">
                        <div
                          className="h-2 bg-stone-600 rounded transition-all"
                          style={{ width: `${journal.progress}%` }}
                        />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setJournalToDelete(journal.id)
                        }}
                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar bitácora"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {/* Delete Team Confirmation */}
      {teamToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg text-stone-900 mb-4">
              ¿Eliminar equipo?
            </h3>
            <p className="text-stone-600 mb-6">
              Esta acción eliminará permanentemente el equipo y todas sus bitácoras. No se puede deshacer.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteTeam}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
              <button
                onClick={() => setTeamToDelete(null)}
                className="px-4 py-2 border border-stone-300 text-stone-900 rounded-lg hover:bg-stone-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Journal Confirmation */}
      {journalToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg text-stone-900 mb-4">
              ¿Eliminar bitácora?
            </h3>
            <p className="text-stone-600 mb-6">
              Esta acción eliminará permanentemente la bitácora y todo su contenido. No se puede deshacer.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteJournal}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
              <button
                onClick={() => setJournalToDelete(null)}
                className="px-4 py-2 border border-stone-300 text-stone-900 rounded-lg hover:bg-stone-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}