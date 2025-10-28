interface TestDataResult {
  teamName: string
  journalTitle: string
  step1Data: Array<{
    who_i_am: string
    what_i_know: string
    who_i_know: string
    what_i_have: string
  }>
  step2Data: {
    title: string
    description: string
    affected: string
    relevance: string
    link_to_means: string
  }
  step3Data: Array<{
    name: string
    type: 'Social' | 'Tecnológica' | 'Ambiental' | 'Cultural' | 'Consumo'
    brief: string
    example: string
    source_apa: string
    comment: string
  }>
  step4Data: Array<{
    idea: string
    innovation_level: 'Baja' | 'Media' | 'Alta'
    feasibility: 'Baja' | 'Media' | 'Alta'
    justification: string
    selected: boolean
  }>
  step5BuyerData: {
    name: string
    age: number
    occupation: string
    motivations: string
    pains: string
    needs: string
  }
  step5VPData: {
    customer_jobs: string
    customer_pains: string
    customer_gains: string
    products_services: string
    pain_relievers: string
    gain_creators: string
  }
}

export class TestDataGenerator {
  private apiKey: string | null

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || null
  }

  async generateTestData(ideaDescription: string): Promise<TestDataResult> {
    if (!this.apiKey) {
      // Return realistic mock data for development
      return this.getMockTestData(ideaDescription)
    }

    const prompt = this.buildPrompt(ideaDescription)

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
              content: `Eres un experto consultor en emprendimiento y metodología efectual. Tu trabajo es generar datos de prueba realistas y coherentes para una aplicación de análisis de oportunidades empresariales.

IMPORTANTE: 
- Todos los datos deben ser específicos, detallados y profesionales
- Usar metodología efectual (empezar con medios disponibles)
- Crear contenido que parezca escrito por emprendedores reales
- Mantener coherencia entre todos los pasos
- Generar exactamente 5 ideas en Step 4, con una marcada como seleccionada`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const result = await response.json()
      const analysis = result.choices[0].message.content

      return this.parseResponse(analysis)
    } catch (error) {
      console.error('Error calling OpenAI API:', error)
      // Fallback to mock data
      return this.getMockTestData(ideaDescription)
    }
  }

  private buildPrompt(ideaDescription: string): string {
    return `
GENERA DATOS DE PRUEBA COMPLETOS PARA ANÁLISIS EFECTUAL BASADO EN ESTA IDEA:

**IDEA DESCRITA:** ${ideaDescription}

INSTRUCCIONES ESPECÍFICAS:

Basándote en la idea descrita, genera contenido realista y detallado para cada paso del análisis efectual. Todo debe estar interconectado y ser coherente.

ESTRUCTURA REQUERIDA:

1. **EQUIPO Y BITÁCORA:**
   - Nombre del equipo (relacionado con la idea)
   - Título de la bitácora (descriptivo y profesional)

2. **PASO 1 - MEDIOS PERSONALES (2 miembros):**
   - Perfiles complementarios que encajen con la idea
   - Experiencias específicas y relevantes
   - Redes de contactos útiles para esta idea
   - Recursos disponibles realistas

3. **PASO 2 - PROBLEMA:**
   - Problema específico que resuelve la idea
   - Descripción detallada (mínimo 200 palabras)
   - Grupos afectados específicos
   - Relevancia económica/social con datos
   - Conexión clara con medios del equipo

4. **PASO 3 - TENDENCIAS (4-5 tendencias):**
   - Variedad de tipos (Social, Tecnológica, Ambiental, Cultural, Consumo)
   - Tendencias actuales que apoyan la idea
   - Ejemplos concretos y fuentes APA realistas
   - Comentarios sobre cómo benefician el proyecto

5. **PASO 4 - IDEAS (exactamente 5 ideas):**
   - Primera idea: la principal (marcada como selected: true)
   - 4 ideas alternativas (selected: false)
   - Todas con justificaciones detalladas
   - Niveles de innovación y factibilidad variados

6. **PASO 5 - USUARIO Y PROPUESTA DE VALOR:**
   - Buyer persona específico y realista
   - Canvas de propuesta de valor completo
   - Coherencia entre ambos lados del canvas

RESPONDE EN FORMATO JSON EXACTO (sin texto adicional):

{
  "teamName": "Nombre del equipo",
  "journalTitle": "Título descriptivo de la bitácora",
  "step1Data": [
    {
      "who_i_am": "Identidad profesional específica del miembro 1 (mínimo 100 palabras)",
      "what_i_know": "Conocimientos técnicos y de dominio específicos (mínimo 100 palabras)",
      "who_i_know": "Red de contactos relevante y específica (mínimo 80 palabras)",
      "what_i_have": "Recursos tangibles e intangibles disponibles (mínimo 80 palabras)"
    },
    {
      "who_i_am": "Identidad profesional específica del miembro 2 (mínimo 100 palabras)",
      "what_i_know": "Conocimientos complementarios al miembro 1 (mínimo 100 palabras)",
      "who_i_know": "Red de contactos diferente pero complementaria (mínimo 80 palabras)",
      "what_i_have": "Recursos adicionales que aporta al proyecto (mínimo 80 palabras)"
    }
  ],
  "step2Data": {
    "title": "Título claro del problema (máximo 15 palabras)",
    "description": "Descripción detallada del problema (mínimo 250 palabras)",
    "affected": "Descripción específica de grupos afectados (mínimo 150 palabras)",
    "relevance": "Explicación del impacto económico/social (mínimo 150 palabras)",
    "link_to_means": "Conexión específica con medios del equipo (mínimo 150 palabras)"
  },
  "step3Data": [
    {
      "name": "Nombre específico de la tendencia 1",
      "type": "Social|Tecnológica|Ambiental|Cultural|Consumo",
      "brief": "Descripción de en qué consiste la tendencia (mínimo 100 palabras)",
      "example": "Ejemplo concreto y específico de la tendencia",
      "source_apa": "Fuente realista en formato APA",
      "comment": "Observación sobre cómo beneficia al proyecto"
    },
    {
      "name": "Nombre específico de la tendencia 2",
      "type": "Diferente tipo al anterior",
      "brief": "Descripción de en qué consiste la tendencia (mínimo 100 palabras)",
      "example": "Ejemplo concreto y específico de la tendencia",
      "source_apa": "Fuente realista en formato APA",
      "comment": "Observación sobre cómo beneficia al proyecto"
    },
    {
      "name": "Nombre específico de la tendencia 3",
      "type": "Diferente tipo a los anteriores",
      "brief": "Descripción de en qué consiste la tendencia (mínimo 100 palabras)",
      "example": "Ejemplo concreto y específico de la tendencia",
      "source_apa": "Fuente realista en formato APA",
      "comment": "Observación sobre cómo beneficia al proyecto"
    },
    {
      "name": "Nombre específico de la tendencia 4",
      "type": "Diferente tipo a los anteriores",
      "brief": "Descripción de en qué consiste la tendencia (mínimo 100 palabras)",
      "example": "Ejemplo concreto y específico de la tendencia",
      "source_apa": "Fuente realista en formato APA",
      "comment": "Observación sobre cómo beneficia al proyecto"
    }
  ],
  "step4Data": [
    {
      "idea": "Descripción detallada de la idea principal (mínimo 150 palabras)",
      "innovation_level": "Baja|Media|Alta",
      "feasibility": "Baja|Media|Alta",
      "justification": "Justificación detallada de por qué es viable (mínimo 150 palabras)",
      "selected": true
    },
    {
      "idea": "Descripción detallada de idea alternativa 1 (mínimo 100 palabras)",
      "innovation_level": "Baja|Media|Alta",
      "feasibility": "Baja|Media|Alta",
      "justification": "Justificación de por qué no fue seleccionada (mínimo 100 palabras)",
      "selected": false
    },
    {
      "idea": "Descripción detallada de idea alternativa 2 (mínimo 100 palabras)",
      "innovation_level": "Baja|Media|Alta",
      "feasibility": "Baja|Media|Alta",
      "justification": "Justificación de por qué no fue seleccionada (mínimo 100 palabras)",
      "selected": false
    },
    {
      "idea": "Descripción detallada de idea alternativa 3 (mínimo 100 palabras)",
      "innovation_level": "Baja|Media|Alta",
      "feasibility": "Baja|Media|Alta",
      "justification": "Justificación de por qué no fue seleccionada (mínimo 100 palabras)",
      "selected": false
    },
    {
      "idea": "Descripción detallada de idea alternativa 4 (mínimo 100 palabras)",
      "innovation_level": "Baja|Media|Alta",
      "feasibility": "Baja|Media|Alta",
      "justification": "Justificación de por qué no fue seleccionada (mínimo 100 palabras)",
      "selected": false
    }
  ],
  "step5BuyerData": {
    "name": "Nombre y apellido específico del buyer persona",
    "age": Edad numérica entre 25 y 55,
    "occupation": "Ocupación específica y realista",
    "motivations": "Motivaciones detalladas (mínimo 150 palabras)",
    "pains": "Frustraciones específicas (mínimo 150 palabras)",
    "needs": "Necesidades específicas (mínimo 100 palabras)"
  },
  "step5VPData": {
    "customer_jobs": "Trabajos del cliente (mínimo 150 palabras)",
    "customer_pains": "Dolores del cliente (mínimo 150 palabras)",
    "customer_gains": "Alegrías esperadas (mínimo 150 palabras)",
    "products_services": "Productos y servicios específicos (mínimo 150 palabras)",
    "pain_relievers": "Cómo alivia dolores específicos (mínimo 150 palabras)",
    "gain_creators": "Cómo crea alegrías y beneficios (mínimo 150 palabras)"
  }
}
`
  }

  private parseResponse(responseText: string): TestDataResult {
    try {
      // Extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response')
      }

      const parsed = JSON.parse(jsonMatch[0])
      
      // Validate and return
      return {
        teamName: parsed.teamName || 'Equipo Innovador',
        journalTitle: parsed.journalTitle || 'Análisis de Oportunidad',
        step1Data: parsed.step1Data || [],
        step2Data: parsed.step2Data || {},
        step3Data: parsed.step3Data || [],
        step4Data: parsed.step4Data || [],
        step5BuyerData: parsed.step5BuyerData || {},
        step5VPData: parsed.step5VPData || {},
      }
    } catch (error) {
      console.error('Error parsing AI response:', error)
      throw new Error('Error al procesar la respuesta de IA')
    }
  }

  private getMockTestData(ideaDescription: string): TestDataResult {
    // Analizar palabras clave de la idea para personalizar un poco
    const idea = ideaDescription.toLowerCase()
    const isApp = idea.includes('app') || idea.includes('aplicación') || idea.includes('plataforma')
    const isEcommerce = idea.includes('tienda') || idea.includes('venta') || idea.includes('marketplace')
    const isEducation = idea.includes('educación') || idea.includes('enseñar') || idea.includes('aprender')
    const isHealth = idea.includes('salud') || idea.includes('médico') || idea.includes('bienestar')
    
    let teamName = 'Innovadores Unidos'
    let journalTitle = 'Análisis de Oportunidad Estratégica'
    
    if (isApp) {
      teamName = 'TechSolve'
      journalTitle = 'Desarrollo de Aplicación Innovadora'
    } else if (isEcommerce) {
      teamName = 'CommerceFlow'
      journalTitle = 'Plataforma de Comercio Digital'
    } else if (isEducation) {
      teamName = 'EduTech Pioneers'
      journalTitle = 'Solución Educativa Disruptiva'
    } else if (isHealth) {
      teamName = 'HealthTech Solutions'
      journalTitle = 'Innovación en Salud Digital'
    }

    return {
      teamName,
      journalTitle,
      step1Data: [
        {
          who_i_am: 'Ingeniero de software con 8 años de experiencia en desarrollo web y mobile. MBA en gestión de proyectos. Apasionado por la innovación tecnológica y el emprendimiento digital.',
          what_i_know: 'Desarrollo fullstack (React, Node.js, Python), gestión de equipos ágiles, análisis de datos, marketing digital, arquitectura de sistemas escalables, metodologías de UX/UI.',
          who_i_know: 'Red de desarrolladores y startups tech, contactos en aceleradoras (Techstars, Y Combinator), inversores ángeles del sector tech, profesores universitarios en ingeniería de sistemas.',
          what_i_have: 'Laptop de alta gama, servidor personal, $15,000 en ahorros, oficina en casa, acceso a laboratorio universitario, licencias de software de desarrollo, equipo de prototipado.'
        },
        {
          who_i_am: 'Especialista en marketing digital y comunicación estratégica. 6 años en startups y empresas tech. Máster en Comunicación Digital y certificación en Growth Hacking.',
          what_i_know: 'Marketing digital, redes sociales, copywriting, SEO/SEM, análisis de mercado, comunicación de marca, fundraising, diseño gráfico, estrategias de crecimiento viral.',
          who_i_know: 'Red de influencers tech, contactos en medios especializados, community managers de marcas reconocidas, expertos en growth de empresas unicornio.',
          what_i_have: 'Equipo de grabación profesional, software de diseño (Adobe Creative Suite), base de datos de 8,000 contactos, $10,000 en ahorros, acceso a herramientas premium de marketing.'
        }
      ],
      step2Data: {
        title: 'Falta de soluciones tecnológicas accesibles y efectivas en el mercado actual',
        description: `Los usuarios y empresas enfrentan dificultades significativas para encontrar soluciones tecnológicas que sean verdaderamente efectivas, accesibles y fáciles de implementar. El mercado actual está saturado de opciones complejas que requieren expertise técnico avanzado o inversiones prohibitivas para usuarios comunes. Esta brecha entre necesidades reales y soluciones disponibles genera frustración, pérdida de tiempo y recursos, especialmente en pequeñas empresas y usuarios individuales que buscan mejorar su productividad o resolver problemas específicos. Las alternativas existentes suelen ser demasiado genéricas, caras o difíciles de personalizar, lo que limita su adopción masiva y efectividad real.`,
        affected: 'Pequeñas y medianas empresas (PyMEs) que buscan digitalizar procesos pero carecen de recursos técnicos internos. Emprendedores individuales que necesitan herramientas profesionales a precios accesibles. Profesionales independientes que requieren soluciones específicas para optimizar su trabajo. Estudiantes y educadores que buscan tecnología educativa efectiva. Organizaciones sin fines de lucro con presupuestos limitados pero necesidades tecnológicas reales.',
        relevance: 'El mercado global de soluciones digitales para PyMEs alcanza $700 billones y crece al 12% anual según Gartner 2024. En Latinoamérica, solo el 30% de PyMEs tienen soluciones digitales adecuadas, representando una oportunidad de $45 billones. La democratización de la tecnología es crucial para el crecimiento económico inclusivo, ya que las PyMEs representan el 90% del empleo en la región. Post-pandemia, la urgencia por digitalización se incrementó 300%, pero las soluciones accesibles no han crecido al mismo ritmo.',
        link_to_means: 'Nuestra experiencia técnica en desarrollo fullstack nos permite crear soluciones elegantes y escalables que simplifican problemas complejos. Los conocimientos en UX/UI son fundamentales para hacer tecnología verdaderamente accesible. La experiencia en marketing digital nos ayuda a entender las necesidades reales del mercado y comunicar valor de manera efectiva. Nuestros contactos en el ecosistema startup facilitan validación temprana y acceso a usuarios beta. Los recursos disponibles permiten desarrollar un MVP robusto sin financiamiento externo inicial.'
      },
      step3Data: [
        {
          name: 'Democratización de la inteligencia artificial',
          type: 'Tecnológica',
          brief: 'Herramientas de IA están volviéndose más accesibles para usuarios no técnicos, con interfaces simplificadas y costos reducidos que permiten automatización avanzada sin programación.',
          example: 'ChatGPT y herramientas no-code como Zapier AI permiten a PyMEs automatizar procesos complejos sin contratar desarrolladores',
          source_apa: 'McKinsey & Company. (2024). The state of AI in 2024: Democratization and enterprise adoption. McKinsey Global Institute.',
          comment: 'Esta tendencia valida la necesidad de soluciones tech más accesibles y crea oportunidades para integración de IA'
        },
        {
          name: 'Trabajo remoto e híbrido permanente',
          type: 'Social',
          brief: 'El trabajo remoto se consolidó como modalidad permanente, creando demanda por herramientas de productividad y colaboración más sofisticadas pero fáciles de usar.',
          example: 'Empresas como Shopify y Twitter adoptaron "remote-first", impulsando demanda por soluciones de gestión remota',
          source_apa: 'Stanford Institute for Human-Centered AI. (2024). Future of Work Report: Remote collaboration trends. Stanford Digital Economy Lab.',
          comment: 'Amplía el mercado objetivo a nivel global y justifica soluciones basadas en la nube'
        },
        {
          name: 'Sostenibilidad digital y green tech',
          type: 'Ambiental',
          brief: 'Creciente presión por soluciones tecnológicas que reduzcan huella de carbono y optimicen recursos, especialmente en empresas con compromisos ESG.',
          example: 'Microsoft comprometió $1B para tecnologías que eliminen carbono, priorizando proveedores con soluciones sostenibles',
          source_apa: 'World Economic Forum. (2024). Green Digital Transformation: Technology for sustainable business. WEF Sustainability Reports.',
          comment: 'Oportunidad para diferenciación mediante eficiencia energética y optimización de recursos'
        },
        {
          name: 'Economía de subscripciones y acceso vs. propiedad',
          type: 'Consumo',
          brief: 'Preferencia creciente por modelos de subscripción sobre compras únicas, especialmente en software y servicios digitales.',
          example: 'Adobe Creative Cloud transformó la industria del diseño; ahora Salesforce, HubSpot dominan con modelos SaaS',
          source_apa: 'Deloitte. (2024). Subscription Economy Report: Changing consumer preferences in digital services. Deloitte Insights.',
          comment: 'Valida modelo de negocio SaaS con ingresos recurrentes y menor barrera de entrada'
        }
      ],
      step4Data: [
        {
          idea: 'Plataforma SaaS que combina múltiples herramientas de productividad en una interfaz unificada, con automatizaciones inteligentes y personalización sin código para PyMEs.',
          innovation_level: 'Media',
          feasibility: 'Alta',
          justification: 'Combina nuestra experiencia técnica con conocimiento profundo de necesidades del mercado. El modelo SaaS es escalable y genera ingresos recurrentes. Podemos empezar con MVP en 4 meses, validar con nuestra red de contactos y iterar rápidamente. La demanda está comprobada y tenemos los recursos para desarrollo inicial.',
          selected: true
        },
        {
          idea: 'Consultora especializada en transformación digital para PyMEs con metodología propia y herramientas personalizadas.',
          innovation_level: 'Baja',
          feasibility: 'Media',
          justification: 'Aunque hay demanda, este modelo limita escalabilidad y requiere crecimiento de equipo lineal. Los márgenes son buenos pero el crecimiento es limitado. Competencia establecida con consultoras grandes.',
          selected: false
        },
        {
          idea: 'Marketplace de soluciones tech específicas para industrias verticales con sistema de matching automático.',
          innovation_level: 'Media',
          feasibility: 'Baja',
          justification: 'Requiere masa crítica muy alta tanto de proveedores como usuarios. Los costos de adquisición serían prohibitivos y necesitaríamos capital significativo para inventario y marketing.',
          selected: false
        },
        {
          idea: 'Aplicación móvil con IA para automatizar tareas administrativas usando reconocimiento de voz y procesamiento de documentos.',
          innovation_level: 'Alta',
          feasibility: 'Baja',
          justification: 'Tecnología muy prometedora pero requiere expertise en machine learning que no tenemos. Los costos de desarrollo serían altos y el tiempo de mercado largo.',
          selected: false
        },
        {
          idea: 'Academia online para enseñar no-code/low-code con certificaciones y proyectos reales para PyMEs.',
          innovation_level: 'Baja',
          feasibility: 'Media',
          justification: 'Mercado educativo es competitivo y monetización toma tiempo. Aunque complementaría bien el producto principal, como negocio standalone presenta desafíos de escalabilidad.',
          selected: false
        }
      ],
      step5BuyerData: {
        name: 'Carlos Mendoza',
        age: 38,
        occupation: 'Gerente General de empresa familiar de 25 empleados en sector retail',
        motivations: 'Busca modernizar la empresa familiar para competir con grandes cadenas y asegurar el futuro del negocio. Quiere implementar tecnología que mejore eficiencia operativa sin complicar procesos existentes. Está motivado por demostrar que puede llevar la empresa al siguiente nivel y preparar el terreno para sus hijos.',
        pains: 'Se siente abrumado por la cantidad de opciones tecnológicas disponibles. Teme invertir en soluciones complejas que su equipo no pueda usar. Ha tenido malas experiencias con consultores que prometen mucho y entregan poco. Le preocupa el costo y el tiempo de implementación de nuevas tecnologías.',
        needs: 'Solución integral pero simple que cubra gestión de inventario, ventas y clientes. Implementación rápida con capacitación incluida. Soporte técnico en español. Costo predecible y ROI demostrable. Integración con sistemas existentes sin migración compleja.'
      },
      step5VPData: {
        customer_jobs: 'Gestionar operaciones diarias de manera eficiente mientras planifica crecimiento a largo plazo. Mantener control de inventario, ventas y relaciones con clientes. Tomar decisiones basadas en datos confiables. Capacitar a su equipo en nuevas herramientas. Optimizar costos operativos sin sacrificar calidad de servicio.',
        customer_pains: 'Sistemas actuales fragmentados que requieren trabajo manual duplicado. Falta de visibilidad en tiempo real sobre performance del negocio. Procesos ineficientes que consumen tiempo valioso. Dificultad para generar reportes precisos para toma de decisiones. Resistencia del equipo a cambios tecnológicos complejos.',
        customer_gains: 'Automatización de tareas repetitivas que libere tiempo para estrategia. Dashboards claros que muestren KPIs importantes. Mejora en satisfacción del cliente através de mejor servicio. Reducción de errores operativos. Capacidad de competir efectivamente con empresas más grandes.',
        products_services: 'Plataforma SaaS integrada con módulos de inventario, CRM, punto de venta y reportes. Interfaz intuitiva diseñada para usuarios no técnicos. Automatizaciones predefinidas para procesos comunes. Capacitación incluida y soporte en español. Integraciones con sistemas existentes como contabilidad y bancos.',
        pain_relievers: 'Interfaz unificada elimina necesidad de múltiples sistemas. Automatizaciones reducen trabajo manual y errores. Setup guiado simplifica implementación. Reportes automáticos proporcionan visibilidad inmediata. Soporte técnico especializado en PyMEs reduce frustración durante adopción.',
        gain_creators: 'Dashboards ejecutivos muestran crecimiento y áreas de oportunidad. Automatizaciones inteligentes sugieren acciones basadas en patrones. Integración con WhatsApp Business para mejor comunicación con clientes. Módulo de análisis predictivo para optimizar inventario. Gamificación para motivar adopción del equipo.'
      }
    }
  }
}