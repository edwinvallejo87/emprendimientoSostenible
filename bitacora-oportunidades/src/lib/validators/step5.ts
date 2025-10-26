import { z } from 'zod'

export const step5BuyerSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  age: z.number().min(1, 'La edad es requerida').max(120, 'Edad inválida'),
  occupation: z.string().min(1, 'La ocupación es requerida'),
  motivations: z.string().min(1, 'Las motivaciones son requeridas'),
  pains: z.string().min(1, 'Las frustraciones son requeridas'),
  needs: z.string().min(1, 'Las necesidades son requeridas'),
})

export const step5VPCanvasSchema = z.object({
  customer_jobs: z.string().min(1, 'Los trabajos del cliente son requeridos'),
  customer_pains: z.string().min(1, 'Los dolores del cliente son requeridos'),
  customer_gains: z.string().min(1, 'Las alegrías del cliente son requeridas'),
  products_services: z.string().min(1, 'Los productos/servicios son requeridos'),
  pain_relievers: z.string().min(1, 'Los aliviadores de dolor son requeridos'),
  gain_creators: z.string().min(1, 'Los generadores de alegría son requeridos'),
})

export type Step5BuyerData = z.infer<typeof step5BuyerSchema>
export type Step5VPCanvasData = z.infer<typeof step5VPCanvasSchema>

export const validateStep5Complete = (
  buyerData: Partial<Step5BuyerData>,
  vpCanvasData: Partial<Step5VPCanvasData>
): boolean => {
  try {
    step5BuyerSchema.parse(buyerData)
    step5VPCanvasSchema.parse(vpCanvasData)
    return true
  } catch {
    return false
  }
}

export const getStep5Progress = (
  buyerData: Partial<Step5BuyerData>,
  vpCanvasData: Partial<Step5VPCanvasData>
): number => {
  let progress = 0
  
  // 50% for buyer persona
  if (buyerData) {
    const buyerFields = ['name', 'age', 'occupation', 'motivations', 'pains', 'needs'] as const
    const completedBuyerFields = buyerFields.filter(field => {
      const value = buyerData[field]
      if (field === 'age') {
        return typeof value === 'number' && value > 0 && value <= 120
      }
      return value && String(value).trim().length > 0
    }).length
    
    progress += Math.round((completedBuyerFields / buyerFields.length) * 50)
  }
  
  // 50% for VP Canvas
  if (vpCanvasData) {
    const vpFields = ['customer_jobs', 'customer_pains', 'customer_gains', 'products_services', 'pain_relievers', 'gain_creators'] as const
    const completedVPFields = vpFields.filter(field => {
      const value = vpCanvasData[field]
      return value && value.trim().length > 0
    }).length
    
    progress += Math.round((completedVPFields / vpFields.length) * 50)
  }
  
  return Math.min(progress, 100)
}