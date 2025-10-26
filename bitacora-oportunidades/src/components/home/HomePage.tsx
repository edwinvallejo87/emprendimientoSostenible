import { useState, useEffect } from 'react'
import { useJournalStore } from '../../store/journal'
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
      <div className="mb-10">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-primary-700 bg-clip-text text-transparent mb-3">
            ¡Hola, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            Gestiona tus equipos y crea bitácoras de oportunidades para 
            <span className="font-semibold text-primary-600"> emprendimientos sostenibles</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up">
        {/* Teams Section */}
        <div className="card card-body">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Users className="h-5 w-5 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Mis Equipos</h2>
            </div>
            <button
              onClick={() => setShowCreateTeam(true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Crear Equipo</span>
            </button>
          </div>

          {showCreateTeam && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl animate-fade-in">
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del equipo
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Ej: Equipo de Innovación Verde"
                    className="input"
                    autoFocus
                  />
                </div>
                <div className="flex space-x-3">
                  <button type="submit" className="btn btn-primary flex-1">
                    Crear Equipo
                  </button>
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
            </div>
          )}

          <div className="space-y-3">
            {teams.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Sin equipos aún</h3>
                <p className="text-sm text-gray-500 mb-4">Crea tu primer equipo para comenzar a colaborar</p>
                <button
                  onClick={() => setShowCreateTeam(true)}
                  className="btn btn-outline btn-sm"
                >
                  Crear primer equipo
                </button>
              </div>
            ) : (
              teams.map((team) => (
                <div
                  key={team.id}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    currentTeam?.id === team.id
                      ? 'bg-primary-50 border-2 border-primary-200 shadow-md'
                      : 'bg-white border border-gray-200 hover:border-primary-200 hover:shadow-card-hover'
                  }`}
                  onClick={() => setCurrentTeam(team)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${
                      currentTeam?.id === team.id 
                        ? 'bg-primary-200' 
                        : 'bg-gray-100'
                    }`}>
                      <Users className={`h-6 w-6 ${
                        currentTeam?.id === team.id 
                          ? 'text-primary-600' 
                          : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{team.name}</h3>
                      <p className="text-sm text-gray-500">
                        Creado el {format(new Date(team.created_at), 'dd MMM yyyy', { locale: es })}
                      </p>
                    </div>
                    {currentTeam?.id === team.id && (
                      <div className="badge badge-primary">
                        Seleccionado
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Journals Section */}
        <div className="card card-body">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-success-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Bitácoras</h2>
                {currentTeam && (
                  <p className="text-sm text-gray-500">{currentTeam.name}</p>
                )}
              </div>
            </div>
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
            <div className="text-center py-12 text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Selecciona un equipo</h3>
              <p className="text-sm text-gray-500">Elige un equipo de la izquierda para ver y crear bitácoras</p>
            </div>
          ) : (
            <>
              {showCreateJournal && (
                <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl animate-fade-in">
                  <form onSubmit={handleCreateJournal} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título de la bitácora
                      </label>
                      <input
                        type="text"
                        value={journalTitle}
                        onChange={(e) => setJournalTitle(e.target.value)}
                        placeholder="Ej: Oportunidades en Energía Renovable"
                        className="input"
                        autoFocus
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button type="submit" className="btn btn-primary flex-1">
                        Crear Bitácora
                      </button>
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
                </div>
              )}

              <div className="space-y-3">
                {journals.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Sin bitácoras aún</h3>
                    <p className="text-sm text-gray-500 mb-4">Crea la primera bitácora para comenzar a identificar oportunidades</p>
                    <button
                      onClick={() => setShowCreateJournal(true)}
                      className="btn btn-outline btn-sm"
                    >
                      Crear primera bitácora
                    </button>
                  </div>
                ) : (
                  journals.map((journal) => (
                    <div
                      key={journal.id}
                      className="p-5 bg-white border border-gray-200 rounded-xl hover:border-primary-200 hover:shadow-card-hover cursor-pointer transition-all duration-200 group"
                      onClick={() => setCurrentJournal(journal)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 rounded-xl group-hover:from-success-200 group-hover:to-success-300 transition-colors">
                            <BookOpen className="h-6 w-6 text-success-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
                              {journal.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-2">
                                <div className="progress w-16">
                                  <div
                                    className="progress-bar"
                                    style={{ width: `${journal.progress}%` }}
                                  />
                                </div>
                                <span className="font-medium">{journal.progress}%</span>
                              </div>
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {format(new Date(journal.updated_at), 'dd MMM yyyy', { locale: es })}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`badge ${
                            journal.status === 'ready' ? 'badge-success' :
                            journal.status === 'in_progress' ? 'badge-warning' :
                            'badge-gray'
                          }`}>
                            {journal.status === 'ready' ? 'Completado' :
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