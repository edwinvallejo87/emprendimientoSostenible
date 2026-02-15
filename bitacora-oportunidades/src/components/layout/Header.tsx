import { useAuthStore } from '../../store/auth'
import { useJournalStore } from '../../store/journal'
import { LogOut, ChevronLeft, Sprout } from 'lucide-react'

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
          <div className="flex items-center gap-4">
            {/* Brand mark — always visible */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                <Sprout className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[15px] font-black text-white tracking-tight lowercase">
                brota
              </span>
            </div>

            {/* Context breadcrumb */}
            {currentJournal && (
              <>
                <div className="w-px h-4 bg-white/10" />
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Mis bitacoras
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {!currentJournal && (
              <span className="hidden sm:inline text-[11px] text-gray-600 tracking-wide">
                de idea a impacto
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-300 rounded-md transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
