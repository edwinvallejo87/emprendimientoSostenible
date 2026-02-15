import StepTabs from '../../ui/StepTabs'
import Step7SustainableCanvas from '../Step7SustainableCanvas'
import Step8InnovationPatterns from '../Step8InnovationPatterns'
import { LayoutGrid, Lightbulb } from 'lucide-react'

interface Step5BusinessModelProps {
  onNext: () => void
}

export default function Step5BusinessModel({ onNext }: Step5BusinessModelProps) {
  return (
    <StepTabs
      tabs={[
        {
          id: 'canvas',
          label: 'Modelo de Negocio',
          icon: LayoutGrid,
          component: <Step7SustainableCanvas onNext={() => {}} />,
        },
        {
          id: 'patterns',
          label: 'Patrones de Innovacion',
          icon: Lightbulb,
          component: <Step8InnovationPatterns onNext={onNext} />,
        },
      ]}
    />
  )
}
