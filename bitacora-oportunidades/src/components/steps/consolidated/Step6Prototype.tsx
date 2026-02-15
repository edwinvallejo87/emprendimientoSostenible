import StepTabs from '../../ui/StepTabs'
import Step9PrototypeMVP from '../Step9PrototypeMVP'
import Step10ValidationStrategy from '../Step10ValidationStrategy'
import Step11EcosystemMap from '../Step11EcosystemMap'
import { Box, CheckCircle, Network } from 'lucide-react'

interface Step6PrototypeProps {
  onNext: () => void
}

export default function Step6Prototype({ onNext }: Step6PrototypeProps) {
  return (
    <StepTabs
      tabs={[
        {
          id: 'prototype',
          label: 'Tu MVP',
          icon: Box,
          component: <Step9PrototypeMVP onNext={() => {}} />,
        },
        {
          id: 'validation',
          label: 'Plan de Validacion',
          icon: CheckCircle,
          component: <Step10ValidationStrategy onNext={() => {}} />,
        },
        {
          id: 'ecosystem',
          label: 'Red de Aliados',
          icon: Network,
          component: <Step11EcosystemMap onNext={onNext} />,
        },
      ]}
    />
  )
}
