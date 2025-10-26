import { useAuthStore } from '../../store/auth'
import { useJournalStore } from '../../store/journal-demo'
import { LogOut, User, Book } from 'lucide-react'

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
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Book className="h-8 w-8 text-primary-500" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Bitácora de Oportunidades
              </h1>
              {currentTeam && currentJournal && (
                <p className="text-sm text-gray-500">
                  {currentTeam.name} • {currentJournal.title}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-700">{user?.email}</span>
            </div>
            
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}