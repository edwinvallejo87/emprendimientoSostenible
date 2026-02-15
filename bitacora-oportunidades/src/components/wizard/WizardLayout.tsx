import { useState, useEffect } from 'react'
import { useJournalStore } from '../../store/journal'
import { validateStep2Complete } from '../../lib/validators/step2'
import { supabase } from '../../lib/supabase'
import {
  Lightbulb, Compass, Globe, Heart, LayoutGrid, Box, Award,
  Home, Check, Lock, ChevronLeft, ChevronRight, Menu, X, Loader2
} from 'lucide-react'

// Consolidated step components
import Step1Idea from '../steps/consolidated/Step1Idea'
import Step2Discovery from '../steps/consolidated/Step2Discovery'
import Step3Environment from '../steps/consolidated/Step3Environment'
import Step4ValueProp from '../steps/consolidated/Step4ValueProp'
import Step5BusinessModel from '../steps/consolidated/Step5BusinessModel'
import Step6Prototype from '../steps/consolidated/Step6Prototype'
import Step7FinalEval from '../steps/consolidated/Step7FinalEval'

const steps = [
  { id: 1, title: 'Tu Idea', icon: Lightbulb, color: 'accent' },
  { id: 2, title: 'Fundamentos', icon: Compass, color: 'primary' },
  { id: 3, title: 'Entorno y FODA', icon: Globe, color: 'primary' },
  { id: 4, title: 'Cliente y Valor', icon: Heart, color: 'primary' },
  { id: 5, title: 'Modelo de Negocio', icon: LayoutGrid, color: 'sustain' },
  { id: 6, title: 'MVP y Validacion', icon: Box, color: 'sustain' },
  { id: 7, title: 'Impacto y Cierre', icon: Award, color: 'accent' },
]

const stepSubtitles: Record<number, string> = {
  1: 'Genera o selecciona la idea que vas a desarrollar',
  2: 'Define tus recursos personales y el problema que resuelves',
  3: 'Analiza tendencias del mercado y evalua fortalezas y debilidades',
  4: 'Perfila a tu cliente ideal y diseña tu propuesta de valor',
  5: 'Construye tu modelo de negocio sostenible con patrones de innovacion',
  6: 'Diseña tu MVP, planifica la validacion y mapea tu red de aliados',
  7: 'Reflexiona sobre el impacto sostenible y obten tu evaluacion IA',
}

function getStepPhase(stepNumber: number): { label: string; bgColor: string; textColor: string; accentColor: string } {
  switch (stepNumber) {
    case 1:
      return { label: 'Ideacion', bgColor: 'bg-amber-100', textColor: 'text-amber-600', accentColor: 'border-amber-200' }
    case 2:
    case 3:
      return { label: 'Analisis', bgColor: 'bg-blue-100', textColor: 'text-blue-600', accentColor: 'border-blue-200' }
    case 4:
    case 5:
      return { label: 'Modelo', bgColor: 'bg-violet-100', textColor: 'text-violet-600', accentColor: 'border-violet-200' }
    case 6:
      return { label: 'Prototipo', bgColor: 'bg-cyan-100', textColor: 'text-cyan-600', accentColor: 'border-cyan-200' }
    case 7:
      return { label: 'Impacto', bgColor: 'bg-emerald-100', textColor: 'text-emerald-600', accentColor: 'border-emerald-200' }
    default:
      return { label: '', bgColor: 'bg-gray-100', textColor: 'text-gray-600', accentColor: 'border-gray-200' }
  }
}

export default function WizardLayout() {
  const [activeStep, setActiveStep] = useState(1)
  const [overallProgress, setOverallProgress] = useState({ totalProgress: 0, steps: [] as any[] })
  const [sustainabilityData, setSustainabilityData] = useState<any>({})
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

      if (currentIdea && currentIdea.journal_id !== currentJournal.id) {
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
      if (canvasResult.status === 'fulfilled' && canvasResult.value.data) data.canvas = canvasResult.value.data
      if (patternsResult.status === 'fulfilled' && patternsResult.value.data) data.patterns = patternsResult.value.data
      if (prototypeResult.status === 'fulfilled' && prototypeResult.value.data) data.prototype = prototypeResult.value.data
      if (validationResult.status === 'fulfilled' && validationResult.value.data) data.validation = validationResult.value.data
      if (ecosystemResult.status === 'fulfilled' && ecosystemResult.value.data) data.ecosystem = ecosystemResult.value.data
      if (reflectionResult.status === 'fulfilled' && reflectionResult.value.data) data.reflection = reflectionResult.value.data
      setSustainabilityData(data)
    } catch (error) {
      console.error('Error loading sustainability data:', error)
    }
  }

  // Progress calculation mapped to 7 consolidated steps
  useEffect(() => {
    if (currentJournal) {
      try {
        const step1Complete = !!(ideas && ideas.length > 0 && currentIdea)
        const step1Progress = step1Complete ? 100 : 0

        let s2MeansProgress = 0, s2ProblemProgress = 0
        let s3TrendsProgress = 0, s3SwotProgress = 0
        let s4Progress = 0
        let s5CanvasProgress = 0, s5PatternsProgress = 0
        let s6ProtoProgress = 0, s6ValidationProgress = 0, s6EcosystemProgress = 0
        let s7ReflectionProgress = 0, s7AIProgress = 0

        if (currentIdea) {
          // Step 2: Discovery (Means + Problem)
          s2MeansProgress = step1Data && step1Data.length > 0 ? 100 : 0
          s2ProblemProgress = step2Data && validateStep2Complete(step2Data) ? 100 : 0

          // Step 3: Environment (Trends + SWOT)
          s3TrendsProgress = step3Data && step3Data.length > 0 ? 100 : 0
          s3SwotProgress = step4EvaluationData && Object.keys(step4EvaluationData).length > 0 ? 100 : 0

          // Step 4: Value Proposition
          s4Progress = step5BuyerData && step5VPData &&
            Object.keys(step5BuyerData).length > 0 && Object.keys(step5VPData).length > 0 ? 100 : 0

          // Step 5: Business Model (Canvas + Patterns)
          if (sustainabilityData.canvas) {
            const canvasFields = ['customer_segments', 'value_propositions', 'social_benefits', 'environmental_benefits', 'key_resources', 'cost_structure']
            const filledFields = canvasFields.filter(f => sustainabilityData.canvas[f]?.trim()?.length > 0)
            s5CanvasProgress = Math.round((filledFields.length / canvasFields.length) * 100)
          }
          if (sustainabilityData.patterns) {
            s5PatternsProgress = sustainabilityData.patterns.length >= 3 ? 100 : Math.round((sustainabilityData.patterns.length / 3) * 100)
          }

          // Step 6: Prototype & Validation
          if (sustainabilityData.prototype) {
            const required = ['name', 'type', 'description', 'hypothesis_to_validate']
            s6ProtoProgress = Math.round((required.filter(f => sustainabilityData.prototype[f]).length / required.length) * 100)
          }
          if (sustainabilityData.validation) {
            const required = ['hypothesis', 'target_segments', 'validation_methods', 'expected_learnings']
            const filled = required.filter(f => {
              const v = sustainabilityData.validation[f]
              return f === 'validation_methods' ? Array.isArray(v) && v.length > 0 : v && String(v).trim().length > 0
            })
            s6ValidationProgress = Math.round((filled.length / required.length) * 100)
          }
          if (sustainabilityData.ecosystem) {
            s6EcosystemProgress = sustainabilityData.ecosystem.length >= 5 ? 100 : Math.round((sustainabilityData.ecosystem.length / 5) * 100)
          }

          // Step 7: Final Eval (Reflection + AI)
          if (sustainabilityData.reflection) {
            const fields = ['social_impact_balance', 'sustainability_decisions', 'scaling_strategy']
            const filled = fields.filter(f => sustainabilityData.reflection[f]?.trim()?.length >= 200)
            s7ReflectionProgress = Math.round((filled.length / fields.length) * 100)
          }
          s7AIProgress = s4Progress > 0 ? 100 : 0
        }

        const step2Progress = Math.round((s2MeansProgress + s2ProblemProgress) / 2)
        const step3Progress = Math.round((s3TrendsProgress + s3SwotProgress) / 2)
        const step5Progress = Math.round((s5CanvasProgress + s5PatternsProgress) / 2)
        const step6Progress = Math.round((s6ProtoProgress + s6ValidationProgress + s6EcosystemProgress) / 3)
        const step7Progress = Math.round((s7ReflectionProgress + s7AIProgress) / 2)

        const step2Complete = step2Progress >= 50
        const step3Complete = step3Progress >= 50
        const step4Complete = s4Progress >= 80
        const step5Complete = step5Progress >= 50
        const step6Complete = step6Progress >= 50
        const step7Complete = step7Progress >= 50

        const total = Math.round((step1Progress + step2Progress + step3Progress + s4Progress + step5Progress + step6Progress + step7Progress) / 7)

        setOverallProgress({
          totalProgress: total,
          steps: [
            { step: 1, completed: step1Complete, progress: step1Progress, locked: false },
            { step: 2, completed: step2Complete, progress: step2Progress, locked: !step1Complete },
            { step: 3, completed: step3Complete, progress: step3Progress, locked: !step2Complete },
            { step: 4, completed: step4Complete, progress: s4Progress, locked: !step3Complete },
            { step: 5, completed: step5Complete, progress: step5Progress, locked: !step4Complete },
            { step: 6, completed: step6Complete, progress: step6Progress, locked: !step5Complete },
            { step: 7, completed: step7Complete, progress: step7Progress, locked: !step6Complete },
          ]
        })
      } catch (error) {
        console.error('Error calculating progress:', error)
        setOverallProgress({
          totalProgress: 0,
          steps: steps.map((s, i) => ({ step: s.id, completed: false, progress: 0, locked: i > 0 }))
        })
      }
    }
  }, [step1Data, step2Data, step3Data, step4Data, step4EvaluationData, step5BuyerData, step5VPData, currentJournal, currentIdea, ideas, sustainabilityData])

  const handleNextStep = () => {
    if (activeStep < steps.length) {
      setActiveStep(activeStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleGoHome = () => {
    setCurrentJournal(null)
  }

  if (!currentJournal) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Selecciona una bitacora para continuar</p>
      </div>
    )
  }

  const renderStepContent = () => {
    if (activeStep > 1 && !currentIdea) {
      return (
        <div className="card-elevated p-12 text-center animate-fade-in">
          <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="h-7 w-7 text-gray-500" />
          </div>
          <p className="text-gray-600 mb-4">Selecciona una idea en el paso 1 para continuar</p>
          <button onClick={() => setActiveStep(1)} className="btn btn-primary btn-sm">
            Ir a Seleccion de Ideas
          </button>
        </div>
      )
    }

    switch (activeStep) {
      case 1: return <Step1Idea onNext={handleNextStep} />
      case 2: return <Step2Discovery onNext={handleNextStep} />
      case 3: return <Step3Environment onNext={handleNextStep} />
      case 4: return <Step4ValueProp onNext={handleNextStep} />
      case 5: return <Step5BusinessModel onNext={handleNextStep} />
      case 6: return <Step6Prototype onNext={handleNextStep} />
      case 7: return <Step7FinalEval onNext={handleNextStep} />
      default: return null
    }
  }

  const currentStepData = steps[activeStep - 1]
  const phase = getStepPhase(activeStep)
  const StepIcon = currentStepData?.icon
  const nextStepTitle = activeStep < steps.length ? steps[activeStep]?.title : null

  return (
    <div className="flex h-[calc(100vh-3rem)]">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 left-6 z-50 p-3 bg-gray-900 text-white rounded-md shadow-sm transition-all"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative z-40 lg:z-auto
        w-72 h-[calc(100vh-3rem)] bg-gray-950
        flex flex-col
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-5 border-b border-white/10">
          <h2 className="text-white font-semibold text-sm truncate mb-1">
            {currentJournal.title}
          </h2>
          {currentIdea && (
            <p className="text-gray-400 text-xs truncate">
              {currentIdea.title}
            </p>
          )}

          {/* Progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-gray-500">Progreso</span>
              <span className="text-primary-400 font-semibold">{overallProgress.totalProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full">
              <div
                className="h-1.5 rounded-full bg-primary-500 transition-all duration-300"
                style={{ width: `${overallProgress.totalProgress}%` }}
              />
            </div>
          </div>

          {saving && (
            <div className="flex items-center gap-1.5 mt-2 text-gray-500 text-xs">
              <Loader2 className="h-3 w-3 animate-spin" />
              Guardando...
            </div>
          )}
        </div>

        {/* Step Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          <div className="space-y-1">
            {steps.map((step) => {
              const stepProgress = overallProgress.steps.find(s => s.step === step.id)
              const isActive = activeStep === step.id
              const isCompleted = stepProgress?.completed
              const isLocked = stepProgress?.locked
              const Icon = step.icon

              return (
                <button
                  key={step.id}
                  onClick={() => {
                    if (!isLocked) {
                      setActiveStep(step.id)
                      setSidebarOpen(false)
                    }
                  }}
                  disabled={isLocked}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-md text-left transition-all duration-200 group ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : isCompleted
                      ? 'text-gray-400 hover:bg-white/5'
                      : isLocked
                      ? 'text-gray-600 cursor-not-allowed'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-glow-sm'
                      : isCompleted
                      ? 'bg-green-500/20 text-green-400'
                      : isLocked
                      ? 'bg-white/5 text-gray-600'
                      : 'bg-white/5 text-gray-500 group-hover:bg-white/10'
                  }`}>
                    {isCompleted ? (
                      <Check className="h-4 w-4" />
                    ) : isLocked ? (
                      <Lock className="h-3.5 w-3.5" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">
                        {step.title}
                      </span>
                      {stepProgress && stepProgress.progress > 0 && !isCompleted && (
                        <span className="text-xs text-gray-500 ml-2">{stepProgress.progress}%</span>
                      )}
                    </div>
                    {stepProgress && stepProgress.progress > 0 && !isCompleted && (
                      <div className="w-full h-0.5 bg-white/10 rounded-full mt-1.5">
                        <div
                          className="h-0.5 rounded-full bg-primary-400 transition-all duration-300"
                          style={{ width: `${stepProgress.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleGoHome}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all text-sm"
          >
            <Home className="h-4 w-4" />
            Volver al Inicio
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Step Header */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center gap-4">
              {/* Step Icon */}
              {StepIcon && (
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${phase.bgColor}`}>
                  <StepIcon className={`h-6 w-6 ${phase.textColor}`} />
                </div>
              )}

              {/* Step Text */}
              <div className="min-w-0">
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${phase.bgColor} ${phase.textColor} mb-1.5`}>
                  Paso {activeStep} de {steps.length} &middot; {phase.label}
                </span>
                <h1 className="text-xl font-bold text-gray-900">
                  {currentStepData?.title}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {stepSubtitles[activeStep]}
                </p>
              </div>
            </div>

            {/* Accent line */}
            <div className={`mt-4 border-b-2 ${phase.accentColor}`} />
          </div>

          {/* Step Content */}
          <div className="step-content animate-fade-in">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevStep}
              disabled={activeStep === 1}
              className="btn btn-ghost group disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
              Anterior
            </button>

            <div className="flex items-center gap-1.5">
              {steps.map((step) => {
                const sp = overallProgress.steps.find(s => s.step === step.id)
                return (
                  <div
                    key={step.id}
                    className={`h-1.5 rounded-full transition-all ${
                      activeStep === step.id
                        ? 'w-6 bg-primary-600'
                        : sp?.completed
                        ? 'w-2 bg-green-500'
                        : 'w-2 bg-gray-200'
                    }`}
                  />
                )
              })}
            </div>

            {activeStep < steps.length ? (
              <button
                onClick={handleNextStep}
                className="btn btn-primary group text-center"
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                {nextStepTitle && (
                  <span className="text-[10px] text-primary-300 block">&rarr; {nextStepTitle}</span>
                )}
              </button>
            ) : (
              <div className="w-24" />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
