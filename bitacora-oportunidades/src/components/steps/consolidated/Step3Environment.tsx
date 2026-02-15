import StepTabs from '../../ui/StepTabs'
import Step3Trends from '../Step3Trends'
import Step4IdeaEvaluation from '../Step4IdeaEvaluation'
import { TrendingUp, BarChart3 } from 'lucide-react'

interface Step3EnvironmentProps {
  onNext: () => void
}

export default function Step3Environment({ onNext }: Step3EnvironmentProps) {
  return (
    <StepTabs
      tabs={[
        {
          id: 'trends',
          label: 'Tendencias de Mercado',
          icon: TrendingUp,
          component: <Step3Trends onNext={() => {}} />,
        },
        {
          id: 'swot',
          label: 'Analisis FODA',
          icon: BarChart3,
          component: <Step4IdeaEvaluation onNext={onNext} />,
        },
      ]}
    />
  )
}
