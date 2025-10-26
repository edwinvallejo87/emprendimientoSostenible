import { useJournalStore } from './store/journal-demo'
import AuthGuard from './components/auth/AuthGuard'
import Header from './components/layout/Header'
import HomePage from './components/home/HomePage'
import WizardLayout from './components/wizard/WizardLayout'

function App() {
  const { currentJournal } = useJournalStore()

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          {currentJournal ? <WizardLayout /> : <HomePage />}
        </main>
      </div>
    </AuthGuard>
  )
}

export default App
