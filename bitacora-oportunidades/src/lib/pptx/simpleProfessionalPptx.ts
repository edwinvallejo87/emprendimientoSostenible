import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface JournalData {
  journal?: { id: string; title: string }
  team?: { id: string; name: string }
  idea?: { title: string; description?: string }
  step1?: Array<{ who_i_am: string; what_i_know: string; who_i_know: string; what_i_have: string }>
  step2?: { title: string; description: string; affected: string; relevance: string; link_to_means: string }
  step3?: Array<{ name: string; type: string; brief: string }>
  step4?: Array<{ name: string; description: string; is_selected?: boolean }>
  step5Buyer?: { name: string; demographics: string; needs: string; pain_points: string }
  step5VP?: { value_proposition: string; unique_benefits: string; why_us: string }
  step8SustainableCanvas?: { social_benefits: string; environmental_benefits: string; economic_benefits: string }
  step9InnovationPatterns?: Array<{ pattern_name: string; description: string }>
  step10Prototype?: { prototype_type: string; description: string }
  step11ValidationStrategy?: { strategy: string; methods: string }
  step12EcosystemActors?: Array<{ actor_name: string; role: string }>
  step13SustainabilityReflection?: { reflection: string; next_steps: string }
}

export async function generateSimpleProfessionalPPTX(data: JournalData) {
  try {
    console.log('📊 Generando presentación profesional simple')
    const htmlContent = generatePresentationHTML(data)
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    
    const printWindow = window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes')
    if (!printWindow) {
      throw new Error('No se pudo abrir la ventana de presentación')
    }
    
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 30000)
    
  } catch (error) {
    console.error('Error generating presentation:', error)
    throw new Error('Error al generar la presentación')
  }
}

function generatePresentationHTML(data: JournalData): string {
  const currentDate = format(new Date(), 'dd/MM/yyyy', { locale: es })
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.journal?.title || 'Presentación de Negocio'}</title>
      <style>
        ${getSimpleStyles()}
      </style>
    </head>
    <body>
      <div class="nav">
        <button onclick="previousSlide()" id="prevBtn">‹ Anterior</button>
        <span id="slideCounter">1 / 5</span>
        <button onclick="nextSlide()" id="nextBtn">Siguiente ›</button>
        <button onclick="window.print()" class="print-btn">Imprimir</button>
      </div>

      <div class="presentation">
        ${generateSlides(data, currentDate)}
      </div>

      <script>
        ${getNavigationScript()}
      </script>
    </body>
    </html>
  `
}

function generateSlides(data: JournalData, currentDate: string): string {
  let slides = ''
  
  // Slide 1: Portada
  slides += `
    <div class="slide active">
      <h1>${data.journal?.title || 'Presentación del Proyecto'}</h1>
      <div class="subtitle">${data.team?.name || 'Equipo Emprendedor'}</div>
      <div class="subtitle">${currentDate}</div>
      
      <div class="section">
        <p style="font-size: 1.3rem; text-align: center; margin-top: 40px;">
          ${data.step2?.title || 'Análisis de Oportunidad de Emprendimiento'}
        </p>
      </div>
    </div>
  `
  
  // Slide 2: Resumen Ejecutivo
  slides += `
    <div class="slide">
      <h2>Resumen Ejecutivo</h2>
      
      <div class="executive-summary">
        <div class="summary-item">
          <strong>Problema:</strong> ${data.step2?.title || 'Por identificar y validar'}
        </div>
        
        <div class="summary-item">
          <strong>Solución:</strong> ${
            (data.step4?.find(idea => idea.is_selected)?.name || 
             data.step4?.[0]?.name || 
             data.idea?.title || 
             'En desarrollo')
          }
        </div>
        
        <div class="summary-item">
          <strong>Cliente:</strong> ${data.step5Buyer?.name || 'Segmento por definir'}
        </div>
        
        <div class="summary-item">
          <strong>Estado:</strong> ${getProjectStatus(data)}
        </div>
        
        <div class="summary-item">
          <strong>Inversión estimada:</strong> ${getInvestmentNeeds(data)}
        </div>
        
        <div class="summary-item">
          <strong>Timeline:</strong> ${getTimeline(data)}
        </div>
      </div>
    </div>
  `

  // Slide 3: Análisis del Problema
  slides += `
    <div class="slide">
      <h2>Análisis del Problema</h2>
      
      ${data.step2 ? `
        <div class="section">
          <strong>Problema identificado:</strong>
          <h3>${data.step2.title}</h3>
          <p>${data.step2.description}</p>
        </div>
        
        <div class="section">
          <strong>Población afectada:</strong>
          <p>${data.step2.affected}</p>
        </div>
        
        <div class="section">
          <strong>Relevancia e impacto:</strong>
          <p>${data.step2.relevance}</p>
        </div>
        
        <div class="section">
          <strong>Conexión con nuestros recursos:</strong>
          <p>${data.step2.link_to_means}</p>
        </div>
      ` : `
        <div class="section">
          <strong>Estado actual:</strong>
          <p>Investigación de problema en curso. El equipo necesita completar el análisis del problema/necesidad para validar la oportunidad de mercado.</p>
        </div>
        
        <div class="section">
          <strong>Próximos pasos:</strong>
          <ul>
            <li>Investigación de mercado y análisis de necesidades</li>
            <li>Entrevistas con potenciales usuarios</li>
            <li>Validación del tamaño del problema</li>
          </ul>
        </div>
      `}
    </div>
  `

  // Slide 4: Tendencias del Entorno
  slides += `
    <div class="slide">
      <h2>Tendencias del Entorno</h2>
      
      ${data.step3 && data.step3.length > 0 ? `
        <div class="section">
          <strong>Tendencias identificadas (${data.step3.length}):</strong>
        </div>
        
        ${data.step3.map(trend => `
          <div class="section">
            <strong>${trend.name}</strong> (${trend.type})
            <p>${trend.brief}</p>
          </div>
        `).join('')}
        
        <div class="section">
          <strong>Implicaciones para nuestro proyecto:</strong>
          <p>Estas tendencias ${data.step3.length > 2 ? 'validan la oportunidad' : 'requieren más análisis'} y ${data.step3.length > 1 ? 'apoyan' : 'pueden apoyar'} el desarrollo de nuestra solución.</p>
        </div>
      ` : `
        <div class="section">
          <strong>Estado del análisis:</strong>
          <p>Análisis de tendencias pendiente. Es crucial identificar tendencias tecnológicas, sociales, económicas y ambientales que impacten nuestro mercado objetivo.</p>
        </div>
        
        <div class="section">
          <strong>Áreas a investigar:</strong>
          <ul>
            <li>Tendencias tecnológicas relevantes</li>
            <li>Cambios en comportamiento de consumidores</li>
            <li>Regulaciones y políticas emergentes</li>
            <li>Factores económicos del sector</li>
          </ul>
        </div>
      `}
    </div>
  `

  // Slide 5: Proceso de Ideación
  slides += `
    <div class="slide">
      <h2>Proceso de Ideación</h2>
      
      ${data.step4 && data.step4.length > 0 ? `
        <div class="section">
          <strong>Ideas generadas: ${data.step4.length}</strong>
        </div>
        
        ${data.step4.map((idea, index) => `
          <div class="section ${idea.is_selected ? 'selected-idea' : ''}">
            <strong>${index + 1}. ${idea.name} ${idea.is_selected ? '✅ SELECCIONADA' : ''}</strong>
            <p>${idea.description}</p>
          </div>
        `).join('')}
        
        ${data.step4.find(idea => idea.is_selected) ? `
          <div class="section">
            <strong>Justificación de la selección:</strong>
            <p>La idea seleccionada presenta la mejor combinación de viabilidad, deseabilidad y factibilidad según nuestros recursos actuales.</p>
          </div>
        ` : `
          <div class="section">
            <strong>Siguiente paso:</strong>
            <p>Evaluar y seleccionar la idea más prometedora para desarrollo.</p>
          </div>
        `}
      ` : `
        <div class="section">
          <strong>Estado de ideación:</strong>
          <p>Proceso de generación de ideas pendiente. El equipo necesita realizar sesiones de brainstorming para desarrollar soluciones potenciales.</p>
        </div>
        
        <div class="section">
          <strong>Metodología sugerida:</strong>
          <ul>
            <li>Sesión de brainstorming estructurado</li>
            <li>Evaluación de viabilidad técnica</li>
            <li>Análisis de recursos requeridos</li>
            <li>Selección de idea principal</li>
          </ul>
        </div>
      `}
    </div>
  `

  // Slide 6: Cliente Objetivo (Buyer Persona)
  slides += `
    <div class="slide">
      <h2>Cliente Objetivo</h2>
      
      ${data.step5Buyer ? `
        <div class="section">
          <strong>Perfil del cliente:</strong>
          <h3>${data.step5Buyer.name}</h3>
        </div>
        
        <div class="section">
          <strong>Demografía:</strong>
          <p>${data.step5Buyer.demographics}</p>
        </div>
        
        <div class="section">
          <strong>Necesidades principales:</strong>
          <p>${data.step5Buyer.needs}</p>
        </div>
        
        <div class="section">
          <strong>Puntos de dolor actuales:</strong>
          <p>${data.step5Buyer.pain_points}</p>
        </div>
        
        <div class="section">
          <strong>Estrategia de alcance:</strong>
          <p>Nuestro producto/servicio aborda directamente estos puntos de dolor, ofreciendo una solución específica para este segmento.</p>
        </div>
      ` : `
        <div class="section">
          <strong>Estado del análisis:</strong>
          <p>Definición de buyer persona pendiente. Es fundamental identificar y caracterizar nuestro cliente ideal antes de desarrollar la solución.</p>
        </div>
        
        <div class="section">
          <strong>Información a recopilar:</strong>
          <ul>
            <li>Perfil demográfico y psicográfico</li>
            <li>Necesidades específicas no cubiertas</li>
            <li>Comportamientos de compra</li>
            <li>Canales de comunicación preferidos</li>
            <li>Presupuesto disponible</li>
          </ul>
        </div>
      `}
    </div>
  `

  // Slide 7: Propuesta de Valor
  slides += `
    <div class="slide">
      <h2>Propuesta de Valor</h2>
      
      ${data.step5VP ? `
        <div class="section">
          <strong>Nuestra propuesta de valor:</strong>
          <p style="font-size: 1.2rem; background: #f8f9fa; padding: 20px; border-radius: 8px;">${data.step5VP.value_proposition}</p>
        </div>
        
        <div class="section">
          <strong>Beneficios únicos:</strong>
          <p>${data.step5VP.unique_benefits}</p>
        </div>
        
        <div class="section">
          <strong>¿Por qué nosotros?:</strong>
          <p>${data.step5VP.why_us}</p>
        </div>
        
        <div class="section">
          <strong>Diferenciación competitiva:</strong>
          <p>Nuestra solución se distingue por combinar ${data.step1?.length ? 'las fortalezas específicas de nuestro equipo' : 'recursos únicos'} con una comprensión profunda del problema.</p>
        </div>
      ` : `
        <div class="section">
          <strong>Estado de desarrollo:</strong>
          <p>Propuesta de valor en definición. Necesitamos articular claramente qué valor único ofrecemos al cliente y por qué somos la mejor opción.</p>
        </div>
        
        <div class="section">
          <strong>Elementos a definir:</strong>
          <ul>
            <li>Beneficio principal para el cliente</li>
            <li>Ventaja competitiva sostenible</li>
            <li>Razones para elegir nuestra solución</li>
            <li>Propuesta de valor cuantificable</li>
          </ul>
        </div>
      `}
    </div>
  `

  // Slide 8: Recursos del Equipo
  slides += `
    <div class="slide">
      <h2>Recursos del Equipo</h2>
      
      ${data.step1 && data.step1.length > 0 ? `
        <div class="section">
          <strong>Composición del equipo: ${data.step1.length} integrante${data.step1.length !== 1 ? 's' : ''}</strong>
        </div>
        
        ${data.step1.map((member, index) => `
          <div class="section">
            <strong>Integrante ${index + 1}:</strong>
            ${member.who_i_am ? `<p><strong>Quién soy:</strong> ${member.who_i_am}</p>` : ''}
            ${member.what_i_know ? `<p><strong>Qué sé:</strong> ${member.what_i_know}</p>` : ''}
            ${member.who_i_know ? `<p><strong>A quién conozco:</strong> ${member.who_i_know}</p>` : ''}
            ${member.what_i_have ? `<p><strong>Qué tengo:</strong> ${member.what_i_have}</p>` : ''}
          </div>
        `).join('')}
        
        <div class="section">
          <strong>Análisis de capacidades:</strong>
          <p>Fortalezas: ${getTeamStrengths(data.step1)}</p>
          <p>Gaps por cubrir: ${getTeamGaps(data)}</p>
        </div>
      ` : `
        <div class="section">
          <strong>Estado del análisis:</strong>
          <p>Mapeo de recursos del equipo pendiente. Es fundamental conocer las capacidades, recursos y conexiones de cada integrante.</p>
        </div>
        
        <div class="section">
          <strong>Información a recopilar de cada integrante:</strong>
          <ul>
            <li>Perfil profesional y experiencia</li>
            <li>Conocimientos técnicos y especializados</li>
            <li>Red de contactos relevantes</li>
            <li>Recursos disponibles (tiempo, dinero, herramientas)</li>
            <li>Pasiones e intereses relacionados</li>
          </ul>
        </div>
      `}
    </div>
  `

  // Slide 9: Sostenibilidad y Prototipo
  slides += `
    <div class="slide">
      <h2>Desarrollo y Sostenibilidad</h2>
      
      ${data.step10Prototype ? `
        <div class="section">
          <strong>Prototipo desarrollado:</strong>
          <h3>${data.step10Prototype.prototype_type}</h3>
          <p>${data.step10Prototype.description}</p>
        </div>
        
        <div class="section">
          <strong>Estado de validación:</strong>
          <p>${data.step11ValidationStrategy ? 
            `Estrategia definida: ${data.step11ValidationStrategy.strategy}` : 
            'Pendiente: Necesitamos definir cómo validar el prototipo con usuarios reales.'}</p>
        </div>
      ` : `
        <div class="section">
          <strong>Desarrollo de prototipo:</strong>
          <p>Prototipo/MVP pendiente de desarrollo. Necesitamos crear una versión inicial para validar nuestra solución con usuarios.</p>
        </div>
      `}
      
      ${data.step8SustainableCanvas ? `
        <div class="section">
          <strong>Impacto sostenible planificado:</strong>
          <p><strong>Social:</strong> ${data.step8SustainableCanvas.social_benefits}</p>
          <p><strong>Ambiental:</strong> ${data.step8SustainableCanvas.environmental_benefits}</p>
          <p><strong>Económico:</strong> ${data.step8SustainableCanvas.economic_benefits}</p>
        </div>
      ` : `
        <div class="section">
          <strong>Análisis de sostenibilidad:</strong>
          <p>Evaluación de impacto sostenible pendiente. Importante considerar beneficios sociales, ambientales y económicos.</p>
        </div>
      `}
    </div>
  `

  // Slide 10: Plan de Acción y Próximos Pasos
  slides += `
    <div class="slide">
      <h2>Plan de Acción</h2>
      
      <div class="section">
        <strong>Estado actual del proyecto:</strong>
        <p>${getDetailedStatus(data)}</p>
      </div>
      
      <div class="section">
        <strong>Actividades inmediatas (próximas 2-4 semanas):</strong>
        <ul>
          ${getImmediateActions(data).map(action => `<li>${action}</li>`).join('')}
        </ul>
      </div>
      
      <div class="section">
        <strong>Recursos necesarios:</strong>
        <ul>
          ${getRequiredResources(data).map(resource => `<li>${resource}</li>`).join('')}
        </ul>
      </div>
      
      <div class="section">
        <strong>Decisiones críticas para el equipo:</strong>
        <ul>
          ${getTeamDecisions(data).map(decision => `<li>${decision}</li>`).join('')}
        </ul>
      </div>
    </div>
  `

  // Slide 11: Análisis Financiero y Riesgos
  slides += `
    <div class="slide">
      <h2>Análisis Financiero y Riesgos</h2>
      
      <div class="section">
        <strong>Estimación de inversión:</strong>
        <p>${getInvestmentNeeds(data)}</p>
        ${getFinancialNeed(data) ? `<p>${getFinancialNeed(data)}</p>` : ''}
      </div>
      
      <div class="section">
        <strong>Timeline estimado:</strong>
        <p>${getTimeline(data)}</p>
      </div>
      
      <div class="section">
        <strong>Principales riesgos identificados:</strong>
        <ul>
          ${getMainRisks(data).map(risk => `<li>${risk}</li>`).join('')}
        </ul>
      </div>
      
      <div class="section">
        <strong>Estrategias de mitigación:</strong>
        <ul>
          <li>Validación temprana con clientes para reducir riesgo de mercado</li>
          <li>Desarrollo iterativo para minimizar inversión inicial</li>
          <li>Búsqueda de mentores y asesores especializados</li>
          <li>Establecimiento de métricas claras de progreso</li>
        </ul>
      </div>
    </div>
  `

  return slides
}

function getSimpleStyles(): string {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background: white;
      color: #333;
      line-height: 1.6;
    }
    
    .nav {
      position: fixed;
      top: 20px;
      right: 20px;
      display: flex;
      gap: 10px;
      z-index: 1000;
      background: white;
      padding: 10px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .nav button {
      background: #2563eb;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    
    .nav button:hover {
      background: #1d4ed8;
    }
    
    .nav button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
    
    .print-btn {
      background: #059669 !important;
    }
    
    .print-btn:hover {
      background: #047857 !important;
    }
    
    #slideCounter {
      display: flex;
      align-items: center;
      padding: 0 10px;
      font-size: 14px;
      color: #6b7280;
    }
    
    .presentation {
      max-width: 900px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    
    .slide {
      display: none;
      min-height: 80vh;
      padding: 60px 40px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    
    .slide.active {
      display: block;
    }
    
    .slide h1 {
      font-size: 3rem;
      margin-bottom: 20px;
      color: #1f2937;
      text-align: center;
      font-weight: 300;
    }
    
    .slide h2 {
      font-size: 2.5rem;
      margin-bottom: 30px;
      color: #1f2937;
      font-weight: 300;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
    }
    
    .slide h3 {
      font-size: 1.8rem;
      margin-bottom: 20px;
      color: #2563eb;
      font-weight: 400;
    }
    
    .subtitle {
      font-size: 1.5rem;
      text-align: center;
      color: #6b7280;
      margin-bottom: 40px;
    }
    
    .date {
      position: absolute;
      bottom: 40px;
      right: 40px;
      color: #9ca3af;
      font-size: 1rem;
    }
    
    .section {
      margin-bottom: 30px;
    }
    
    .section strong {
      display: block;
      margin-bottom: 8px;
      color: #374151;
      font-size: 1.1rem;
    }
    
    .section p {
      font-size: 1rem;
      color: #4b5563;
      margin-left: 20px;
    }
    
    .section ul {
      margin-left: 40px;
      color: #4b5563;
    }
    
    .section li {
      margin-bottom: 8px;
    }
    
    .executive-summary {
      background: #f8f9fa;
      padding: 30px;
      border-radius: 8px;
      margin: 30px 0;
      border-left: 4px solid #2563eb;
    }
    
    .summary-item {
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .summary-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
    
    .summary-item strong {
      display: inline;
      margin-right: 8px;
      color: #1f2937;
    }
    
    .selected-idea {
      background: #dcfce7;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #16a34a;
    }
    
    @media print {
      .nav { display: none; }
      .slide { 
        page-break-after: always;
        display: block !important;
        min-height: auto;
        border: none;
        margin: 0;
      }
      .slide:last-child { page-break-after: auto; }
      body { background: white; }
    }
    
    @media (max-width: 768px) {
      .presentation {
        padding: 20px 10px;
      }
      
      .slide {
        padding: 40px 20px;
      }
      
      .slide h1 {
        font-size: 2rem;
      }
      
      .slide h2 {
        font-size: 1.8rem;
      }
      
      .nav {
        position: relative;
        top: auto;
        right: auto;
        justify-content: center;
        margin-bottom: 20px;
      }
    }
  `
}

// Funciones auxiliares para generar contenido inteligente
function getProjectStatus(data: JournalData): string {
  const completedSteps = []
  if (data.step1?.length > 0) completedSteps.push('equipo')
  if (data.step2) completedSteps.push('problema')
  if (data.step4?.length > 0) completedSteps.push('ideación')
  if (data.step5VP) completedSteps.push('propuesta')
  if (data.step10Prototype) completedSteps.push('prototipo')
  
  const completion = (completedSteps.length / 5) * 100
  
  if (completion >= 80) return 'Avanzado - Listo para validación'
  if (completion >= 60) return 'Intermedio - Desarrollando MVP'
  if (completion >= 40) return 'Inicial - Definiendo propuesta'
  return 'Concepto - Investigación inicial'
}

function getInvestmentNeeds(data: JournalData): string {
  const hasPrototype = data.step10Prototype
  const hasValidation = data.step11ValidationStrategy
  
  if (hasPrototype && hasValidation) return '$50,000 - $150,000 (escalamiento)'
  if (hasPrototype) return '$20,000 - $50,000 (validación)'
  if (data.step5VP) return '$5,000 - $20,000 (prototipo)'
  return '$1,000 - $5,000 (investigación)'
}

function getTimeline(data: JournalData): string {
  const hasPrototype = data.step10Prototype
  const hasValidation = data.step11ValidationStrategy
  
  if (hasPrototype && hasValidation) return '3-6 meses al mercado'
  if (hasPrototype) return '2-4 meses para validación'
  if (data.step5VP) return '1-3 meses para MVP'
  return '2-6 meses para definir propuesta'
}

function getTeamStrengths(teamData: any[]): string {
  const skills = []
  const resources = []
  
  teamData.forEach(member => {
    if (member.what_i_know) skills.push(member.what_i_know)
    if (member.what_i_have) resources.push(member.what_i_have)
  })
  
  const allSkills = skills.join(', ')
  const allResources = resources.join(', ')
  
  return `Conocimientos: ${allSkills || 'Por mapear'}. Recursos: ${allResources || 'Por inventariar'}.`
}

function getTeamGaps(data: JournalData): string {
  const gaps = []
  
  if (!data.step5VP) gaps.push('definición de propuesta de valor')
  if (!data.step10Prototype) gaps.push('desarrollo técnico')
  if (!data.step11ValidationStrategy) gaps.push('validación de mercado')
  if (!data.step5Buyer) gaps.push('conocimiento del cliente')
  
  return gaps.length > 0 ? gaps.join(', ') : 'Equipo completo según análisis actual'
}

function getDetailedStatus(data: JournalData): string {
  const completed = []
  const pending = []
  
  if (data.step1?.length > 0) completed.push('análisis de equipo')
  else pending.push('mapeo de recursos del equipo')
  
  if (data.step2) completed.push('identificación del problema')
  else pending.push('investigación de mercado')
  
  if (data.step4?.length > 0) completed.push('generación de ideas')
  else pending.push('sesiones de ideación')
  
  if (data.step5VP) completed.push('propuesta de valor')
  else pending.push('definición de propuesta única')
  
  if (data.step10Prototype) completed.push('prototipo funcional')
  else pending.push('desarrollo de MVP')
  
  const status = completed.length > 0 ? `Completado: ${completed.join(', ')}.` : ''
  const next = pending.length > 0 ? ` Pendiente: ${pending.slice(0, 3).join(', ')}.` : ''
  
  return status + next
}

function getImmediateActions(data: JournalData): string[] {
  const actions = []
  
  if (!data.step1?.length) actions.push('Completar análisis de medios personales del equipo')
  if (!data.step2) actions.push('Investigar y validar el problema del mercado')
  if (!data.step4?.length) actions.push('Realizar sesiones de brainstorming para generar ideas')
  if (!data.step5VP) actions.push('Definir propuesta de valor única')
  if (!data.step5Buyer) actions.push('Crear perfil detallado del cliente objetivo')
  if (!data.step10Prototype) actions.push('Desarrollar MVP o prototipo inicial')
  if (!data.step11ValidationStrategy) actions.push('Diseñar estrategia de validación con clientes')
  
  return actions.slice(0, 4) // Máximo 4 acciones inmediatas
}

function getRequiredResources(data: JournalData): string[] {
  const resources = []
  
  if (!data.step2) resources.push('Tiempo para investigación de mercado (20-40 horas)')
  if (!data.step10Prototype) resources.push('Presupuesto para desarrollo técnico ($5,000-15,000)')
  if (!data.step11ValidationStrategy) resources.push('Acceso a clientes potenciales para entrevistas')
  if (data.step10Prototype && !data.step11ValidationStrategy) resources.push('Presupuesto para testeo de mercado ($2,000-5,000)')
  
  if (resources.length === 0) resources.push('Financiamiento para escalamiento')
  
  return resources
}

function getTeamDecisions(data: JournalData): string[] {
  const decisions = []
  
  if (!data.step1?.length) decisions.push('¿Quién lidera cada área del proyecto?')
  if (!data.step2) decisions.push('¿En qué mercado específico nos enfocamos?')
  if (data.step4?.length > 1 && !data.step4.find(i => i.is_selected)) {
    decisions.push('¿Cuál idea priorizamos para desarrollo?')
  }
  if (!data.step5Buyer) decisions.push('¿Quién es nuestro cliente ideal inicial?')
  if (!data.step10Prototype) decisions.push('¿Qué tipo de MVP desarrollamos primero?')
  if (data.step10Prototype && !data.step11ValidationStrategy) {
    decisions.push('¿Cómo validamos la solución con clientes reales?')
  }
  
  if (decisions.length === 0) decisions.push('¿Cuándo y cómo buscamos inversión externa?')
  
  return decisions.slice(0, 3) // Máximo 3 decisiones clave
}

function getFinancialNeed(data: JournalData): string | null {
  if (data.step10Prototype && data.step11ValidationStrategy) {
    return 'Inversión Seed: $100,000-500,000 para escalamiento y equipo'
  }
  if (data.step10Prototype) {
    return 'Funding inicial: $10,000-30,000 para validación de mercado'
  }
  if (data.step5VP) {
    return 'Presupuesto MVP: $5,000-15,000 para desarrollo inicial'
  }
  return null
}

function getMainRisks(data: JournalData): string[] {
  const risks = []
  
  if (!data.step2) risks.push('Mercado no validado - podríamos resolver un problema inexistente')
  if (!data.step5Buyer) risks.push('Cliente indefinido - sin claridad sobre quién pagará')
  if (!data.step11ValidationStrategy) risks.push('Falta de validación - desarrollar sin feedback del mercado')
  
  risks.push('Competencia establecida con más recursos')
  risks.push('Timing de mercado incorrecto')
  
  if (!data.step1?.length) risks.push('Equipo incompleto para ejecutar la visión')
  
  return risks.slice(0, 4) // Máximo 4 riesgos principales
}

function getNavigationScript(): string {
  return `
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    
    function updateSlideCounter() {
      document.getElementById('slideCounter').textContent = (currentSlide + 1) + ' / ' + totalSlides;
      document.getElementById('prevBtn').disabled = currentSlide === 0;
      document.getElementById('nextBtn').disabled = currentSlide === totalSlides - 1;
    }
    
    function showSlide(n) {
      slides.forEach(slide => slide.classList.remove('active'));
      if (slides[n]) {
        slides[n].classList.add('active');
        currentSlide = n;
        updateSlideCounter();
      }
    }
    
    function nextSlide() {
      if (currentSlide < totalSlides - 1) {
        showSlide(currentSlide + 1);
      }
    }
    
    function previousSlide() {
      if (currentSlide > 0) {
        showSlide(currentSlide - 1);
      }
    }
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        previousSlide();
      }
      if (e.key === 'Home') {
        e.preventDefault();
        showSlide(0);
      }
      if (e.key === 'End') {
        e.preventDefault();
        showSlide(totalSlides - 1);
      }
    });
    
    updateSlideCounter();
    console.log('Presentación cargada:', totalSlides, 'slides');
  `
}