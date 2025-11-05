import { useState, useEffect } from 'react'
import { useJournalStore } from '../../store/journal'
import { calculateOverallProgress } from '../../lib/progress/calcProgress'
import { validateStep2Complete } from '../../lib/validators/step2'
import { supabase } from '../../lib/supabase'
import GuardedTab from './GuardedTab'
import ProgressBadge from './ProgressBadge'
import Step1Means from '../steps/Step1Means'
import IdeasManager from '../steps/IdeasManager'
import Step2Problem from '../steps/Step2Problem'
import Step3Trends from '../steps/Step3Trends'
import Step4IdeaEvaluation from '../steps/Step4IdeaEvaluation'
import Step5UserValue from '../steps/Step5UserValue'
import Step6AIEvaluation from '../steps/Step6AIEvaluation'
import Step7SustainableCanvas from '../steps/Step7SustainableCanvas'
import Step8InnovationPatterns from '../steps/Step8InnovationPatterns'
import Step9PrototypeMVP from '../steps/Step9PrototypeMVP'
import Step10ValidationStrategy from '../steps/Step10ValidationStrategy'
import Step11EcosystemMap from '../steps/Step11EcosystemMap'
import Step12SustainabilityReflection from '../steps/Step12SustainabilityReflection'
import { FileDown, Save, Home } from 'lucide-react'

const steps = [
  { id: 1, title: 'Selección de Idea', component: IdeasManager },
  { id: 2, title: 'Medios (Bird in Hand)', component: Step1Means },
  { id: 3, title: 'Problema (Affordable Loss)', component: Step2Problem },
  { id: 4, title: 'Tendencias (Crazy Quilt)', component: Step3Trends },
  { id: 5, title: 'Evaluación (Lemonade)', component: Step4IdeaEvaluation },
  { id: 6, title: 'Usuario/Valor (Pilot-in-Plane)', component: Step5UserValue },
  { id: 7, title: 'Evaluación IA', component: Step6AIEvaluation },
  { id: 8, title: 'Canvas Sostenible', component: Step7SustainableCanvas },
  { id: 9, title: 'Patrones Innovación', component: Step8InnovationPatterns },
  { id: 10, title: 'Prototipo/PMV', component: Step9PrototypeMVP },
  { id: 11, title: 'Validación', component: Step10ValidationStrategy },
  { id: 12, title: 'Ecosistema', component: Step11EcosystemMap },
  { id: 13, title: 'Reflexión Final', component: Step12SustainabilityReflection },
]

export default function WizardLayout() {
  const [activeStep, setActiveStep] = useState(1)
  const [overallProgress, setOverallProgress] = useState({ totalProgress: 0, steps: [] })
  const [sustainabilityData, setSustainabilityData] = useState<any>({})
  
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
      loadSustainabilityData(currentIdea.id)
    }
  }, [currentIdea, loadIdeaData])

  // Load sustainability data for new steps
  const loadSustainabilityData = async (ideaId: string) => {
    try {
      const [canvasResult, patternsResult, prototypeResult, validationResult, ecosystemResult, reflectionResult] = await Promise.allSettled([
        supabase.from('sustainable_canvas').select('*').eq('idea_id', ideaId).single(),
        supabase.from('innovation_patterns').select('*').eq('idea_id', ideaId),
        supabase.from('prototypes').select('*').eq('idea_id', ideaId).single(),
        supabase.from('validation_strategies').select('*').eq('idea_id', ideaId).single(),
        supabase.from('ecosystem_actors').select('*').eq('idea_id', ideaId),
        supabase.from('sustainability_reflections').select('*').eq('idea_id', ideaId).single()
      ])

      const data: any = {}
      
      if (canvasResult.status === 'fulfilled' && canvasResult.value.data) {
        data.canvas = canvasResult.value.data
      }
      if (patternsResult.status === 'fulfilled' && patternsResult.value.data) {
        data.patterns = patternsResult.value.data
      }
      if (prototypeResult.status === 'fulfilled' && prototypeResult.value.data) {
        data.prototype = prototypeResult.value.data
      }
      if (validationResult.status === 'fulfilled' && validationResult.value.data) {
        data.validation = validationResult.value.data
      }
      if (ecosystemResult.status === 'fulfilled' && ecosystemResult.value.data) {
        data.ecosystem = ecosystemResult.value.data
      }
      if (reflectionResult.status === 'fulfilled' && reflectionResult.value.data) {
        data.reflection = reflectionResult.value.data
      }

      setSustainabilityData(data)
    } catch (error) {
      console.error('Error loading sustainability data:', error)
    }
  }

  useEffect(() => {
    if (currentJournal) {
      try {
        // Step 1: Ideas management - complete if has ideas and currentIdea selected
        const step1Complete = ideas && ideas.length > 0 && currentIdea
        const step1Progress = step1Complete ? 100 : 0
        
        // Steps 2-13: Only if currentIdea is selected
        let step2Complete = false, step2Progress = 0
        let step3Complete = false, step3Progress = 0
        let step4Complete = false, step4Progress = 0
        let step5Complete = false, step5Progress = 0
        let step6Complete = false, step6Progress = 0
        let step7Complete = false, step7Progress = 0
        let step8Complete = false, step8Progress = 0
        let step9Complete = false, step9Progress = 0
        let step10Complete = false, step10Progress = 0
        let step11Complete = false, step11Progress = 0
        let step12Complete = false, step12Progress = 0
        let step13Complete = false, step13Progress = 0
        
        if (currentIdea) {
          
          // Step 2: Medios personales (Bird in Hand)
          step2Complete = step1Data && step1Data.length > 0
          step2Progress = step2Complete ? 100 : 0
          
          // Step 3: Problema (Affordable Loss)
          step3Complete = step2Data ? validateStep2Complete(step2Data) : false
          step3Progress = step3Complete ? 100 : 0
          
          // Step 4: SWOT evaluation (idea-specific)
          step4Complete = step4EvaluationData ? Object.keys(step4EvaluationData).length > 0 : false
          step4Progress = step4Complete ? 100 : 0
          
          // Step 5: User & Value Proposition (idea-specific)
          step5Complete = step5BuyerData && step5VPData ? 
            Object.keys(step5BuyerData).length > 0 && Object.keys(step5VPData).length > 0 : false
          step5Progress = step5Complete ? 100 : 0
          
          // Step 6: AI Analysis (idea-specific)
          step6Complete = step5Complete
          step6Progress = step6Complete ? 100 : 0
          
          // Step 7: AI Evaluation
          step7Complete = step6Complete
          step7Progress = step7Complete ? 100 : 0
          
          // Step 8: Sustainable Canvas
          if (sustainabilityData.canvas) {
            const canvasFields = ['customer_segments', 'value_propositions', 'social_benefits', 'environmental_benefits', 'key_resources', 'cost_structure']
            const filledFields = canvasFields.filter(field => sustainabilityData.canvas[field] && sustainabilityData.canvas[field].trim().length > 0)
            step8Progress = Math.round((filledFields.length / canvasFields.length) * 100)
            step8Complete = step8Progress >= 80
          }
          
          // Step 9: Innovation Patterns
          if (sustainabilityData.patterns && sustainabilityData.patterns.length >= 3) {
            step9Progress = 100
            step9Complete = true
          } else if (sustainabilityData.patterns) {
            step9Progress = Math.round((sustainabilityData.patterns.length / 3) * 100)
          }
          
          // Step 10: Prototype/MVP
          if (sustainabilityData.prototype) {
            const requiredFields = ['name', 'type', 'description', 'hypothesis_to_validate']
            const filledFields = requiredFields.filter(field => sustainabilityData.prototype[field])
            step10Progress = Math.round((filledFields.length / requiredFields.length) * 100)
            step10Complete = step10Progress >= 80
          }
          
          // Step 11: Validation Strategy
          if (sustainabilityData.validation) {
            const requiredFields = ['hypothesis', 'target_segments', 'validation_methods', 'expected_learnings']
            const filledFields = requiredFields.filter(field => {
              const value = sustainabilityData.validation[field]
              if (field === 'validation_methods') {
                return Array.isArray(value) && value.length > 0
              }
              return value && String(value).trim().length > 0
            })
            step11Progress = Math.round((filledFields.length / requiredFields.length) * 100)
            step11Complete = step11Progress >= 70
          }
          
          // Step 12: Ecosystem Map
          if (sustainabilityData.ecosystem && sustainabilityData.ecosystem.length >= 5) {
            step12Progress = 100
            step12Complete = true
          } else if (sustainabilityData.ecosystem) {
            step12Progress = Math.round((sustainabilityData.ecosystem.length / 5) * 100)
          }
          
          // Step 13: Sustainability Reflection
          if (sustainabilityData.reflection) {
            const reflectionFields = ['social_impact_balance', 'sustainability_decisions', 'scaling_strategy']
            const filledFields = reflectionFields.filter(field => {
              const value = sustainabilityData.reflection[field]
              return value && String(value).trim().length >= 200
            })
            step13Progress = Math.round((filledFields.length / reflectionFields.length) * 100)
            step13Complete = step13Progress >= 80
          }
        }
        
        const progress = {
          totalProgress: Math.round((step1Progress + step2Progress + step3Progress + step4Progress + step5Progress + step6Progress + step7Progress + step8Progress + step9Progress + step10Progress + step11Progress + step12Progress + step13Progress) / 13),
          steps: [
            { step: 1, completed: step1Complete, progress: step1Progress, locked: false },
            { step: 2, completed: step2Complete, progress: step2Progress, locked: !step1Complete },
            { step: 3, completed: step3Complete, progress: step3Progress, locked: !step2Complete },
            { step: 4, completed: step4Complete, progress: step4Progress, locked: !step3Complete },
            { step: 5, completed: step5Complete, progress: step5Progress, locked: !step4Complete },
            { step: 6, completed: step6Complete, progress: step6Progress, locked: !step5Complete },
            { step: 7, completed: step7Complete, progress: step7Progress, locked: !step6Complete },
            { step: 8, completed: step8Complete, progress: step8Progress, locked: !step7Complete },
            { step: 9, completed: step9Complete, progress: step9Progress, locked: !step8Complete },
            { step: 10, completed: step10Complete, progress: step10Progress, locked: !step9Complete },
            { step: 11, completed: step11Complete, progress: step11Progress, locked: !step10Complete },
            { step: 12, completed: step12Complete, progress: step12Progress, locked: !step11Complete },
            { step: 13, completed: step13Complete, progress: step13Progress, locked: !step12Complete },
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
            { step: 8, completed: false, progress: 0, locked: true },
            { step: 9, completed: false, progress: 0, locked: true },
            { step: 10, completed: false, progress: 0, locked: true },
            { step: 11, completed: false, progress: 0, locked: true },
            { step: 12, completed: false, progress: 0, locked: true },
            { step: 13, completed: false, progress: 0, locked: true },
          ]
        })
      }
    }
  }, [step1Data, step2Data, step3Data, step4Data, step4EvaluationData, step5BuyerData, step5VPData, currentJournal, currentIdea, ideas, sustainabilityData])

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
          ) : activeStep === 8 ? (
            currentIdea ? (
              <Step7SustainableCanvas onNext={handleNextStep} />
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
          ) : activeStep === 9 ? (
            currentIdea ? (
              <Step8InnovationPatterns onNext={handleNextStep} />
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
          ) : activeStep === 10 ? (
            currentIdea ? (
              <Step9PrototypeMVP onNext={handleNextStep} />
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
          ) : activeStep === 11 ? (
            currentIdea ? (
              <Step10ValidationStrategy onNext={handleNextStep} />
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
          ) : activeStep === 12 ? (
            currentIdea ? (
              <Step11EcosystemMap onNext={handleNextStep} />
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
          ) : activeStep === 13 ? (
            currentIdea ? (
              <Step12SustainabilityReflection onNext={handleNextStep} />
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