import { supabase } from '../lib/supabase'

// Demo user ID (debe coincidir con el del store)
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000'

export async function createCompleteTestData() {
  try {
    console.log('🚀 Creando datos de prueba COMPLETOS...')
    
    // Verificar conexión con Supabase
    console.log('🔗 Verificando conexión con Supabase...')
    const { error: testError } = await supabase
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
        name: 'EcoTech Innovations'
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
        title: 'EcoScore App - Análisis Completo 2024'
      })
      .select()
      .single()

    if (journalError) {
      console.error('Error creando bitácora:', journalError)
      throw new Error(`Error creando bitácora: ${journalError.message}`)
    }

    console.log('✅ Bitácora creada:', journal.title)

    // 3. Crear idea de prueba
    console.log('💡 Creando idea de prueba...')
    
    const { data: idea, error: ideaError } = await supabase
      .from('ideas')
      .insert({
        journal_id: journal.id,
        title: 'EcoScore App - Calificación de Impacto Ambiental',
        description: 'Aplicación móvil que usa IA para evaluar el impacto ambiental real de productos mediante códigos de barras, proporcionando puntuaciones transparentes y alternativas sostenibles.',
        target_market: 'Consumidores conscientes del medio ambiente, millennials y Gen Z con ingresos medios-altos',
        unique_value: 'Primera app que combina verificación blockchain con IA para scoring ambiental en tiempo real',
        resources_needed: ['desarrollo_mobile', 'base_datos_productos', 'api_blockchain', 'equipo_marketing'],
        implementation_complexity: 'Medium',
        market_potential: 'High',
        alignment_score: 85,
        reasoning: 'Combina nuestra experiencia técnica con el creciente mercado de consumo consciente y nuevas regulaciones ambientales',
        status: 'draft'
      })
      .select()
      .single()

    if (ideaError) {
      console.error('Error creando idea:', ideaError)
      throw new Error(`Error creando idea: ${ideaError.message}`)
    }

    console.log('✅ Idea creada:', idea.title)

    // 4. Crear datos del Paso 1 (medios personales para esta idea específica)
    console.log('👥 Creando medios personales para la idea...')
    
    const step1Data = [
      {
        idea_id: idea.id,
        member_id: DEMO_USER_ID,
        who_i_am: 'Ingeniero de software con 8 años de experiencia en desarrollo web y mobile. MBA en gestión de proyectos. Apasionado por la sostenibilidad y tecnologías limpias. Co-fundador motivado por crear impacto ambiental real.',
        what_i_know: 'Desarrollo fullstack (React, Node.js, Python), gestión de equipos ágiles, análisis de datos, marketing digital, conocimientos en energías renovables y economía circular. Experiencia en APIs de verificación y bases de datos de productos.',
        who_i_know: 'Red de desarrolladores y startups tech, contactos en aceleradoras (Techstars, Y Combinator), inversores ángeles del sector cleantech, profesores universitarios en ingeniería ambiental. Conexiones con certificadoras ambientales.',
        what_i_have: 'Laptop de alta gama, servidor personal, $15,000 en ahorros, oficina en casa, acceso a laboratorio universitario, licencias de software de desarrollo. Prototipo inicial de base de datos de productos.'
      },
      {
        idea_id: idea.id,
        member_id: '11111111-1111-1111-1111-111111111111', // Segundo miembro demo
        who_i_am: 'Especialista en marketing digital y comunicación ambiental. 6 años en ONGs ambientales. Máster en Comunicación Social y certificación en Google Ads. Experta en comunicar sostenibilidad sin greenwashing.',
        what_i_know: 'Marketing digital, redes sociales, copywriting, SEO/SEM, análisis de mercado, comunicación de impacto social, fundraising, diseño gráfico básico. Metodologías de análisis de ciclo de vida.',
        who_i_know: 'Red de influencers eco-friendly, contactos en medios ambientales, community managers de marcas sostenibles, expertos en RSE de empresas grandes. Relaciones con retailers conscientes.',
        what_i_have: 'Equipo de grabación (cámara, micrófono), software de diseño (Adobe Creative Suite), base de datos de 5,000 contactos en redes, $8,000 en ahorros. Red de 200+ marcas sostenibles verificadas.'
      }
    ]

    for (const memberData of step1Data) {
      const { error: step1Error } = await supabase
        .from('step1_means')
        .upsert(memberData)

      if (step1Error) {
        console.error('Error creando medios personales:', step1Error)
        throw new Error(`Error en medios personales: ${step1Error.message}`)
      }
    }

    console.log('✅ Medios personales creados para la idea')

    // 5. Crear datos del Paso 2 (problema específico de la idea)
    console.log('🎯 Creando datos del Paso 2...')
    
    const { error: step2Error } = await supabase
      .from('step2_problem')
      .upsert({
        idea_id: idea.id,
        title: 'Falta de acceso a información confiable sobre el impacto ambiental real de productos de consumo',
        description: 'Los consumidores conscientes del medio ambiente enfrentan dificultades para identificar productos verdaderamente sostenibles debido a la abundancia de greenwashing y falta de transparencia en las cadenas de suministro. Las etiquetas actuales son confusas, incompletas o poco confiables, lo que genera frustración y decisiones de compra subóptimas. Esto afecta tanto a consumidores que quieren hacer elecciones responsables como a empresas que realmente son sostenibles pero no pueden comunicar efectivamente su valor diferencial.',
        affected: 'Consumidores millennials y Gen Z (25-40 años) con ingresos medios-altos que valoran la sostenibilidad pero carecen de tiempo para investigar cada compra. Familias con niños pequeños preocupadas por el futuro del planeta y la salud de sus hijos. Empresas que buscan proveedores sostenibles pero no tienen herramientas de verificación confiables. Pequeños productores sostenibles que no logran comunicar su valor diferencial frente a la competencia con presupuestos de marketing mayores.',
        relevance: '73% de consumidores globales pagarían más por productos sostenibles según Nielsen 2021, pero muchos no saben cómo identificarlos. El mercado de productos sostenibles crece 20% anualmente, alcanzando $150 billones globally. Regulaciones europeas como EU Taxonomy exigen mayor transparencia ambiental. La crisis climática genera urgencia en cambio de hábitos de consumo, especialmente entre consumidores jóvenes que representan el 60% del crecimiento del mercado.',
        link_to_means: 'Mi experiencia técnica en desarrollo fullstack permite crear sistemas de verificación digital escalables usando APIs, bases de datos y algoritmos de machine learning. Los conocimientos en marketing digital son clave para educar consumidores y lograr adopción viral. Nuestros contactos en ONGs ambientales proporcionan credibilidad y acceso a datos confiables. El acceso a laboratorio universitario facilita validación de metodologías de análisis de ciclo de vida.'
      })

    if (step2Error) {
      console.error('Error creando datos del Paso 2:', step2Error)
      throw new Error(`Error en Paso 2: ${step2Error.message}`)
    }

    console.log('✅ Datos del Paso 2 creados')

    // 6. Crear datos del Paso 3 (tendencias específicas de la idea)
    console.log('📈 Creando datos del Paso 3...')
    
    const step3Data = [
      {
        idea_id: idea.id,
        name: 'Transparencia en cadenas de suministro',
        type: 'Tecnológica' as const,
        brief: 'Implementación masiva de blockchain y IoT para rastrear productos desde origen hasta consumidor final',
        example: 'Walmart usa blockchain para rastrear alimentos, reduciendo tiempo de investigación de brotes de 7 días a 2.2 segundos',
        source_apa: 'Chen, S., Liu, X., Yan, J., Hu, G., & Shi, Y. (2021). Processes, benefits, and challenges for adoption of blockchain technologies in food supply chains. Applied Sciences, 11(16), 7546.',
        comment: 'Esta tendencia facilita la verificación automática de claims ambientales'
      },
      {
        idea_id: idea.id,
        name: 'Consumo consciente post-pandemia',
        type: 'Social' as const,
        brief: 'Cambio generacional hacia compras más reflexivas, priorizando impacto sobre conveniencia',
        example: '67% de consumidores reportan haber cambiado hábitos de compra hacia marcas más sostenibles desde 2020',
        source_apa: 'Unilever. (2021). The Unilever Sustainable Living Brands report 2021. Unilever PLC.',
        comment: 'Ventana de oportunidad para productos que faciliten decisiones sostenibles'
      },
      {
        idea_id: idea.id,
        name: 'Regulaciones de etiquetado ambiental',
        type: 'Ambiental' as const,
        brief: 'Nuevas leyes europeas y estadounidenses exigen disclosure detallado de impacto ambiental',
        example: 'EU Taxonomy Regulation obliga a empresas a reportar porcentaje de actividades sostenibles',
        source_apa: 'European Commission. (2021). EU taxonomy for sustainable activities. Publications Office of the European Union.',
        comment: 'Crea demanda obligatoria para herramientas de medición y reporte'
      },
      {
        idea_id: idea.id,
        name: 'Gamificación de comportamientos sostenibles',
        type: 'Cultural' as const,
        brief: 'Uso de elementos de juego para motivar acciones pro-ambientales en aplicaciones móviles',
        example: 'App JouleBug permite a usuarios competir en challenges de sostenibilidad, con 89% de retención mensual',
        source_apa: 'Deterding, S., Dixon, D., Khaled, R., & Nacke, L. (2011). From game design elements to gamefulness. Proceedings of the 15th International Academic MindTrek Conference, 9-15.',
        comment: 'Estrategia de engagement para mantener usuarios activos en la plataforma'
      },
      {
        idea_id: idea.id,
        name: 'Subscripciones vs. propiedad',
        type: 'Consumo' as const,
        brief: 'Preferencia creciente por modelos de acceso sobre posesión, especialmente en productos digitales',
        example: 'Netflix cambió industria del entretenimiento; ahora Patagonia prueba "Worn Wear" para ropa usada',
        source_apa: 'Bardhi, F., & Eckhardt, G. M. (2012). Access-based consumption: The case of car sharing. Journal of Consumer Research, 39(4), 881-898.',
        comment: 'Oportunidad para modelo SaaS en lugar de app de pago único'
      }
    ]

    for (const trendData of step3Data) {
      const { error: step3Error } = await supabase
        .from('step3_trends')
        .insert(trendData)

      if (step3Error) {
        console.error('Error creando tendencia:', step3Error)
        throw new Error(`Error en Paso 3: ${step3Error.message}`)
      }
    }

    console.log('✅ Datos del Paso 3 creados')

    // 7. Crear datos del Paso 4 - Evaluación SWOT de la idea
    console.log('🎯 Creando evaluación SWOT de la idea...')
    
    const { error: step4EvalError } = await supabase
      .from('step4_idea_evaluation')
      .upsert({
        idea_id: idea.id,
        strengths: 'Experiencia técnica sólida en desarrollo fullstack y mobile. Conocimiento profundo en marketing digital y comunicación ambiental. Red de contactos en ONGs y sector cleantech que aporta credibilidad. Capital inicial disponible para MVP. Acceso a laboratorio universitario para validaciones. Timing perfecto con regulaciones emergentes de transparencia ambiental.',
        weaknesses: 'Falta de experiencia previa en verificación de cadenas de suministro. Sin historial empresarial en sector alimentario/retail. Base de datos de productos requerirá validación costosa y tiempo. Dependencia de terceros para certificaciones y verificaciones. Competencia potencial de gigantes tecnológicos con más recursos.',
        opportunities: 'Crecimiento explosivo del mercado de productos sostenibles (20% anual). Nuevas regulaciones europeas crean demanda obligatoria. Post-pandemia aumentó conciencia ambiental especialmente en millennials. Blockchain permite nuevos modelos de verificación transparente. Partnerships con retailers pueden acelerar adopción.',
        threats: 'Google o Amazon podrían lanzar feature similar con recursos masivos. Greenwashing por parte de grandes marcas puede generar escepticismo del consumidor. Regulaciones pueden cambiar estándares de certificación rápidamente. Recesión económica podría priorizar precio sobre sostenibilidad. Dependencia de datos de terceros crea vulnerabilidad.',
        success_factors: 'Construcción de base de datos confiable y actualizada de productos. Partnerships estratégicos con retailers y marcas sostenibles. Interfaz de usuario extremadamente simple y rápida. Modelo de monetización diversificado (freemium + B2B + afiliaciones). Marketing de contenido que eduque sin ser preachy. Credibilidad a través de transparencia de metodología.',
        risk_mitigation: 'Empezar con categorías específicas (ej: cosméticos) para profundizar antes que ampliar. Diversificar fuentes de datos y crear metodología propia de scoring. Construir moat a través de red de usuarios y datos comportamentales. Establecer partnerships exclusivos con verificadores. Mantener costos bajos y runway largo para sobrevivir a competencia de gigantes.'
      })

    if (step4EvalError) {
      console.error('Error creando evaluación de idea:', step4EvalError)
      throw new Error(`Error en evaluación: ${step4EvalError.message}`)
    }

    console.log('✅ Evaluación SWOT creada')

    // 8. Crear datos del Paso 5 - Usuario y Valor (Buyer Persona)
    console.log('👤 Creando datos del Paso 5 - Buyer Persona...')
    
    const { error: step5BuyerError } = await supabase
      .from('step5_buyer')
      .upsert({
        idea_id: idea.id,
        name: 'Sofía Martínez',
        age: 32,
        occupation: 'Gerente de Marketing en empresa de tecnología, madre de un niño de 5 años',
        motivations: 'Quiere tomar decisiones de compra que protejan el futuro de su hijo. Busca ser coherente con sus valores ambientales sin sacrificar calidad de vida. Desea sentirse empoderada con información confiable.',
        pains: 'No tiene tiempo para investigar cada producto. Se siente engañada por greenwashing. Las etiquetas ecológicas son confusas. Teme pagar más por productos que no son realmente sostenibles.',
        needs: 'Información rápida y confiable sobre impacto ambiental. Alternativas sostenibles a productos habituales. Validación de que sus decisiones importan. Comunidad de personas con valores similares.'
      })

    if (step5BuyerError) {
      console.error('Error creando datos del Paso 5 - Buyer:', step5BuyerError)
      throw new Error(`Error en Paso 5 Buyer: ${step5BuyerError.message}`)
    }

    console.log('✅ Datos del Paso 5 - Buyer Persona creados')

    // 9. Crear datos del Paso 5 - Propuesta de Valor Canvas
    console.log('💎 Creando datos del Paso 5 - VP Canvas...')
    
    const { error: step5VPError } = await supabase
      .from('step5_vpcanvas')
      .upsert({
        idea_id: idea.id,
        customer_jobs: 'Comprar productos para el hogar y familia de manera eficiente. Mantener estilo de vida coherente con valores ambientales. Educar a su familia sobre sostenibilidad. Optimizar presupuesto familiar sin comprometer calidad.',
        customer_pains: 'Información ambiental confusa o ausente en productos. Tiempo limitado para investigar sostenibilidad de marcas. Desconfianza por prácticas de greenwashing. Precios premium injustificados en productos "eco". Falta de alternativas sostenibles en categorías específicas.',
        customer_gains: 'Sentirse bien por decisiones de compra conscientes. Encontrar productos que superan expectativas de calidad. Ahorro económico a largo plazo con productos duraderos. Reconocimiento social por estilo de vida sostenible. Contribuir measurablemente a la protección ambiental.',
        products_services: 'App móvil con escáner de códigos de barras y EcoScore instantáneo. Base de datos de +50,000 productos con análisis de ciclo de vida. Recomendaciones personalizadas de alternativas sostenibles. Dashboard personal de impacto ambiental acumulado. Comunidad de usuarios con challenges y tips.',
        pain_relievers: 'EcoScore simplificado (1-10) elimina confusión de múltiples certificaciones. Escaneo instantáneo ahorra tiempo de investigación. Algoritmo anti-greenwashing basado en datos verificados. Comparador de precios muestra relación costo-beneficio real. Filtros por categoría facilitan búsqueda de alternativas.',
        gain_creators: 'Gamificación con puntos por decisiones sostenibles. Calculadora de impacto personal (CO2, agua, residuos ahorrados). Badges y logros por hitos ambientales. Sharing en redes sociales de logros de sostenibilidad. Descuentos exclusivos en marcas partner verificadas.'
      })

    if (step5VPError) {
      console.error('Error creando datos del Paso 5 - VP Canvas:', step5VPError)
      throw new Error(`Error en Paso 5 VP: ${step5VPError.message}`)
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
      // No fallar por esto, es solo cosmético
    }

    console.log('🎉 ¡Datos de prueba COMPLETOS creados exitosamente!')
    console.log(`📋 Equipo: ${team.name}`)
    console.log(`📚 Bitácora: ${journal.title}`)
    console.log(`💡 Idea creada: ${idea.title}`)
    console.log(`👤 Buyer persona: Sofía Martínez`)
    console.log(`💎 VP Canvas: Completo`)
    console.log(`🎯 Evaluación SWOT: Completa`)

    return {
      team,
      journal,
      idea,
      success: true
    }

  } catch (error) {
    console.error('❌ Error general creando datos de prueba:', error)
    throw error
  }
}