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
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl text-stone-900 mb-2">{currentJournal.title}</h1>
            <p className="text-stone-600">Análisis efectual de oportunidades</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {saving && (
              <span className="text-stone-500 text-sm">Guardando...</span>
            )}
            
            <button
              onClick={handleGoHome}
              className="btn btn-outline"
            >
              Inicio
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-stone-200 rounded">
          <div
            className="h-2 bg-stone-600 rounded transition-all duration-500"
            style={{ width: `${overallProgress.totalProgress}%` }}
          />
        </div>
        <p className="text-sm text-stone-600 mt-2">Progreso: {overallProgress.totalProgress}%</p>
      </div>

      {/* Navigation */}
      <div className="flex justify-center mb-12">
        <div className="flex space-x-2 bg-stone-100 p-2 rounded-lg">
          {steps.map((step) => {
            const stepProgress = overallProgress.steps.find(s => s.step === step.id)
            if (!stepProgress) return null

            const getStepStyle = () => {
              if (stepProgress.completed) {
                return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
              }
              if (activeStep === step.id) {
                return 'bg-blue-100 text-blue-800 border-blue-200 shadow-md'
              }
              if (!stepProgress.locked) {
                return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
              }
              return 'bg-stone-50 text-stone-400 border-stone-200 cursor-not-allowed'
            }

            return (
              <button
                key={step.id}
                onClick={() => !stepProgress.locked && setActiveStep(step.id)}
                disabled={stepProgress.locked}
                className={`px-4 py-3 text-sm rounded-lg border-2 transition-all duration-200 relative ${getStepStyle()}`}
              >
                <div className="flex items-center space-x-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    stepProgress.completed 
                      ? 'bg-green-500 text-white' 
                      : activeStep === step.id
                      ? 'bg-blue-500 text-white'
                      : !stepProgress.locked
                      ? 'bg-yellow-400 text-yellow-900'
                      : 'bg-stone-300 text-stone-500'
                  }`}>
                    {stepProgress.completed ? '✓' : step.id}
                  </span>
                  <span className="font-medium">{step.title}</span>
                </div>
                {stepProgress.progress > 0 && (
                  <div className="absolute bottom-1 left-1 right-1 h-1 bg-stone-200 rounded">
                    <div 
                      className={`h-1 rounded transition-all duration-300 ${
                        stepProgress.completed ? 'bg-green-500' : 
                        activeStep === step.id ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${stepProgress.progress}%` }}
                    />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div>
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
  )
}