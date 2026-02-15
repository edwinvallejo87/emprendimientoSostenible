import { z } from 'zod'

export const step2ProblemSchema = z.object({
  title: z.string().min(1, 'El titulo es requerido'),
  description: z.string().min(50, 'Describe el problema en al menos 50 caracteres'),
  affected: z.string().min(30, 'Indica al menos a quien afecta'),
  relevance: z.string().min(30, 'Explica brevemente por que importa'),
  link_to_means: z.string().min(30, 'Conecta brevemente con tus recursos'),
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
    } else if (field === 'description') {
      if (value && value.trim().length >= 50) completedFields++
    } else {
      if (value && value.trim().length >= 30) completedFields++
    }
  }

  return Math.round((completedFields / fields.length) * 100)
}
