import StepTabs from '../../ui/StepTabs'
import Step1Means from '../Step1Means'
import Step2Problem from '../Step2Problem'
import { User, AlertTriangle } from 'lucide-react'

interface Step2DiscoveryProps {
  onNext: () => void
}

export default function Step2Discovery({ onNext }: Step2DiscoveryProps) {
  return (
    <StepTabs
      tabs={[
        {
          id: 'means',
          label: 'Tus Recursos',
          icon: User,
          component: <Step1Means onNext={() => {}} />,
        },
        {
          id: 'problem',
          label: 'El Problema',
          icon: AlertTriangle,
          component: <Step2Problem onNext={onNext} />,
        },
      ]}
    />
  )
}
