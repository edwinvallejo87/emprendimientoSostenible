import { z } from 'zod'

export const innovationLevelSchema = z.enum(['Incremental', 'Radical'])
export const feasibilityLevelSchema = z.enum(['Alta', 'Media', 'Baja'])

export const step4IdeaSchema = z.object({
  idea: z.string().min(1, 'La idea es requerida'),
  kind: z.string().min(1, 'El tipo es requerido'),
  innovation_level: innovationLevelSchema,
  feasibility: feasibilityLevelSchema,
  selected: z.boolean().default(false),
  justification: z.string().optional(),
})

export type Step4IdeaData = z.infer<typeof step4IdeaSchema>
export type InnovationLevel = z.infer<typeof innovationLevelSchema>
export type FeasibilityLevel = z.infer<typeof feasibilityLevelSchema>

export const validateStep4Complete = (ideasData: Partial<Step4IdeaData>[]): boolean => {
  if (!ideasData || ideasData.length < 5) return false
  
  const validIdeas = ideasData.filter(idea => {
    try {
      step4IdeaSchema.parse(idea)
      return true
    } catch {
      return false
    }
  })
  
  if (validIdeas.length < 5) return false
  
  const selectedIdeas = validIdeas.filter(idea => idea.selected)
  if (selectedIdeas.length !== 1) return false
  
  const selectedIdea = selectedIdeas[0]
  return selectedIdea.justification && selectedIdea.justification.trim().length >= 200
}

export const getStep4Progress = (ideasData: Partial<Step4IdeaData>[]): number => {
  if (!ideasData) return 0
  
  const validIdeas = ideasData.filter(idea => {
    try {
      step4IdeaSchema.parse(idea)
      return true
    } catch {
      return false
    }
  })
  
  let progress = 0
  
  // 60% for having at least 5 valid ideas
  if (validIdeas.length >= 5) {
    progress += 60
  } else {
    progress += Math.round((validIdeas.length / 5) * 60)
  }
  
  // 20% for having exactly one selected idea
  const selectedIdeas = validIdeas.filter(idea => idea.selected)
  if (selectedIdeas.length === 1) {
    progress += 20
  }
  
  // 20% for having justification with at least 200 characters
  if (selectedIdeas.length === 1 && selectedIdeas[0].justification && selectedIdeas[0].justification.trim().length >= 200) {
    progress += 20
  }
  
  return Math.min(progress, 100)
}

export const innovationLevels: InnovationLevel[] = ['Incremental', 'Radical']
export const feasibilityLevels: FeasibilityLevel[] = ['Alta', 'Media', 'Baja']