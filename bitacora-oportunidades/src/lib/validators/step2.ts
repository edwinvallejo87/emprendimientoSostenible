import { z } from 'zod'

export const step2ProblemSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().min(200, 'La descripción debe tener al menos 200 caracteres'),
  affected: z.string().min(200, 'Los afectados deben tener al menos 200 caracteres'),
  relevance: z.string().min(200, 'La relevancia debe tener al menos 200 caracteres'),
  link_to_means: z.string().min(200, 'El vínculo con medios debe tener al menos 200 caracteres'),
})

export type Step2ProblemData = z.infer<typeof step2ProblemSchema>

export const validateStep2Complete = (problemData: Partial<Step2ProblemData>): boolean => {
  try {
    step2ProblemSchema.parse(problemData)
    return true
  } catch {
    return false
  }
}

export const getStep2Progress = (problemData: Partial<Step2ProblemData>): number => {
  if (!problemData) return 0
  
  const fields = ['title', 'description', 'affected', 'relevance', 'link_to_means'] as const
  let completedFields = 0
  
  for (const field of fields) {
    const value = problemData[field]
    if (field === 'title') {
      if (value && value.trim().length > 0) completedFields++
    } else {
      if (value && value.trim().length >= 200) completedFields++
    }
  }
  
  return Math.round((completedFields / fields.length) * 100)
}