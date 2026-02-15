import { useAuthStore } from '../../store/auth'
import { useJournalStore } from '../../store/journal'
import { LogOut, ChevronLeft, Leaf } from 'lucide-react'

export default function Header() {
  const { signOut } = useAuthStore()
  const { currentJournal, setCurrentJournal, setCurrentIdea } = useJournalStore()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleBack = () => {
    setCurrentIdea(null)
    setCurrentJournal(null)
  }

  return (
    <header className="bg-gray-950 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          <div className="flex items-center gap-3">
            {currentJournal ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Mis bitacoras</span>
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-emerald-500 to-primary-600 flex items-center justify-center shadow-glow-sm">
                  <Leaf className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="leading-none">
                  <span className="text-sm font-bold text-white block">
                    Emprendimiento Sostenible
                  </span>
                  <span className="text-[10px] text-gray-500">
                    Bitacora de Oportunidades
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-300 rounded-md transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  )
}
