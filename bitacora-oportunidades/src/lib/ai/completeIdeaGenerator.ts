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
    strengths: string
    weaknesses: string
    opportunities: string
    threats: string
    success_factors: string
    risk_mitigation: string
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
  
  // Step 8: Canvas Sostenible
  step8SustainableCanvas: {
    customer_segments: string
    value_propositions: string
    products_services: string
    channels: string
    customer_relationships: string
    revenue_streams: string
    social_benefits: string
    environmental_benefits: string
    key_resources: string
    key_activities: string
    key_partnerships: string
    cost_structure: string
    social_costs: string
    environmental_costs: string
    sustainability_reflection: string
  }
  
  // Step 9: Patrones de Innovación
  step9InnovationPatterns: Array<{
    pattern_name: string
    pattern_description: string
    justification: string
    expected_impact: string
    is_primary: boolean
  }>
  
  // Step 10: Prototipo y MVP
  step10Prototype: {
    name: string
    type: 'concept' | 'wireframe' | 'mockup' | 'mvp' | 'physical' | 'digital' | 'service'
    description: string
    hypothesis_to_validate: string
    expected_learning_metrics: string
    ai_mvp_suggestion: string
  }
  
  // Step 11: Estrategia de Validación
  step11ValidationStrategy: {
    hypothesis: string
    target_segments: string
    validation_methods: ('interview' | 'survey' | 'landing_page' | 'ab_test' | 'observation' | 'focus_group' | 'prototype_test')[]
    expected_learnings: string
    success_criteria: string
    timeline_weeks: number
    budget_estimate: number
  }
  
  // Step 12: Mapa del Ecosistema
  step12EcosystemActors: Array<{
    actor_name: string
    actor_type: 'financial' | 'academic' | 'business' | 'social' | 'institutional'
    role_description: string
    support_types: ('funding' | 'mentorship' | 'infrastructure' | 'networking' | 'technical' | 'legal' | 'marketing')[]
    benefit_to_venture: string
    benefit_to_actor: string
    relationship_status: string
  }>
  
  // Step 13: Reflexión de Sostenibilidad
  step13SustainabilityReflection: {
    social_impact_balance: string
    sustainability_decisions: string
    scaling_strategy: string
    ai_generated_reflection: string
  }
}

export class CompleteIdeaGenerator {
  private apiKey: string | null

  constructor() {
    // Use the same pattern as the existing openai.ts file
    this.apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || null
    console.log('🔐 API Key length:', this.apiKey?.length || 0)
    console.log('🔐 API Key starts with:', this.apiKey?.substring(0, 10) || 'undefined')
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
      console.log('📝 Prompt length:', this.buildCompleteIdeaPrompt(ideaPrompt, userProfile).length)
      
      // Create timeout promise (2 minutes)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout after 120 seconds')), 120000)
      )
      
      // Create fetch promise
      const fetchPromise = fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `Eres un consultor senior experto en metodología efectual y emprendimiento sostenible con 15+ años de experiencia. Desarrollas análisis exhaustivos y detallados de emprendimientos.

INSTRUCCIONES ESPECÍFICAS:
- Genera contenido extenso, profundo y realista para cada campo
- Incluye datos específicos, porcentajes, cifras de mercado cuando sea posible
- Proporciona análisis cualitativos y cuantitativos detallados
- Los campos de step4 deben ser STRINGS con análisis profundo, NO arrays
- Cada descripción debe ser sustancial y demostrar expertise profesional

Responde ÚNICAMENTE en formato JSON válido.`
            },
            {
              role: 'user',
              content: this.buildCompleteIdeaPrompt(ideaPrompt, userProfile)
            }
          ],
          temperature: 0.7,
          max_tokens: 12000,
        }),
      })
      
      // Race between fetch and timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response

      console.log('📡 Response status:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error details:', errorText)
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      const content = result.choices[0].message.content
      
      console.log('✅ Idea completa generada exitosamente')
      console.log('🔍 Raw AI response length:', content?.length)
      console.log('🔍 Raw AI response preview:', content?.substring(0, 200) + '...')
      
      const parsedData = this.parseCompleteIdea(content)
      
      console.log('🔍 Parsed Step4 data:', parsedData.step4)
      console.log('🔍 Step4 strengths type:', typeof parsedData.step4.strengths, '| Length:', parsedData.step4.strengths?.length)
      console.log('🔍 Parsed Step9InnovationPatterns:', parsedData.step9InnovationPatterns?.length, 'patterns')
      console.log('🔍 Parsed Step12EcosystemActors:', parsedData.step12EcosystemActors?.length, 'actors')
      console.log('🔍 AI generated reflection:', parsedData.step13SustainabilityReflection?.ai_generated_reflection?.substring(0, 100) + '...')
      
      return parsedData
    } catch (error) {
      console.error('❌ Error generando idea completa:', error)
      console.error('🔍 Error details:', error.message)
      console.log('🔄 Fallback a idea simulada')
      return this.getMockCompleteIdea(ideaPrompt)
    }
  }

  private buildCompleteIdeaPrompt(ideaPrompt: string, userProfile?: string): string {
    return `
Como consultor senior en emprendimiento sostenible, desarrolla una bitácora COMPLETA Y DETALLADA para: "${ideaPrompt}"

${userProfile ? `Contexto del emprendedor: ${userProfile}` : ''}

REQUISITOS:
- Análisis profesional detallado para cada campo
- Incluir datos específicos, cifras y métricas cuando sea posible
- Contenido sustancial y específico para cada sección
- 4 tendencias (tipos: "Social", "Tecnológica", "Ambiental", "Cultural", "Consumo")
- 3 patrones de innovación mínimo
- 4 actores del ecosistema mínimo

Responde en JSON con contenido detallado:

{
  "idea": {
    "title": "Título específico del emprendimiento", 
    "description": "Descripción detallada con análisis de mercado y propuesta de valor diferenciada, incluyendo datos específicos de la industria",
    "target_market": "Segmentación específica con tamaños de mercado, demografía y análisis de competencia",
    "unique_value": "Propuesta de valor única con ventajas competitivas sostenibles"
  },
  "step1": {
    "who_i_am": "Perfil profesional completo con experiencia relevante, formación y habilidades técnicas específicas",
    "what_i_know": "Conocimientos específicos del área, industria objetivo, metodologías y herramientas dominadas",
    "who_i_know": "Red de contactos estratégica en la industria con roles específicos y conexiones relevantes",
    "what_i_have": "Recursos disponibles incluyendo capital, activos, tecnología y team potential"
  },
  "step2": {
    "title": "Título específico del problema",
    "description": "Análisis detallado del problema con causas, impacto cuantificado y por qué soluciones actuales son inadecuadas",
    "affected": "Población afectada específica con demografía, tamaño de mercado y características socioeconómicas",
    "relevance": "Relevancia económica con impacto cuantificado y oportunidad de mercado específica",
    "link_to_means": "Conexión con medios personales y ventajas únicas para abordar este problema"
  },
  "step3": [
    {"name": "Tendencia Social", "type": "Social", "brief": "Análisis detallado de tendencia social con drivers y proyecciones", "example": "Ejemplo concreto con datos reales", "source_apa": "Fuente específica APA", "comment": "Relevancia para emprendimiento"},
    {"name": "Tendencia Tecnológica", "type": "Tecnológica", "brief": "Análisis técnico con adoption rates y costos", "example": "Ejemplo con números específicos", "source_apa": "Fuente técnica", "comment": "Ventaja competitiva"},
    {"name": "Tendencia Ambiental", "type": "Ambiental", "brief": "Driver ambiental con regulaciones y financial implications", "example": "Ejemplo con metrics sustainability", "source_apa": "Fuente ambiental", "comment": "Oportunidad de negocio"},
    {"name": "Tendencia Cultural", "type": "Cultural", "brief": "Shift cultural con datos específicos", "example": "Ejemplo con consumer behavior", "source_apa": "Fuente cultural", "comment": "Implicaciones comerciales"}
  ],
  "step4": {
    "strengths": "Análisis detallado de fortalezas estratégicas y ventajas competitivas específicas",
    "weaknesses": "Limitaciones actuales y gaps en recursos o capabilities específicos",
    "opportunities": "Oportunidades de mercado específicas con tamaños cuantificados",
    "threats": "Amenazas competitivas y riesgos específicos del mercado",
    "success_factors": "Factores críticos que determinarán el éxito del venture",
    "risk_mitigation": "Estrategias específicas para mitigar riesgos identificados"
  },
  "step5Buyer": {
    "name": "Nombre del buyer persona",
    "age": 32,
    "occupation": "Ocupación específica con income range y características profesionales",
    "motivations": "Motivaciones profundas y drivers específicos para decisiones",
    "pains": "Pain points específicos y frustraciones con solutions existentes",
    "needs": "Necesidades específicas y outcomes buscados"
  },
  "step5VP": {
    "customer_jobs": "Jobs específicos del customer con análisis funcional y emocional",
    "customer_pains": "Pain points detallados con severity analysis",
    "customer_gains": "Beneficios específicos valorados por el customer",
    "products_services": "Descripción de offerings específicos con features clave",
    "pain_relievers": "Cómo productos alivian customer pains específicos",
    "gain_creators": "Cómo offerings crean value para el customer"
  },
  "step8SustainableCanvas": {
    "customer_segments": "Análisis de segmentos que priorizan sustainability con características específicas",
    "value_propositions": "Value propositions sostenibles con impacto ambiental/social cuantificado",
    "products_services": "Ofertas con features de sustainability específicas",
    "channels": "Canales de distribución alineados con valores sostenibles",
    "customer_relationships": "Estrategias de relación que fomentan engagement sostenible",
    "revenue_streams": "Modelos de ingresos alineados con goals de sostenibilidad",
    "social_benefits": "Impactos sociales específicos cuantificados",
    "environmental_benefits": "Impacto ambiental cuantificado con metrics específicas",
    "key_resources": "Recursos críticos para goals de sostenibilidad",
    "key_activities": "Actividades core que drive business y sustainability",
    "key_partnerships": "Partnerships estratégicas con valores alineados",
    "cost_structure": "Estructura de costos incluyendo true environmental costs",
    "social_costs": "Análisis de potential negative social impacts",
    "environmental_costs": "Costos ambientales de operations con analysis",
    "sustainability_reflection": "Reflexión sobre how business model drives sustainability"
  },
  "step9InnovationPatterns": [
    {"pattern_name": "Patrón Principal", "pattern_description": "Descripción detallada del innovation pattern aplicado", "justification": "Justificación para este pattern específico", "expected_impact": "Impacto proyectado con metrics", "is_primary": true},
    {"pattern_name": "Patrón Secundario", "pattern_description": "Second innovation pattern con implementation", "justification": "Justificación para secondary pattern", "expected_impact": "Impacto esperado con timeline", "is_primary": false},
    {"pattern_name": "Patrón Terciario", "pattern_description": "Supporting pattern con applications", "justification": "Strategic fit y benefits", "expected_impact": "Impacto adicional", "is_primary": false}
  ],
  "step10Prototype": {
    "name": "Nombre del prototipo/MVP",
    "type": "digital",
    "description": "Descripción detallada del prototype con features específicas",
    "hypothesis_to_validate": "Hipótesis específica con assumptions clave",
    "expected_learning_metrics": "KPIs específicos para measure learning",
    "ai_mvp_suggestion": "Recomendación detallada para MVP scope"
  },
  "step11ValidationStrategy": {
    "hypothesis": "Hipótesis de negocio específicas a validar",
    "target_segments": "Customer segments específicos para validation",
    "validation_methods": ["interview", "survey", "prototype_test"],
    "expected_learnings": "Insights específicos buscados",
    "success_criteria": "Métricas cuantificadas de éxito",
    "timeline_weeks": 8,
    "budget_estimate": 15000
  },
  "step12EcosystemActors": [
    {"actor_name": "Actor Financiero", "actor_type": "financial", "role_description": "Análisis del financial actor específico", "support_types": ["funding", "mentorship"], "benefit_to_venture": "Beneficios específicos al venture", "benefit_to_actor": "Value proposition para el actor", "relationship_status": "Estado actual de relación"},
    {"actor_name": "Socio Comercial", "actor_type": "business", "role_description": "Análisis del business partner", "support_types": ["marketing", "infrastructure"], "benefit_to_venture": "Ventajas estratégicas", "benefit_to_actor": "Beneficios para el partner", "relationship_status": "Engagement level actual"},
    {"actor_name": "Institución Académica", "actor_type": "academic", "role_description": "Análisis de academic institution", "support_types": ["technical", "networking"], "benefit_to_venture": "Capabilities de research", "benefit_to_actor": "Oportunidades académicas", "relationship_status": "Nivel de relación"},
    {"actor_name": "Organización Social", "actor_type": "social", "role_description": "Análisis de social organization", "support_types": ["advocacy", "networking"], "benefit_to_venture": "Community access", "benefit_to_actor": "Mission advancement", "relationship_status": "Engagement actual"}
  ],
  "step13SustainabilityReflection": {
    "social_impact_balance": "Análisis comprehensive del net social impact",
    "sustainability_decisions": "Key sustainability decisions en business model",
    "scaling_strategy": "Plan detallado para scale sostenible",
    "ai_generated_reflection": "Evaluación final comprehensiva con synthesis completo"
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
          strengths: parsed.step4?.strengths || 'Fortalezas no especificadas',
          weaknesses: parsed.step4?.weaknesses || 'Debilidades no especificadas',
          opportunities: parsed.step4?.opportunities || 'Oportunidades no especificadas',
          threats: parsed.step4?.threats || 'Amenazas no especificadas',
          success_factors: parsed.step4?.success_factors || 'Factores críticos no especificados',
          risk_mitigation: parsed.step4?.risk_mitigation || 'Mitigación de riesgos no especificada'
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
        },
        step8SustainableCanvas: {
          customer_segments: parsed.step8SustainableCanvas?.customer_segments || 'Segmentos no definidos',
          value_propositions: parsed.step8SustainableCanvas?.value_propositions || 'Propuestas de valor no definidas',
          products_services: parsed.step8SustainableCanvas?.products_services || 'Productos/servicios no definidos',
          channels: parsed.step8SustainableCanvas?.channels || 'Canales no definidos',
          customer_relationships: parsed.step8SustainableCanvas?.customer_relationships || 'Relaciones no definidas',
          revenue_streams: parsed.step8SustainableCanvas?.revenue_streams || 'Ingresos no definidos',
          social_benefits: parsed.step8SustainableCanvas?.social_benefits || 'Beneficios sociales no definidos',
          environmental_benefits: parsed.step8SustainableCanvas?.environmental_benefits || 'Beneficios ambientales no definidos',
          key_resources: parsed.step8SustainableCanvas?.key_resources || 'Recursos clave no definidos',
          key_activities: parsed.step8SustainableCanvas?.key_activities || 'Actividades clave no definidas',
          key_partnerships: parsed.step8SustainableCanvas?.key_partnerships || 'Alianzas clave no definidas',
          cost_structure: parsed.step8SustainableCanvas?.cost_structure || 'Estructura de costos no definida',
          social_costs: parsed.step8SustainableCanvas?.social_costs || 'Costos sociales no definidos',
          environmental_costs: parsed.step8SustainableCanvas?.environmental_costs || 'Costos ambientales no definidos',
          sustainability_reflection: parsed.step8SustainableCanvas?.sustainability_reflection || 'Reflexión de sostenibilidad no definida'
        },
        step9InnovationPatterns: Array.isArray(parsed.step9InnovationPatterns) ? parsed.step9InnovationPatterns.map((pattern: any) => ({
          pattern_name: pattern.pattern_name || 'Patrón sin nombre',
          pattern_description: pattern.pattern_description || 'Descripción no disponible',
          justification: pattern.justification || 'Justificación no proporcionada',
          expected_impact: pattern.expected_impact || 'Impacto no especificado',
          is_primary: Boolean(pattern.is_primary)
        })) : [],
        step10Prototype: {
          name: parsed.step10Prototype?.name || 'Prototipo no definido',
          type: ['concept', 'wireframe', 'mockup', 'mvp', 'physical', 'digital', 'service'].includes(parsed.step10Prototype?.type) 
            ? parsed.step10Prototype.type : 'concept',
          description: parsed.step10Prototype?.description || 'Descripción no disponible',
          hypothesis_to_validate: parsed.step10Prototype?.hypothesis_to_validate || 'Hipótesis no definida',
          expected_learning_metrics: parsed.step10Prototype?.expected_learning_metrics || 'Métricas no especificadas',
          ai_mvp_suggestion: parsed.step10Prototype?.ai_mvp_suggestion || 'Sugerencia de MVP no disponible'
        },
        step11ValidationStrategy: {
          hypothesis: parsed.step11ValidationStrategy?.hypothesis || 'Hipótesis no definida',
          target_segments: parsed.step11ValidationStrategy?.target_segments || 'Segmentos objetivo no especificados',
          validation_methods: Array.isArray(parsed.step11ValidationStrategy?.validation_methods) 
            ? parsed.step11ValidationStrategy.validation_methods 
            : ['interview'],
          expected_learnings: parsed.step11ValidationStrategy?.expected_learnings || 'Aprendizajes no especificados',
          success_criteria: parsed.step11ValidationStrategy?.success_criteria || 'Criterios de éxito no definidos',
          timeline_weeks: typeof parsed.step11ValidationStrategy?.timeline_weeks === 'number' 
            ? parsed.step11ValidationStrategy.timeline_weeks : 4,
          budget_estimate: typeof parsed.step11ValidationStrategy?.budget_estimate === 'number' 
            ? parsed.step11ValidationStrategy.budget_estimate : 1000
        },
        step12EcosystemActors: Array.isArray(parsed.step12EcosystemActors) ? parsed.step12EcosystemActors.map((actor: any) => ({
          actor_name: actor.actor_name || 'Actor sin nombre',
          actor_type: ['financial', 'academic', 'business', 'social', 'institutional'].includes(actor.actor_type) 
            ? actor.actor_type : 'business',
          role_description: actor.role_description || 'Rol no definido',
          support_types: Array.isArray(actor.support_types) ? actor.support_types : ['funding'],
          benefit_to_venture: actor.benefit_to_venture || 'Beneficio al emprendimiento no especificado',
          benefit_to_actor: actor.benefit_to_actor || 'Beneficio al actor no especificado',
          relationship_status: actor.relationship_status || 'Estado de relación no definido'
        })) : [],
        step13SustainabilityReflection: {
          social_impact_balance: parsed.step13SustainabilityReflection?.social_impact_balance || 'Balance de impacto social no definido',
          sustainability_decisions: parsed.step13SustainabilityReflection?.sustainability_decisions || 'Decisiones de sostenibilidad no especificadas',
          scaling_strategy: parsed.step13SustainabilityReflection?.scaling_strategy || 'Estrategia de escalamiento no definida',
          ai_generated_reflection: parsed.step13SustainabilityReflection?.ai_generated_reflection || 'Reflexión de IA no disponible'
        }
      }
    } catch (error) {
      console.error('Error parseando idea completa:', error)
      throw new Error('Error al procesar la idea generada')
    }
  }

  private getMockCompleteIdea(ideaPrompt: string): CompleteIdeaData {
    console.log('📝 Usando mock data porque la IA no funcionó correctamente')
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
        strengths: "Expertise técnico específico en desarrollo móvil y tecnología verde que pocos competidores combinan, con 8+ años de experiencia demostrable en React Native y arquitecturas escalables. Red de contactos privilegiada en certificadoras ambientales (B-Corp, Carbon Trust, ISO 14001) que proporcionan acceso exclusivo a datos verificados y metodologías de evaluación. Recursos técnicos y financieros robustos ($45K capital inicial + acceso a créditos AWS $10K) suficientes para desarrollar MVP completo sin financiación externa, incluyendo infraestructura cloud y equipo de desarrollo freelance confiable. Timing perfecto con convergencia de múltiples trends favorables: conciencia ambiental creciendo 130% anual, adopción masiva de códigos QR post-COVID, presión regulatoria EU Taxonomy y Carbon Border Adjustments. Modelo de negocio escalable validado con múltiples streams de revenue diversificados (freemium $4.99/mes, licensing B2B $0.10/consulta, partnerships 10% fee) que mitigan riesgo de dependencia de una sola fuente de ingresos.",
        weaknesses: "Dependencia inicial de APIs y datos de terceros que podrían cambiar términos o precios. Falta de experiencia en marketing B2C masivo y adquisición de usuarios a escala. Complejidad técnica de integrar múltiples fuentes de datos ambientales de manera confiable. Necesidad de educación del mercado sobre la importancia de verificación ambiental. Riesgo de que grandes players (Amazon, Google) desarrollen funcionalidad similar.",
        opportunities: "Expansión a mercados B2B ayudando retailers a comunicar sostenibilidad de productos. Partnerships con supermercados y e-commerce para integración nativa en apps existentes. Licenciamiento de tecnología a certificadoras ambientales para distribución. Expansión internacional comenzando por mercados regulados (EU, Canada). Desarrollo de API para que otras apps integren scoring ambiental.",
        threats: "Google o Amazon podrían integrar funcionalidad similar en sus apps dominantes. Certificadoras podrían desarrollar sus propias apps directas al consumidor. Regulaciones podrían cambiar estándares de certificación afectando nuestra base de datos. Economic downturn podría reducir prioridad del consumidor en sostenibilidad. Greenwashing sofisticado podría erosionar confianza del consumidor en verificación digital.",
        success_factors: "Acceso privilegiado a datos verificados de certificadoras ambientales. Partnerships estratégicos con retailers y e-commerce para distribución. UI/UX excepcional que simplifique información compleja. Timing correcto con convergencia de trends favorables. Modelo freemium que genere adoption masiva antes de monetizar.",
        risk_mitigation: "Diversificación de fuentes de datos para reducir dependencia de APIs específicas. Desarrollo de relaciones directas con certificadoras para asegurar acceso a largo plazo. Focus en mercados B2B enterprise para reducir riesgo de competencia de Big Tech. Construcción de moats mediante network effects y data exclusiva."
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
      },
      step8SustainableCanvas: {
        customer_segments: "Consumidores eco-conscientes urbanos de 25-45 años con ingresos medios-altos, padres jóvenes preocupados por el futuro, millennials y Gen Z que priorizan sostenibilidad, y early adopters de tecnología verde interesados en transparencia ambiental.",
        value_propositions: "Transparencia instantánea sobre impacto ambiental de productos mediante scoring verificado, educación ambiental accesible que empodera decisiones sostenibles, y herramientas para tracking personal del impacto ambiental positivo.",
        products_services: "App móvil freemium con scanner QR/código de barras, base de datos colaborativa de productos verificados, API para retailers, dashboards de impacto personal, content educativo, y servicios de consultoría B2B para transparencia ambiental.",
        channels: "App stores móviles, partnerships con retailers sostenibles, marketing de influencers eco-conscientes, eventos de sostenibilidad, colaboraciones con ONGs ambientales, y distribution a través de certificadoras partner.",
        customer_relationships: "Comunidad gamificada de usuarios sostenibles, soporte personalizado vía chat, contenido educativo regular, newsletters con tips ambientales, y programas de rewards por comportamiento sostenible.",
        revenue_streams: "Freemium app con premium subscriptions ($4.99/mes), licensing de API a retailers ($0.10 por consulta), partnerships revenue con certificadoras (10% fee), y servicios de consulting B2B ($5K-$50K por proyecto).",
        social_benefits: "Educación masiva sobre sostenibilidad que accelera adoption de productos verdes, empoderamiento del consumidor para tomar decisiones informadas, y pressión social positiva para que empresas mejoren transparencia ambiental.",
        environmental_benefits: "Reducción agregada de footprint ambiental a través de mejor consumer choice, incentivos de mercado para empresas sostenibles, y data collection que identifica productos más problemáticos ambientalmente para targeted improvements.",
        key_resources: "Base de datos proprietaria de productos verificados, relationships exclusivas con certificadoras ambientales, algoritmos de scoring ambiental, equipo técnico especializado, y intellectual property en metodología de verificación.",
        key_activities: "Continuous data collection y verification de productos, desarrollo de algoritmos de scoring, partnerships development con retailers y certificadoras, community building, y product development para nuevas features.",
        key_partnerships: "Certificadoras ambientales (B-Corp, Carbon Trust), retailers sostenibles (Whole Foods, Patagonia), ONGs ambientales para credibilidad, universidades para research, e inversores ESG para funding y network.",
        cost_structure: "Development team salaries (40%), data acquisition y verification costs (25%), marketing y customer acquisition (20%), infraestructura cloud y APIs (10%), y legal/compliance costs (5%).",
        social_costs: "Potential job displacement en industrias menos sostenibles, exclusión digital de usuarios sin smartphones, y posible eco-anxiety incrementado por awareness de impacto ambiental negativo de productos.",
        environmental_costs: "Footprint de infraestructura digital y servers, lifecycle impact de increased smartphone usage, y potential for increased consumption driven by 'green' marketing si no es usado responsablemente.",
        sustainability_reflection: "El modelo prioriza impact measurement y transparency como core values. Scaling strategy incluye carbon neutrality certificada, reinvestment de profits en environmental projects, y governance structure que incluye stakeholders ambientales en decision making para mantener mission alignment durante growth."
      },
      step9InnovationPatterns: [
        {
          pattern_name: "Democratización del Acceso a Información",
          pattern_description: "Hacer accesible a consumidores masivos información especializada que antes solo estaba disponible para expertos o empresas, utilizando interfaces simples y tecnología móvil ubicua.",
          justification: "La información sobre impacto ambiental está fragmentada en múltiples fuentes técnicas. Este patrón permite que cualquier consumidor acceda instantáneamente a evaluaciones ambientales complejas mediante un simple scan.",
          expected_impact: "Transformación del mercado hacia mayor transparencia, presión competitiva para mejora ambiental, y empoderamiento del consumidor para decisiones sostenibles informadas.",
          is_primary: true
        },
        {
          pattern_name: "Gamificación para Cambio de Comportamiento",
          pattern_description: "Uso de mecánicas de juego (scores, badges, leaderboards) para motivar y sostener comportamientos pro-ambientales a largo plazo en decisiones de consumo cotidiano.",
          justification: "El cambio de comportamiento sostenible requiere motivación continua. La gamificación hace que las decisiones ambientales sean rewarding y socialmente visible, creando hábitos positivos.",
          expected_impact: "Adoption rates más altas, retention mejorada, y network effects mediante sharing social de achievements ambientales, amplificando el impacto individual.",
          is_primary: false
        },
        {
          pattern_name: "Plataforma de Dos Lados (Two-Sided Market)",
          pattern_description: "Conectar consumidores que buscan productos sostenibles con empresas que necesitan comunicar su impacto ambiental, creando value para ambos lados del mercado.",
          justification: "Existe asimetría informacional: consumidores no pueden evaluar fácilmente sustainability, y empresas sostenibles luchan por diferenciarse. La plataforma resuelve ambos problemas simultáneamente.",
          expected_impact: "Network effects que fortalecen la plataforma, revenue diversificado de múltiples streams, y creation de nuevo mercado para transparency-as-a-service.",
          is_primary: false
        }
      ],
      step10Prototype: {
        name: "EcoScore MVP Scanner",
        type: "digital",
        description: "App móvil minimalista que permite escanear códigos de barras y obtener un score ambiental simple (1-100) con explicación básica. Incluye funcionalidad de búsqueda manual, favoritos, y sharing social. Backend conectado a 3 certificadoras ambientales para validation inicial de ~1000 productos comunes en supermercados.",
        hypothesis_to_validate: "Los consumidores cambiarán sus decisiones de compra cuando tengan acceso fácil e instantáneo a scoring ambiental verificado de productos durante su shopping experience normal.",
        expected_learning_metrics: "Frequency de uso por usuario/semana, percentage de scans que resultan en purchase decision change, time spent in app por session, y willingness to pay for premium features medido via surveys post-uso.",
        ai_mvp_suggestion: "Comenzar con categoría específica (productos de limpieza) donde impact ambiental es más obvio y consumer awareness mayor. Usar partnership con una sola certificadora respetada para credibilidad inicial. Focus en UX ultra-simple: scan -> score -> brief explanation. Medir todas las interactions para optimizar conversion."
      },
      step11ValidationStrategy: {
        hypothesis: "Los consumidores eco-conscientes cambiarán sus patrones de compra cuando tengan acceso instantáneo a scoring ambiental verificado durante su proceso normal de shopping, y estarán dispuestos a pagar por features premium que les ayuden a maximizar su impacto positivo.",
        target_segments: "Millennials urbanos de ingresos medios-altos (25-40 años) con children que priorizan sostenibilidad, early adopters de apps de lifestyle que ya usan apps como HappyCow o Think Dirty, y households que ya compran products orgánicos/sostenibles regularmente.",
        validation_methods: ["prototype_test", "interview", "survey", "observation"],
        expected_learnings: "Validation de product-market fit mediante usage metrics, identificación de features más valorados por users, understanding de willingness to pay y price sensitivity, behavioral patterns de uso real vs. stated preferences, y feedback sobre accuracy y credibilidad del scoring system.",
        success_criteria: "70%+ de test users usan la app al menos 2x por semana durante grocery shopping, 40%+ reportan haber cambiado al menos una purchasing decision basada en app recommendations, 60%+ consideran el scoring system trustworthy y accurate, y 25%+ expresan willingness to pay $2.99-$4.99/mes por premium features.",
        timeline_weeks: 8,
        budget_estimate: 15000
      },
      step12EcosystemActors: [
        {
          actor_name: "B-Corporation Certification",
          actor_type: "institutional",
          role_description: "Organización global que certifica empresas que cumplen standards rigurosos de performance social y ambiental. Proporcionan framework de assessment y credibilidad institucional para consumer-facing sustainability claims.",
          support_types: ["technical", "networking"],
          benefit_to_venture: "Acceso a database de companies certificadas, credibilidad through association, technical expertise en sustainability metrics, y potential endorsement que aumenta consumer trust en nuestra platform.",
          benefit_to_actor: "Increased visibility de B-Corps certificadas hacia consumers, nueva channel para communicar impact de companies certificadas, y data insights sobre consumer preferences que pueden inform future certification criteria.",
          relationship_status: "Preliminary discussions initiated. Positive response to partnership concept. Need to develop formal proposal para data access y co-marketing opportunities."
        },
        {
          actor_name: "Whole Foods Market",
          actor_type: "business",
          role_description: "Retailer líder en productos naturales y orgánicos con strong brand association con sustainability y conscious consumption. Target demographic alineado perfecto con nuestro user base.",
          support_types: ["marketing", "infrastructure"],
          benefit_to_venture: "Distribution channel para customer acquisition, validation through partnership con trusted brand, potential integration en shopping app, y access a customer base ya committed a sustainable shopping.",
          benefit_to_actor: "Differentiation de competitors through innovative sustainability features, enhanced customer engagement y loyalty, data insights sobre customer preferences, y positioning como innovation leader en retail sustainability.",
          relationship_status: "Target for outreach. Research indicates innovation team activo en sustainability tech partnerships. Plan initial meeting través de existing network contacts en retail sustainability space."
        },
        {
          actor_name: "Climate Tech VC Fund (Breakthrough Energy Ventures)",
          actor_type: "financial",
          role_description: "Venture capital fund específicamente focused en climate solutions con track record de successful exits en consumer climate tech. Portfolio incluye companies con similar mission-driven approach.",
          support_types: ["funding", "mentorship", "networking"],
          benefit_to_venture: "Series A funding potential ($2M-$5M), access a portfolio de climate tech companies para partnerships, strategic guidance en scaling climate solutions, y credibility que facilita future fundraising rounds.",
          benefit_to_actor: "Investment opportunity en high-growth consumer climate tech con clear path to profitability, potential portfolio synergies con existing investments, y diversification dentro de consumer-facing climate solutions segment.",
          relationship_status: "Research phase completed. Fund thesis alignment confirmed. Plan warm introduction através de existing portfolio company founder durante Q2 para initial pitch meeting."
        },
        {
          actor_name: "Environmental Defense Fund (EDF)",
          actor_type: "social",
          role_description: "Leading environmental advocacy organization con expertise en market-based environmental solutions y strong reputation entre consumers y corporations para trusted environmental guidance.",
          support_types: ["mentorship", "technical", "marketing"],
          benefit_to_venture: "Scientific credibility para methodology validation, potential endorsement que builds consumer trust, access a research sobre consumer behavior ambiental, y guidance en environmental impact measurement best practices.",
          benefit_to_actor: "Amplification de environmental education mission através de consumer technology, new channel para reaching younger demographics, data insights sobre consumer environmental preferences para policy advocacy, y demonstration de innovative approaches to environmental awareness.",
          relationship_status: "Initial contact established através de conference networking. Expressed interest en reviewing our environmental methodology. Scheduled follow-up meeting to explore formal advisory relationship."
        }
      ],
      step13SustainabilityReflection: {
        social_impact_balance: "El venture create value social através de education y empowerment, pero debe carefully balance accessibility con exclusivity. Pricing strategy debe ensure que tools no estén available solo para high-income consumers. Plan incluye free tier robusto, partnerships con community organizations, y eventual expansion a mercados emerging para democratizar access a environmental information globally.",
        sustainability_decisions: "Core business model alineado con environmental mission: revenue streams incentivan behavior positivo, no dependency en advertising que podría create perverse incentives, y governance structure que protege mission durante scaling. Key decisions include: carbon neutrality commitment desde día 1, sustainable office practices, remote-first team para reduce commuting impact, y commitment para reinvest 15% de profits en environmental restoration projects.",
        scaling_strategy: "Scaling approach priori impact preservation: international expansion comenzará con markets que tienen similar regulatory frameworks y consumer awareness (Canada, EU), partnerships strategy foca en organizations con aligned values en lugar de pure revenue maximization, y technology development mantendrá open-source components para enable industry-wide improvement en sustainability measurement.",
        ai_generated_reflection: "EVALUACIÓN FINAL IA (Pilot-in-the-Plane): Este emprendimiento presenta alta viabilidad debido a convergencia de trends favorables (consumer awareness, regulatory pressure, technology readiness), unique competitive position através de partnerships con certificadoras, y scalable business model con multiple revenue streams. Riesgos críticos incluyen dependency en third-party data sources y potential competition de tech giants, mitigados através de exclusive partnerships y focus en trust/credibility. Próximos pasos sugeridos: 1) Secure initial partnership con certificadora respetada para data access, 2) Develop MVP con 1000+ productos en categoría focused, 3) Run validation study con 100+ target users durante 8 semanas, 4) Prepare Series A materials focusing en market size y social impact metrics para climate tech investors. Success probability estimada: 75% para achieving product-market fit, 60% para scaling sustainably while maintaining mission alignment."
      }
    }
  }
}