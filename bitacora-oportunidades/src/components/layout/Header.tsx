import { useAuthStore } from '../../store/auth'
import { useJournalStore } from '../../store/journal'
import { LogOut, User, BookOpen, ChevronRight, Home } from 'lucide-react'

export default function Header() {
  const { user, signOut } = useAuthStore()
  const { currentTeam, currentJournal } = useJournalStore()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Emprendimiento Sostenible
                </h1>
                <p className="text-xs text-gray-500 font-medium">Bitácora de Oportunidades</p>
              </div>
            </div>
            
            {currentTeam && currentJournal && (
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <Home className="h-4 w-4" />
                <span className="font-medium">{currentTeam.name}</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="text-gray-800 font-semibold">{currentJournal.title}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.email?.split('@')[0]}
              </span>
            </div>
            
            <button
              onClick={handleSignOut}
              className="btn btn-ghost btn-sm flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}