import { supabase } from '../lib/supabase'

// Demo user ID (ya establecido en el sistema)
const DEMO_USER_ID = 'demo-user-123'

export async function createTestData() {
  try {
    console.log('🚀 Creando datos de prueba...')

    // 1. Crear equipo de prueba
    console.log('📝 Creando equipo...')
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        name: 'EcoTech Innovations',
        created_by: DEMO_USER_ID
      })
      .select()
      .single()

    if (teamError) {
      console.error('Error creando equipo:', teamError)
      return {
        success: false,
        error: teamError.message
      }
    }

    console.log('✅ Equipo creado:', team.name)

    // 2. Crear bitácora de prueba
    console.log('📚 Creando bitácora...')
    const { data: journal, error: journalError } = await supabase
      .from('journals')
      .insert({
        team_id: team.id,
        title: 'EcoScore App - Análisis Inicial 2024',
        status: 'in_progress'
      })
      .select()
      .single()

    if (journalError) {
      console.error('Error creando bitácora:', journalError)
      return {
        success: false,
        error: journalError.message
      }
    }

    console.log('✅ Bitácora creada:', journal.title)

    // 3. Crear datos del Paso 1 (2 miembros)
    console.log('👥 Creando datos del Paso 1...')
    
    const step1Data = [
      {
        journal_id: journal.id,
        member_id: DEMO_USER_ID,
        who_i_am: 'Ingeniero de software con 8 años de experiencia en desarrollo web y mobile. MBA en gestión de proyectos. Apasionado por la sostenibilidad y tecnologías limpias.',
        what_i_know: 'Desarrollo fullstack (React, Node.js, Python), gestión de equipos ágiles, análisis de datos, marketing digital, conocimientos en energías renovables y economía circular.',
        who_i_know: 'Red de desarrolladores y startups tech, contactos en aceleradoras (Techstars, Y Combinator), inversores ángeles del sector cleantech, profesores universitarios en ingeniería ambiental.',
        what_i_have: 'Laptop de alta gama, servidor personal, $15,000 en ahorros, oficina en casa, acceso a laboratorio universitario, licencias de software de desarrollo.'
      },
      {
        journal_id: journal.id,
        member_id: 'demo-user-456', // Segundo miembro ficticio
        who_i_am: 'Especialista en marketing digital y comunicación ambiental. 6 años en ONGs ambientales. Máster en Comunicación Social y certificación en Google Ads.',
        what_i_know: 'Marketing digital, redes sociales, copywriting, SEO/SEM, análisis de mercado, comunicación de impacto social, fundraising, diseño gráfico básico.',
        who_i_know: 'Red de influencers eco-friendly, contactos en medios ambientales, community managers de marcas sostenibles, expertos en RSE de empresas grandes.',
        what_i_have: 'Equipo de grabación (cámara, micrófono), software de diseño (Adobe Creative Suite), base de datos de 5,000 contactos en redes, $8,000 en ahorros.'
      }
    ]

    const { error: step1Error } = await supabase
      .from('step1_means')
      .insert(step1Data)

    if (step1Error) {
      console.error('Error creando datos del Paso 1:', step1Error)
      return {
        success: false,
        error: `Error en Paso 1: ${step1Error.message}`
      }
    }

    console.log('✅ Datos del Paso 1 creados')

    // 4. Crear datos del Paso 2
    console.log('🎯 Creando datos del Paso 2...')
    
    const { error: step2Error } = await supabase
      .from('step2_problem')
      .insert({
        journal_id: journal.id,
        title: 'Falta de acceso a información confiable sobre el impacto ambiental real de productos de consumo',
        description: 'Los consumidores conscientes del medio ambiente enfrentan dificultades para identificar productos verdaderamente sostenibles debido a la abundancia de greenwashing y falta de transparencia en las cadenas de suministro. Las etiquetas actuales son confusas, incompletas o poco confiables, lo que genera frustración y decisiones de compra subóptimas.',
        affected: 'Consumidores millennials y Gen Z (25-40 años) con ingresos medios-altos, familias con niños pequeños preocupadas por el futuro del planeta, empresas que buscan proveedores sostenibles pero no tienen herramientas de verificación, pequeños productores sostenibles que no logran comunicar su valor diferencial.',
        relevance: '73% de consumidores globales pagarían más por productos sostenibles (Nielsen 2021). El mercado de productos sostenibles crece 20% anualmente. Regulaciones europeas exigen mayor transparencia ambiental. Crisis climática genera urgencia en cambio de hábitos de consumo.',
        link_to_means: 'Mi experiencia técnica permite desarrollar sistemas de verificación digital, mientras que los conocimientos en marketing son clave para educar consumidores. Nuestros contactos en el sector ambiental proporcionan credibilidad y acceso a datos confiables.'
      })

    if (step2Error) {
      console.error('Error creando datos del Paso 2:', step2Error)
      return {
        success: false,
        error: `Error en Paso 2: ${step2Error.message}`
      }
    }

    console.log('✅ Datos del Paso 2 creados')

    // 5. Crear datos del Paso 3 (5 tendencias)
    console.log('📈 Creando datos del Paso 3...')
    
    const step3Data = [
      {
        journal_id: journal.id,
        name: 'Transparencia en cadenas de suministro',
        type: 'Tecnológica' as const,
        brief: 'Implementación masiva de blockchain y IoT para rastrear productos desde origen hasta consumidor final',
        example: 'Walmart usa blockchain para rastrear alimentos, reduciendo tiempo de investigación de brotes de 7 días a 2.2 segundos',
        source_apa: 'Chen, S., Liu, X., Yan, J., Hu, G., & Shi, Y. (2021). Processes, benefits, and challenges for adoption of blockchain technologies in food supply chains. Applied Sciences, 11(16), 7546.',
        comment: 'Esta tendencia facilita la verificación automática de claims ambientales'
      },
      {
        journal_id: journal.id,
        name: 'Consumo consciente post-pandemia',
        type: 'Social' as const,
        brief: 'Cambio generacional hacia compras más reflexivas, priorizando impacto sobre conveniencia',
        example: '67% de consumidores reportan haber cambiado hábitos de compra hacia marcas más sostenibles desde 2020',
        source_apa: 'Unilever. (2021). The Unilever Sustainable Living Brands report 2021. Unilever PLC.',
        comment: 'Ventana de oportunidad para productos que faciliten decisiones sostenibles'
      },
      {
        journal_id: journal.id,
        name: 'Regulaciones de etiquetado ambiental',
        type: 'Ambiental' as const,
        brief: 'Nuevas leyes europeas y estadounidenses exigen disclosure detallado de impacto ambiental',
        example: 'EU Taxonomy Regulation obliga a empresas a reportar porcentaje de actividades sostenibles',
        source_apa: 'European Commission. (2021). EU taxonomy for sustainable activities. Publications Office of the European Union.',
        comment: 'Crea demanda obligatoria para herramientas de medición y reporte'
      },
      {
        journal_id: journal.id,
        name: 'Gamificación de comportamientos sostenibles',
        type: 'Cultural' as const,
        brief: 'Uso de elementos de juego para motivar acciones pro-ambientales en aplicaciones móviles',
        example: 'App JouleBug permite a usuarios competir en challenges de sostenibilidad, con 89% de retención mensual',
        source_apa: 'Deterding, S., Dixon, D., Khaled, R., & Nacke, L. (2011). From game design elements to gamefulness. Proceedings of the 15th International Academic MindTrek Conference, 9-15.',
        comment: 'Estrategia de engagement para mantener usuarios activos en la plataforma'
      },
      {
        journal_id: journal.id,
        name: 'Subscripciones vs. propiedad',
        type: 'Consumo' as const,
        brief: 'Preferencia creciente por modelos de acceso sobre posesión, especialmente en productos digitales',
        example: 'Netflix cambió industria del entretenimiento; ahora Patagonia prueba "Worn Wear" para ropa usada',
        source_apa: 'Bardhi, F., & Eckhardt, G. M. (2012). Access-based consumption: The case of car sharing. Journal of Consumer Research, 39(4), 881-898.',
        comment: 'Oportunidad para modelo SaaS en lugar de app de pago único'
      }
    ]

    const { error: step3Error } = await supabase
      .from('step3_trends')
      .insert(step3Data)

    if (step3Error) {
      console.error('Error creando datos del Paso 3:', step3Error)
      return
    }

    console.log('✅ Datos del Paso 3 creados')

    // 6. Crear datos del Paso 4 (5 ideas)
    console.log('💡 Creando datos del Paso 4...')
    
    const step4Data = [
      {
        journal_id: journal.id,
        idea: 'Plataforma web que permite escanear códigos de barras y recibir "EcoScore" instantáneo basado en análisis de ciclo de vida, certificaciones y transparencia de marca',
        kind: 'Aplicación web/móvil',
        innovation_level: 'Incremental' as const,
        feasibility: 'Alta' as const,
        selected: true,
        justification: 'Combina nuestra experiencia técnica con conocimiento en comunicación ambiental. El modelo es escalable, hay demanda comprobada y podemos empezar con MVP en 3 meses. Los contactos en ONGs proporcionan credibilidad inicial, mientras que la experiencia en marketing digital asegura adopción de usuarios. Requiere inversión moderada y tiene múltiples fuentes de ingresos (freemium, B2B, afiliaciones).'
      },
      {
        journal_id: journal.id,
        idea: 'Consultora especializada en ayudar a PYMEs a medir y comunicar su huella de carbono',
        kind: 'Servicios de consultoría',
        innovation_level: 'Incremental' as const,
        feasibility: 'Media' as const,
        selected: false,
        justification: ''
      },
      {
        journal_id: journal.id,
        idea: 'Marketplace exclusivo para productos verificados como carbono-neutro',
        kind: 'Plataforma e-commerce',
        innovation_level: 'Incremental' as const,
        feasibility: 'Baja' as const,
        selected: false,
        justification: ''
      },
      {
        journal_id: journal.id,
        idea: 'Sistema IoT para monitoreo automático de consumo energético en hogares',
        kind: 'Hardware + Software',
        innovation_level: 'Radical' as const,
        feasibility: 'Baja' as const,
        selected: false,
        justification: ''
      },
      {
        journal_id: journal.id,
        idea: 'Red social gamificada donde usuarios comparten y compiten en challenges de sostenibilidad',
        kind: 'Aplicación móvil social',
        innovation_level: 'Incremental' as const,
        feasibility: 'Media' as const,
        selected: false,
        justification: ''
      }
    ]

    const { error: step4Error } = await supabase
      .from('step4_ideas')
      .insert(step4Data)

    if (step4Error) {
      console.error('Error creando datos del Paso 4:', step4Error)
      return
    }

    console.log('✅ Datos del Paso 4 creados')

    // 7. Crear datos del Paso 5 - Buyer Persona
    console.log('👤 Creando datos del Paso 5 - Buyer Persona...')
    
    const { error: step5BuyerError } = await supabase
      .from('step5_buyer')
      .insert({
        journal_id: journal.id,
        name: 'Sofía Martínez',
        age: 32,
        occupation: 'Gerente de Marketing en empresa de tecnología, madre de un niño de 5 años',
        motivations: 'Quiere tomar decisiones de compra que protejan el futuro de su hijo. Busca ser coherente con sus valores ambientales sin sacrificar calidad de vida. Desea sentirse empoderada con información confiable.',
        pains: 'No tiene tiempo para investigar cada producto. Se siente engañada por greenwashing. Las etiquetas ecológicas son confusas. Teme pagar más por productos que no son realmente sostenibles.',
        needs: 'Información rápida y confiable sobre impacto ambiental. Alternativas sostenibles a productos habituales. Validación de que sus decisiones importan. Comunidad de personas con valores similares.'
      })

    if (step5BuyerError) {
      console.error('Error creando datos del Paso 5 - Buyer:', step5BuyerError)
      return
    }

    console.log('✅ Datos del Paso 5 - Buyer Persona creados')

    // 8. Crear datos del Paso 5 - VP Canvas
    console.log('💎 Creando datos del Paso 5 - VP Canvas...')
    
    const { error: step5VPError } = await supabase
      .from('step5_vpcanvas')
      .insert({
        journal_id: journal.id,
        customer_jobs: 'Comprar productos para el hogar y familia de manera eficiente. Mantener estilo de vida coherente con valores ambientales. Educar a su familia sobre sostenibilidad. Optimizar presupuesto familiar sin comprometer calidad.',
        customer_pains: 'Información ambiental confusa o ausente en productos. Tiempo limitado para investigar sostenibilidad de marcas. Desconfianza por prácticas de greenwashing. Precios premium injustificados en productos "eco". Falta de alternativas sostenibles en categorías específicas.',
        customer_gains: 'Sentirse bien por decisiones de compra conscientes. Encontrar productos que superan expectativas de calidad. Ahorro económico a largo plazo con productos duraderos. Reconocimiento social por estilo de vida sostenible. Contribuir measurablemente a la protección ambiental.',
        products_services: 'App móvil con escáner de códigos de barras y EcoScore instantáneo. Base de datos de +50,000 productos con análisis de ciclo de vida. Recomendaciones personalizadas de alternativas sostenibles. Dashboard personal de impacto ambiental acumulado. Comunidad de usuarios con challenges y tips.',
        pain_relievers: 'EcoScore simplificado (1-10) elimina confusión de múltiples certificaciones. Escaneo instantáneo ahorra tiempo de investigación. Algoritmo anti-greenwashing basado en datos verificados. Comparador de precios muestra relación costo-beneficio real. Filtros por categoría facilitan búsqueda de alternativas.',
        gain_creators: 'Gamificación con puntos por decisiones sostenibles. Calculadora de impacto personal (CO2, agua, residuos ahorrados). Badges y logros por hitos ambientales. Sharing en redes sociales de logros de sostenibilidad. Descuentos exclusivos en marcas partner verificadas.'
      })

    if (step5VPError) {
      console.error('Error creando datos del Paso 5 - VP Canvas:', step5VPError)
      return
    }

    console.log('✅ Datos del Paso 5 - VP Canvas creados')

    // 9. Actualizar progreso de la bitácora
    console.log('📊 Actualizando progreso de la bitácora...')
    
    const { error: updateError } = await supabase
      .from('journals')
      .update({
        status: 'ready',
        progress: 100
      })
      .eq('id', journal.id)

    if (updateError) {
      console.error('Error actualizando progreso:', updateError)
      return
    }

    console.log('🎉 ¡Datos de prueba creados exitosamente!')
    console.log(`📋 Equipo: ${team.name}`)
    console.log(`📚 Bitácora: ${journal.title}`)
    console.log(`🔗 ID del equipo: ${team.id}`)
    console.log(`🔗 ID de la bitácora: ${journal.id}`)

    return {
      team,
      journal,
      success: true
    }

  } catch (error) {
    console.error('❌ Error general creando datos de prueba:', error)
    return {
      success: false,
      error
    }
  }
}