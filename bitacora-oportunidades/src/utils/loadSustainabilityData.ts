import { supabase } from '../lib/supabase'

// Helper function to specifically load sustainability data after AI generation
export async function loadSustainabilityData(ideaId: string) {
  console.log('🌱 Loading sustainability data for ideaId:', ideaId)
  
  try {
    const [
      sustainableCanvasResult, 
      innovationPatternsResult, 
      prototypeResult, 
      validationStrategyResult, 
      ecosystemActorsResult, 
      sustainabilityReflectionResult
    ] = await Promise.all([
      supabase.from('sustainable_canvas').select('*').eq('idea_id', ideaId).maybeSingle(),
      supabase.from('innovation_patterns').select('*').eq('idea_id', ideaId),
      supabase.from('prototypes').select('*').eq('idea_id', ideaId).maybeSingle(),
      supabase.from('validation_strategies').select('*').eq('idea_id', ideaId).maybeSingle(),
      supabase.from('ecosystem_actors').select('*').eq('idea_id', ideaId),
      supabase.from('sustainability_reflections').select('*').eq('idea_id', ideaId).maybeSingle(),
    ])

    console.log('🌱 Sustainability data loaded:', {
      sustainableCanvas: !!sustainableCanvasResult.data,
      innovationPatterns: innovationPatternsResult.data?.length || 0,
      prototype: !!prototypeResult.data,
      validationStrategy: !!validationStrategyResult.data,
      ecosystemActors: ecosystemActorsResult.data?.length || 0,
      sustainabilityReflection: !!sustainabilityReflectionResult.data
    })

    return {
      sustainableCanvas: sustainableCanvasResult.data,
      innovationPatterns: innovationPatternsResult.data || [],
      prototype: prototypeResult.data,
      validationStrategy: validationStrategyResult.data,
      ecosystemActors: ecosystemActorsResult.data || [],
      sustainabilityReflection: sustainabilityReflectionResult.data
    }
  } catch (error) {
    console.error('Error loading sustainability data:', error)
    return null
  }
}