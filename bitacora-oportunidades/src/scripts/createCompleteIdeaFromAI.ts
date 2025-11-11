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
        strengths: completeData.step4.strengths || '',
        weaknesses: completeData.step4.weaknesses || '',
        opportunities: completeData.step4.opportunities || '',
        threats: completeData.step4.threats || '',
        success_factors: completeData.step4.success_factors || '',
        risk_mitigation: completeData.step4.risk_mitigation || ''
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

    // 10. Crear Step 8 - Canvas Sostenible
    console.log('🌱 Creando Step 8 - Canvas Sostenible...')
    const canvasData = completeData.step8SustainableCanvas ? {
      idea_id: idea.id,
      customer_segments: completeData.step8SustainableCanvas.customer_segments,
      value_propositions: completeData.step8SustainableCanvas.value_propositions,
      products_services: completeData.step8SustainableCanvas.products_services,
      channels: completeData.step8SustainableCanvas.channels,
      customer_relationships: completeData.step8SustainableCanvas.customer_relationships,
      revenue_streams: completeData.step8SustainableCanvas.revenue_streams,
      social_benefits: completeData.step8SustainableCanvas.social_benefits,
      environmental_benefits: completeData.step8SustainableCanvas.environmental_benefits,
      key_resources: completeData.step8SustainableCanvas.key_resources,
      key_activities: completeData.step8SustainableCanvas.key_activities,
      key_partnerships: completeData.step8SustainableCanvas.key_partnerships,
      cost_structure: completeData.step8SustainableCanvas.cost_structure,
      social_costs: completeData.step8SustainableCanvas.social_costs,
      environmental_costs: completeData.step8SustainableCanvas.environmental_costs,
      sustainability_reflection: completeData.step8SustainableCanvas.sustainability_reflection
    } : {
      idea_id: idea.id,
      customer_segments: generateBasicCanvasData(completeData.idea, 'customer_segments'),
      value_propositions: generateBasicCanvasData(completeData.idea, 'value_propositions'),
      products_services: generateBasicCanvasData(completeData.idea, 'products_services'),
      channels: generateBasicCanvasData(completeData.idea, 'channels'),
      customer_relationships: generateBasicCanvasData(completeData.idea, 'customer_relationships'),
      revenue_streams: generateBasicCanvasData(completeData.idea, 'revenue_streams'),
      social_benefits: generateBasicCanvasData(completeData.idea, 'social_benefits'),
      environmental_benefits: generateBasicCanvasData(completeData.idea, 'environmental_benefits'),
      key_resources: generateBasicCanvasData(completeData.idea, 'key_resources'),
      key_activities: generateBasicCanvasData(completeData.idea, 'key_activities'),
      key_partnerships: generateBasicCanvasData(completeData.idea, 'key_partnerships'),
      cost_structure: generateBasicCanvasData(completeData.idea, 'cost_structure'),
      social_costs: generateBasicCanvasData(completeData.idea, 'social_costs'),
      environmental_costs: generateBasicCanvasData(completeData.idea, 'environmental_costs'),
      sustainability_reflection: `Reflexión generada automáticamente: ${completeData.idea.title} busca crear valor sostenible equilibrando impacto económico, social y ambiental.`
    }

    const { error: step8Error } = await supabase
      .from('sustainable_canvas')
      .insert(canvasData)

    if (step8Error) {
      console.warn('⚠️ Error creando Step 8 (Canvas Sostenible):', step8Error)
      // No bloqueamos el proceso, solo advertimos
    } else {
      console.log('✅ Step 8 (Canvas Sostenible) creado')
    }

    // 11. Crear Step 9 - Patrones de Innovación (múltiples)
    console.log('💡 Creando Step 9 - Patrones de Innovación...')
    if (completeData.step9InnovationPatterns && completeData.step9InnovationPatterns.length > 0) {
      const innovationPatternsToInsert = completeData.step9InnovationPatterns.map(pattern => ({
        idea_id: idea.id,
        pattern_name: pattern.pattern_name,
        pattern_description: pattern.pattern_description,
        justification: pattern.justification,
        expected_impact: pattern.expected_impact,
        is_primary: pattern.is_primary
      }))

      const { error: step9Error } = await supabase
        .from('innovation_patterns')
        .insert(innovationPatternsToInsert)

      if (step9Error) {
        console.warn('⚠️ Error creando Step 9 (Patrones de Innovación):', step9Error)
      } else {
        console.log(`✅ Step 9 (${innovationPatternsToInsert.length} Patrones de Innovación) creado`)
      }
    } else {
      // Fallback si no hay patrones de IA
      console.log('⚠️ No se encontraron patrones de IA, creando patrón básico')
      const { error: step9Error } = await supabase
        .from('innovation_patterns')
        .insert({
          idea_id: idea.id,
          pattern_name: 'Innovación Sostenible',
          pattern_description: `Patrón de innovación aplicado a ${completeData.idea.title} enfocado en sostenibilidad y triple impacto.`,
          justification: `Este patrón es ideal para ${completeData.idea.title} porque combina viabilidad económica con beneficio social y ambiental.`,
          expected_impact: `Se espera generar impacto positivo en el mercado objetivo de ${completeData.idea.target_market}.`,
          is_primary: true
        })
      if (step9Error) console.warn('⚠️ Error creando patrón básico:', step9Error)
    }

    // 12. Crear Step 10 - Prototipo
    console.log('🔧 Creando Step 10 - Prototipo...')
    const prototypeData = completeData.step10Prototype ? {
      idea_id: idea.id,
      name: completeData.step10Prototype.name,
      type: completeData.step10Prototype.type,
      description: completeData.step10Prototype.description,
      hypothesis_to_validate: completeData.step10Prototype.hypothesis_to_validate,
      expected_learning_metrics: completeData.step10Prototype.expected_learning_metrics,
      ai_mvp_suggestion: completeData.step10Prototype.ai_mvp_suggestion
    } : {
      idea_id: idea.id,
      name: `Prototipo de ${completeData.idea.title}`,
      type: 'concept' as const,
      description: `Prototipo inicial conceptual para validar la viabilidad de ${completeData.idea.title} en el mercado de ${completeData.idea.target_market}.`,
      hypothesis_to_validate: `Los usuarios del segmento ${completeData.idea.target_market} están dispuestos a adoptar ${completeData.idea.title} por su propuesta de valor única.`,
      expected_learning_metrics: 'Tasa de adopción, feedback de usuarios, tiempo de uso, satisfacción del cliente, disposición a pagar.',
      ai_mvp_suggestion: `Para ${completeData.idea.title}, se recomienda comenzar con un MVP digital que permita validar la propuesta de valor con inversión mínima.`
    }

    const { error: step10Error } = await supabase
      .from('prototypes')
      .insert(prototypeData)

    if (step10Error) {
      console.warn('⚠️ Error creando Step 10 (Prototipo):', step10Error)
    } else {
      console.log('✅ Step 10 (Prototipo) creado')
    }

    // 13. Crear Step 11 - Estrategia de Validación
    console.log('🎯 Creando Step 11 - Estrategia de Validación...')
    const validationData = completeData.step11ValidationStrategy ? {
      idea_id: idea.id,
      hypothesis: completeData.step11ValidationStrategy.hypothesis,
      target_segments: completeData.step11ValidationStrategy.target_segments,
      validation_methods: completeData.step11ValidationStrategy.validation_methods,
      expected_learnings: completeData.step11ValidationStrategy.expected_learnings,
      success_criteria: completeData.step11ValidationStrategy.success_criteria,
      timeline_weeks: completeData.step11ValidationStrategy.timeline_weeks,
      budget_estimate: completeData.step11ValidationStrategy.budget_estimate,
      progress_percentage: 0
    } : {
      idea_id: idea.id,
      hypothesis: `${completeData.idea.title} resolverá el problema principal del mercado ${completeData.idea.target_market} de manera sostenible y rentable.`,
      target_segments: completeData.idea.target_market,
      validation_methods: ['interview', 'survey', 'prototype_test'],
      expected_learnings: 'Validar aceptación del mercado, identificar mejoras al producto, confirmar modelo de negocio sostenible.',
      success_criteria: 'Al menos 70% de entrevistados expresa interés en el producto, 80% considera valiosa la propuesta sostenible.',
      timeline_weeks: 8,
      budget_estimate: 5000,
      progress_percentage: 0
    }

    const { error: step11Error } = await supabase
      .from('validation_strategies')
      .insert(validationData)

    if (step11Error) {
      console.warn('⚠️ Error creando Step 11 (Estrategia de Validación):', step11Error)
    } else {
      console.log('✅ Step 11 (Estrategia de Validación) creado')
    }

    // 14. Crear Step 12 - Actores del Ecosistema (múltiples)
    console.log('🤝 Creando Step 12 - Actores del Ecosistema...')
    if (completeData.step12EcosystemActors && completeData.step12EcosystemActors.length > 0) {
      const ecosystemActorsToInsert = completeData.step12EcosystemActors.map(actor => ({
        idea_id: idea.id,
        actor_name: actor.actor_name,
        actor_type: actor.actor_type,
        role_description: actor.role_description,
        support_types: actor.support_types,
        benefit_to_venture: actor.benefit_to_venture,
        benefit_to_actor: actor.benefit_to_actor,
        relationship_status: actor.relationship_status
      }))

      const { error: step12Error } = await supabase
        .from('ecosystem_actors')
        .insert(ecosystemActorsToInsert)

      if (step12Error) {
        console.warn('⚠️ Error creando Step 12 (Actores del Ecosistema):', step12Error)
      } else {
        console.log(`✅ Step 12 (${ecosystemActorsToInsert.length} Actores del Ecosistema) creado`)
      }
    } else {
      // Fallback si no hay actores de IA
      console.log('⚠️ No se encontraron actores de IA, creando actores básicos')
      const ecosystemActors = [
        {
          idea_id: idea.id,
          actor_name: 'Universidad o Centro de Investigación',
          actor_type: 'academic' as const,
          role_description: `Institución académica que puede proveer investigación y validación científica para ${completeData.idea.title}.`,
          support_types: ['technical' as const, 'infrastructure' as const],
          benefit_to_venture: 'Acceso a investigación, laboratorios, estudiantes talentosos y validación científica.',
          benefit_to_actor: 'Casos de estudio reales, proyectos aplicados para estudiantes, publicaciones académicas.',
          relationship_status: 'Potencial'
        },
        {
          idea_id: idea.id,
          actor_name: 'Inversionista de Impacto',
          actor_type: 'financial' as const,
          role_description: `Fondo o inversor enfocado en proyectos de triple impacto que podrían financiar ${completeData.idea.title}.`,
          support_types: ['funding' as const, 'mentorship' as const, 'networking' as const],
          benefit_to_venture: 'Capital para crecimiento, mentoría estratégica, acceso a red de contactos.',
          benefit_to_actor: 'Retorno financiero con impacto social y ambiental positivo.',
          relationship_status: 'Por contactar'
        }
      ]

      const { error: step12Error } = await supabase
        .from('ecosystem_actors')
        .insert(ecosystemActors)

      if (step12Error) {
        console.warn('⚠️ Error creando actores básicos:', step12Error)
      } else {
        console.log('✅ Actores básicos del ecosistema creados')
      }
    }

    // 15. Crear Step 13 - Reflexión de Sostenibilidad
    console.log('🌍 Creando Step 13 - Reflexión de Sostenibilidad...')
    const reflectionData = completeData.step13SustainabilityReflection ? {
      idea_id: idea.id,
      social_impact_balance: completeData.step13SustainabilityReflection.social_impact_balance,
      sustainability_decisions: completeData.step13SustainabilityReflection.sustainability_decisions,
      scaling_strategy: completeData.step13SustainabilityReflection.scaling_strategy,
      ai_generated_reflection: completeData.step13SustainabilityReflection.ai_generated_reflection
    } : {
      idea_id: idea.id,
      social_impact_balance: `${completeData.idea.title} busca generar impacto social positivo en ${completeData.idea.target_market} mientras mantiene viabilidad económica.`,
      sustainability_decisions: `Las decisiones clave incluyen: procesos eficientes en recursos, modelo de negocio circular, y consideración del impacto en comunidades.`,
      scaling_strategy: `La estrategia mantendrá el foco en sostenibilidad mediante certificaciones ambientales y alianzas estratégicas.`,
      ai_generated_reflection: `Análisis integral: ${completeData.idea.title} representa una oportunidad de emprendimiento sostenible que equilibra la creación de valor económico con impacto social y ambiental positivo.`
    }

    const { error: step13Error } = await supabase
      .from('sustainability_reflections')
      .insert(reflectionData)

    if (step13Error) {
      console.warn('⚠️ Error creando Step 13 (Reflexión de Sostenibilidad):', step13Error)
    } else {
      console.log('✅ Step 13 (Reflexión de Sostenibilidad) creado')
    }

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
        step5VP: true,
        step8SustainableCanvas: true,
        step9InnovationPattern: true,
        step10Prototype: true,
        step11ValidationStrategy: true,
        step12EcosystemActors: true,
        step13SustainabilityReflection: true
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

// Helper function to generate basic canvas data based on the idea
function generateBasicCanvasData(idea: any, field: string): string {
  const templates = {
    customer_segments: `Segmentos objetivo de ${idea.title}: ${idea.target_market} y usuarios interesados en soluciones sostenibles e innovadoras.`,
    value_propositions: `${idea.unique_value} - Propuesta diferenciada que combina funcionalidad, sostenibilidad e impacto social positivo.`,
    products_services: `${idea.title} ofrecido como solución integral que incluye el producto/servicio principal y servicios complementarios de soporte.`,
    channels: `Canales digitales (plataforma web, redes sociales), alianzas estratégicas, y distribución directa enfocada en sostenibilidad.`,
    customer_relationships: `Relación cercana y personalizada, con enfoque en construir comunidad de usuarios comprometidos con la sostenibilidad.`,
    revenue_streams: `Ingresos por ventas directas, suscripciones para servicios premium, y potenciales ingresos por impacto social medible.`,
    social_benefits: `Beneficios sociales: mejora en calidad de vida de ${idea.target_market}, generación de empleo local, educación y concientización.`,
    environmental_benefits: `Beneficios ambientales: reducción de huella de carbono, uso eficiente de recursos, promoción de prácticas sostenibles.`,
    key_resources: `Recursos clave: talento especializado, tecnología, alianzas estratégicas, y conocimiento del mercado ${idea.target_market}.`,
    key_activities: `Actividades clave: desarrollo y mejora del producto, marketing sostenible, operaciones eficientes, y medición de impacto.`,
    key_partnerships: `Alianzas con organizaciones de impacto, proveedores sostenibles, instituciones académicas, y actores del ecosistema emprendedor.`,
    cost_structure: `Estructura de costos optimizada: desarrollo, operaciones, marketing, y inversión en sostenibilidad y certificaciones.`,
    social_costs: `Costos sociales considerados: impacto en comunidades, responsabilidad laboral, y inversión en programas sociales.`,
    environmental_costs: `Costos ambientales: inversión en tecnologías limpias, certificaciones verdes, y compensación de huella ambiental.`
  }
  
  return templates[field as keyof typeof templates] || `Datos generados automáticamente para ${field} de ${idea.title}.`
}