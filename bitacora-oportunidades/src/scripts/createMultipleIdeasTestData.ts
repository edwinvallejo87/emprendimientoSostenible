import { supabase } from '../lib/supabase'

// Demo user ID (debe coincidir con el del store)
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000000'

export async function createMultipleIdeasTestData() {
  try {
    console.log('🚀 Creando bitácora con múltiples ideas de prueba...')
    
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
        name: 'Innovation Lab - Ideas Portfolio'
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
        title: 'Portfolio de Ideas de Innovación 2024'
      })
      .select()
      .single()

    if (journalError) {
      console.error('Error creando bitácora:', journalError)
      throw new Error(`Error creando bitácora: ${journalError.message}`)
    }

    console.log('✅ Bitácora creada:', journal.title)

    // 3. Definir múltiples ideas
    const ideasData = [
      {
        title: 'EcoScore App - Calificación Ambiental de Productos',
        description: 'Aplicación móvil que usa IA para evaluar el impacto ambiental real de productos mediante códigos de barras, proporcionando puntuaciones transparentes y alternativas sostenibles.',
        target_market: 'Consumidores conscientes del medio ambiente, millennials y Gen Z con ingresos medios-altos',
        unique_value: 'Primera app que combina verificación blockchain con IA para scoring ambiental en tiempo real',
        implementation_complexity: 'Medium' as const,
        market_potential: 'High' as const,
        alignment_score: 85,
        reasoning: 'Combina nuestra experiencia técnica con el creciente mercado de consumo consciente y nuevas regulaciones ambientales',
        medios: {
          who_i_am: 'Ingeniero de software con 8 años de experiencia en desarrollo web y mobile. MBA en gestión de proyectos. Apasionado por la sostenibilidad y tecnologías limpias.',
          what_i_know: 'Desarrollo fullstack (React, Node.js, Python), gestión de equipos ágiles, análisis de datos, marketing digital, conocimientos en energías renovables y economía circular.',
          who_i_know: 'Red de desarrolladores y startups tech, contactos en aceleradoras (Techstars, Y Combinator), inversores ángeles del sector cleantech, profesores universitarios en ingeniería ambiental.',
          what_i_have: 'Laptop de alta gama, servidor personal, $15,000 en ahorros, oficina en casa, acceso a laboratorio universitario, licencias de software de desarrollo.'
        },
        problema: {
          title: 'Falta de información confiable sobre impacto ambiental de productos',
          description: 'Los consumidores conscientes del medio ambiente enfrentan enormes dificultades para identificar productos verdaderamente sostenibles en el mercado actual. El problema principal radica en la abundancia de greenwashing practicado por empresas que utilizan marketing engañoso para hacer que sus productos parezcan más ecológicos de lo que realmente son. Además, existe una grave falta de transparencia en las cadenas de suministro globales, donde es prácticamente imposible para el consumidor promedio rastrear el verdadero impacto ambiental de un producto desde su origen hasta su disposición final. Esta información fragmentada y poco confiable genera confusión, frustración y decisiones de compra subóptimas.',
          affected: 'El problema afecta principalmente a consumidores millennials y Gen Z (edades 25-40 años) con ingresos medios-altos que valoran genuinamente la sostenibilidad pero carecen del tiempo, recursos y expertise técnico necesario para investigar cada compra individual. Este segmento representa aproximadamente 78 millones de personas solo en México y Estados Unidos, quienes expresan una fuerte disposición a pagar premiums del 15-25% por productos genuinamente sostenibles, pero se sienten traicionados por las prácticas de greenwashing y buscan desesperadamente herramientas confiables para tomar decisiones de compra alineadas con sus valores ambientales.',
          relevance: 'Según estudios de Nielsen 2023, el 73% de consumidores globales están dispuestos a pagar más por productos sostenibles, representando un mercado de $150 billones de dólares anuales. Sin embargo, el 67% reporta dificultades para identificar productos genuinamente sostenibles debido a información contradictoria y falta de estándares unificados. El EU Green Deal y regulaciones similares en México están creando presión regulatoria para mayor transparencia, mientras que el crecimiento del 300% en búsquedas relacionadas con "productos ecológicos" demuestra una demanda insatisfecha urgente. La brecha entre intención de compra sostenible y comportamiento real del consumidor representa una oportunidad de mercado masiva.',
          link_to_means: 'Mi experiencia técnica de 8 años en desarrollo fullstack (React, Node.js, Python) me permite crear sistemas de verificación digital escalables que pueden procesar y analizar datos complejos de cadenas de suministro usando APIs, bases de datos distribuidas y algoritmos de machine learning. Mi red profesional incluye contactos en aceleradoras tech como Techstars, inversores ángeles del sector cleantech, y profesores universitarios en ingeniería ambiental que pueden validar la metodología científica. Además, mi conocimiento en sostenibilidad y blockchain permite implementar sistemas de verificación transparentes y confiables que los consumidores pueden entender y en los que pueden confiar para tomar decisiones de compra informadas.'
        }
      },
      {
        title: 'AgriDrone - Monitoreo Inteligente de Cultivos',
        description: 'Sistema de drones autónomos con IA para monitoreo de cultivos, detección temprana de plagas y optimización de recursos agrícolas.',
        target_market: 'Agricultores medianos y grandes, cooperativas agrícolas, empresas agrotécnicas',
        unique_value: 'Combinación de hardware autónomo con análisis predictivo para optimización agrícola',
        implementation_complexity: 'High' as const,
        market_potential: 'High' as const,
        alignment_score: 65,
        reasoning: 'Mercado grande pero requiere expertise en hardware que podríamos adquirir mediante partnerships',
        medios: {
          who_i_am: 'Ingeniero agrónomo con 10 años de experiencia en tecnificación de cultivos. Especialista en agricultura de precisión y análisis de datos.',
          what_i_know: 'Agricultura de precisión, análisis de suelos, sistemas de riego inteligente, interpretación de imágenes satelitales, programación en Python y R.',
          who_i_know: 'Red de agricultores innovadores, contactos en universidades agrícolas, distribuidores de maquinaria agrícola, cooperativas regionales.',
          what_i_have: 'Estación meteorológica personal, drones básicos para pruebas, terreno de 2 hectáreas para experimentación, $25,000 en ahorros.'
        },
        problema: {
          title: 'Pérdidas agrícolas por detección tardía de problemas en cultivos',
          description: 'Los agricultores mexicanos enfrentan pérdidas devastadoras del 20-40% de sus cosechas debido a la detección tardía de plagas, enfermedades, estrés hídrico y deficiencias nutricionales, especialmente en cultivos extensivos como maíz, soja y sorgo. El problema se agrava por la dependencia de métodos de monitoreo tradicionales que requieren inspección manual de vastas extensiones de terreno, lo cual es físicamente imposible de realizar con la frecuencia necesaria. Las plagas pueden propagarse exponencialmente en días, las enfermedades fúngicas se desarrollan rápidamente bajo condiciones específicas de humedad, y el estrés hídrico puede causar daños irreversibles antes de ser detectado visualmente. Esta situación genera pérdidas económicas masivas y desperdicio de recursos como agua, fertilizantes y pesticidas.',
          affected: 'Este problema afecta críticament a agricultores medianos con extensiones de 10-500 hectáreas que representan el 65% de la producción agrícola mexicana pero que no pueden permitirse tecnología de agricultura de precisión de última generación como la que usan las grandes corporaciones. Estos productores enfrentan márgenes de ganancia cada vez más estrechos debido al aumento de costos de insumos, volatilidad climática y competencia global, por lo que necesitan desesperadamente optimizar recursos y maximizar rendimientos. Son técnicamente competentes pero carecen de acceso a soluciones tecnológicas asequibles que les permitan competir efectivamente en el mercado moderno.',
          relevance: 'La agricultura de precisión puede aumentar rendimientos entre 15-25% y reducir costos de insumos del 10-20% según estudios de la FAO 2023. El mercado global de tecnología agrícola está valorado en $7.8 billones y creciendo al 12% anual. En México específicamente, las pérdidas agrícolas representan $3.2 billones anuales, mientras que el gobierno está invirtiendo $800 millones en programas de tecnificación agrícola. La crisis de seguridad alimentaria global y el cambio climático han convertido la optimización agrícola en una prioridad nacional, con subsidios gubernamentales del 60% disponibles para tecnologías que demuestren impacto medible en productividad y sostenibilidad.',
          link_to_means: 'Mi experiencia de 10 años en agronomía con especialización en agricultura de precisión me proporciona el conocimiento técnico fundamental sobre ciclos de cultivos, comportamiento de plagas y factores de estrés vegetal. Mi formación en análisis de datos y programación (Python, R) me permite desarrollar algoritmos de detección temprana basados en imágenes multiespectrales. Además, mi red de contactos incluye agricultores innovadores dispuestos a ser early adopters, distribuidores de maquinaria agrícola para canales de venta, y acceso a terrenos de prueba donde puedo validar y perfeccionar la tecnología antes del lanzamiento comercial masivo.'
        }
      },
      {
        title: 'EduConnect - Plataforma de Tutorías P2P',
        description: 'Marketplace que conecta estudiantes universitarios para intercambio de tutorías, creando una economía colaborativa de conocimiento.',
        target_market: 'Estudiantes universitarios de 18-25 años, especialmente en carreras STEM y ciencias sociales',
        unique_value: 'Sistema de intercambio de créditos donde estudiantes pueden ser tutores y estudiantes simultáneamente',
        implementation_complexity: 'Low' as const,
        market_potential: 'Medium' as const,
        alignment_score: 90,
        reasoning: 'Perfectamente alineado con mi experiencia en educación y desarrollo de plataformas digitales',
        medios: {
          who_i_am: 'Desarrollador fullstack con experiencia en EdTech. Ex-tutor universitario con pasión por democratizar el acceso a educación de calidad.',
          what_i_know: 'Desarrollo web y mobile, sistemas de matching, gamificación, psicología del aprendizaje, metodologías de enseñanza efectivas.',
          who_i_know: 'Red de profesores universitarios, estudiantes de múltiples universidades, desarrolladores de EdTech, inversores en educación.',
          what_i_have: 'Plataforma web básica desarrollada, acceso a 3 universidades para pruebas piloto, $10,000 en ahorros, equipo de desarrollo remoto.'
        },
        problema: {
          title: 'Acceso limitado y costoso a tutorías de calidad en universidades',
          description: 'Los estudiantes universitarios enfrentan una crisis de acceso a apoyo académico personalizado de calidad, especialmente en materias STEM complejas como cálculo, física, química orgánica y programación. Las tutorías tradicionales son prohibitivamente caras ($300-500 MXN por hora), tienen horarios extremadamente limitados que no se adaptan a los horarios estudiantiles variables, y frecuentemente no están disponibles cuando más se necesitan (épocas de exámenes, entregas de proyectos). Los centros de tutorías universitarios están sobresaturados y ofrecen apoyo grupal genérico que no atiende las necesidades específicas de aprendizaje individual. Esta situación crea un círculo vicioso donde estudiantes con dificultades se retrasan más, mientras que estudiantes brillantes pierden oportunidades de monetizar sus conocimientos ayudando a sus compañeros.',
          affected: 'Este problema afecta crítica a dos segmentos principales: estudiantes universitarios con dificultades académicas (especialmente de bajos recursos económicos que no pueden permitirse tutorías privadas) que representan el 40% de la población estudiantil y corren riesgo de deserción; y estudiantes académicamente brillantes que podrían generar ingresos adicionales compartiendo su conocimiento pero carecen de plataformas eficientes para conectar con quienes necesitan ayuda. En México, esto representa aproximadamente 2.8 millones de estudiantes universitarios que podrían beneficiarse de un sistema de tutorías P2P accesible, eficiente y económicamente viable.',
          relevance: 'Según estudios de la ANUIES 2023, el 68% de estudiantes universitarios mexicanos reportan necesitar apoyo académico adicional, mientras que el 35% considera las tutorías como factor determinante para el éxito académico. El mercado global de tutorías privadas está valorado en $102 billones y creciendo al 8% anual. La pandemia aceleró la adopción de tutorías virtuales en un 400%, demostrando la viabilidad de plataformas digitales. Con tasas de deserción universitaria del 24% en México y costos crecientes de educación, existe una necesidad urgente de soluciones que democraticen el acceso a apoyo académico de calidad sin aumentar la carga financiera de los estudiantes.',
          link_to_means: 'Mi experiencia de 3 años como tutor universitario me proporciona insights únicos sobre las necesidades específicas de aprendizaje estudiantil, metodologías de enseñanza efectivas, y los pain points tanto de tutores como de estudiantes en el sistema actual. Mi background técnico en desarrollo fullstack me permite crear la solución tecnológica escalable necesaria para matching inteligente, sistemas de calificación, gamificación y manejo de pagos. Además, mi acceso directo a 3 universidades para pruebas piloto y mi red de contactos estudiantiles me permite validar rápidamente el product-market fit y iterar basado en feedback real del mercado objetivo.'
        }
      }
    ]

    console.log(`💡 Creando ${ideasData.length} ideas de prueba...`)

    const createdIdeas = []

    for (let i = 0; i < ideasData.length; i++) {
      const ideaInfo = ideasData[i]
      console.log(`📝 Creando idea ${i + 1}: ${ideaInfo.title}`)

      // Crear la idea
      const { data: idea, error: ideaError } = await supabase
        .from('ideas')
        .insert({
          journal_id: journal.id,
          title: ideaInfo.title,
          description: ideaInfo.description,
          target_market: ideaInfo.target_market,
          unique_value: ideaInfo.unique_value,
          resources_needed: ['desarrollo', 'marketing', 'validacion'],
          implementation_complexity: ideaInfo.implementation_complexity,
          market_potential: ideaInfo.market_potential,
          alignment_score: ideaInfo.alignment_score,
          reasoning: ideaInfo.reasoning,
          status: 'draft'
        })
        .select()
        .single()

      if (ideaError) {
        console.error(`Error creando idea ${i + 1}:`, ideaError)
        continue
      }

      console.log(`✅ Idea ${i + 1} creada: ${idea.title}`)

      // Crear medios personales para esta idea
      const { error: step1Error } = await supabase
        .from('step1_means')
        .insert({
          idea_id: idea.id,
          member_id: DEMO_USER_ID,
          who_i_am: ideaInfo.medios.who_i_am,
          what_i_know: ideaInfo.medios.what_i_know,
          who_i_know: ideaInfo.medios.who_i_know,
          what_i_have: ideaInfo.medios.what_i_have,
        })

      if (step1Error) {
        console.error(`Error creando medios para idea ${i + 1}:`, step1Error)
      }

      // Crear problema para esta idea
      const { error: step2Error } = await supabase
        .from('step2_problem')
        .insert({
          idea_id: idea.id,
          title: ideaInfo.problema.title,
          description: ideaInfo.problema.description,
          affected: ideaInfo.problema.affected,
          relevance: ideaInfo.problema.relevance,
          link_to_means: ideaInfo.problema.link_to_means,
        })

      if (step2Error) {
        console.error(`Error creando problema para idea ${i + 1}:`, step2Error)
      }

      // Crear tendencias específicas para cada idea
      let trendsData = []
      
      if (i === 0) { // EcoScore App
        trendsData = [
          {
            idea_id: idea.id,
            name: 'Regulaciones Ambientales Estrictas',
            type: 'Regulatoria' as const,
            brief: 'Nuevas leyes exigen transparencia en impacto ambiental de productos',
            example: 'EU Green Deal requiere etiquetado de huella de carbono para 2025',
            source_apa: 'European Commission. (2024). Green Deal Implementation Report.',
            comment: 'Crea demanda obligatoria para nuestras soluciones de scoring ambiental'
          },
          {
            idea_id: idea.id,
            name: 'Consumo Consciente Gen Z',
            type: 'Social' as const,
            brief: 'Generación Z prioriza compras basadas en impacto ambiental',
            example: '78% de Gen Z pagaría 15% más por productos sostenibles verificados',
            source_apa: 'Nielsen. (2024). Generational Sustainability Report.',
            comment: 'Nuestro mercado objetivo tiene fuerte disposición de pago'
          },
          {
            idea_id: idea.id,
            name: 'IA para Verificación Ambiental',
            type: 'Tecnológica' as const,
            brief: 'Avances en IA permiten análisis automatizado de cadenas de suministro',
            example: 'IBM Watson Carbon Intelligence identifica emisiones con 95% precisión',
            source_apa: 'MIT Technology Review. (2024). AI for Climate Action.',
            comment: 'Tecnología habilitadora clave para nuestra propuesta de valor'
          },
          {
            idea_id: idea.id,
            name: 'Inversión ESG Masiva',
            type: 'Económica' as const,
            brief: 'Fondos de inversión priorizan empresas con criterios ESG sólidos',
            example: 'BlackRock destina $130B a inversiones ESG, demanda transparencia ambiental',
            source_apa: 'Financial Times. (2024). ESG Investment Trends Report.',
            comment: 'Presión del capital financiero acelera adopción de herramientas de transparencia'
          },
          {
            idea_id: idea.id,
            name: 'Blockchain para Trazabilidad',
            type: 'Tecnológica' as const,
            brief: 'Adopción de blockchain para verificar cadenas de suministro sostenibles',
            example: 'Walmart implementa blockchain para rastrear productos orgánicos',
            source_apa: 'Harvard Business Review. (2024). Supply Chain Innovation.',
            comment: 'Infraestructura tecnológica disponible para verificación de impacto'
          }
        ]
      } else if (i === 1) { // AgriDrone
        trendsData = [
          {
            idea_id: idea.id,
            name: 'Crisis de Seguridad Alimentaria',
            type: 'Social' as const,
            brief: 'Necesidad urgente de optimizar producción agrícola por escasez global',
            example: 'FAO proyecta déficit del 25% en producción alimentaria para 2030',
            source_apa: 'FAO. (2024). Global Food Security Outlook.',
            comment: 'Presión del mercado para adoptar tecnologías de agricultura de precisión'
          },
          {
            idea_id: idea.id,
            name: 'Democratización de Drones',
            type: 'Tecnológica' as const,
            brief: 'Costos de drones agrícolas han bajado 70% en últimos 3 años',
            example: 'Drones comerciales ahora cuestan $2,000 vs $15,000 en 2020',
            source_apa: 'AgTech Report. (2024). Drone Technology Accessibility.',
            comment: 'Hace viable económicamente nuestra solución para agricultores medianos'
          },
          {
            idea_id: idea.id,
            name: 'Políticas de Agricultura Sostenible',
            type: 'Regulatoria' as const,
            brief: 'Gobiernos incentivan adopción de tecnologías que reduzcan pesticidas',
            example: 'México ofrece subsidios del 60% para tecnología de agricultura de precisión',
            source_apa: 'SAGARPA. (2024). Programa de Tecnificación Agrícola.',
            comment: 'Apoyo gubernamental reduce barreras de adopción para nuestros clientes'
          },
          {
            idea_id: idea.id,
            name: 'Cambio Climático Extremo',
            type: 'Ambiental' as const,
            brief: 'Eventos climáticos impredecibles aumentan riesgo en agricultura tradicional',
            example: 'Sequías e inundaciones causaron pérdidas de $50B en 2023 en México',
            source_apa: 'CENAPRED. (2024). Impacto Climático en Agricultura.',
            comment: 'Necesidad urgente de monitoreo preventivo para reducir riesgos climáticos'
          },
          {
            idea_id: idea.id,
            name: 'IA en Agricultura de Precisión',
            type: 'Tecnológica' as const,
            brief: 'Algoritmos de machine learning optimizan decisiones agrícolas en tiempo real',
            example: 'John Deere integra IA en tractores - aumento 12% rendimientos',
            source_apa: 'Agriculture Technology Magazine. (2024). AI in Farming.',
            comment: 'Tecnología madura disponible para integrar en nuestros drones'
          }
        ]
      } else { // EduConnect
        trendsData = [
          {
            idea_id: idea.id,
            name: 'Crisis de Desigualdad Educativa',
            type: 'Social' as const,
            brief: 'Pandemia amplió brecha académica, aumentando demanda de tutorías',
            example: '45% de estudiantes reporta necesitar apoyo académico adicional post-COVID',
            source_apa: 'UNESCO. (2024). Educational Recovery Report.',
            comment: 'Mercado expandido con necesidad urgente de soluciones accesibles'
          },
          {
            idea_id: idea.id,
            name: 'Plataformas de Economía Colaborativa',
            type: 'Tecnológica' as const,
            brief: 'Normalización de servicios P2P facilita adopción de tutorías colaborativas',
            example: 'Uber, Airbnb normalizaron intercambios entre pares - 90% confianza',
            source_apa: 'Sharing Economy Institute. (2024). Trust in P2P Platforms.',
            comment: 'Base de usuarios ya acostumbrada a modelos colaborativos'
          },
          {
            idea_id: idea.id,
            name: 'Costos Educativos en Aumento',
            type: 'Económica' as const,
            brief: 'Tutorías privadas cada vez más caras, creando necesidad de alternativas',
            example: 'Costo promedio de tutorías subió 35% en 2 años - ahora $30-50/hora',
            source_apa: 'Education Economics Journal. (2024). Private Tutoring Costs.',
            comment: 'Nuestra solución de intercambio ofrece alternativa económica atractiva'
          },
          {
            idea_id: idea.id,
            name: 'Educación Digital Nativa',
            type: 'Social' as const,
            brief: 'Estudiantes prefieren aprendizaje digital interactivo y colaborativo',
            example: '85% de Gen Z prefiere video tutoriales y peer learning vs clases magistrales',
            source_apa: 'Education Technology Review. (2024). Digital Learning Preferences.',
            comment: 'Alineación perfecta con preferencias de nuestro mercado objetivo'
          },
          {
            idea_id: idea.id,
            name: 'Regulaciones de Equidad Educativa',
            type: 'Regulatoria' as const,
            brief: 'Políticas gubernamentales promueven acceso equitativo a educación de calidad',
            example: 'SEP lanza programa de $2B para democratizar acceso a tutorías',
            source_apa: 'Secretaría de Educación Pública. (2024). Plan de Equidad Educativa.',
            comment: 'Apoyo institucional para plataformas que reduzcan brechas educativas'
          }
        ]
      }

      for (const trend of trendsData) {
        const { error: trendError } = await supabase
          .from('step3_trends')
          .insert(trend)

        if (trendError) {
          console.error(`Error creando tendencia para idea ${i + 1}:`, trendError)
        }
      }

      // Crear evaluación SWOT para cada idea
      let evaluationData = {}
      
      if (i === 0) { // EcoScore App
        evaluationData = {
          idea_id: idea.id,
          strengths: 'Equipo técnico fuerte, experiencia en desarrollo mobile, conocimiento en sostenibilidad, red de contactos en sector tech',
          weaknesses: 'Sin experiencia previa en retail, dependencia de APIs externas, necesidad de validación científica constante',
          opportunities: 'Regulaciones ambientales crecientes, mercado millennial/Gen Z en crecimiento, partnerships con retailers, expansión internacional',
          threats: 'Competencia de Google/Amazon, resistencia de marcas a transparencia, datos ambientales inexactos, cambios regulatorios',
          success_factors: 'Calidad y confiabilidad de datos ambientales, partnerships estratégicos con retailers, adopción de usuarios masiva',
          risk_mitigation: 'Diversificar fuentes datos, acuerdos legales sólidos, plan B sin APIs externas, validación científica independiente'
        }
      } else if (i === 1) { // AgriDrone
        evaluationData = {
          idea_id: idea.id,
          strengths: 'Conocimiento agrícola profundo, terreno para pruebas, red de agricultores, experiencia en análisis de datos',
          weaknesses: 'Sin experiencia en hardware, dependencia de tecnología externa, inversión inicial alta en drones',
          opportunities: 'Mercado agrícola en crecimiento, subsidios gubernamentales, necesidad urgente por crisis alimentaria, escalabilidad internacional',
          threats: 'Competencia de DJI/Parrot, regulaciones de drones, dependencia climática, resistencia al cambio de agricultores tradicionales',
          success_factors: 'Precisión de detección de problemas, facilidad de uso para agricultores, ROI demostrable, soporte técnico',
          risk_mitigation: 'Partnerships tecnológicos, modelos de renting, seguros para equipos, capacitación intensiva usuarios'
        }
      } else { // EduConnect
        evaluationData = {
          idea_id: idea.id,
          strengths: 'Experiencia en educación, plataforma web básica desarrollada, acceso a universidades, red de estudiantes',
          weaknesses: 'Plataforma aún básica, sin modelo de monetización claro, dependencia de adopción masiva para crear valor',
          opportunities: 'Crisis educativa post-COVID, mercado de tutorías en crecimiento, modelos P2P exitosos, expansión a otras universidades',
          threats: 'Competencia de plataformas establecidas, cambios en sistemas educativos, problemas de calidad en tutorías P2P',
          success_factors: 'Sistema de matching efectivo, calidad de tutorías, masa crítica de usuarios, monetización sostenible',
          risk_mitigation: 'Sistema calificaciones robusto, moderación contenido, partnerships universidades, modelo freemium'
        }
      }

      const { error: evaluationError } = await supabase
        .from('step4_idea_evaluation')
        .insert(evaluationData)

      if (evaluationError) {
        console.error(`Error creando evaluación para idea ${i + 1}:`, evaluationError)
      }

      // Crear datos de buyer persona para cada idea
      let buyerData = {}
      
      if (i === 0) { // EcoScore App
        buyerData = {
          idea_id: idea.id,
          name: 'Sofía González',
          age: 28,
          occupation: 'Marketing Manager en empresa tech',
          motivations: 'Quiere vivir de manera más sostenible sin sacrificar conveniencia, ser coherente con sus valores al comprar productos que realmente cuiden el planeta',
          pains: 'No sabe qué productos son realmente sostenibles, desconfianza del greenwashing, falta tiempo para investigar cada compra, información confusa en etiquetas',
          needs: 'Verificación independiente de impacto ambiental, información clara y rápida, alternativas sostenibles personalizadas, confianza en las marcas'
        }
      } else if (i === 1) { // AgriDrone
        buyerData = {
          idea_id: idea.id,
          name: 'Carlos Mendoza',
          age: 45,
          occupation: 'Agricultor con 120 hectáreas de maíz y soja',
          motivations: 'Aumentar rendimiento 15-20%, reducir pérdidas por plagas/enfermedades, optimizar uso de recursos, ser reconocido como agricultor innovador',
          pains: 'Pérdidas por detección tardía de problemas, costos altos de monitoreo manual, falta tiempo para supervisar todo el terreno, incertidumbre sobre ROI de tecnología',
          needs: 'ROI demostrable, facilidad de uso, soporte técnico local, garantías sólidas, casos de éxito comprobados en la región'
        }
      } else { // EduConnect
        buyerData = {
          idea_id: idea.id,
          name: 'Ana Rodríguez',
          age: 20,
          occupation: 'Estudiante de ingeniería en TEC',
          motivations: 'Aprobar materias difíciles, mejorar calificaciones, aprender eficientemente, gastar menos en educación, ayudar a otros estudiantes',
          pains: 'Tutorías caras ($300-500/hora), horarios limitados, dificultad encontrar tutores de calidad para matemáticas/física, presupuesto estudiantil limitado',
          needs: 'Precio accesible, calidad del tutor verificada, flexibilidad horarios, reputación/calificaciones confiables, facilidad de uso en móvil'
        }
      }

      const { error: buyerError } = await supabase
        .from('step5_buyer')
        .insert(buyerData)

      if (buyerError) {
        console.error(`Error creando buyer persona para idea ${i + 1}:`, buyerError)
      }

      // Crear propuesta de valor para cada idea
      let valueData = {}
      
      if (i === 0) { // EcoScore App
        valueData = {
          idea_id: idea.id,
          customer_jobs: 'Comprar productos sostenibles verificados, tomar decisiones de compra conscientes, comparar alternativas ecológicas',
          customer_pains: 'Desconfianza del greenwashing, falta de información clara sobre impacto ambiental, tiempo limitado para investigar productos',
          customer_gains: 'Tranquilidad de comprar productos genuinamente sostenibles, coherencia entre valores y acciones, reconocimiento social por consumo responsable',
          products_services: 'App móvil de scoring ambiental, base de datos verificada de productos, sistema de recomendaciones personalizadas, integración e-commerce',
          pain_relievers: 'Verificación blockchain elimina greenwashing, scoring en 3 segundos ahorra tiempo, datos científicos dan confianza',
          gain_creators: 'Badges sociales por compras sostenibles, reportes personales de impacto, comunidad de consumidores conscientes'
        }
      } else if (i === 1) { // AgriDrone
        valueData = {
          idea_id: idea.id,
          customer_jobs: 'Monitorear cultivos eficientemente, detectar problemas tempranamente, optimizar uso de recursos, maximizar rendimientos',
          customer_pains: 'Pérdidas por detección tardía, altos costos de monitoreo manual, incertidumbre sobre estado de cultivos, ROI incierto de tecnología',
          customer_gains: 'Aumento del rendimiento 15-20%, reducción de pérdidas, reconocimiento como agricultor innovador, tranquilidad sobre cultivos',
          products_services: 'Drones autónomos, software de análisis IA, reportes semanales, mapas de prescripción, soporte técnico especializado',
          pain_relievers: 'Detección 14 días antes que métodos visuales, modelo de renta sin inversión inicial, soporte técnico local',
          gain_creators: 'Certificación de agricultura de precisión, dashboard en tiempo real, reportes para acceder a subsidios gubernamentales'
        }
      } else { // EduConnect
        valueData = {
          idea_id: idea.id,
          customer_jobs: 'Obtener tutorías de calidad, aprobar materias difíciles, mejorar calificaciones, aprender eficientemente',
          customer_pains: 'Tutorías caras ($300-500/hora), horarios limitados, dificultad encontrar tutores calificados, presupuesto estudiantil limitado',
          customer_gains: 'Acceso a tutorías gratuitas, flexibilidad horaria, mejora en calificaciones, red de apoyo académico',
          products_services: 'Plataforma de intercambio de tutorías, sistema de matching inteligente, videollamadas integradas, sistema de créditos',
          pain_relievers: 'Intercambio elimina costo monetario, horarios 24/7, sistema de calificaciones asegura calidad',
          gain_creators: 'Gamificación con badges por ayudar, reconocimiento como tutor destacado, comunidad estudiantil de apoyo'
        }
      }

      const { error: valueError } = await supabase
        .from('step5_vpcanvas')
        .insert(valueData)

      if (valueError) {
        console.error(`Error creando propuesta de valor para idea ${i + 1}:`, valueError)
      }

      console.log(`✅ Datos básicos creados para idea ${i + 1}`)
      createdIdeas.push(idea)
    }

    console.log('🎉 ¡Bitácora con múltiples ideas creada exitosamente!')
    console.log(`📋 Equipo: ${team.name}`)
    console.log(`📚 Bitácora: ${journal.title}`)
    console.log(`💡 Ideas creadas: ${createdIdeas.length}`)
    createdIdeas.forEach((idea, index) => {
      console.log(`   ${index + 1}. ${idea.title}`)
    })

    return {
      team,
      journal,
      ideas: createdIdeas,
      success: true
    }

  } catch (error) {
    console.error('❌ Error general creando datos de prueba:', error)
    throw error
  }
}