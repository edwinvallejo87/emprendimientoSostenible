import { AIAnalysisService } from './openai'

export interface TeamMember {
  who_i_am: string
  what_i_know: string
  who_i_know: string
  what_i_have: string
}

export interface GeneratedIdea {
  title: string
  description: string
  targetMarket: string
  uniqueValue: string
  resourcesNeeded: string[]
  implementationComplexity: 'Low' | 'Medium' | 'High'
  marketPotential: 'Low' | 'Medium' | 'High'
  alignmentScore: number // 0-100, how well it aligns with team's means
  reasoning: string
}

export interface IdeaGenerationResult {
  ideas: GeneratedIdea[]
  teamAnalysis: string
  recommendedFocus: string[]
}

export class AIIdeaGenerator {
  private aiService: AIAnalysisService

  constructor() {
    this.aiService = new AIAnalysisService()
  }

  async generateIdeas(
    teamName: string,
    teamMembers: TeamMember[],
    focusArea?: string,
    count: number = 5
  ): Promise<IdeaGenerationResult> {
    try {
      const prompt = this.buildIdeaGenerationPrompt(teamName, teamMembers, focusArea, count)
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.aiService['apiKey']}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: `Eres un experto en metodología efectual y generación de oportunidades emprendedoriales. Tu especialidad es identificar oportunidades viables basándose en los medios disponibles del equipo (enfoque efectual vs. causal).

PRINCIPIOS EFECTUALES CLAVE:
🎯 Partir de MEDIOS disponibles (quién soy, qué sé, a quién conozco, qué tengo)
🔄 Buscar PÉRDIDAS ASEQUIBLES (low risk, quick validation)
🤝 Aprovechar ALIANZAS existentes (red de contactos)
🎲 Capitalizar CONTINGENCIAS (oportunidades inesperadas)
🎨 Crear NUEVOS MERCADOS vs. competir en existentes

Tu misión: generar ideas de oportunidades que maximicen los medios del equipo y minimicen riesgos iniciales.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 3000,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const result = await response.json()
      const generatedContent = result.choices[0].message.content

      return this.parseIdeaGeneration(generatedContent)
    } catch (error) {
      console.warn('Using mock idea generation:', error)
      return this.getMockIdeaGeneration(teamName, teamMembers)
    }
  }

  private buildIdeaGenerationPrompt(
    teamName: string, 
    teamMembers: TeamMember[], 
    focusArea?: string,
    count: number = 5
  ): string {
    return `
GENERA ${count} IDEAS DE OPORTUNIDADES EMPRENDEDORIALES para el equipo "${teamName}" usando metodología efectual.

═══════════════════════════════════════
📋 MEDIOS DISPONIBLES DEL EQUIPO
═══════════════════════════════════════

${teamMembers.map((member, i) => `
👤 MIEMBRO ${i + 1}:
• IDENTIDAD: ${member.who_i_am || 'No especificado'}
• CONOCIMIENTOS: ${member.what_i_know || 'No especificado'}  
• RED DE CONTACTOS: ${member.who_i_know || 'No especificado'}
• RECURSOS DISPONIBLES: ${member.what_i_have || 'No especificado'}
`).join('\n')}

${focusArea ? `🎯 ÁREA DE ENFOQUE SOLICITADA: ${focusArea}` : ''}

═══════════════════════════════════════
🎯 INSTRUCCIONES DE GENERACIÓN
═══════════════════════════════════════

GENERA ideas que:
✅ MAXIMICEN los medios disponibles del equipo
✅ APROVECHEN la red de contactos existente  
✅ REQUIERAN baja inversión inicial (pérdidas asequibles)
✅ PERMITAN validación rápida (30-90 días)
✅ CONSTRUYAN sobre conocimientos existentes
✅ CREEN nuevos mercados vs. competir directamente

EVALÚA cada idea en:
📊 ALINEACIÓN con medios del equipo (0-100)
📈 POTENCIAL de mercado (Low/Medium/High)
🔧 COMPLEJIDAD de implementación (Low/Medium/High)
💰 RECURSOS adicionales necesarios
🎯 MERCADO objetivo específico

Responde en formato JSON EXACTO:

{
  "teamAnalysis": "Análisis de 2-3 párrafos sobre las fortalezas únicas del equipo y su potencial emprendedor",
  "recommendedFocus": ["área 1", "área 2", "área 3"],
  "ideas": [
    {
      "title": "Nombre conciso de la oportunidad",
      "description": "Descripción detallada en 2-3 párrafos de qué es y cómo funciona",
      "targetMarket": "Segmento específico de mercado objetivo",
      "uniqueValue": "Propuesta de valor única que solo este equipo puede ofrecer",
      "resourcesNeeded": ["recurso 1", "recurso 2", "recurso 3"],
      "implementationComplexity": "Low|Medium|High",
      "marketPotential": "Low|Medium|High", 
      "alignmentScore": 85,
      "reasoning": "Explicación de por qué esta idea es perfecta para este equipo específico"
    }
  ]
}
`
  }

  private parseIdeaGeneration(content: string): IdeaGenerationResult {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found')
      }

      const parsed = JSON.parse(jsonMatch[0])
      
      return {
        teamAnalysis: parsed.teamAnalysis || 'Análisis no disponible',
        recommendedFocus: Array.isArray(parsed.recommendedFocus) ? parsed.recommendedFocus : [],
        ideas: Array.isArray(parsed.ideas) ? parsed.ideas.map((idea: any) => ({
          title: idea.title || 'Oportunidad sin título',
          description: idea.description || 'Descripción no disponible',
          targetMarket: idea.targetMarket || 'Mercado no especificado',
          uniqueValue: idea.uniqueValue || 'Valor único no definido',
          resourcesNeeded: Array.isArray(idea.resourcesNeeded) ? idea.resourcesNeeded : [],
          implementationComplexity: ['Low', 'Medium', 'High'].includes(idea.implementationComplexity) 
            ? idea.implementationComplexity : 'Medium',
          marketPotential: ['Low', 'Medium', 'High'].includes(idea.marketPotential) 
            ? idea.marketPotential : 'Medium',
          alignmentScore: typeof idea.alignmentScore === 'number' ? idea.alignmentScore : 50,
          reasoning: idea.reasoning || 'Razonamiento no disponible'
        })) : []
      }
    } catch (error) {
      console.error('Error parsing idea generation:', error)
      throw new Error('Error al procesar las ideas generadas')
    }
  }

  private getMockIdeaGeneration(teamName: string, teamMembers: TeamMember[]): IdeaGenerationResult {
    return {
      teamAnalysis: `El equipo ${teamName} presenta una combinación interesante de competencias técnicas y experiencia de mercado. La presencia de habilidades en desarrollo de software, combined con conocimiento del sector empresarial, crea oportunidades únicas en la intersección de tecnología y consultoría. La red de contactos diversa permite acceso tanto a mercados B2B como B2C, mientras que los recursos técnicos disponibles minimizan la barrera de entrada para soluciones digitales.`,
      recommendedFocus: [
        "SaaS B2B para automatización de procesos",
        "Marketplace o plataforma de conexión",
        "Consultoría especializada con herramientas digitales"
      ],
      ideas: [
        {
          title: "Plataforma de Gestión de Proyectos para PyMEs",
          description: "Una herramienta SaaS simplificada que combina gestión de proyectos, facturación y CRM básico específicamente diseñada para pequeñas empresas que no pueden costear soluciones enterprise. La propuesta diferencial está en la simplicidad de uso y precios accesibles, aprovechando el conocimiento del equipo sobre las necesidades reales de las PyMEs.",
          targetMarket: "PyMEs de 5-50 empleados en servicios profesionales",
          uniqueValue: "Interfaz ultra-simple diseñada por quien conoce las limitaciones reales de las PyMEs",
          resourcesNeeded: ["Hosting cloud", "Herramientas de desarrollo", "Capital de marketing inicial"],
          implementationComplexity: "Medium",
          marketPotential: "High",
          alignmentScore: 92,
          reasoning: "Perfecta alineación entre skills técnicos del equipo y conocimiento profundo de necesidades PyME. Baja inversión inicial requerida."
        },
        {
          title: "Marketplace de Servicios Profesionales Locales",
          description: "Plataforma que conecta profesionales independientes (contadores, abogados, consultores) con empresas locales, similar a Upwork pero enfocado en servicios presenciales y relaciones a largo plazo. El valor está en la curación de profesionales y garantía de calidad.",
          targetMarket: "Empresas locales que necesitan servicios profesionales esporádicos",
          uniqueValue: "Curación local y relaciones de confianza vs. competencia global",
          resourcesNeeded: ["Desarrollo web/móvil", "Marketing local", "Sistema de pagos"],
          implementationComplexity: "Medium",
          marketPotential: "Medium", 
          alignmentScore: 78,
          reasoning: "Aprovecha la red de contactos profesionales y conocimiento del mercado local."
        },
        {
          title: "Consultoría en Transformación Digital para Sectores Tradicionales",
          description: "Servicio de consultoría especializado en digitalizar procesos en industrias tradicionales (manufactura, retail físico, agricultura), combinando estrategia con implementación técnica. El diferencial está en entender tanto el negocio tradicional como las posibilidades tecnológicas.",
          targetMarket: "Empresas tradicionales de 20-200 empleados",
          uniqueValue: "Puente entre mundo tradicional y digital, no solo vende tecnología",
          resourcesNeeded: ["Herramientas de automatización", "Equipo comercial", "Cases de éxito"],
          implementationComplexity: "Low",
          marketPotential: "High",
          alignmentScore: 88,
          reasoning: "Capitaliza la experiencia empresarial tradicional del equipo para ofrecer algo que consultoras puramente tech no pueden."
        }
      ]
    }
  }
}