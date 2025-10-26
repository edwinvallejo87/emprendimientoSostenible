import { validateStep1Complete, getStep1Progress } from '../validators/step1'
import { validateStep2Complete, getStep2Progress } from '../validators/step2'
import { validateStep3Complete, getStep3Progress } from '../validators/step3'
import { validateStep4Complete, getStep4Progress } from '../validators/step4'
import { validateStep5Complete, getStep5Progress } from '../validators/step5'
import type { Database } from '../database.types'

type Step1Data = Database['public']['Tables']['step1_means']['Row'][]
type Step2Data = Database['public']['Tables']['step2_problem']['Row'] | null
type Step3Data = Database['public']['Tables']['step3_trends']['Row'][]
type Step4Data = Database['public']['Tables']['step4_ideas']['Row'][]
type Step5BuyerData = Database['public']['Tables']['step5_buyer']['Row'] | null
type Step5VPData = Database['public']['Tables']['step5_vpcanvas']['Row'] | null

export interface StepProgress {
  step: number
  completed: boolean
  progress: number
  locked: boolean
}

export interface OverallProgress {
  totalProgress: number
  steps: StepProgress[]
}

export const calculateStepProgress = (
  step: number,
  data: {
    step1?: Step1Data
    step2?: Step2Data
    step3?: Step3Data
    step4?: Step4Data
    step5Buyer?: Step5BuyerData
    step5VP?: Step5VPData
    teamMembersCount?: number
  }
): StepProgress => {
  let completed = false
  let progress = 0

  switch (step) {
    case 1:
      if (data.step1 && data.teamMembersCount) {
        completed = validateStep1Complete(data.step1)
        progress = getStep1Progress(data.step1, data.teamMembersCount)
      }
      break
    case 2:
      if (data.step2) {
        completed = validateStep2Complete(data.step2)
        progress = getStep2Progress(data.step2)
      }
      break
    case 3:
      if (data.step3) {
        completed = validateStep3Complete(data.step3)
        progress = getStep3Progress(data.step3)
      }
      break
    case 4:
      if (data.step4) {
        completed = validateStep4Complete(data.step4)
        progress = getStep4Progress(data.step4)
      }
      break
    case 5:
      if (data.step5Buyer && data.step5VP) {
        completed = validateStep5Complete(data.step5Buyer, data.step5VP)
        progress = getStep5Progress(data.step5Buyer, data.step5VP)
      }
      break
  }

  return { step, completed, progress, locked: false }
}

export const calculateOverallProgress = (
  data: {
    step1?: Step1Data
    step2?: Step2Data
    step3?: Step3Data
    step4?: Step4Data
    step5Buyer?: Step5BuyerData
    step5VP?: Step5VPData
    teamMembersCount?: number
  }
): OverallProgress => {
  const steps: StepProgress[] = []
  
  for (let i = 1; i <= 5; i++) {
    const stepProgress = calculateStepProgress(i, data)
    
    // Lock step if previous step is not completed
    if (i > 1) {
      const previousStep = steps[i - 2]
      stepProgress.locked = !previousStep.completed
    }
    
    steps.push(stepProgress)
  }
  
  const totalProgress = Math.round(steps.reduce((sum, step) => sum + step.progress, 0) / 5)
  
  return { totalProgress, steps }
}

export const getProgressColor = (progress: number): string => {
  if (progress >= 100) return 'text-green-600'
  if (progress >= 75) return 'text-yellow-600'
  if (progress >= 25) return 'text-orange-600'
  return 'text-red-600'
}

export const getProgressBgColor = (progress: number): string => {
  if (progress >= 100) return 'bg-green-100'
  if (progress >= 75) return 'bg-yellow-100'
  if (progress >= 25) return 'bg-orange-100'
  return 'bg-red-100'
}