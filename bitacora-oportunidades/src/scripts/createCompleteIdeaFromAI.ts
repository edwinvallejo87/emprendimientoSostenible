import { supabase } from '../lib/supabase'
import { CompleteIdeaGenerator } from '../lib/ai/completeIdeaGenerator'

export async function createCompleteIdeaFromAI(ideaDescription: string) {
  try {
    console.log('🤖 Iniciando generación completa de idea con IA...')
    console.log('💡 Descripción de entrada:', ideaDescription)
    
    // Generar datos completos con IA
    console.log('🔧 Creando generador...')
    const generator = new CompleteIdeaGenerator()
    console.log('✅ Generador creado')
    
    console.log('🚀 Generando datos completos...')
    const completeData = await generator.generateCompleteIdea(ideaDescription)
    console.log('✅ Datos generados por IA:', completeData)
    console.log('📊 Estructura de datos:', Object.keys(completeData))

    // 1. Crear equipo
    console.log('🏗️ Creando equipo en base de datos...')
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        name: `Equipo ${completeData.idea.title}`
        // Solo insertar name, no description (no existe en el schema)
      })
      .select()
      .single()

    if (teamError) {
      console.error('❌ Error creando equipo:', teamError)
      throw teamError
    }
    console.log('✅ Equipo creado:', team)

    // 2. Crear bitácora
    console.log('📓 Creando bitácora en base de datos...')
    const { data: journal, error: journalError } = await supabase
      .from('journals')
      .insert({
        team_id: team.id,
        title: `Bitácora: ${completeData.idea.title}`
        // Solo insertar team_id y title, no description (no existe en el schema)
      })
      .select()
      .single()

    if (journalError) {
      console.error('❌ Error creando bitácora:', journalError)
      throw journalError
    }
    console.log('✅ Bitácora creada:', journal)

    // 3. Crear idea principal
    console.log('💡 Creando idea principal en base de datos...')
    const { data: idea, error: ideaError } = await supabase
      .from('ideas')
      .insert({
        journal_id: journal.id,
        title: completeData.idea.title,
        description: completeData.idea.description,
        target_market: completeData.idea.target_market,
        unique_value: completeData.idea.unique_value
      })
      .select()
      .single()

    if (ideaError) {
      console.error('❌ Error creando idea:', ideaError)
      throw ideaError
    }
    console.log('✅ Idea creada:', idea)

    // 4. Crear Step 1 - Medios Personales
    console.log('📝 Creando Step 1 - Medios Personales...')
    const { error: step1Error } = await supabase
      .from('step1_means')
      .insert({
        idea_id: idea.id,
        who_i_am: completeData.step1.who_i_am,
        what_i_know: completeData.step1.what_i_know,
        who_i_know: completeData.step1.who_i_know,
        what_i_have: completeData.step1.what_i_have
      })

    if (step1Error) {
      console.error('❌ Error creando Step 1:', step1Error)
      throw step1Error
    }
    console.log('✅ Step 1 creado')

    // 5. Crear Step 2 - Problema
    console.log('🎯 Creando Step 2 - Problema...')
    const { error: step2Error } = await supabase
      .from('step2_problem')
      .insert({
        idea_id: idea.id,
        title: completeData.step2.title,
        description: completeData.step2.description,
        affected: completeData.step2.affected,
        relevance: completeData.step2.relevance,
        link_to_means: completeData.step2.link_to_means
      })

    if (step2Error) {
      console.error('❌ Error creando Step 2:', step2Error)
      throw step2Error
    }
    console.log('✅ Step 2 creado')

    // 6. Crear Step 3 - Tendencias
    console.log('📈 Creando Step 3 - Tendencias...')
    const step3Inserts = completeData.step3.map(trend => ({
      idea_id: idea.id,
      name: trend.name,
      type: trend.type,
      brief: trend.brief,
      example: trend.example,
      source_apa: trend.source_apa,
      comment: trend.comment
    }))

    const { error: step3Error } = await supabase
      .from('step3_trends')
      .insert(step3Inserts)

    if (step3Error) {
      console.error('❌ Error creando Step 3:', step3Error)
      throw step3Error
    }
    console.log('✅ Step 3 creado')

    // 7. Crear Step 4 - Evaluación FODA
    console.log('🔍 Creando Step 4 - Evaluación FODA...')
    const { error: step4Error } = await supabase
      .from('step4_idea_evaluation')
      .insert({
        idea_id: idea.id,
        strengths: completeData.step4.strengths.join('\n'),
        weaknesses: completeData.step4.weaknesses.join('\n'),
        opportunities: completeData.step4.opportunities.join('\n'),
        threats: completeData.step4.threats.join('\n')
        // success_factors y risk_mitigation son opcionales
      })

    if (step4Error) {
      console.error('❌ Error creando Step 4:', step4Error)
      throw step4Error
    }
    console.log('✅ Step 4 creado')

    // 8. Crear Step 5 - Usuario Comprador
    console.log('👤 Creando Step 5 - Usuario Comprador...')
    const { error: step5BuyerError } = await supabase
      .from('step5_buyer')
      .insert({
        idea_id: idea.id,
        name: completeData.step5Buyer.name,
        age: completeData.step5Buyer.age,
        occupation: completeData.step5Buyer.occupation,
        motivations: completeData.step5Buyer.motivations,
        pains: completeData.step5Buyer.pains,
        needs: completeData.step5Buyer.needs
        // segment e income no existen en el schema actual
      })

    if (step5BuyerError) {
      console.error('❌ Error creando Step 5 Buyer:', step5BuyerError)
      throw step5BuyerError
    }
    console.log('✅ Step 5 Buyer creado')

    // 9. Crear Step 5 - Propuesta de Valor
    console.log('💼 Creando Step 5 - Propuesta de Valor...')
    const { error: step5VPError } = await supabase
      .from('step5_vpcanvas')
      .insert({
        idea_id: idea.id,
        customer_jobs: completeData.step5VP.customer_jobs,
        customer_pains: completeData.step5VP.customer_pains,
        customer_gains: completeData.step5VP.customer_gains,
        products_services: completeData.step5VP.products_services,
        pain_relievers: completeData.step5VP.pain_relievers,
        gain_creators: completeData.step5VP.gain_creators
      })

    if (step5VPError) {
      console.error('❌ Error creando Step 5 VP:', step5VPError)
      throw step5VPError
    }
    console.log('✅ Step 5 VP creado')

    console.log('🎉 ¡Idea completa creada exitosamente con IA!')
    console.log('📋 Resumen de datos creados:', {
      teamId: team.id,
      journalId: journal.id,
      ideaId: idea.id,
      stepDataCreated: {
        step1: true,
        step2: true,
        step3: true,
        step4: true,
        step5Buyer: true,
        step5VP: true
      }
    })

    return {
      success: true,
      team,
      journal,
      idea,
      aiData: completeData
    }

  } catch (error) {
    console.error('❌ Error creando idea completa con IA:', error)
    
    // Enhanced error reporting
    let errorDetails = 'Error desconocido'
    if (error instanceof Error) {
      errorDetails = `${error.name}: ${error.message}`
      console.error('Error stack:', error.stack)
    } else if (typeof error === 'string') {
      errorDetails = error
    } else {
      errorDetails = JSON.stringify(error, null, 2)
    }
    
    console.error('Detalles del error:', errorDetails)
    return { success: false, error: errorDetails }
  }
}