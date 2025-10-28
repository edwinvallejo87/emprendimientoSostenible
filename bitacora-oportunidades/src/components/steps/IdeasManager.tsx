import { useState } from 'react'
import { useJournalStore } from '../../store/journal'
import { Plus, Lightbulb, ArrowRight, Edit, Trash2 } from 'lucide-react'
import CreateIdeaForm from './CreateIdeaForm'

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
    return <div>Selecciona una bitácora primero</div>
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
          <h2 className="text-2xl text-stone-900 flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-yellow-500" />
            Nueva Idea
          </h2>
          <button
            onClick={() => setShowCreateForm(false)}
            className="btn btn-outline"
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl text-stone-900 flex items-center gap-3">
          <Lightbulb className="w-8 h-8 text-yellow-500" />
          Gestión de Ideas (Bird in Hand)
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Idea
        </button>
      </div>

      <div className="bg-white rounded-lg border border-stone-200 p-6">
        {ideas.length === 0 ? (
          <div className="text-center py-12">
            <Lightbulb className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-lg text-stone-600 mb-2">No hay ideas todavía</h3>
            <p className="text-stone-500 mb-6">
              Crea tu primera idea para comenzar el análisis efectual
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn btn-primary flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Crear Primera Idea
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-stone-600 mb-4">
              Selecciona una idea para continuar con el análisis efectual:
            </p>
            
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  currentIdea?.id === idea.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
                onClick={() => handleSelectIdea(idea)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-stone-900 mb-2">
                      {idea.title}
                    </h3>
                    <p className="text-stone-600 text-sm mb-3">
                      {idea.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Mercado:</span>
                        <span className={`px-2 py-1 rounded ${
                          idea.market_potential === 'High' ? 'bg-green-100 text-green-800' :
                          idea.market_potential === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {idea.market_potential}
                        </span>
                      </span>
                      
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Complejidad:</span>
                        <span className={`px-2 py-1 rounded ${
                          idea.implementation_complexity === 'Low' ? 'bg-green-100 text-green-800' :
                          idea.implementation_complexity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {idea.implementation_complexity}
                        </span>
                      </span>
                      
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Alineación:</span>
                        <span className="text-stone-700">
                          {idea.alignment_score}%
                        </span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {currentIdea?.id === idea.id && (
                      <span className="text-blue-600 text-sm font-medium">
                        Seleccionada
                      </span>
                    )}
                    <ArrowRight className="w-5 h-5 text-stone-400" />
                  </div>
                </div>
              </div>
            ))}
            
            {currentIdea && (
              <div className="pt-4 border-t border-stone-200">
                <button
                  onClick={onNext}
                  className="btn btn-primary flex items-center gap-2 mx-auto"
                >
                  Continuar con "{currentIdea.title}"
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}