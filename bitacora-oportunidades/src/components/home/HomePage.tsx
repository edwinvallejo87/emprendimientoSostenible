import { useState, useEffect } from 'react'
import { useJournalStore } from '../../store/journal'
import { Plus, Trash2, ArrowRight, Target, TrendingUp, Users, Lightbulb, Layers, Network, Leaf, Zap } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const STEPS = [
  { icon: Lightbulb, label: 'Idea', color: 'bg-amber-400' },
  { icon: TrendingUp, label: 'Analisis', color: 'bg-blue-400' },
  { icon: Target, label: 'Entorno', color: 'bg-blue-500' },
  { icon: Users, label: 'Cliente', color: 'bg-violet-400' },
  { icon: Layers, label: 'Modelo', color: 'bg-violet-500' },
  { icon: Network, label: 'MVP', color: 'bg-cyan-400' },
  { icon: Leaf, label: 'Impacto', color: 'bg-emerald-400' },
]

export default function HomePage() {
  const {
    journals,
    currentTeam,
    ensureDefaultTeam,
    setCurrentJournal,
    setCurrentIdea,
    createJournal,
    deleteJournal,
  } = useJournalStore()

  const [showCreateJournal, setShowCreateJournal] = useState(false)
  const [journalTitle, setJournalTitle] = useState('')
  const [journalToDelete, setJournalToDelete] = useState<string | null>(null)

  useEffect(() => {
    ensureDefaultTeam()
  }, [ensureDefaultTeam])

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

  const handleDeleteJournal = async () => {
    if (!journalToDelete) return
    try {
      await deleteJournal(journalToDelete)
      setJournalToDelete(null)
    } catch (error) {
      console.error('Error deleting journal:', error)
    }
  }

  const getStepFromProgress = (progress: number) => {
    if (progress >= 100) return 7
    return Math.max(1, Math.ceil((progress / 100) * 7))
  }

  return (
    <div className="min-h-[calc(100vh-3rem)]">

      {/* ===== HERO ===== */}
      <section className="relative bg-gray-950 overflow-hidden">
        <div className="absolute top-[-40%] left-[20%] w-[600px] h-[600px] bg-emerald-500/6 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-50%] right-[10%] w-[400px] h-[400px] bg-primary-600/6 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-6 pt-10 pb-12">
          <div className="animate-slide-up">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-[1.15] mb-3">
              Valida tu idea de negocio{' '}
              <span className="text-gradient bg-gradient-to-r from-emerald-400 to-primary-400">
                sostenible
              </span>
            </h1>
            <p className="text-base text-gray-400 max-w-lg mb-8">
              7 pasos estructurados con inteligencia artificial para ir de la idea al plan de accion.
            </p>

            {/* Method pipeline */}
            <div className="hidden sm:flex items-center gap-0.5 mb-8">
              {STEPS.map((step, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
                    <step.icon className="h-3.5 w-3.5 text-gray-500" />
                    <span className="text-[11px] text-gray-400">{step.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-2.5 h-px bg-white/10" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setShowCreateJournal(true)
                  document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="btn btn-glow btn-lg group"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva bitacora
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </button>
              {journals.length > 0 && (
                <span className="text-sm text-gray-600">
                  {journals.length} {journals.length === 1 ? 'bitacora activa' : 'bitacoras activas'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      {/* ===== BITACORAS ===== */}
      <section id="workspace" className="bg-gray-50 min-h-[40vh]">
        <div className="max-w-4xl mx-auto px-6 py-10">

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Tus bitacoras
            </h2>
            <button
              onClick={() => setShowCreateJournal(true)}
              className="btn btn-primary btn-sm"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Nueva
            </button>
          </div>

          {showCreateJournal && (
            <form onSubmit={handleCreateJournal} className="mb-5 animate-slide-up">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={journalTitle}
                  onChange={(e) => setJournalTitle(e.target.value)}
                  placeholder="Nombre de tu bitacora"
                  className="input flex-1"
                  autoFocus
                />
                <button type="submit" className="btn btn-primary">Crear</button>
                <button
                  type="button"
                  onClick={() => { setShowCreateJournal(false); setJournalTitle('') }}
                  className="btn btn-ghost"
                >
                  &times;
                </button>
              </div>
            </form>
          )}

          {journals.length === 0 ? (
            /* Empty state */
            <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <div className="flex items-center justify-center gap-1 mb-6">
                {STEPS.map((step, i) => (
                  <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    i === 0 ? 'bg-amber-100' : 'bg-gray-100'
                  }`}>
                    <step.icon className={`h-4 w-4 ${
                      i === 0 ? 'text-amber-500' : 'text-gray-300'
                    }`} />
                  </div>
                ))}
              </div>
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                Comienza tu primera bitacora
              </h3>
              <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
                Cada bitacora te guia por 7 pasos para transformar una idea en un plan de negocio sostenible y validado
              </p>
              <button
                onClick={() => setShowCreateJournal(true)}
                className="btn btn-primary btn-lg"
              >
                <Zap className="h-4 w-4 mr-2" />
                Crear mi primera bitacora
              </button>
            </div>
          ) : (
            /* Journal cards */
            <div className="space-y-3">
              {journals.map((journal) => {
                const progress = journal.progress || 0
                const currentStep = getStepFromProgress(progress)

                return (
                  <div
                    key={journal.id}
                    className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer overflow-hidden"
                    onClick={() => {
                      setCurrentIdea(null)
                      setCurrentJournal(journal)
                    }}
                  >
                    {/* Color accent strip */}
                    <div className="h-1 flex">
                      {STEPS.map((step, i) => (
                        <div
                          key={i}
                          className={`flex-1 ${
                            progress > 0 && i < currentStep
                              ? step.color
                              : 'bg-gray-100'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="px-5 py-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-bold text-gray-900 truncate">
                            {journal.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">
                              {format(new Date(journal.updated_at), "d MMM yyyy", { locale: es })}
                            </span>
                            {progress > 0 && (
                              <>
                                <span className="text-gray-200">·</span>
                                <span className="text-xs font-medium text-gray-500">
                                  Paso {currentStep} de 7
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <span className="text-xs font-bold text-gray-400 tabular-nums">
                            {progress}%
                          </span>
                          <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-primary-500 transition-colors" />
                          <button
                            onClick={(e) => { e.stopPropagation(); setJournalToDelete(journal.id) }}
                            className="p-1.5 text-gray-300 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-all"
                            title="Eliminar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* 7-step pipeline dots */}
                      <div className="flex items-center gap-1">
                        {STEPS.map((step, i) => {
                          const isCompleted = progress > 0 && i < currentStep
                          const isCurrent = i === currentStep - 1 && progress > 0 && progress < 100
                          return (
                            <div key={i} className="flex items-center flex-1">
                              <div className="flex items-center gap-1 flex-1" title={step.label}>
                                <step.icon className={`h-3 w-3 flex-shrink-0 ${
                                  isCompleted ? 'text-gray-700' :
                                  isCurrent ? 'text-primary-500' :
                                  'text-gray-300'
                                }`} />
                                <div className={`flex-1 h-1 rounded-full ${
                                  isCompleted ? step.color :
                                  isCurrent ? 'bg-primary-200' :
                                  'bg-gray-100'
                                }`} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Delete Modal */}
      {journalToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full mx-4 animate-slide-up">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Eliminar bitacora?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Se eliminara permanentemente la bitacora y todo su contenido.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setJournalToDelete(null)} className="btn btn-ghost">Cancelar</button>
              <button onClick={handleDeleteJournal} className="btn bg-red-600 text-white hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
