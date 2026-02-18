import { useState } from 'react'
import { useJournalStore } from '../../store/journal'
import { Plus, ArrowRight, Sparkles, Check } from 'lucide-react'
import CreateIdeaForm from './CreateIdeaForm'
import AIIdeaCreator from '../AIIdeaCreator'

interface IdeasManagerProps {
  onNext?: () => void
}

export default function IdeasManager({ onNext }: IdeasManagerProps) {
  const {
    currentJournal,
    currentIdea,
    ideas,
    setCurrentIdea,
    loadIdeas,
  } = useJournalStore()

  const [showCreateForm, setShowCreateForm] = useState(false)

  if (!currentJournal) {
    return <div className="text-sm text-gray-500">Selecciona una bitacora primero</div>
  }

  const handleSelectIdea = (idea: any) => {
    setCurrentIdea(idea)
    if (onNext) {
      onNext()
    }
  }

  const handleIdeaCreated = () => {
    setShowCreateForm(false)
    loadIdeas(currentJournal.id)
  }

  if (showCreateForm) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Nueva Idea</h2>
          <button
            onClick={() => setShowCreateForm(false)}
            className="btn btn-ghost btn-sm"
          >
            Cancelar
          </button>
        </div>
        <CreateIdeaForm
          onSuccess={handleIdeaCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* AI Generator */}
      <AIIdeaCreator />

      {/* Divider */}
      <div className="relative flex items-center">
        <div className="flex-1 border-t border-gray-200" />
        <span className="px-3 text-xs text-gray-400 uppercase tracking-wider">o selecciona una idea existente</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      {/* Ideas list */}
      {ideas.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-lg py-12 text-center">
          <p className="text-sm text-gray-400 mb-4">No hay ideas todavia</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-outline btn-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Crear manualmente
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              {ideas.length} {ideas.length === 1 ? 'idea' : 'ideas'}
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-ghost btn-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Nueva
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 bg-white">
            {ideas.map((idea) => {
              const isSelected = currentIdea?.id === idea.id

              return (
                <div
                  key={idea.id}
                  className={`px-5 py-4 cursor-pointer transition-colors group ${
                    isSelected ? 'bg-primary-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectIdea(idea)}
                >
                  <div className="flex items-start gap-3">
                    {/* Selection indicator */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? 'border-primary-600 bg-primary-600'
                        : 'border-gray-300 group-hover:border-gray-400'
                    }`}>
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {idea.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`badge text-xs ${
                            idea.market_potential === 'High' ? 'badge-success' :
                            idea.market_potential === 'Medium' ? 'badge-warning' :
                            'badge-error'
                          }`}>
                            {idea.market_potential}
                          </span>
                          <span className="text-xs text-gray-400 tabular-nums">
                            {idea.alignment_score}%
                          </span>
                          <ArrowRight className="h-4 w-4 text-gray-300" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {idea.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      )}
    </div>
  )
}
