import { useJournalStore } from './store/journal'
import AuthGuard from './components/auth/AuthGuard'
import Header from './components/layout/Header'
import HomePage from './components/home/HomePage'
import WizardLayout from './components/wizard/WizardLayout'

function App() {
  const { currentJournal } = useJournalStore()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
        <Header />
        <main className="relative">
          {currentJournal ? <WizardLayout /> : <HomePage />}
        </main>
      </div>
    </AuthGuard>
  )
}

export default App
