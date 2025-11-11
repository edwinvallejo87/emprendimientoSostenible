import { supabase } from '../lib/supabase'

// Helper function to specifically load sustainability data after AI generation
export async function loadSustainabilityData(ideaId: string) {
  console.log('🌱 Loading sustainability data for ideaId:', ideaId)
  
  // Helper function to safely query a table
  const safeQuery = async (tableName: string, query: any) => {
    try {
      const result = await query
      return result
    } catch (error) {
      console.warn(`⚠️ Table ${tableName} not available:`, error.message)
      return { data: null, error: { message: `Table ${tableName} not found` } }
    }
  }
  
  try {
    const [
      sustainableCanvasResult, 
      innovationPatternsResult, 
      prototypeResult, 
      validationStrategyResult, 
      ecosystemActorsResult, 
      sustainabilityReflectionResult
    ] = await Promise.allSettled([
      safeQuery('sustainable_canvas', supabase.from('sustainable_canvas').select('*').eq('idea_id', ideaId).maybeSingle()),
      safeQuery('innovation_patterns', supabase.from('innovation_patterns').select('*').eq('idea_id', ideaId)),
      safeQuery('prototypes', supabase.from('prototypes').select('*').eq('idea_id', ideaId).maybeSingle()),
      safeQuery('validation_strategies', supabase.from('validation_strategies').select('*').eq('idea_id', ideaId).maybeSingle()),
      safeQuery('ecosystem_actors', supabase.from('ecosystem_actors').select('*').eq('idea_id', ideaId)),
      safeQuery('sustainability_reflections', supabase.from('sustainability_reflections').select('*').eq('idea_id', ideaId).maybeSingle()),
    ])

    // Extract data from settled promises
    const getData = (result: any) => {
      if (result.status === 'fulfilled' && result.value && !result.value.error) {
        return result.value.data
      }
      return null
    }

    const getArrayData = (result: any) => {
      if (result.status === 'fulfilled' && result.value && !result.value.error) {
        return result.value.data || []
      }
      return []
    }

    const sustainabilityData = {
      sustainableCanvas: getData(sustainableCanvasResult),
      innovationPatterns: getArrayData(innovationPatternsResult),
      prototype: getData(prototypeResult),
      validationStrategy: getData(validationStrategyResult),
      ecosystemActors: getArrayData(ecosystemActorsResult),
      sustainabilityReflection: getData(sustainabilityReflectionResult)
    }

    console.log('🌱 Sustainability data loaded (with fallbacks):', {
      sustainableCanvas: !!sustainabilityData.sustainableCanvas,
      innovationPatterns: sustainabilityData.innovationPatterns.length,
      prototype: !!sustainabilityData.prototype,
      validationStrategy: !!sustainabilityData.validationStrategy,
      ecosystemActors: sustainabilityData.ecosystemActors.length,
      sustainabilityReflection: !!sustainabilityData.sustainabilityReflection
    })

    return sustainabilityData
  } catch (error) {
    console.error('Error loading sustainability data:', error)
    // Return empty structure if all else fails
    return {
      sustainableCanvas: null,
      innovationPatterns: [],
      prototype: null,
      validationStrategy: null,
      ecosystemActors: [],
      sustainabilityReflection: null
    }
  }
}