import { useState, useEffect } from 'react'
import { useJournalStore } from '../../store/journal'
import { calculateOverallProgress } from '../../lib/progress/calcProgress'
import GuardedTab from './GuardedTab'
import ProgressBadge from './ProgressBadge'
import Step1Means from '../steps/Step1Means'
import Step2Problem from '../steps/Step2Problem'
import Step3Trends from '../steps/Step3Trends'
import Step4Ideation from '../steps/Step4Ideation'
import Step5UserValue from '../steps/Step5UserValue'
import { FileDown, Save, Home } from 'lucide-react'

const steps = [
  { id: 1, title: 'Medios Personales', component: Step1Means },
  { id: 2, title: 'Problema o Necesidad', component: Step2Problem },
  { id: 3, title: 'Tendencias', component: Step3Trends },
  { id: 4, title: 'Ideación', component: Step4Ideation },
  { id: 5, title: 'Usuario y Propuesta de Valor', component: Step5UserValue },
]

export default function WizardLayout() {
  const [activeStep, setActiveStep] = useState(1)
  const [overallProgress, setOverallProgress] = useState({ totalProgress: 0, steps: [] })
  
  const {
    currentJournal,
    step1Data,
    step2Data,
    step3Data,
    step4Data,
    step5BuyerData,
    step5VPData,
    saving,
    loadJournalData,
    subscribeToJournal,
    unsubscribeFromJournal,
    setCurrentJournal,
  } = useJournalStore()

  useEffect(() => {
    if (currentJournal) {
      loadJournalData(currentJournal.id)
      subscribeToJournal(currentJournal.id)
      
      return () => {
        unsubscribeFromJournal()
      }
    }
  }, [currentJournal, loadJournalData, subscribeToJournal, unsubscribeFromJournal])

  useEffect(() => {
    if (currentJournal) {
      try {
        const progress = calculateOverallProgress({
          step1: step1Data || [],
          step2: step2Data || null,
          step3: step3Data || [],
          step4: step4Data || [],
          step5Buyer: step5BuyerData || null,
          step5VP: step5VPData || null,
          teamMembersCount: 2, // TODO: Get actual team member count
        })
        setOverallProgress(progress)
      } catch (error) {
        console.error('Error calculating progress:', error)
        // Set default progress state
        setOverallProgress({
          totalProgress: 0,
          steps: [
            { step: 1, completed: false, progress: 0, locked: false },
            { step: 2, completed: false, progress: 0, locked: true },
            { step: 3, completed: false, progress: 0, locked: true },
            { step: 4, completed: false, progress: 0, locked: true },
            { step: 5, completed: false, progress: 0, locked: true },
          ]
        })
      }
    }
  }, [step1Data, step2Data, step3Data, step4Data, step5BuyerData, step5VPData, currentJournal])

  const handleNextStep = () => {
    const nextStep = activeStep + 1
    if (nextStep <= steps.length) {
      setActiveStep(nextStep)
    }
  }

  const handleGoHome = () => {
    setCurrentJournal(null)
  }

  if (!currentJournal) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Selecciona una bitácora para continuar</p>
      </div>
    )
  }

  const ActiveStepComponent = steps.find(step => step.id === activeStep)?.component

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with overall progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{currentJournal.title}</h2>
            <p className="text-gray-600">Progreso general: {overallProgress.totalProgress}%</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {saving && (
              <div className="flex items-center space-x-2 text-gray-500">
                <Save className="h-4 w-4 animate-pulse" />
                <span className="text-sm">Guardando...</span>
              </div>
            )}
            
            <button
              onClick={handleGoHome}
              className="btn btn-secondary flex items-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>Inicio</span>
            </button>
            
            <button
              className="btn btn-secondary flex items-center space-x-2"
              disabled={overallProgress.totalProgress < 100}
            >
              <FileDown className="h-4 w-4" />
              <span>Exportar PDF</span>
            </button>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-primary-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress.totalProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left sidebar with step navigation */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">Pasos</h3>
            
            {steps.map((step) => {
              const stepProgress = overallProgress.steps.find(s => s.step === step.id)
              if (!stepProgress) return null

              return (
                <GuardedTab
                  key={step.id}
                  stepProgress={stepProgress}
                  isActive={activeStep === step.id}
                  onClick={() => setActiveStep(step.id)}
                  title={step.title}
                />
              )
            })}

            {/* Progress summary */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Resumen de Progreso</h4>
              <div className="space-y-2">
                {overallProgress.steps.map((stepProgress) => (
                  <ProgressBadge key={stepProgress.step} stepProgress={stepProgress} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {ActiveStepComponent && (
              activeStep === 1 ? (
                <Step1Means onNext={handleNextStep} />
              ) : activeStep === 2 ? (
                <Step2Problem onNext={handleNextStep} />
              ) : activeStep === 3 ? (
                <Step3Trends onNext={handleNextStep} />
              ) : activeStep === 4 ? (
                <Step4Ideation onNext={handleNextStep} />
              ) : activeStep === 5 ? (
                <Step5UserValue onNext={handleNextStep} />
              ) : (
                <ActiveStepComponent />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}