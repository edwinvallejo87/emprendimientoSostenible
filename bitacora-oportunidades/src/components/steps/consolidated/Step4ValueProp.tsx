import Step5UserValue from '../Step5UserValue'

interface Step4ValuePropProps {
  onNext: () => void
}

export default function Step4ValueProp({ onNext }: Step4ValuePropProps) {
  return <Step5UserValue onNext={onNext} />
}
