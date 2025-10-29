export interface CompleteIdeaData {
  // Idea principal
  idea: {
    title: string
    description: string
    target_market: string
    unique_value: string
  }
  
  // Step 1: Medios personales
  step1: {
    who_i_am: string
    what_i_know: string
    who_i_know: string
    what_i_have: string
  }
  
  // Step 2: Problema
  step2: {
    title: string
    description: string
    affected: string
    relevance: string
    link_to_means: string
  }
  
  // Step 3: Tendencias
  step3: Array<{
    name: string
    type: 'Social' | 'Tecnológica' | 'Ambiental' | 'Cultural' | 'Consumo'
    brief: string
    example: string
    source_apa: string
    comment: string
  }>
  
  // Step 4: Evaluación SWOT
  step4: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  
  // Step 5A: Buyer Persona
  step5Buyer: {
    name: string
    age: number
    occupation: string
    motivations: string
    pains: string
    needs: string
  }
  
  // Step 5B: Propuesta de Valor
  step5VP: {
    customer_jobs: string
    customer_pains: string
    customer_gains: string
    products_services: string
    pain_relievers: string
    gain_creators: string
  }
}

export class CompleteIdeaGenerator {
  private apiKey: string | null

  constructor() {
    // Use the same pattern as the existing openai.ts file
    this.apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || null
  }

  async generateCompleteIdea(ideaPrompt: string, userProfile?: string): Promise<CompleteIdeaData> {
    console.log('🎯 Iniciando generación de idea completa...')
    console.log('💡 Prompt recibido:', ideaPrompt)
    console.log('🔑 API Key disponible:', this.apiKey ? 'Sí' : 'No')
    
    if (!this.apiKey) {
      console.log('🔧 API key no configurada, usando análisis simulado')
      return this.getMockCompleteIdea(ideaPrompt)
    }

    try {
      console.log('🤖 Generando idea completa con IA...')
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: `Eres un experto en metodología efectual y desarrollo de oportunidades emprendedoriales. Tu especialidad es tomar una idea básica y desarrollar un análisis completo de 6 pasos siguiendo la metodología efectual de Sarasvathy.

METODOLOGÍA EFECTUAL - 5 PRINCIPIOS:
🎯 BIRD-IN-HAND: Partir de medios disponibles (quién soy, qué sé, a quién conozco, qué tengo)
💰 AFFORDABLE LOSS: Definir pérdidas asequibles vs. retornos esperados
🤝 CRAZY QUILT: Formar alianzas antes que análisis competitivo
🍋 LEMONADE: Capitalizar contingencias vs. evitar incertidumbre  
✈️ PILOT-IN-THE-PLANE: Controlar el futuro vs. predecirlo

Tu misión: Desarrollar una bitácora completa y realista que un emprendedor podría usar para validar y ejecutar la oportunidad.`
            },
            {
              role: 'user',
              content: this.buildCompleteIdeaPrompt(ideaPrompt, userProfile)
            }
          ],
          temperature: 0.4,
          max_tokens: 4000,
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const result = await response.json()
      const content = result.choices[0].message.content
      
      console.log('✅ Idea completa generada exitosamente')
      
      return this.parseCompleteIdea(content)
    } catch (error) {
      console.error('Error generando idea completa:', error)
      console.log('🔄 Fallback a idea simulada')
      return this.getMockCompleteIdea(ideaPrompt)
    }
  }

  private buildCompleteIdeaPrompt(ideaPrompt: string, userProfile?: string): string {
    return `
DESARROLLA UNA BITÁCORA COMPLETA DE OPORTUNIDAD basada en esta idea inicial:

💡 IDEA INICIAL: "${ideaPrompt}"

${userProfile ? `👤 PERFIL DEL EMPRENDEDOR: ${userProfile}` : ''}

═══════════════════════════════════════════════════════════════════
🎯 DESARROLLO COMPLETO REQUERIDO - 6 PASOS
═══════════════════════════════════════════════════════════════════

⚠️ INSTRUCCIONES CRÍTICAS DE LONGITUD:
- TODOS los campos de texto deben tener MÍNIMO 400 caracteres
- NO generes texto corto. EXTIENDE cada respuesta con detalles, ejemplos, cifras y análisis profundo
- Incluye datos específicos, números, porcentajes, y referencias concretas
- Desarrolla cada idea completamente con contexto exhaustivo

Desarrolla COMPLETAMENTE cada paso con información realista y específica:

**PASO 1 - MEDIOS PERSONALES (Bird-in-Hand):**
Crea un perfil realista del emprendedor ideal para esta oportunidad:
• Identidad profesional específica (background, experiencia, estudios)
• Conocimientos técnicos y skills relevantes (específicos para la idea)
• Red de contactos relevantes (industria, roles, influencia)
• Recursos materiales disponibles (financieros, técnicos, físicos)

**PASO 2 - PROBLEMA/NECESIDAD (Affordable Loss):**
Define el problema que resuelve la idea:
• Título específico del problema (conciso pero descriptivo)
• Descripción detallada del problema (manifestaciones, frecuencia, impacto)
• Población afectada (segmentos específicos, tamaño, características)
• Relevancia económica/social (impacto cuantificado, tendencias)
• Conexión con medios del equipo (por qué este equipo puede resolverlo)

**PASO 3 - TENDENCIAS (Crazy Quilt):**
Identifica 3-5 tendencias relevantes que apoyan la oportunidad (genera múltiples tendencias en el array step3):
• Nombre de la tendencia
• Tipo (Social/Tecnológica/Ambiental/Cultural/Consumo)
• Descripción breve pero específica
• Ejemplo concreto de la tendencia en acción
• Fuente académica o de autoridad (formato APA)
• Comentario sobre cómo beneficia la oportunidad

**PASO 4 - EVALUACIÓN SWOT (Lemonade):**
Análisis realista de:
• 4-5 Fortalezas específicas del proyecto/equipo
• 4-5 Debilidades críticas a abordar
• 4-5 Oportunidades de mercado concretas
• 4-5 Amenazas y riesgos reales

**PASO 5A - BUYER PERSONA (Pilot-in-the-Plane):**
Crea un buyer persona específico y realista:
• Nombre y edad específicos
• Ocupación detallada (incluir segmento de mercado e ingresos en este campo)
• Motivaciones principales (3-4 específicas)
• Pain points principales (3-4 específicos)
• Necesidades clave (3-4 específicas)

**PASO 5B - PROPUESTA DE VALOR (Pilot-in-the-Plane):**
Canvas de propuesta de valor completo:
• Trabajos del cliente (jobs-to-be-done específicos)
• Dolores del cliente (pain points detallados)
• Ganancias esperadas (gains específicos)
• Productos/servicios ofrecidos (descripción detallada)
• Aliviadores de dolor (cómo resuelve cada pain point)
• Generadores de ganancia (cómo crea valor específico)

═══════════════════════════════════════════════════════════════════
📋 REQUERIMIENTOS DE CALIDAD
═══════════════════════════════════════════════════════════════════

✅ REALISMO: Todo debe ser factible y realista
✅ ESPECIFICIDAD: Evita generalidades, sé específico
✅ COHERENCIA: Todos los pasos deben estar interconectados
✅ ACTIONABLE: La información debe ser utilizable
✅ CUANTIFICACIÓN: Incluye números donde sea posible
✅ METODOLOGÍA EFECTUAL: Refleja los 5 principios

Responde ÚNICAMENTE en formato JSON con esta estructura EXACTA:

{
  "idea": {
    "title": "Título conciso de la oportunidad",
    "description": "Descripción detallada de 2-3 párrafos",
    "target_market": "Mercado objetivo específico",
    "unique_value": "Propuesta de valor única"
  },
  "step1": {
    "who_i_am": "TEXTO EXTENSO OBLIGATORIO - Mínimo 400 caracteres: Identidad profesional completa con background detallado, experiencia laboral específica (empresas, roles, años), educación formal e informal, certificaciones relevantes, habilidades técnicas y blandas desarrolladas, logros profesionales cuantificados, experiencias emprendedoras previas, motivaciones personales profundas, pasiones que impulsan el proyecto, valores profesionales, red de mentores, y características de personalidad que favorecen el emprendimiento. Incluir ejemplos específicos y cronología.",
    "what_i_know": "TEXTO EXTENSO OBLIGATORIO - Mínimo 400 caracteres: Conocimientos técnicos específicos y especializados incluyendo: tecnologías dominadas con años de experiencia, metodologías aplicadas en proyectos reales, certificaciones profesionales obtenidas, competencias desarrolladas en industrias relevantes, conocimiento del mercado objetivo, experiencia en desarrollo de productos similares, habilidades en marketing digital, ventas, operaciones, finanzas, experiencia regulatoria, conocimiento de tendencias del sector, y expertise único que diferencia al equipo de la competencia.",
    "who_i_know": "TEXTO EXTENSO OBLIGATORIO - Mínimo 400 caracteres: Red de contactos profesionales específica incluyendo: mentores con experiencia en la industria (nombres, roles, influencia), socios potenciales estratégicos, clientes pioneros identificados, proveedores clave con relaciones establecidas, inversores o fondos con interés en el sector, expertos técnicos consultores, influencers del mercado, profesionales de servicios (legales, contables, marketing), autoridades regulatorias, y contactos internacionales. Especificar el valor específico que cada contacto aporta al proyecto.",
    "what_i_have": "TEXTO EXTENSO OBLIGATORIO - Mínimo 400 caracteres: Recursos tangibles e intangibles disponibles incluyendo: capital inicial específico (monto exacto), equipamiento técnico detallado, software y licencias, oficinas o espacios de trabajo, vehículos, inventario inicial, ahorros personales destinados al proyecto, activos que pueden monetizarse, tiempo dedicado semanalmente, infraestructura tecnológica, bases de datos existentes, propiedad intelectual, marcas registradas, contratos preexistentes, y recursos familiares o personales que pueden apalancarse para el proyecto."
  },
  "step2": {
    "title": "Título específico del problema",
    "description": "TEXTO EXTENSO OBLIGATORIO - Mínimo 400 caracteres: Descripción exhaustiva del problema incluyendo contexto histórico, causas raíz, manifestaciones actuales, frecuencia de ocurrencia, gravedad del impacto, consecuencias a corto y largo plazo, ejemplos específicos de casos reales, datos estadísticos relevantes, y cómo afecta la vida diaria de las personas. Incluir números, porcentajes y referencias específicas.",
    "affected": "TEXTO EXTENSO OBLIGATORIO - Mínimo 400 caracteres: Población afectada con análisis demográfico completo incluyendo: rangos de edad específicos, distribución geográfica (países, regiones, ciudades), nivel socioeconómico, educación, profesión, ingresos promedio, tamaño exacto del mercado potencial, segmentación por características psicográficas, comportamientos de consumo, preferencias tecnológicas, y datos estadísticos de censos o estudios de mercado. Incluir cifras exactas y fuentes.",
    "relevance": "TEXTO EXTENSO OBLIGATORIO - Mínimo 400 caracteres: Relevancia económica y social cuantificada con análisis detallado del impacto financiero actual, costos anuales del problema a nivel individual y social, pérdidas económicas estimadas, oportunidad de mercado valorizada en cifras específicas, beneficios sociales potenciales, ROI proyectado, análisis de costo-beneficio, comparación con soluciones existentes, datos de investigaciones académicas o informes de consultoría, y proyecciones de crecimiento del mercado.",
    "link_to_means": "TEXTO EXTENSO OBLIGATORIO - Mínimo 400 caracteres: Conexión específica y detallada entre CADA uno de los medios del equipo y la solución del problema. Explicar cómo los conocimientos técnicos específicos se aplican, qué contactos clave facilitarán el desarrollo y distribución, cómo los recursos financieros y materiales se utilizarán eficientemente, experiencias previas relevantes del equipo, ventajas competitivas únicas, sinergias entre recursos disponibles, y plan específico de implementación utilizando los medios identificados."
  },
  "step3": [
    {
      "name": "Nombre de tendencia 1",
      "type": "Social|Tecnológica|Ambiental|Cultural|Consumo",
      "brief": "Descripción específica de la tendencia 1",
      "example": "Ejemplo concreto de la tendencia 1",
      "source_apa": "Fuente APA de tendencia 1",
      "comment": "Cómo beneficia la oportunidad"
    },
    {
      "name": "Nombre de tendencia 2", 
      "type": "Social|Tecnológica|Ambiental|Cultural|Consumo",
      "brief": "Descripción específica de la tendencia 2",
      "example": "Ejemplo concreto de la tendencia 2",
      "source_apa": "Fuente APA de tendencia 2", 
      "comment": "Cómo beneficia la oportunidad"
    },
    {
      "name": "Nombre de tendencia 3",
      "type": "Social|Tecnológica|Ambiental|Cultural|Consumo", 
      "brief": "Descripción específica de la tendencia 3",
      "example": "Ejemplo concreto de la tendencia 3",
      "source_apa": "Fuente APA de tendencia 3",
      "comment": "Cómo beneficia la oportunidad"
    }
  ],
  "step4": {
    "strengths": ["fortaleza 1 específica", "fortaleza 2", "fortaleza 3", "fortaleza 4"],
    "weaknesses": ["debilidad 1 específica", "debilidad 2", "debilidad 3", "debilidad 4"],
    "opportunities": ["oportunidad 1 específica", "oportunidad 2", "oportunidad 3", "oportunidad 4"],
    "threats": ["amenaza 1 específica", "amenaza 2", "amenaza 3", "amenaza 4"]
  },
  "step5Buyer": {
    "name": "Nombre específico",
    "age": número,
    "occupation": "Ocupación específica, segmento de mercado e ingresos",
    "motivations": "Motivaciones principales detalladas",
    "pains": "Pain points específicos detallados",
    "needs": "Necesidades clave específicas"
  },
  "step5VP": {
    "customer_jobs": "Jobs-to-be-done específicos del cliente",
    "customer_pains": "Dolores específicos del cliente",
    "customer_gains": "Ganancias esperadas específicas",
    "products_services": "Productos/servicios ofrecidos detallados",
    "pain_relievers": "Cómo alivia cada dolor específico",
    "gain_creators": "Cómo genera valor específico"
  }
}
`
  }

  private parseCompleteIdea(content: string): CompleteIdeaData {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No se encontró JSON válido en la respuesta')
      }

      const parsed = JSON.parse(jsonMatch[0])
      
      // Validar estructura básica
      return {
        idea: {
          title: parsed.idea?.title || 'Oportunidad Generada por IA',
          description: parsed.idea?.description || 'Descripción no disponible',
          target_market: parsed.idea?.target_market || 'Mercado no especificado',
          unique_value: parsed.idea?.unique_value || 'Valor único no definido'
        },
        step1: {
          who_i_am: parsed.step1?.who_i_am || 'Perfil profesional no definido',
          what_i_know: parsed.step1?.what_i_know || 'Conocimientos no especificados',
          who_i_know: parsed.step1?.who_i_know || 'Red de contactos no definida',
          what_i_have: parsed.step1?.what_i_have || 'Recursos no especificados'
        },
        step2: {
          title: parsed.step2?.title || 'Problema no definido',
          description: parsed.step2?.description || 'Descripción del problema no disponible',
          affected: parsed.step2?.affected || 'Población afectada no especificada',
          relevance: parsed.step2?.relevance || 'Relevancia no definida',
          link_to_means: parsed.step2?.link_to_means || 'Conexión con medios no establecida'
        },
        step3: Array.isArray(parsed.step3) ? parsed.step3.map((trend: any) => ({
          name: trend.name || 'Tendencia sin nombre',
          type: ['Social', 'Tecnológica', 'Económica', 'Ambiental', 'Política'].includes(trend.type) 
            ? trend.type : 'Social',
          brief: trend.brief || 'Descripción no disponible',
          example: trend.example || 'Ejemplo no proporcionado',
          source_apa: trend.source_apa || 'Fuente no citada',
          comment: trend.comment || 'Comentario no disponible'
        })) : [],
        step4: {
          strengths: Array.isArray(parsed.step4?.strengths) ? parsed.step4.strengths : [],
          weaknesses: Array.isArray(parsed.step4?.weaknesses) ? parsed.step4.weaknesses : [],
          opportunities: Array.isArray(parsed.step4?.opportunities) ? parsed.step4.opportunities : [],
          threats: Array.isArray(parsed.step4?.threats) ? parsed.step4.threats : []
        },
        step5Buyer: {
          name: parsed.step5Buyer?.name || 'Persona no definida',
          age: typeof parsed.step5Buyer?.age === 'number' ? parsed.step5Buyer.age : 30,
          occupation: parsed.step5Buyer?.occupation || 'Ocupación no especificada',
          segment: parsed.step5Buyer?.segment || 'Segmento no definido',
          income: parsed.step5Buyer?.income || 'Ingresos no especificados',
          motivations: parsed.step5Buyer?.motivations || 'Motivaciones no definidas',
          pains: parsed.step5Buyer?.pains || 'Pain points no identificados',
          needs: parsed.step5Buyer?.needs || 'Necesidades no especificadas'
        },
        step5VP: {
          customer_jobs: parsed.step5VP?.customer_jobs || 'Jobs no definidos',
          customer_pains: parsed.step5VP?.customer_pains || 'Dolores no identificados',
          customer_gains: parsed.step5VP?.customer_gains || 'Ganancias no especificadas',
          products_services: parsed.step5VP?.products_services || 'Productos/servicios no definidos',
          pain_relievers: parsed.step5VP?.pain_relievers || 'Aliviadores no especificados',
          gain_creators: parsed.step5VP?.gain_creators || 'Generadores de valor no definidos'
        }
      }
    } catch (error) {
      console.error('Error parseando idea completa:', error)
      throw new Error('Error al procesar la idea generada')
    }
  }

  private getMockCompleteIdea(ideaPrompt: string): CompleteIdeaData {
    return {
      idea: {
        title: "EcoScore - App de Impacto Ambiental de Productos",
        description: "Aplicación móvil que permite a los consumidores escanear códigos de barras de productos para obtener una puntuación de impacto ambiental basada en criterios como huella de carbono, sostenibilidad del packaging, prácticas laborales y origen de materiales. La app utilizará una base de datos colaborativa y APIs de certificadoras ambientales para proporcionar información verificada y actualizada.",
        target_market: "Consumidores conscientes del medio ambiente, millennials y Gen Z, con ingresos medios-altos",
        unique_value: "Primera app que combina múltiples métricas ambientales en una sola puntuación fácil de entender"
      },
      step1: {
        who_i_am: "Soy un ingeniero en sistemas con 8 años de experiencia en desarrollo de aplicaciones móviles y APIs. Tengo una maestría en Desarrollo Sostenible y he trabajado en 3 startups de tecnología verde. Mi experiencia incluye desarrollo en React Native, integración de APIs de terceros, y diseño de bases de datos escalables. He liderado equipos de 5-8 desarrolladores y tengo experiencia en metodologías ágiles.",
        what_i_know: "Domino desarrollo móvil multiplataforma (React Native, Flutter), arquitecturas de microservicios, bases de datos NoSQL, integración de APIs RESTful, y metodologías de certificación ambiental (ISO 14001, Carbon Trust). Tengo conocimientos sólidos en UX/UI design, analytics móviles, y estrategias de monetización freemium. También manejo marketing digital, SEO móvil, y he estudiado comportamiento del consumidor sostenible.",
        who_i_know: "Mi red incluye desarrolladores senior en Apple y Google, fundadores de 4 startups exitosas de tecnología verde, contactos en ONG ambientales como Greenpeace y WWF, ejecutivos en retail sostenible (Patagonia, Whole Foods), investigadores en universidades especializados en impacto ambiental, y inversores angel especializados en climate tech con portfolios de $50M+.",
        what_i_have: "Tengo $45K en ahorros personales, acceso a un equipo de desarrollo freelance de confianza (3 personas), licencias de software de desarrollo profesional, una MacBook Pro M2 y iPhone 14 Pro para testing, suscripciones a bases de datos ambientales premium, y un apartamento con oficina home equipada. También tengo acceso a créditos de AWS por $10K y conexiones para obtener datos de certificadoras."
      },
      step2: {
        title: "Falta de transparencia en el impacto ambiental de productos de consumo masivo",
        description: "Los consumidores enfrentan una información fragmentada y poco confiable sobre el impacto ambiental real de los productos que compran. Las etiquetas actuales son confusas, incompletas o inexistentes, y no existe un estándar unificado para evaluar el impacto total. Esto resulta en decisiones de compra basadas en greenwashing o información parcial. El 73% de consumidores globales pagarían más por productos sostenibles, pero solo el 23% confía en las afirmaciones ambientales de las marcas.",
        affected: "Principalmente afecta a consumidores conscientes del medio ambiente (estimados en 2.1 billones globalmente), especialmente millennials (72% priorizan sostenibilidad) y Gen Z (83% considera impacto ambiental en decisiones de compra). También impacta a retailers que buscan diferenciación sostenible, marcas que invierten en sostenibilidad sin comunicarla efectivamente, y certificadoras ambientales que luchan por alcanzar al consumidor final. El mercado de productos sostenibles, valorado en $150B anuales, sufre de asimetría informacional.",
        relevance: "El problema tiene un impacto económico de $2.3 trillones anuales en decisiones de compra subóptimas y greenwashing. La falta de transparencia genera desconfianza del consumidor (67% considera que las marcas exageran sus credenciales verdes) y ralentiza la transición hacia una economía circular. Regulaciones emergentes como la EU Taxonomy y Carbon Border Adjustments incrementan la presión por transparencia. El mercado de verificación ambiental crece 23% anual, indicando demanda latente de soluciones confiables.",
        link_to_means: "Mi background en tecnología verde y desarrollo móvil me posiciona únicamente para abordar este problema técnico complejo. Mis contactos en certificadoras ambientales proporcionan acceso privilegiado a datos verificados, mientras que mi red en retail sostenible facilita partnerships para distribución. Mi experiencia en UX/UI es crucial para simplificar información compleja en interfaces intuitivas. Los recursos técnicos disponibles permiten desarrollar el MVP sin inversión externa significativa, y mi conocimiento en monetización digital asegura un modelo de negocio sostenible."
      },
      step3: [
        {
          name: "Crecimiento exponencial de la conciencia ambiental del consumidor",
          type: "Social",
          brief: "Los consumidores, especialmente millennials y Gen Z, están priorizando cada vez más el impacto ambiental en sus decisiones de compra, impulsando la demanda de transparencia.",
          example: "Las búsquedas de 'productos sostenibles' en Google aumentaron 130% en 2023, y el 67% de consumidores pagarían hasta 15% más por productos verificados como sostenibles.",
          source_apa: "Nielsen Global Corporate Sustainability Report. (2023). Consumer sentiment on sustainability. Nielsen Holdings.",
          comment: "Esta tendencia crea una base de usuarios altamente motivada y dispuesta a pagar por nuestra solución, validando el market-fit potencial de la aplicación."
        },
        {
          name: "Digitalización de retail y adopción masiva de códigos QR/NFC",
          type: "Tecnológica",
          brief: "La pandemia aceleró la adopción de tecnologías contactless y códigos QR, creando familiaridad del consumidor con el escaneo de productos para información adicional.",
          example: "El uso de códigos QR aumentó 750% durante 2020-2022, y el 45% de consumidores ahora escanea regularmente productos para comparar precios o leer reseñas.",
          source_apa: "Statista Digital Market Insights. (2023). QR code usage statistics and mobile commerce trends. Statista GmbH.",
          comment: "La infraestructura tecnológica y comportamiento del usuario ya están establecidos, reduciendo significativamente las barreras de adopción para nuestra app."
        },
        {
          name: "Regulaciones de transparencia ambiental corporativa",
          type: "Ambiental",
          brief: "Gobiernos globalmente están implementando regulaciones que requieren mayor transparencia en reporting ambiental y verificación de claims de sostenibilidad.",
          example: "La EU Taxonomy (2023) y el California Climate Disclosure Act requieren reporting detallado de impacto ambiental, creando presión regulatoria para transparencia.",
          source_apa: "European Commission. (2023). EU Taxonomy for sustainable activities: Final report. Official Journal of the European Union.",
          comment: "Las regulaciones crean un tailwind regulatorio que presiona a las empresas a ser más transparentes, aumentando el valor de nuestra plataforma de verificación."
        },
        {
          name: "Crecimiento del mercado de certificación y verificación ambiental",
          type: "Consumo",
          brief: "El mercado global de certificación ambiental está creciendo 18% anual, impulsado por demanda corporativa y del consumidor por verificación confiable.",
          example: "Companies como B Corp certificación crecieron 28% en 2023, y el mercado de carbon credits alcanzó $2B, indicando disposición a pagar por verificación ambiental.",
          source_apa: "Grand View Research. (2023). Environmental certification market size and growth analysis. Grand View Research Inc.",
          comment: "El crecimiento del mercado de certificación indica oportunidades de monetización B2B y partnerships lucrativos con certificadoras establecidas."
        },
        {
          name: "Presión de investors ESG y capital sostenible",
          type: "Cultural",
          brief: "Los inversores están aplicando criterios ESG más estrictos, creando presión en empresas para demostrar impacto ambiental real y transparente.",
          example: "Los activos ESG alcanzaron $35 trillones globalmente en 2023, y el 89% de investors considera métricas ambientales en decisiones de inversión.",
          source_apa: "Global Sustainable Investment Alliance. (2023). Global sustainable investment review. GSIA Publications.",
          comment: "La presión de capital ESG crea demanda B2B para herramientas que ayuden a empresas a comunicar y verificar su impacto ambiental de manera creíble."
        }
      ],
      step4: {
        strengths: [
          "Expertise técnico específico en desarrollo móvil y tecnología verde que pocos competidores combinan",
          "Red de contactos privilegiada en certificadoras ambientales que proporcionan acceso a datos verificados",
          "Recursos técnicos y financieros suficientes para desarrollar MVP sin financiación externa",
          "Timing perfecto con convergencia de conciencia ambiental, adopción QR, y presión regulatoria",
          "Modelo de negocio escalable con múltiples streams de revenue (freemium, B2B, partnerships)"
        ],
        weaknesses: [
          "Dependencia inicial de APIs y datos de terceros que podrían cambiar términos o precios",
          "Falta de experiencia en marketing B2C masivo y adquisición de usuarios a escala",
          "Complejidad técnica de integrar múltiples fuentes de datos ambientales de manera confiable",
          "Necesidad de educación del mercado sobre la importancia de verificación ambiental",
          "Riesgo de que grandes players (Amazon, Google) desarrollen funcionalidad similar"
        ],
        opportunities: [
          "Expansión a mercados B2B ayudando retailers a comunicar sostenibilidad de productos",
          "Partnerships con supermercados y e-commerce para integración nativa en apps existentes",
          "Licenciamiento de tecnología a certificadoras ambientales para distribución",
          "Expansión internacional comenzando por mercados regulados (EU, Canada)",
          "Desarrollo de API para que otras apps integren scoring ambiental"
        ],
        threats: [
          "Google o Amazon podrían integrar funcionalidad similar en sus apps dominantes",
          "Certificadoras podrían desarrollar sus propias apps directas al consumidor",
          "Regulaciones podrían cambiar estándares de certificación afectando nuestra base de datos",
          "Economic downturn podría reducir prioridad del consumidor en sostenibilidad",
          "Greenwashing sofisticado podría erosionar confianza del consumidor en verificación digital"
        ]
      },
      step5Buyer: {
        name: "Sofia Martinez",
        age: 32,
        occupation: "Marketing Manager en empresa tech, MBA, madre de 1 hijo con ingresos altos ($75k-$95k anuales), segmento: Millennials urbanos conscientes del medio ambiente",
        motivations: "Quiere tomar decisiones de compra que reflejen sus valores ambientales y dejar un planeta mejor para su hijo. Le importa la autenticidad y verificación de claims ambientales. Busca eficiencia en sus decisiones de compra sin sacrificar conveniencia.",
        pains: "Se siente abrumada por el greenwashing y afirmaciones ambientales contradictorias. No tiene tiempo para investigar cada producto individualmente. Desconfía de las afirmaciones de sostenibilidad de las marcas. Le frustra pagar premium por productos 'verdes' que descubre no son realmente sostenibles.",
        needs: "Información ambiental confiable y verificada accesible instantáneamente. Interface simple que no complique sus compras. Recomendaciones personalizadas basadas en sus valores. Comparación rápida entre productos similares. Educación sobre impacto ambiental sin ser abrumadora."
      },
      step5VP: {
        customer_jobs: "Sofia necesita tomar decisiones de compra rápidas y informadas que alineen con sus valores ambientales, educar a su familia sobre sostenibilidad, y sentirse segura de que está invirtiendo en productos genuinamente sostenibles sin dedicar horas a investigación.",
        customer_pains: "Información ambiental fragmentada y confusa, falta de tiempo para investigar cada producto, desconfianza hacia claims de marketing verde, preocupación por pagar premium por productos que no son realmente sostenibles, y frustración por la falta de estándares claros en el mercado.",
        customer_gains: "Confianza en sus decisiones de compra, ahorro de tiempo en investigación, alineación entre valores y acciones de consumo, educación ambiental accesible, sentimiento de contribución positiva al medio ambiente, y validación social de sus elecciones sostenibles.",
        products_services: "App móvil gratuita con scanner de códigos de barras que proporciona EcoScore instantáneo, base de datos de +1M productos con información verificada, recomendaciones personalizadas, comparador de productos, y contenido educativo sobre sostenibilidad. Versión premium incluye análisis detallado y tracking personal de impacto.",
        pain_relievers: "Información verificada por certificadoras reduce desconfianza, scanner instantáneo elimina tiempo de investigación, scoring simple (1-100) reduce confusión, alertas de greenwashing protegen de marketing engañoso, y comparador side-by-side facilita decisiones entre productos similares.",
        gain_creators: "Dashboard personal muestra impacto ambiental acumulado de compras, badges y achievements gamifican comportamiento sostenible, sharing social permite influenciar red personal, recomendaciones inteligentes descubren productos sostenibles nuevos, y content educativo aumenta conocimiento ambiental."
      }
    }
  }
}