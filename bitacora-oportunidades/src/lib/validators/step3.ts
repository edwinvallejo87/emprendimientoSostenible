import { z } from 'zod'

export const trendTypeSchema = z.enum(['Social', 'Tecnológica', 'Ambiental', 'Cultural', 'Consumo'])

export const step3TrendSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  type: trendTypeSchema,
  brief: z.string().min(1, 'La descripción breve es requerida'),
  example: z.string().min(1, 'El ejemplo es requerido'),
  source_apa: z.string().min(1, 'La fuente APA es requerida'),
  comment: z.string().optional(),
})

export type Step3TrendData = z.infer<typeof step3TrendSchema>
export type TrendType = z.infer<typeof trendTypeSchema>

export const validateStep3Complete = (trendsData: Partial<Step3TrendData>[]): boolean => {
  if (!trendsData || trendsData.length !== 5) return false
  
  return trendsData.every(trend => {
    try {
      step3TrendSchema.parse(trend)
      return true
    } catch {
      return false
    }
  })
}

export const getStep3Progress = (trendsData: Partial<Step3TrendData>[]): number => {
  if (!trendsData) return 0
  
  const expectedCount = 5
  const validTrends = trendsData.filter(trend => {
    try {
      step3TrendSchema.parse(trend)
      return true
    } catch {
      return false
    }
  })
  
  return Math.round((validTrends.length / expectedCount) * 100)
}

export const trendTypes: TrendType[] = ['Social', 'Tecnológica', 'Ambiental', 'Cultural', 'Consumo']