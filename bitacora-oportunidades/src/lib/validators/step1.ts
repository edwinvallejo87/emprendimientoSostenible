import { z } from 'zod'

export const step1MeansSchema = z.object({
  who_i_am: z.string().optional(),
  what_i_know: z.string().optional(),
  who_i_know: z.string().optional(),
  what_i_have: z.string().optional(),
})

export type Step1MeansData = z.infer<typeof step1MeansSchema>

export const validateStep1Complete = (meansData: Step1MeansData[]): boolean => {
  if (!meansData || meansData.length === 0) return false
  
  return meansData.every(means => {
    if (!means) return false
    const values = [means.who_i_am, means.what_i_know, means.who_i_know, means.what_i_have]
    return values.some(value => value && value.trim().length > 0)
  })
}

export const getStep1Progress = (meansData: Step1MeansData[], teamMembersCount: number): number => {
  if (!meansData || teamMembersCount === 0) return 0
  
  const completedMembers = meansData.filter(means => {
    if (!means) return false
    const values = [means.who_i_am, means.what_i_know, means.who_i_know, means.what_i_have]
    return values.some(value => value && value.trim().length > 0)
  }).length
  
  return Math.round((completedMembers / teamMembersCount) * 100)
}