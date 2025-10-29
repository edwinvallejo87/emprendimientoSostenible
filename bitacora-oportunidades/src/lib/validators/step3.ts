import { z } from 'zod'

export const trendTypeSchema = z.enum(['Social', 'Tecnológica', 'Ambiental', 'Cultural', 'Consumo'])

export const step3TrendSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  type: trendTypeSchema,
  brief: z.string().min(1, 'La descripción breve es requerida'),
  example: z.string().min(1, 'El ejemplo es requerido'),
  source_apa: z.string().optional(),
  comment: z.string().optional(),
})

export type Step3TrendData = z.infer<typeof step3TrendSchema>
export type TrendType = z.infer<typeof trendTypeSchema>

export const validateStep3Complete = (trendsData: Partial<Step3TrendData>[]): boolean => {
  if (!trendsData || trendsData.length < 1) return false
  
  const validTrends = trendsData.filter(trend => {
    try {
      step3TrendSchema.parse(trend)
      return true
    } catch {
      return false
    }
  })
  
  return validTrends.length >= 1
}

export const getStep3Progress = (trendsData: Partial<Step3TrendData>[]): number => {
  if (!trendsData) return 0
  
  const validTrends = trendsData.filter(trend => {
    try {
      step3TrendSchema.parse(trend)
      return true
    } catch {
      return false
    }
  })
  
  // Progress based on having at least 1 valid trend
  if (validTrends.length >= 1) {
    return 100
  }
  
  return 0
}

export const trendTypes: TrendType[] = ['Social', 'Tecnológica', 'Ambiental', 'Cultural', 'Consumo']