import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useJournalStore } from '../../store/journal'
import { 
  step5BuyerSchema, 
  step5VPCanvasSchema,
  type Step5BuyerData, 
  type Step5VPCanvasData 
} from '../../lib/validators/step5'
import { Users, Target, CheckCircle, AlertTriangle } from 'lucide-react'
import PptxExportButton from '../export/PptxExportButton'
import { calculateOverallProgress } from '../../lib/progress/calcProgress'

interface Step5UserValueProps {
  onNext?: () => void
}

export default function Step5UserValue({ onNext }: Step5UserValueProps) {
  const {
    currentJournal,
    step1Data,
    step2Data,
    step3Data,
    step4Data,
    step5BuyerData,
    step5VPData,
    saveStep5BuyerData,
    saveStep5VPData,
  } = useJournalStore()

  const [saving, setSaving] = useState(false)

  const {
    control: buyerControl,
    watch: watchBuyer,
    handleSubmit: handleBuyerSubmit,
    formState: { errors: buyerErrors, isValid: isBuyerValid },
  } = useForm<Step5BuyerData>({
    resolver: zodResolver(step5BuyerSchema),
    defaultValues: step5BuyerData || {},
    mode: 'onChange'
  })

  const {
    control: vpControl,
    watch: watchVP,
    handleSubmit: handleVPSubmit,
    formState: { errors: vpErrors, isValid: isVPValid },
  } = useForm<Step5VPCanvasData>({
    resolver: zodResolver(step5VPCanvasSchema),
    defaultValues: step5VPData || {},
    mode: 'onChange'
  })

  const buyerValues = watchBuyer()
  const vpValues = watchVP()

  // Calculate if all steps are complete for PDF export
  const overallProgress = calculateOverallProgress({
    step1: step1Data || [],
    step2: step2Data || null,
    step3: step3Data || [],
    step4: step4Data || [],
    step5Buyer: step5BuyerData || null,
    step5VP: step5VPData || null,
    teamMembersCount: 2, // TODO: Get actual team member count
  })
  
  const allStepsComplete = overallProgress.totalProgress === 100

  const onSubmit = async (buyerData: Step5BuyerData, vpData: Step5VPCanvasData) => {
    if (!currentJournal) return
    
    setSaving(true)
    try {
      await Promise.all([
        saveStep5BuyerData(currentJournal.id, buyerData),
        saveStep5VPData(currentJournal.id, vpData)
      ])
      if (onNext) {
        onNext()
      }
    } catch (error) {
      console.error('Error saving step 5 data:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleFormSubmit = () => {
    if (isBuyerValid && isVPValid) {
      onSubmit(buyerValues, vpValues)
    }
  }

  if (!currentJournal) {
    return <div>No hay bitácora seleccionada</div>
  }

  const getBuyerFieldStatus = (field: keyof Step5BuyerData) => {
    const value = buyerValues[field]
    if (field === 'age') {
      return typeof value === 'number' && value > 0 ? 'complete' : 'empty'
    }
    return value && String(value).trim().length > 0 ? 'complete' : 'empty'
  }

  const getVPFieldStatus = (field: keyof Step5VPCanvasData) => {
    const value = vpValues[field]
    return value && value.trim().length > 0 ? 'complete' : 'empty'
  }

  const getStatusIcon = (status: string) => {
    return status === 'complete' 
      ? <CheckCircle className="h-4 w-4 text-green-500" />
      : <div className="h-4 w-4 border border-gray-300 rounded-full" />
  }

  return (
    <div className="max-w-3xl mx-auto px-6">
      <div className="mb-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl text-stone-900 mb-3">Usuario y Propuesta de Valor</h1>
          <p className="text-lg text-stone-600">
            Define el buyer persona y desarrolla el canvas de propuesta de valor
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }} className="space-y-16">
          {saving && (
            <div className="text-center py-2 text-stone-500 text-sm">
              Guardando...
            </div>
          )}

          {/* Buyer Persona Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Buyer Persona</h3>
                <p className="text-sm text-gray-600">
                  Perfil detallado de tu usuario objetivo
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(getBuyerFieldStatus('name'))}
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre del persona *
                  </label>
                </div>
                <Controller
                  name="name"
                  control={buyerControl}
                  render={({ field }) => (
                    <input
                      {...field}
                      value={field.value || ''}
                      type="text"
                      className="input"
                      placeholder="Ej: María González"
                    />
                  )}
                />
                {buyerErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{buyerErrors.name.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(getBuyerFieldStatus('age'))}
                  <label className="block text-sm font-medium text-gray-700">
                    Edad *
                  </label>
                </div>
                <Controller
                  name="age"
                  control={buyerControl}
                  render={({ field }) => (
                    <input
                      {...field}
                      value={field.value || ''}
                      type="number"
                      min="1"
                      max="120"
                      className="input"
                      placeholder="35"
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                    />
                  )}
                />
                {buyerErrors.age && (
                  <p className="mt-1 text-sm text-red-600">{buyerErrors.age.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(getBuyerFieldStatus('occupation'))}
                  <label className="block text-sm font-medium text-gray-700">
                    Ocupación *
                  </label>
                </div>
                <Controller
                  name="occupation"
                  control={buyerControl}
                  render={({ field }) => (
                    <input
                      {...field}
                      value={field.value || ''}
                      type="text"
                      className="input"
                      placeholder="Ej: Gerente de Marketing Digital"
                    />
                  )}
                />
                {buyerErrors.occupation && (
                  <p className="mt-1 text-sm text-red-600">{buyerErrors.occupation.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(getBuyerFieldStatus('motivations'))}
                  <label className="block text-sm font-medium text-gray-700">
                    Motivaciones *
                  </label>
                </div>
                <Controller
                  name="motivations"
                  control={buyerControl}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      value={field.value || ''}
                      rows={4}
                      className="textarea"
                      placeholder="¿Qué la motiva? ¿Cuáles son sus objetivos y aspiraciones?"
                    />
                  )}
                />
                {buyerErrors.motivations && (
                  <p className="mt-1 text-sm text-red-600">{buyerErrors.motivations.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(getBuyerFieldStatus('pains'))}
                  <label className="block text-sm font-medium text-gray-700">
                    Frustraciones *
                  </label>
                </div>
                <Controller
                  name="pains"
                  control={buyerControl}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      value={field.value || ''}
                      rows={4}
                      className="textarea"
                      placeholder="¿Cuáles son sus principales frustraciones y obstáculos?"
                    />
                  )}
                />
                {buyerErrors.pains && (
                  <p className="mt-1 text-sm text-red-600">{buyerErrors.pains.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(getBuyerFieldStatus('needs'))}
                  <label className="block text-sm font-medium text-gray-700">
                    Necesidades *
                  </label>
                </div>
                <Controller
                  name="needs"
                  control={buyerControl}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      value={field.value || ''}
                      rows={3}
                      className="textarea"
                      placeholder="¿Qué necesita para alcanzar sus objetivos y resolver sus frustraciones?"
                    />
                  )}
                />
                {buyerErrors.needs && (
                  <p className="mt-1 text-sm text-red-600">{buyerErrors.needs.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Value Proposition Canvas Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Canvas de Propuesta de Valor</h3>
                <p className="text-sm text-gray-600">
                  Estructura tu propuesta de valor en ambos lados del canvas
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customer Side */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-blue-900 border-b border-blue-200 pb-2">
                  👤 Perfil del Cliente
                </h4>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(getVPFieldStatus('customer_jobs'))}
                    <label className="block text-sm font-medium text-gray-700">
                      Trabajos del Cliente *
                    </label>
                  </div>
                  <Controller
                    name="customer_jobs"
                    control={vpControl}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        value={field.value || ''}
                        rows={4}
                        className="textarea"
                        placeholder="¿Qué trabajos funcionales, emocionales y sociales intenta realizar el cliente?"
                      />
                    )}
                  />
                  {vpErrors.customer_jobs && (
                    <p className="mt-1 text-sm text-red-600">{vpErrors.customer_jobs.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(getVPFieldStatus('customer_pains'))}
                    <label className="block text-sm font-medium text-gray-700">
                      Dolores del Cliente *
                    </label>
                  </div>
                  <Controller
                    name="customer_pains"
                    control={vpControl}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        value={field.value || ''}
                        rows={4}
                        className="textarea"
                        placeholder="¿Qué dolores, obstáculos y riesgos experimenta el cliente?"
                      />
                    )}
                  />
                  {vpErrors.customer_pains && (
                    <p className="mt-1 text-sm text-red-600">{vpErrors.customer_pains.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(getVPFieldStatus('customer_gains'))}
                    <label className="block text-sm font-medium text-gray-700">
                      Alegrías del Cliente *
                    </label>
                  </div>
                  <Controller
                    name="customer_gains"
                    control={vpControl}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        value={field.value || ''}
                        rows={4}
                        className="textarea"
                        placeholder="¿Qué resultados y beneficios espera, desea o le sorprenderían positivamente?"
                      />
                    )}
                  />
                  {vpErrors.customer_gains && (
                    <p className="mt-1 text-sm text-red-600">{vpErrors.customer_gains.message}</p>
                  )}
                </div>
              </div>

              {/* Value Proposition Side */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-green-900 border-b border-green-200 pb-2">
                  💎 Propuesta de Valor
                </h4>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(getVPFieldStatus('products_services'))}
                    <label className="block text-sm font-medium text-gray-700">
                      Productos y Servicios *
                    </label>
                  </div>
                  <Controller
                    name="products_services"
                    control={vpControl}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        value={field.value || ''}
                        rows={4}
                        className="textarea"
                        placeholder="¿Qué productos y servicios ofreces? Lista las características más importantes."
                      />
                    )}
                  />
                  {vpErrors.products_services && (
                    <p className="mt-1 text-sm text-red-600">{vpErrors.products_services.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(getVPFieldStatus('pain_relievers'))}
                    <label className="block text-sm font-medium text-gray-700">
                      Aliviadores de Dolor *
                    </label>
                  </div>
                  <Controller
                    name="pain_relievers"
                    control={vpControl}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        value={field.value || ''}
                        rows={4}
                        className="textarea"
                        placeholder="¿Cómo tu propuesta alivia los dolores específicos del cliente?"
                      />
                    )}
                  />
                  {vpErrors.pain_relievers && (
                    <p className="mt-1 text-sm text-red-600">{vpErrors.pain_relievers.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(getVPFieldStatus('gain_creators'))}
                    <label className="block text-sm font-medium text-gray-700">
                      Generadores de Alegría *
                    </label>
                  </div>
                  <Controller
                    name="gain_creators"
                    control={vpControl}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        value={field.value || ''}
                        rows={4}
                        className="textarea"
                        placeholder="¿Cómo tu propuesta crea alegrías y beneficios que el cliente espera, desea o le sorprenderían?"
                      />
                    )}
                  />
                  {vpErrors.gain_creators && (
                    <p className="mt-1 text-sm text-red-600">{vpErrors.gain_creators.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              disabled={!isBuyerValid || !isVPValid || saving}
              className="btn btn-primary"
            >
              {saving ? 'Guardando...' : 'Finalizar'}
            </button>
            
            <PptxExportButton disabled={!allStepsComplete} />
          </div>

          {!allStepsComplete && isBuyerValid && isVPValid && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 text-center">
                <strong>💡 Consejo:</strong> Una vez que guardes este paso, podrás exportar toda la bitácora como presentación
              </p>
            </div>
          )}

        </form>

        <div className="mt-6 p-4 bg-orange-50 rounded-lg">
          <h4 className="font-medium text-orange-900 mb-2">📋 Criterios de validación:</h4>
          <ul className="text-sm text-orange-800 space-y-1">
            <li>• Buyer Persona completo (todos los campos requeridos)</li>
            <li>• Canvas de Propuesta de Valor completo (6 bloques llenos)</li>
            <li>• Coherencia entre el buyer persona y el canvas</li>
            <li>• Conexión clara con la idea seleccionada del paso anterior</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">💡 Consejos para el canvas:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Enfócate en los aspectos más importantes y específicos</li>
            <li>• Usa el lenguaje que usaría tu cliente</li>
            <li>• Sé concreto y evita generalidades</li>
            <li>• Asegúrate de que hay match entre ambos lados del canvas</li>
          </ul>
        </div>
      </div>
    </div>
  )
}