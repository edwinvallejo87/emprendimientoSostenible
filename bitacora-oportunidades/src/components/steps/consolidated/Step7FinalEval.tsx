import Step12SustainabilityReflection from '../Step12SustainabilityReflection'
import Step6AIEvaluation from '../Step6AIEvaluation'
import ExportButtons from '../../export/ExportButtons'
import { Leaf, Brain, Download } from 'lucide-react'
import StepTabs from '../../ui/StepTabs'

interface Step7FinalEvalProps {
  onNext: () => void
}

export default function Step7FinalEval({ onNext }: Step7FinalEvalProps) {
  return (
    <StepTabs
      tabs={[
        {
          id: 'reflection',
          label: 'Impacto Sostenible',
          icon: Leaf,
          component: <Step12SustainabilityReflection onNext={() => {}} />,
        },
        {
          id: 'ai',
          label: 'Evaluacion IA',
          icon: Brain,
          component: (
            <div>
              <Step6AIEvaluation onNext={onNext} />
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gray-100 rounded-md">
                    <Download className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Exportar Proyecto</h3>
                    <p className="text-sm text-gray-500">Descarga tu analisis completo</p>
                  </div>
                </div>
                <ExportButtons />
              </div>
            </div>
          ),
        },
      ]}
    />
  )
}
