import IdeasManager from '../IdeasManager'

interface Step1IdeaProps {
  onNext: () => void
}

export default function Step1Idea({ onNext }: Step1IdeaProps) {
  return <IdeasManager onNext={onNext} />
}
