import { useState, useEffect } from 'react'
import { useJournalStore } from '../../store/journal'
import { calculateOverallProgress } from '../../lib/progress/calcProgress'
import GuardedTab from './GuardedTab'
import ProgressBadge from './ProgressBadge'
import Step1Means from '../steps/Step1Means'
import IdeasManager from '../steps/IdeasManager'
import Step2Problem from '../steps/Step2Problem'
import Step3Trends from '../steps/Step3Trends'
import Step4IdeaEvaluation from '../steps/Step4IdeaEvaluation'
import Step5UserValue from '../steps/Step5UserValue'
import Step6AIEvaluation from '../steps/Step6AIEvaluation'
import { FileDown, Save, Home } from 'lucide-react'

const steps = [
  { id: 1, title: 'Selección de Idea', component: IdeasManager },
  { id: 2, title: 'Medios (Bird in Hand)', component: Step1Means },
  { id: 3, title: 'Problema (Affordable Loss)', component: Step2Problem },
  { id: 4, title: 'Tendencias (Crazy Quilt)', component: Step3Trends },
  { id: 5, title: 'Evaluación (Lemonade)', component: Step4IdeaEvaluation },
  { id: 6, title: 'Usuario/Valor (Pilot-in-Plane)', component: Step5UserValue },
  { id: 7, title: 'Evaluación IA', component: Step6AIEvaluation },
]

export default function WizardLayout() {
  const [activeStep, setActiveStep] = useState(1)
  const [overallProgress, setOverallProgress] = useState({ totalProgress: 0, steps: [] })
  
  const {
    currentJournal,
    currentIdea,
    ideas,
    step1Data,
    step2Data,
    step3Data,
    step4Data,
    step4EvaluationData,
    step5BuyerData,
    step5VPData,
    saving,
    loadJournalData,
    loadIdeas,
    loadIdeaData,
    subscribeToJournal,
    unsubscribeFromJournal,
    setCurrentJournal,
    setCurrentIdea,
  } = useJournalStore()

  useEffect(() => {
    if (currentJournal) {
      loadJournalData(currentJournal.id)
      loadIdeas(currentJournal.id)
      subscribeToJournal(currentJournal.id)
      
      // Clear any previously selected idea when switching journals
      if (currentIdea && currentIdea.journal_id !== currentJournal.id) {
        console.log('🧹 WizardLayout: Clearing idea from different journal')
        setCurrentIdea(null)
      }
      
      return () => {
        unsubscribeFromJournal()
      }
    }
  }, [currentJournal, loadJournalData, loadIdeas, subscribeToJournal, unsubscribeFromJournal, currentIdea, setCurrentJournal])

  useEffect(() => {
    if (currentIdea) {
      loadIdeaData(currentIdea.id)
    }
  }, [currentIdea, loadIdeaData])

  useEffect(() => {
    if (currentJournal) {
      try {
        // Step 1: Ideas management - complete if has ideas and currentIdea selected
        const step1Complete = ideas && ideas.length > 0 && currentIdea
        const step1Progress = step1Complete ? 100 : 0
        
        // Steps 2-7: Only if currentIdea is selected
        let step2Complete = false, step2Progress = 0
        let step3Complete = false, step3Progress = 0
        let step4Complete = false, step4Progress = 0
        let step5Complete = false, step5Progress = 0
        let step6Complete = false, step6Progress = 0
        let step7Complete = false, step7Progress = 0
        
        if (currentIdea) {
          console.log('🔍 WizardLayout progress check:', {
            currentIdea: currentIdea.title,
            step1Data: step1Data?.length,
            step2Data: step2Data ? Object.keys(step2Data).length : 0,
            step3Data: step3Data?.length,
            step4EvaluationData: step4EvaluationData ? Object.keys(step4EvaluationData).length : 0,
            step5BuyerData: step5BuyerData ? Object.keys(step5BuyerData).length : 0,
            step5VPData: step5VPData ? Object.keys(step5VPData).length : 0
          })
          
          // Step 2: Medios personales (idea-specific)
          step2Complete = step1Data && step1Data.length > 0
          step2Progress = step2Complete ? 100 : 0
          
          // Step 3: Problem analysis (idea-specific)  
          step3Complete = step2Data ? Object.keys(step2Data).length > 0 : false
          step3Progress = step3Complete ? 100 : 0
          
          // Step 4: Trends (idea-specific)
          step4Complete = step3Data && step3Data.length >= 3
          step4Progress = step4Complete ? 100 : 0
          
          // Step 5: Idea evaluation (idea-specific)
          step5Complete = step4EvaluationData ? Object.keys(step4EvaluationData).length > 0 : false
          step5Progress = step5Complete ? 100 : 0
          
          // Step 6: User value (idea-specific)
          step6Complete = step5BuyerData && step5VPData ? 
            Object.keys(step5BuyerData).length > 0 && Object.keys(step5VPData).length > 0 : false
          step6Progress = step6Complete ? 100 : 0
          
          // Step 7: AI Evaluation (available when step 6 is complete)
          step7Complete = false // We don't track completion for AI evaluation yet
          step7Progress = 0
          
          console.log('📊 Step completion status:', {
            step2Complete, step3Complete, step4Complete, step5Complete, step6Complete
          })
        }
        
        const progress = {
          totalProgress: Math.round((step1Progress + step2Progress + step3Progress + step4Progress + step5Progress + step6Progress + step7Progress) / 7),
          steps: [
            { step: 1, completed: step1Complete, progress: step1Progress, locked: false },
            { step: 2, completed: step2Complete, progress: step2Progress, locked: !step1Complete },
            { step: 3, completed: step3Complete, progress: step3Progress, locked: !step2Complete },
            { step: 4, completed: step4Complete, progress: step4Progress, locked: !step3Complete },
            { step: 5, completed: step5Complete, progress: step5Progress, locked: !step4Complete },
            { step: 6, completed: step6Complete, progress: step6Progress, locked: !step5Complete },
            { step: 7, completed: step7Complete, progress: step7Progress, locked: !step6Complete },
          ]
        }
        
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
            { step: 6, completed: false, progress: 0, locked: true },
            { step: 7, completed: false, progress: 0, locked: true },
          ]
        })
      }
    }
  }, [step1Data, step2Data, step3Data, step4Data, step4EvaluationData, step5BuyerData, step5VPData, currentJournal, currentIdea, ideas])

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
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl text-stone-900 mb-1">{currentJournal.title}</h1>
            <p className="text-stone-600 text-sm">Análisis efectual de oportunidades</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {saving && (
              <span className="text-stone-500 text-xs">Guardando...</span>
            )}
            
            <button
              onClick={handleGoHome}
              className="btn btn-outline text-sm px-3 py-1.5"
            >
              Inicio
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-stone-200 rounded">
          <div
            className="h-1.5 bg-stone-600 rounded transition-all duration-500"
            style={{ width: `${overallProgress.totalProgress}%` }}
          />
        </div>
        <p className="text-xs text-stone-600 mt-1">Progreso: {overallProgress.totalProgress}%</p>
      </div>

      {/* Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex flex-wrap gap-1 bg-stone-100 p-2 rounded-lg max-w-full">
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
                className={`px-3 py-2 text-xs rounded-lg border-2 transition-all duration-200 relative min-w-0 ${getStepStyle()}`}
              >
                <div className="flex items-center space-x-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${
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
                  <span className="font-medium truncate max-w-[120px]">{step.title}</span>
                </div>
                {stepProgress.progress > 0 && (
                  <div className="absolute bottom-0.5 left-0.5 right-0.5 h-0.5 bg-stone-200 rounded">
                    <div 
                      className={`h-0.5 rounded transition-all duration-300 ${
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
            <IdeasManager onNext={handleNextStep} />
          ) : activeStep === 2 ? (
            currentIdea ? (
              <Step1Means onNext={handleNextStep} />
            ) : (
              <div className="text-center py-12">
                <p className="text-stone-600">Selecciona una idea en el paso anterior para continuar</p>
                <button
                  onClick={() => setActiveStep(1)}
                  className="btn btn-outline mt-4"
                >
                  Volver a Selección de Ideas
                </button>
              </div>
            )
          ) : activeStep === 3 ? (
            currentIdea ? (
              <Step2Problem onNext={handleNextStep} />
            ) : (
              <div className="text-center py-12">
                <p className="text-stone-600">Selecciona una idea en el paso 1 para continuar</p>
                <button
                  onClick={() => setActiveStep(1)}
                  className="btn btn-outline mt-4"
                >
                  Volver a Selección de Ideas
                </button>
              </div>
            )
          ) : activeStep === 4 ? (
            currentIdea ? (
              <Step3Trends onNext={handleNextStep} />
            ) : (
              <div className="text-center py-12">
                <p className="text-stone-600">Selecciona una idea en el paso 1 para continuar</p>
                <button
                  onClick={() => setActiveStep(1)}
                  className="btn btn-outline mt-4"
                >
                  Volver a Selección de Ideas
                </button>
              </div>
            )
          ) : activeStep === 5 ? (
            currentIdea ? (
              <Step4IdeaEvaluation onNext={handleNextStep} />
            ) : (
              <div className="text-center py-12">
                <p className="text-stone-600">Selecciona una idea en el paso 1 para continuar</p>
                <button
                  onClick={() => setActiveStep(1)}
                  className="btn btn-outline mt-4"
                >
                  Volver a Selección de Ideas
                </button>
              </div>
            )
          ) : activeStep === 6 ? (
            currentIdea ? (
              <Step5UserValue onNext={handleNextStep} />
            ) : (
              <div className="text-center py-12">
                <p className="text-stone-600">Selecciona una idea en el paso 1 para continuar</p>
                <button
                  onClick={() => setActiveStep(1)}
                  className="btn btn-outline mt-4"
                >
                  Volver a Selección de Ideas
                </button>
              </div>
            )
          ) : activeStep === 7 ? (
            currentIdea ? (
              <Step6AIEvaluation onNext={handleNextStep} />
            ) : (
              <div className="text-center py-12">
                <p className="text-stone-600">Selecciona una idea en el paso 1 para continuar</p>
                <button
                  onClick={() => setActiveStep(1)}
                  className="btn btn-outline mt-4"
                >
                  Volver a Selección de Ideas
                </button>
              </div>
            )
          ) : (
            <ActiveStepComponent />
          )
        )}
      </div>
    </div>
  )
}