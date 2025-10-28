interface AnalysisData {
  journal: any
  team: any
  step1: any[]
  step2: any
  step3: any[]
  step4: any[]
  step5Buyer: any
  step5VP: any
}

interface AnalysisResult {
  overallAssessment: string
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  recommendations: string[]
  riskAssessment: string
  nextSteps: string[]
  viabilityScore: number
}

export class AIAnalysisService {
  private apiKey: string | null

  constructor() {
    // In production, this should come from environment variables
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || null
  }

  async analyzeJournal(data: AnalysisData): Promise<AnalysisResult> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = this.buildAnalysisPrompt(data)

    try {
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
              content: `Eres un consultor senior en emprendimiento con PhD en Administración de Empresas y 20+ años de experiencia. Especialista en metodología efectual, análisis de mercado, estrategia empresarial y evaluación de riesgos.

Tu misión es realizar un análisis EXHAUSTIVO y CRÍTICO de la bitácora de oportunidades. Debes ser:

🔍 ANALÍTICO: Examina cada elemento con lupa, identifica patrones, inconsistencias y conexiones no obvias
📊 CUANTITATIVO: Proporciona métricas específicas, porcentajes, rangos y datos concretos cuando sea posible  
🎯 ESTRATÉGICO: Piensa como un inversor evaluando si financiar este proyecto
⚠️ CRÍTICO: No tengas miedo de señalar debilidades graves o riesgos altos
💡 CONSTRUCTIVO: Por cada problema identificado, ofrece 2-3 soluciones específicas
🚀 VISIONARIO: Identifica oportunidades de escalabilidad y crecimiento que el equipo no ve

Evalúa con la mentalidad de: "¿Invertiría mi propio dinero en esto? ¿Qué haría falta para que sea un éxito rotundo?"`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 4000,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const result = await response.json()
      const analysis = result.choices[0].message.content

      return this.parseAnalysis(analysis)
    } catch (error) {
      console.error('Error calling OpenAI API:', error)
      throw new Error('Error al analizar con IA. Verifica la configuración.')
    }
  }

  private buildAnalysisPrompt(data: AnalysisData): string {
    const selectedIdea = data.step4?.find(idea => idea.selected)
    const totalIdeas = data.step4?.length || 0
    const unselectedIdeas = data.step4?.filter(idea => !idea.selected) || []
    
    return `
REALIZA UN ANÁLISIS EXHAUSTIVO de esta bitácora de oportunidades. Como consultor senior, evalúa cada aspecto con rigor profesional:

═══════════════════════════════════════
📋 DATOS DEL PROYECTO
═══════════════════════════════════════
**EQUIPO:** ${data.team?.name}
**BITÁCORA:** ${data.journal?.title}
**METODOLOGÍA:** Efectual (Bird, Sarasvathy)

═══════════════════════════════════════
🔍 ANÁLISIS POR PASOS
═══════════════════════════════════════

**PASO 1 - INVENTARIO DE MEDIOS PERSONALES:**
${data.step1?.map((member, i) => `
👤 PERFIL MIEMBRO ${i + 1}:
• Identidad profesional: ${member.who_i_am || '❌ FALTANTE'}
• Conocimientos/expertise: ${member.what_i_know || '❌ FALTANTE'}
• Red de contactos: ${member.who_i_know || '❌ FALTANTE'}
• Recursos disponibles: ${member.what_i_have || '❌ FALTANTE'}
`).join('\n')}

**PASO 2 - PROBLEMA/OPORTUNIDAD IDENTIFICADA:**
• 🎯 Título: ${data.step2?.title || '❌ FALTANTE'}
• 📝 Descripción detallada: ${data.step2?.description || '❌ FALTANTE'}
• 👥 Población afectada: ${data.step2?.affected || '❌ FALTANTE'}
• 💰 Relevancia económica/social: ${data.step2?.relevance || '❌ FALTANTE'}
• 🔗 Conexión con medios del equipo: ${data.step2?.link_to_means || '❌ FALTANTE'}

**PASO 3 - ANÁLISIS DE TENDENCIAS (${data.step3?.length || 0} identificadas):**
${data.step3?.map((trend, i) => `
📈 TENDENCIA ${i + 1}: ${trend.name} [${trend.type}]
• Descripción: ${trend.brief}
• Ejemplo concreto: ${trend.example || '❌ Sin ejemplo'}
• Fuente: ${trend.source_apa || 'No citada'}
`).join('\n')}

**PASO 4 - PROCESO DE IDEACIÓN:**
• 💡 Total de ideas generadas: ${totalIdeas}
• ⭐ Idea seleccionada: ${selectedIdea?.idea || '❌ NINGUNA SELECCIONADA'}
• 🎯 Nivel de innovación: ${selectedIdea?.innovation_level || 'N/A'}
• ⚖️ Factibilidad percibida: ${selectedIdea?.feasibility || 'N/A'}
• 📋 Justificación de selección: ${selectedIdea?.justification || '❌ FALTANTE'}

Ideas no seleccionadas (para análisis de alternativas):
${unselectedIdeas.slice(0, 3).map((idea, i) => `• ${idea.idea} (${idea.innovation_level}, ${idea.feasibility})`).join('\n')}

**PASO 5 - DEFINICIÓN DE USUARIO Y PROPUESTA DE VALOR:**

👤 BUYER PERSONA:
• Nombre/Perfil: ${data.step5Buyer?.name || '❌ FALTANTE'} (${data.step5Buyer?.age || '?'} años)
• Ocupación: ${data.step5Buyer?.occupation || '❌ FALTANTE'}
• Motivaciones clave: ${data.step5Buyer?.motivations || '❌ FALTANTE'}
• Puntos de dolor: ${data.step5Buyer?.pains || '❌ FALTANTE'}
• Necesidades primarias: ${data.step5Buyer?.needs || '❌ FALTANTE'}

💎 CANVAS DE PROPUESTA DE VALOR:
LADO CLIENTE:
• Trabajos del cliente: ${data.step5VP?.customer_jobs || '❌ FALTANTE'}
• Dolores del cliente: ${data.step5VP?.customer_pains || '❌ FALTANTE'}
• Alegrías esperadas: ${data.step5VP?.customer_gains || '❌ FALTANTE'}

LADO PROPUESTA:
• Productos/Servicios: ${data.step5VP?.products_services || '❌ FALTANTE'}
• Aliviadores de dolor: ${data.step5VP?.pain_relievers || '❌ FALTANTE'}
• Generadores de alegría: ${data.step5VP?.gain_creators || '❌ FALTANTE'}

═══════════════════════════════════════
🎯 INSTRUCCIONES DE ANÁLISIS
═══════════════════════════════════════

EVALÚA CRÍTICAMENTE:
1. **Coherencia efectual:** ¿Están los medios alineados con el problema y la solución?
2. **Validación de mercado:** ¿Hay evidencia real de la necesidad?
3. **Diferenciación competitiva:** ¿Qué hace único este proyecto?
4. **Viabilidad técnica/financiera:** ¿Es realista implementarlo?
5. **Escalabilidad:** ¿Puede crecer significativamente?
6. **Riesgos críticos:** ¿Qué podría hacer fracasar el proyecto?
7. **Oportunidades perdidas:** ¿Qué no están viendo?

IDENTIFICA GAPS ESPECÍFICOS:
• Datos faltantes o superficiales
• Inconsistencias entre pasos
• Suposiciones no validadas
• Sesgos del equipo emprendedor

PROPORCIONA MÉTRICAS DONDE SEA POSIBLE:
• Tamaño de mercado estimado
• Inversión inicial requerida
• Timeline realista de implementación
• Probabilidad de éxito por categorías

Responde en formato JSON con esta estructura EXACTA (amplía el contenido, sé específico y cuantitativo):

{
  "overallAssessment": "Evaluación integral de 4-5 párrafos que incluya: diagnóstico general, nivel de preparación del equipo, potencial de mercado, principales desafíos y perspectiva de éxito. Sé específico sobre qué funciona y qué no.",
  "strengths": ["Mínimo 5 fortalezas específicas y medibles", "Incluye datos concretos cuando sea posible", "Evalúa tanto equipo como propuesta", "Identifica ventajas competitivas reales", "Considera aspectos únicos del enfoque efectual"],
  "weaknesses": ["Mínimo 5 debilidades críticas que requieren atención", "Señala gaps de información específicos", "Identifica riesgos de implementación", "Evaluación realista de capacidades del equipo", "Inconsistencias en la lógica del proyecto"],
  "opportunities": ["Mínimo 5 oportunidades concretas y accionables", "Incluye oportunidades de mercado específicas", "Posibilidades de expansión o pivot", "Alianzas estratégicas potenciales", "Nuevos segmentos o aplicaciones"],
  "recommendations": ["Mínimo 7 recomendaciones específicas y priorizadas", "Incluye acciones inmediatas (30 días)", "Estrategias de mediano plazo (3-6 meses)", "Métricas para medir progreso", "Recursos específicos necesarios", "Validaciones críticas requeridas", "Aspectos a profundizar"],
  "riskAssessment": "Análisis detallado de riesgos en 3-4 párrafos: riesgos de mercado, técnicos, financieros, de equipo y competitivos. Incluye probabilidad estimada y impacto potencial. Prioriza los 3 riesgos más críticos.",
  "nextSteps": ["Mínimo 8 pasos específicos y secuenciales", "Incluye timeframes estimados", "Responsables sugeridos", "Recursos necesarios", "Criterios de éxito para cada paso", "Puntos de decisión clave", "Métricas de seguimiento", "Plan B si algo falla"],
  "viabilityScore": "Puntuación de 0-100 basada en criterios objetivos (explica brevemente el cálculo)"
}
`
  }

  private parseAnalysis(analysisText: string): AnalysisResult {
    try {
      // Extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in analysis')
      }

      const parsed = JSON.parse(jsonMatch[0])
      
      // Validate required fields
      return {
        overallAssessment: parsed.overallAssessment || 'Análisis no disponible',
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
        opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : [],
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
        riskAssessment: parsed.riskAssessment || 'Evaluación de riesgos no disponible',
        nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : [],
        viabilityScore: typeof parsed.viabilityScore === 'number' ? parsed.viabilityScore : 50,
      }
    } catch (error) {
      console.error('Error parsing analysis:', error)
      throw new Error('Error al procesar el análisis de IA')
    }
  }

  // Mock analysis for testing without API key
  getMockAnalysis(): AnalysisResult {
    return {
      overallAssessment: "DIAGNÓSTICO INTEGRAL: Este proyecto demuestra una aplicación sólida de la metodología efectual con un equipo multidisciplinario que ha identificado una oportunidad de mercado real. La coherencia entre medios personales (competencias técnicas en desarrollo de software y experiencia en UX) y el problema seleccionado (falta de transparencia en impacto ambiental) es estratégicamente sólida, sugiriendo un 'fit' natural que maximiza las probabilidades de ejecución exitosa.\n\nPOTENCIAL DE MERCADO: El mercado de sostenibilidad y transparencia ambiental está valorado en $13.1B globalmente con CAGR del 15.1% (2023-2028). El segmento específico de consumidores conscientes (25-40 años) representa 67% del mercado premium, con disposición a pagar 15-25% más por productos verificados. Sin embargo, el proyecto requiere validación cuantitativa de la propuesta de valor y definición de métricas de impacto específicas.\n\nPREPARACIÓN DEL EQUIPO: Fortalezas evidentes en capacidades técnicas y comprensión del usuario, pero gaps críticos en experiencia comercial y estrategia de go-to-market. La ausencia de expertise en certificaciones ambientales y partnerships B2B representa un riesgo de implementación significativo.\n\nPERSPECTIVA DE INVERSIÓN: Con refinamiento estratégico y validación de mercado robusta, este proyecto presenta potencial de crecimiento escalable. Recomiendo fase de pre-seed ($150K-300K) para validación y desarrollo de MVP antes de Serie A.",
      strengths: [
        "Equipo con skills técnicos específicos (React, UX/UI, bases de datos) perfectamente alineados con solución digital requerida",
        "Problema validado por estadísticas concretas: 73% consumidores pagarían más por productos sostenibles verificados",
        "Timing óptimo: convergencia de regulaciones ESG, demanda consumer y madurez tecnológica blockchain para certificaciones",
        "Metodología efectual aplicada correctamente: inicio con medios disponibles vs. proyecciones especulativas de mercado",
        "Segmento de mercado cuantificado: millennials/Gen Z con $143B poder adquisitivo y 67% priorizan sostenibilidad",
        "Propuesta de valor diferenciada: transparencia radical vs. greenwashing predominante en competencia actual"
      ],
      weaknesses: [
        "CRÍTICO: Ausencia total de validación directa con usuarios - 0 entrevistas, encuestas o tests de concepto realizados",
        "Gap comercial severo: sin experiencia en ventas B2B, partnerships corporativos o modelos de monetización freemium",
        "Análisis competitivo superficial: no evaluaron a HowGood, Good On You, o Sustainability Analytics (competidores directos)",
        "Subestimación de complejidad técnica: integración con bases de datos de certificaciones requiere partnerships institucionales costosos",
        "Ausencia de expertise regulatorio: desconocimiento de certificaciones ISO 14001, LEED, Carbon Trust requeridas para credibilidad",
        "Modelo financiero inexistente: sin proyecciones de CAC, LTV, unit economics o runway de capital requerido"
      ],
      opportunities: [
        "MEGA OPORTUNIDAD: Mercado B2B2C inexplorado - vender licencias white-label a retailers para certificar sus cadenas de suministro ($2.8B TAM)",
        "Partnership estratégico con certificadoras existentes (SGS, Bureau Veritas) para monetizar validación de datos vs. competir",
        "Expansión geográfica escalonada: México/Colombia tienen regulaciones ESG emergentes con menos competencia digital",
        "Monetización de datos agregados: insights de consumo sostenible vendibles a CPG companies ($50K-200K por reporte)",
        "Integración con apps existentes (Amazon, MercadoLibre) como plugin vs. app standalone - reducir CAC 60-80%",
        "Pivote a SaaS empresarial: herramienta para compliance ESG corporativo (mercado $7.5B, CAGR 22%)"
      ],
      recommendations: [
        "PRIORIDAD 1 (30 días): Ejecutar research cualitativo - 25 entrevistas estructuradas con target users + 10 con retailers potenciales",
        "PRIORIDAD 2 (45 días): Desarrollar MVP landing page con 3 features core para validar tracción real (target: 500 signups, 15% engagement)",
        "PRIORIDAD 3 (60 días): Mapear y contactar 3-5 certificadoras para explorar partnerships de datos vs. construir desde cero",
        "Refinar segmentación: definir ICP específico (ej: urban millennials, income >$50K, compran organic >2x/mes)",
        "Construir modelo financiero detallado: proyecciones 3 años con escenarios optimista/realista/pesimista",
        "Contratar advisor con experiencia sustainability tech (equity 0.5-1.0%) para credibilidad y network",
        "Establecer métricas North Star: DAU, retention D7/D30, tiempo promedio en app, conversión a verificación premium"
      ],
      riskAssessment: "RIESGOS DE MERCADO (Probabilidad: Alta, Impacto: Alto): La saturación de apps de sostenibilidad y fatiga del consumidor por greenwashing podría limitar adopción. Competidores con mayor funding (HowGood recaudó $23M Serie B) pueden outspend en marketing y partnerships. RIESGO TÉCNICO (Probabilidad: Media, Impacto: Alto): Integración con APIs de certificadoras puede ser más costosa y lenta de lo proyectado, requiriendo capital adicional no presupuestado. RIESGO DE EQUIPO (Probabilidad: Media, Impacto: Medio): Ausencia de co-founder con background comercial/ventas puede ralentizar go-to-market significativamente. Los 3 riesgos más críticos requieren mitigación inmediata: 1) Validación de market-fit antes de desarrollo full, 2) Securing de al menos 1 partnership de datos para reducir complejidad técnica, 3) Advisor/hire comercial para balancear capabilities del equipo.",
      nextSteps: [
        "Semana 1-2: Diseñar y ejecutar protocolo de research - crear cuestionarios, reclutar participantes via LinkedIn/comunidades sustainability",
        "Semana 3-4: Análisis de research + redefinición de ICP y value proposition basado en learnings reales",
        "Semana 5-6: Outreach a certificadoras (SGS, Bureau Veritas, Carbon Trust) para explorar partnership de datos",
        "Semana 7-8: Desarrollo de landing page MVP con tracking robusto (Mixpanel/Amplitude) para medir engagement real",
        "Semana 9-10: Launch soft de landing page + campaña contenido LinkedIn para generar primeros 100 signups",
        "Semana 11-12: Análisis de métricas MVP + iteración basada en user behavior y feedback directo",
        "Mes 3: Pitch a 5-8 angel investors especializados en climate tech para pre-seed $150K-300K",
        "Mes 4: Con funding secured, contratar developer adicional + marketing specialist para acelerar development"
      ],
      viabilityScore: 73
    }
  }
}