import { supabase } from '../lib/supabase'

// Demo user ID (debe coincidir con el del store)
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000'

export async function createSimpleTestData() {
  try {
    console.log('🚀 Creando datos de prueba simples...')
    
    // Verificar conexión con Supabase
    console.log('🔗 Verificando conexión con Supabase...')
    const { data: testData, error: testError } = await supabase
      .from('teams')
      .select('id')
      .limit(1)
    
    if (testError) {
      console.error('❌ Error de conexión con Supabase:', testError)
      throw new Error(`Error de conexión: ${testError.message}`)
    }
    
    console.log('✅ Conexión con Supabase exitosa')

    // 1. Crear equipo de prueba
    console.log('📝 Creando equipo...')
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        name: 'EcoTech Innovations - Test'
        // No incluir created_by por ahora, como hace el store
      })
      .select()
      .single()

    if (teamError) {
      console.error('Error creando equipo:', teamError)
      throw new Error(`Error creando equipo: ${teamError.message}`)
    }

    console.log('✅ Equipo creado:', team.name)

    // 2. Crear bitácora de prueba
    console.log('📚 Creando bitácora...')
    const { data: journal, error: journalError } = await supabase
      .from('journals')
      .insert({
        team_id: team.id,
        title: 'Bitácora de Prueba Simple'
        // status y progress tienen valores por defecto en la DB
      })
      .select()
      .single()

    if (journalError) {
      console.error('Error creando bitácora:', journalError)
      throw new Error(`Error creando bitácora: ${journalError.message}`)
    }

    console.log('✅ Bitácora creada:', journal.title)

    // 3. Crear un dato simple del Paso 1
    console.log('👥 Creando datos del Paso 1...')
    
    const { error: step1Error } = await supabase
      .from('step1_means')
      .upsert({
        journal_id: journal.id,
        member_id: DEMO_USER_ID,
        who_i_am: 'Desarrollador de software con experiencia en aplicaciones web',
        what_i_know: 'React, Node.js, bases de datos, diseño de interfaces',
        who_i_know: 'Comunidad de desarrolladores y startups tecnológicas',
        what_i_have: 'Computadora, conocimientos técnicos, tiempo disponible'
      })

    if (step1Error) {
      console.error('Error creando datos del Paso 1:', step1Error)
      throw new Error(`Error en Paso 1: ${step1Error.message}`)
    }

    console.log('✅ Datos del Paso 1 creados')

    console.log('🎉 ¡Datos de prueba simples creados exitosamente!')
    
    return {
      team,
      journal,
      success: true
    }

  } catch (error) {
    console.error('❌ Error general creando datos de prueba:', error)
    throw error
  }
}