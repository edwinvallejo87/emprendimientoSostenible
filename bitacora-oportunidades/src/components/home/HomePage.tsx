import { useState, useEffect } from 'react'
import { useJournalStore } from '../../store/journal-demo'
import { useAuthStore } from '../../store/auth'
import { Plus, BookOpen, Users, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

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
    createTeam,
    createJournal,
  } = useJournalStore()

  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [showCreateJournal, setShowCreateJournal] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [journalTitle, setJournalTitle] = useState('')

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
      const newJournal = await createJournal(currentTeam.id, journalTitle)
      setCurrentJournal(newJournal)
      setJournalTitle('')
      setShowCreateJournal(false)
    } catch (error) {
      console.error('Error creating journal:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {user?.email?.split('@')[0]}
        </h1>
        <p className="mt-2 text-gray-600">
          Gestiona tus equipos y bitácoras de oportunidades de innovación
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Teams Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Mis Equipos</h2>
            <button
              onClick={() => setShowCreateTeam(true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Crear Equipo</span>
            </button>
          </div>

          {showCreateTeam && (
            <form onSubmit={handleCreateTeam} className="mb-6 p-4 border border-gray-200 rounded-lg">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Nombre del equipo"
                  className="input flex-1"
                  autoFocus
                />
                <button type="submit" className="btn btn-primary">Crear</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateTeam(false)
                    setTeamName('')
                  }}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {teams.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No tienes equipos aún</p>
                <p className="text-sm">Crea tu primer equipo para comenzar</p>
              </div>
            ) : (
              teams.map((team) => (
                <div
                  key={team.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    currentTeam?.id === team.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setCurrentTeam(team)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-full">
                      <Users className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{team.name}</h3>
                      <p className="text-sm text-gray-500">
                        Creado {format(new Date(team.created_at), 'dd MMM yyyy', { locale: es })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Journals Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Bitácoras {currentTeam && `- ${currentTeam.name}`}
            </h2>
            {currentTeam && (
              <button
                onClick={() => setShowCreateJournal(true)}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Nueva Bitácora</span>
              </button>
            )}
          </div>

          {!currentTeam ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Selecciona un equipo</p>
              <p className="text-sm">Elige un equipo para ver sus bitácoras</p>
            </div>
          ) : (
            <>
              {showCreateJournal && (
                <form onSubmit={handleCreateJournal} className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={journalTitle}
                      onChange={(e) => setJournalTitle(e.target.value)}
                      placeholder="Título de la bitácora"
                      className="input flex-1"
                      autoFocus
                    />
                    <button type="submit" className="btn btn-primary">Crear</button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateJournal(false)
                        setJournalTitle('')
                      }}
                      className="btn btn-secondary"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {journals.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No hay bitácoras en este equipo</p>
                    <p className="text-sm">Crea la primera bitácora para comenzar</p>
                  </div>
                ) : (
                  journals.map((journal) => (
                    <div
                      key={journal.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer transition-colors"
                      onClick={() => setCurrentJournal(journal)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                            <BookOpen className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{journal.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Progreso: {journal.progress}%</span>
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {format(new Date(journal.updated_at), 'dd MMM yyyy', { locale: es })}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-500 h-2 rounded-full"
                              style={{ width: `${journal.progress}%` }}
                            />
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            journal.status === 'ready' ? 'bg-green-100 text-green-800' :
                            journal.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {journal.status === 'ready' ? 'Listo' :
                             journal.status === 'in_progress' ? 'En progreso' : 'Borrador'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}