import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Database } from '../database.types'

type Tables = Database['public']['Tables']
type Team = Tables['teams']['Row']
type Journal = Tables['journals']['Row']
type Idea = Tables['ideas']['Row']
type Step1Data = Tables['step1_means']['Row'][]
type Step2Data = Tables['step2_problem']['Row'] | null
type Step3Data = Tables['step3_trends']['Row'][]
type Step4Data = Tables['step4_ideas']['Row'][]
type Step5BuyerData = Tables['step5_buyer']['Row'] | null
type Step5VPData = Tables['step5_vpcanvas']['Row'] | null

// Sustainability module types
type SustainableCanvasData = Tables['sustainable_canvas']['Row'] | null
type InnovationPatternsData = Tables['innovation_patterns']['Row'][]
type PrototypeData = Tables['prototypes']['Row'] | null
type ValidationStrategyData = Tables['validation_strategies']['Row'] | null
type EcosystemActorsData = Tables['ecosystem_actors']['Row'][]
type SustainabilityReflectionData = Tables['sustainability_reflections']['Row'] | null

interface JournalData {
  journal: Journal
  team: Team
  idea?: Idea | null
  // Effectual analysis data (steps 1-5)
  step1: Step1Data
  step2: Step2Data
  step3: Step3Data
  step4: Step4Data
  step5Buyer: Step5BuyerData
  step5VP: Step5VPData
  // Sustainability data (steps 8-13)
  step8SustainableCanvas?: SustainableCanvasData
  step9InnovationPatterns?: InnovationPatternsData
  step10Prototype?: PrototypeData
  step11ValidationStrategy?: ValidationStrategyData
  step12EcosystemActors?: EcosystemActorsData
  step13SustainabilityReflection?: SustainabilityReflectionData
}

export async function generateWorkingPresentationPPTX(data: JournalData) {
  try {
    console.log('🎬 Generando presentación con datos:', data)
    
    // Crear HTML con los datos reales
    const htmlContent = generateWorkingPresentationHTML(data)
    
    // Crear un blob con el contenido HTML
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    
    // Abrir en una nueva ventana
    const printWindow = window.open(url, '_blank', 'width=1400,height=900,scrollbars=yes')
    if (!printWindow) {
      throw new Error('No se pudo abrir la ventana de presentación')
    }
    
    // Limpiar la URL después de un tiempo
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 30000)
    
  } catch (error) {
    console.error('Error generating working presentation:', error)
    throw new Error('Error al generar la presentación')
  }
}

function generateWorkingPresentationHTML(data: JournalData): string {
  const currentDate = format(new Date(), 'dd \'de\' MMMM \'de\' yyyy', { locale: es })
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.journal?.title || 'Bitácora de Oportunidades'} - Presentación Profesional</title>
      <style>
        ${getWorkingPresentationStyles()}
      </style>
    </head>
    <body>
      <div class="presentation-container">
        <!-- Navigation -->
        <div class="nav-bar">
          <button onclick="previousSlide()" id="prevBtn">← Anterior</button>
          <span id="slideCounter">1 / 15</span>
          <button onclick="nextSlide()" id="nextBtn">Siguiente →</button>
          <button onclick="window.print()" class="print-btn">🖨️ Imprimir</button>
        </div>

        <!-- Slides Container -->
        <div class="slides-container" id="slidesContainer">
          ${generateWorkingSlides(data, currentDate)}
        </div>
      </div>

      <script>
        ${getPresentationScript()}
      </script>
    </body>
    </html>
  `
}

function getWorkingPresentationStyles(): string {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #333;
      overflow-x: hidden;
    }

    .presentation-container {
      width: 100vw;
      height: 100vh;
      position: relative;
    }

    .nav-bar {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.8);
      padding: 12px 24px;
      border-radius: 30px;
      display: flex;
      align-items: center;
      gap: 20px;
      z-index: 1000;
      backdrop-filter: blur(10px);
    }

    .nav-bar button {
      background: #4f46e5;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .nav-bar button:hover:not(:disabled) {
      background: #6366f1;
      transform: translateY(-2px);
    }

    .nav-bar button:disabled {
      background: #6b7280;
      cursor: not-allowed;
      opacity: 0.5;
    }

    .print-btn {
      background: #059669 !important;
    }

    .print-btn:hover {
      background: #047857 !important;
    }

    #slideCounter {
      color: white;
      font-weight: 600;
      min-width: 80px;
      text-align: center;
    }

    .slides-container {
      width: 100%;
      height: 100vh;
      position: relative;
      overflow: hidden;
    }

    .slide {
      width: 100%;
      height: 100vh;
      padding: 80px 60px 60px 60px;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
      background: white;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }

    .slide.active {
      opacity: 1;
      z-index: 10;
    }

    .slide.title-slide {
      background: linear-gradient(135deg, #1e3a8a, #3730a3, #4338ca);
      color: white;
      justify-content: center;
      align-items: center;
      text-align: center;
    }

    .slide.section-slide {
      background: linear-gradient(135deg, #059669, #047857, #065f46);
      color: white;
      justify-content: center;
      align-items: center;
      text-align: center;
    }

    h1 {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    h2 {
      font-size: 2.5rem;
      color: #1f2937;
      font-weight: 700;
      margin-bottom: 2rem;
      border-bottom: 4px solid #4f46e5;
      padding-bottom: 1rem;
    }

    .title-slide h2, .section-slide h2 {
      color: white;
      border-bottom: 4px solid rgba(255,255,255,0.3);
    }

    h3 {
      font-size: 1.8rem;
      color: #4f46e5;
      font-weight: 600;
      margin: 1.5rem 0 1rem 0;
    }

    .slide-subtitle {
      font-size: 1.5rem;
      color: rgba(255,255,255,0.9);
      margin-bottom: 2rem;
      font-weight: 300;
    }

    .slide-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .info-grid {
      background: rgba(255,255,255,0.1);
      border-radius: 15px;
      padding: 2rem;
      border: 2px solid rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
    }

    .info-item {
      display: flex;
      align-items: center;
      margin: 1rem 0;
      font-size: 1.2rem;
    }

    .info-label {
      font-weight: 600;
      margin-right: 1rem;
      min-width: 120px;
    }

    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      height: 100%;
    }

    .three-column {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 1.5rem;
      height: 100%;
    }

    .card {
      background: #f8fafc;
      border-radius: 12px;
      padding: 1.5rem;
      border-left: 6px solid #4f46e5;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      height: fit-content;
    }

    .card h4 {
      color: #4f46e5;
      font-size: 1.2rem;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
    }

    .card-icon {
      font-size: 1.5rem;
      margin-right: 0.5rem;
    }

    .card p {
      color: #374151;
      line-height: 1.6;
      margin: 0.5rem 0;
    }

    .highlight-box {
      background: linear-gradient(135deg, #dbeafe, #bfdbfe);
      border: 2px solid #3b82f6;
      border-radius: 12px;
      padding: 1.5rem;
      margin: 1rem 0;
    }

    .highlight-box h3 {
      color: #1e40af;
      margin-top: 0;
    }

    .metrics-row {
      display: flex;
      justify-content: space-around;
      margin: 2rem 0;
    }

    .metric-box {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      border-top: 4px solid #4f46e5;
      min-width: 120px;
    }

    .metric-number {
      font-size: 2rem;
      font-weight: 800;
      color: #4f46e5;
      display: block;
    }

    .metric-label {
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 0.5rem;
      font-weight: 500;
    }

    .list-enhanced {
      list-style: none;
      padding: 0;
    }

    .list-enhanced li {
      background: white;
      margin: 1rem 0;
      padding: 1rem;
      border-radius: 8px;
      border-left: 4px solid #4f46e5;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .list-enhanced li strong {
      color: #4f46e5;
      display: block;
      margin-bottom: 0.5rem;
    }

    .trend-type {
      display: inline-block;
      background: #4f46e5;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.875rem;
      font-weight: 600;
      margin: 0.5rem 0;
    }

    .selected-idea {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      border-color: #f59e0b;
    }

    .selected-idea h4 {
      color: #d97706;
    }

    .no-data {
      text-align: center;
      color: #6b7280;
      font-style: italic;
      padding: 2rem;
      background: #f9fafb;
      border-radius: 12px;
      border: 2px dashed #d1d5db;
    }

    @media print {
      body { background: white; }
      .nav-bar { display: none; }
      .slide { 
        page-break-after: always; 
        position: relative; 
        opacity: 1; 
        height: auto; 
        min-height: 100vh;
        padding: 1in;
      }
      .slide:last-child { page-break-after: auto; }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .slide.active {
      animation: slideIn 0.5s ease-out;
    }
  `
}

function getCompletedSteps(data: JournalData): string[] {
  const steps = []
  
  if (data.step1?.length > 0) steps.push('Medios Personales')
  if (data.step2) steps.push('Problema/Necesidad') 
  if (data.step3?.length > 0) steps.push('Tendencias')
  if (data.step4?.length > 0) steps.push('Ideación')
  if (data.step5Buyer) steps.push('Buyer Persona')
  if (data.step5VP) steps.push('Propuesta de Valor')
  if (data.step8SustainableCanvas) steps.push('Canvas Sostenible')
  if (data.step9InnovationPatterns?.length > 0) steps.push('Patrones de Innovación')
  if (data.step10Prototype) steps.push('Prototipo')
  if (data.step11ValidationStrategy) steps.push('Validación')
  if (data.step12EcosystemActors?.length > 0) steps.push('Ecosistema')
  if (data.step13SustainabilityReflection) steps.push('Reflexión')
  
  return steps
}

function generateWorkingSlides(data: JournalData, currentDate: string): string {
  console.log('📝 Generando slides con datos:', {
    journal: data.journal?.title,
    team: data.team?.name,
    step1Count: data.step1?.length,
    step2: !!data.step2,
    step3Count: data.step3?.length,
    step4Count: data.step4?.length,
    step5Buyer: !!data.step5Buyer,
    step5VP: !!data.step5VP,
    sustainableCanvas: !!data.step8SustainableCanvas,
    innovationPatterns: data.step9InnovationPatterns?.length,
    prototype: !!data.step10Prototype,
    validation: !!data.step11ValidationStrategy,
    ecosystem: data.step12EcosystemActors?.length,
    reflection: !!data.step13SustainabilityReflection
  })

  // Calcular progreso y filtrar slides completadas
  const completedSteps = getCompletedSteps(data)
  const slideCount = Math.max(5, completedSteps.length + 2) // Mínimo 5 slides

  return `
    <!-- Slide 1: Título -->
    <div class="slide title-slide active">
      <h1>🌱 ${data.journal?.title || 'BITÁCORA DE OPORTUNIDADES'}</h1>
      <div class="slide-subtitle">Emprendimiento Sostenible & Análisis Efectual</div>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">📊 Equipo:</span>
          <span>${data.team?.name || 'Equipo Emprendedor'}</span>
        </div>
        <div class="info-item">
          <span class="info-label">👥 Integrantes:</span>
          <span>${data.step1?.length || 0} emprendedor${(data.step1?.length || 0) !== 1 ? 'es' : ''}</span>
        </div>
        <div class="info-item">
          <span class="info-label">📅 Fecha:</span>
          <span>${currentDate}</span>
        </div>
        <div class="info-item">
          <span class="info-label">🎯 Progreso:</span>
          <span>${completedSteps.length} de 13 pasos completados</span>
        </div>
        ${data.idea ? `
          <div class="info-item">
            <span class="info-label">💡 Oportunidad:</span>
            <span>${data.idea.title}</span>
          </div>
        ` : ''}
      </div>
    </div>

    <!-- Slide 2: Resumen Ejecutivo -->
    <div class="slide">
      <h2>📋 Resumen Ejecutivo</h2>
      <div class="slide-content">
        ${generateExecutiveSummaryContent(data)}
      </div>
    </div>

    <!-- Slide 3: Medios Personales -->
    <div class="slide">
      <h2>👥 Paso 1: Medios Personales</h2>
      <div class="slide-content">
        ${generateStep1Content(data.step1)}
      </div>
    </div>

    <!-- Slide 4: Problema -->
    <div class="slide">
      <h2>🎯 Paso 2: Problema o Necesidad</h2>
      <div class="slide-content">
        ${generateStep2Content(data.step2)}
      </div>
    </div>

    <!-- Slide 5: Tendencias -->
    <div class="slide">
      <h2>📈 Paso 3: Tendencias del Entorno</h2>
      <div class="slide-content">
        ${generateStep3Content(data.step3)}
      </div>
    </div>

    <!-- Slide 6: Ideas -->
    <div class="slide">
      <h2>💡 Paso 4: Ideación y Selección</h2>
      <div class="slide-content">
        ${generateStep4Content(data.step4)}
      </div>
    </div>

    <!-- Slide 7: Buyer Persona -->
    <div class="slide">
      <h2>👤 Paso 5A: Buyer Persona</h2>
      <div class="slide-content">
        ${generateStep5BuyerContent(data.step5Buyer)}
      </div>
    </div>

    <!-- Slide 8: Propuesta de Valor -->
    <div class="slide">
      <h2>💎 Paso 5B: Propuesta de Valor</h2>
      <div class="slide-content">
        ${generateStep5VPContent(data.step5VP)}
      </div>
    </div>

    <!-- Slide 9: Transición Sostenibilidad -->
    <div class="slide section-slide">
      <h1>🌱 EMPRENDIMIENTO SOSTENIBLE</h1>
      <div class="slide-subtitle">Integrando Impacto Social, Ambiental y Económico</div>
      <div class="info-grid">
        <p style="font-size: 1.3rem; line-height: 1.6;">
          Ahora analizamos cómo el emprendimiento puede generar valor económico 
          mientras crea un impacto positivo en la sociedad y el medio ambiente.
        </p>
        <br>
        <p style="font-size: 1.1rem;">
          <strong>Módulos:</strong> Canvas Sostenible, Innovación, Prototipo, Validación, Ecosistema y Reflexión Final
        </p>
      </div>
    </div>

    <!-- Slide 10: Canvas Sostenible -->
    <div class="slide">
      <h2>🌱 Paso 8: Canvas Sostenible</h2>
      <div class="slide-content">
        ${generateStep8Content(data.step8SustainableCanvas)}
      </div>
    </div>

    <!-- Slide 11: Patrones de Innovación -->
    <div class="slide">
      <h2>💡 Paso 9: Patrones de Innovación</h2>
      <div class="slide-content">
        ${generateStep9Content(data.step9InnovationPatterns)}
      </div>
    </div>

    <!-- Slide 12: Prototipo -->
    <div class="slide">
      <h2>🔧 Paso 10: Prototipo y MVP</h2>
      <div class="slide-content">
        ${generateStep10Content(data.step10Prototype)}
      </div>
    </div>

    <!-- Slide 13: Validación -->
    <div class="slide">
      <h2>🎯 Paso 11: Estrategia de Validación</h2>
      <div class="slide-content">
        ${generateStep11Content(data.step11ValidationStrategy)}
      </div>
    </div>

    <!-- Slide 14: Ecosistema -->
    <div class="slide">
      <h2>🤝 Paso 12: Mapa del Ecosistema</h2>
      <div class="slide-content">
        ${generateStep12Content(data.step12EcosystemActors)}
      </div>
    </div>

    <!-- Slide 15: Reflexión -->
    <div class="slide">
      <h2>🔁 Paso 13: Reflexión Final</h2>
      <div class="slide-content">
        ${generateStep13Content(data.step13SustainabilityReflection)}
      </div>
    </div>

    <!-- Slide 16: Conclusiones -->
    <div class="slide">
      <h2>🎉 Conclusiones y Próximos Pasos</h2>
      <div class="slide-content">
        ${generateConclusionsContent(data)}
      </div>
    </div>
  `
}

function generateExecutiveSummaryContent(data: JournalData): string {
  const selectedIdea = data.step4?.find(idea => idea.selected)
  
  return `
    <div class="two-column">
      <div>
        <div class="highlight-box">
          <h3>💡 Oportunidad Identificada</h3>
          <p><strong>${selectedIdea?.idea || data.idea?.title || 'Oportunidad de Emprendimiento'}</strong></p>
          ${data.step2?.title ? `<p><strong>Problema:</strong> ${data.step2.title}</p>` : ''}
          ${selectedIdea?.kind ? `<p><strong>Tipo:</strong> ${selectedIdea.kind}</p>` : ''}
        </div>
        
        <div class="card">
          <h4><span class="card-icon">🎯</span>Propuesta de Valor</h4>
          <p>${data.step5VP?.products_services || 'Propuesta de valor en desarrollo...'}</p>
        </div>
      </div>
      
      <div>
        <div class="metrics-row">
          <div class="metric-box">
            <span class="metric-number">${data.step3?.length || 0}</span>
            <span class="metric-label">Tendencias</span>
          </div>
          <div class="metric-box">
            <span class="metric-number">${data.step4?.length || 0}</span>
            <span class="metric-label">Ideas</span>
          </div>
          <div class="metric-box">
            <span class="metric-number">${data.step9InnovationPatterns?.length || 0}</span>
            <span class="metric-label">Patrones</span>
          </div>
        </div>
        
        <div class="card">
          <h4><span class="card-icon">🌱</span>Impacto Sostenible</h4>
          <p>${data.step8SustainableCanvas?.social_benefits || 'Impacto social y ambiental positivo a través de un modelo de negocio sostenible'}</p>
        </div>
      </div>
    </div>
  `
}

function generateStep1Content(step1Data: Step1Data): string {
  if (!step1Data || step1Data.length === 0) {
    return '<div class="no-data">No hay datos de medios personales disponibles</div>'
  }

  const membersCards = step1Data.map((member, index) => `
    <div class="card">
      <h4><span class="card-icon">👤</span>Emprendedor ${index + 1}</h4>
      ${member.who_i_am ? `<p><strong>Quién soy:</strong> ${member.who_i_am}</p>` : ''}
      ${member.what_i_know ? `<p><strong>Qué sé:</strong> ${member.what_i_know}</p>` : ''}
      ${member.who_i_know ? `<p><strong>A quién conozco:</strong> ${member.who_i_know}</p>` : ''}
      ${member.what_i_have ? `<p><strong>Qué tengo:</strong> ${member.what_i_have}</p>` : ''}
    </div>
  `).join('')

  return `
    <p style="text-align: center; color: #6b7280; margin-bottom: 1rem;">
      Inventario de recursos del equipo emprendedor
    </p>
    <div class="${step1Data.length > 2 ? 'three-column' : 'two-column'}">
      ${membersCards}
    </div>
  `
}

function generateStep2Content(step2Data: Step2Data): string {
  if (!step2Data) {
    return '<div class="no-data">No hay datos del problema identificado</div>'
  }

  return `
    <div class="highlight-box">
      <h3>${step2Data.title}</h3>
    </div>
    <div class="two-column">
      <div>
        <div class="card">
          <h4><span class="card-icon">📝</span>Descripción del Problema</h4>
          <p>${step2Data.description}</p>
        </div>
        
        <div class="card">
          <h4><span class="card-icon">👥</span>Población Afectada</h4>
          <p>${step2Data.affected}</p>
        </div>
      </div>
      
      <div>
        <div class="card">
          <h4><span class="card-icon">📊</span>Relevancia e Impacto</h4>
          <p>${step2Data.relevance}</p>
        </div>
        
        <div class="card">
          <h4><span class="card-icon">🔗</span>Conexión con Medios</h4>
          <p>${step2Data.link_to_means}</p>
        </div>
      </div>
    </div>
  `
}

function generateStep3Content(step3Data: Step3Data): string {
  if (!step3Data || step3Data.length === 0) {
    return '<div class="no-data">No hay tendencias analizadas</div>'
  }

  const trendsCards = step3Data.map((trend, index) => `
    <div class="card">
      <h4><span class="card-icon">${getTrendIcon(trend.type)}</span>${trend.name}</h4>
      <span class="trend-type">${trend.type}</span>
      <p><strong>Descripción:</strong> ${trend.brief}</p>
      ${trend.example ? `<p><strong>Ejemplo:</strong> ${trend.example}</p>` : ''}
      ${trend.source_apa ? `<p><strong>Fuente:</strong> ${trend.source_apa}</p>` : ''}
    </div>
  `).join('')

  return `
    <p style="text-align: center; color: #6b7280; margin-bottom: 1rem;">
      ${step3Data.length} tendencias clave identificadas
    </p>
    <div class="${step3Data.length > 2 ? 'two-column' : 'three-column'}">
      ${trendsCards}
    </div>
  `
}

function generateStep4Content(step4Data: Step4Data): string {
  if (!step4Data || step4Data.length === 0) {
    return '<div class="no-data">No hay ideas generadas</div>'
  }

  const selectedIdea = step4Data.find(idea => idea.selected)
  const otherIdeas = step4Data.filter(idea => !idea.selected).slice(0, 3)
  
  return `
    <p style="text-align: center; color: #6b7280; margin-bottom: 1rem;">
      De ${step4Data.length} ideas generadas, se seleccionó la más prometedora
    </p>
    <div class="two-column">
      <div>
        ${selectedIdea ? `
          <div class="card selected-idea">
            <h4><span class="card-icon">⭐</span>Idea Seleccionada</h4>
            <p><strong>${selectedIdea.idea}</strong></p>
            <p><strong>Tipo:</strong> ${selectedIdea.kind}</p>
            <p><strong>Innovación:</strong> ${selectedIdea.innovation_level}</p>
            <p><strong>Factibilidad:</strong> ${selectedIdea.feasibility}</p>
            ${selectedIdea.justification ? `<p><strong>Justificación:</strong> ${selectedIdea.justification}</p>` : ''}
          </div>
        ` : '<div class="no-data">No hay idea seleccionada</div>'}
      </div>
      
      <div>
        <h3>🔍 Otras Ideas Exploradas</h3>
        ${otherIdeas.length > 0 ? otherIdeas.map((idea) => `
          <div class="card">
            <h4><span class="card-icon">💭</span>${idea.idea}</h4>
            <p><strong>Tipo:</strong> ${idea.kind}</p>
            <p><strong>Innovación:</strong> ${idea.innovation_level}</p>
          </div>
        `).join('') : '<div class="no-data">No hay otras ideas</div>'}
      </div>
    </div>
  `
}

function generateStep5BuyerContent(buyerData: Step5BuyerData): string {
  if (!buyerData) {
    return '<div class="no-data">Buyer Persona no definido</div>'
  }

  return `
    <div class="highlight-box">
      <h3>"${buyerData.name}" - Cliente Objetivo</h3>
      <p><strong>Edad:</strong> ${buyerData.age} años | <strong>Ocupación:</strong> ${buyerData.occupation}</p>
    </div>
    
    <div class="three-column">
      <div class="card">
        <h4><span class="card-icon">🎯</span>Motivaciones</h4>
        <p>${buyerData.motivations}</p>
      </div>
      
      <div class="card">
        <h4><span class="card-icon">😤</span>Frustraciones</h4>
        <p>${buyerData.pains}</p>
      </div>
      
      <div class="card">
        <h4><span class="card-icon">✨</span>Necesidades</h4>
        <p>${buyerData.needs}</p>
      </div>
    </div>
  `
}

function generateStep5VPContent(vpData: Step5VPData): string {
  if (!vpData) {
    return '<div class="no-data">Propuesta de valor no definida</div>'
  }

  return `
    <div class="two-column">
      <div>
        <h3>👤 Perfil del Cliente</h3>
        <div class="card">
          <h4><span class="card-icon">⚙️</span>Trabajos del Cliente</h4>
          <p>${vpData.customer_jobs}</p>
        </div>
        
        <div class="card">
          <h4><span class="card-icon">😞</span>Dolores</h4>
          <p>${vpData.customer_pains}</p>
        </div>
        
        <div class="card">
          <h4><span class="card-icon">😊</span>Alegrías</h4>
          <p>${vpData.customer_gains}</p>
        </div>
      </div>
      
      <div>
        <h3>💎 Mapa de Valor</h3>
        <div class="card">
          <h4><span class="card-icon">🛍️</span>Productos y Servicios</h4>
          <p>${vpData.products_services}</p>
        </div>
        
        <div class="card">
          <h4><span class="card-icon">💊</span>Aliviadores de Dolor</h4>
          <p>${vpData.pain_relievers}</p>
        </div>
        
        <div class="card">
          <h4><span class="card-icon">🚀</span>Generadores de Alegría</h4>
          <p>${vpData.gain_creators}</p>
        </div>
      </div>
    </div>
  `
}

function generateStep8Content(canvasData?: SustainableCanvasData): string {
  if (!canvasData) {
    return '<div class="no-data">Canvas sostenible no completado</div>'
  }

  return `
    <div class="three-column">
      <div>
        <h3>👥 Lado del Cliente</h3>
        <div class="card">
          <h4><span class="card-icon">🎯</span>Segmentos</h4>
          <p>${canvasData.customer_segments || 'No especificado'}</p>
        </div>
        
        <div class="card">
          <h4><span class="card-icon">💎</span>Propuestas de Valor</h4>
          <p>${canvasData.value_propositions || 'No especificado'}</p>
        </div>
      </div>
      
      <div>
        <h3>🌍 Impacto Sostenible</h3>
        <div class="card">
          <h4><span class="card-icon">🤝</span>Beneficios Sociales</h4>
          <p>${canvasData.social_benefits || 'No especificado'}</p>
        </div>
        
        <div class="card">
          <h4><span class="card-icon">🌱</span>Beneficios Ambientales</h4>
          <p>${canvasData.environmental_benefits || 'No especificado'}</p>
        </div>
      </div>
      
      <div>
        <h3>🏢 Lado del Negocio</h3>
        <div class="card">
          <h4><span class="card-icon">🔑</span>Recursos Clave</h4>
          <p>${canvasData.key_resources || 'No especificado'}</p>
        </div>
        
        <div class="card">
          <h4><span class="card-icon">💰</span>Ingresos</h4>
          <p>${canvasData.revenue_streams || 'No especificado'}</p>
        </div>
      </div>
    </div>
  `
}

function generateStep9Content(patternsData?: InnovationPatternsData): string {
  if (!patternsData || patternsData.length === 0) {
    return '<div class="no-data">Patrones de innovación no completados</div>'
  }

  const patternsCards = patternsData.map(pattern => `
    <div class="card">
      <h4><span class="card-icon">💡</span>${pattern.pattern_name} ${pattern.is_primary ? '(Principal)' : ''}</h4>
      <p><strong>Descripción:</strong> ${pattern.pattern_description || 'Sin descripción'}</p>
      <p><strong>Justificación:</strong> ${pattern.justification || 'Sin justificación'}</p>
      <p><strong>Impacto esperado:</strong> ${pattern.expected_impact || 'Sin definir'}</p>
    </div>
  `).join('')

  return `
    <p style="text-align: center; color: #6b7280; margin-bottom: 1rem;">
      ${patternsData.length} patrones de innovación identificados
    </p>
    <div class="${patternsData.length > 2 ? 'two-column' : 'three-column'}">
      ${patternsCards}
    </div>
  `
}

function generateStep10Content(prototypeData?: PrototypeData): string {
  if (!prototypeData) {
    return '<div class="no-data">Prototipo no definido</div>'
  }

  return `
    <div class="highlight-box">
      <h3>🔧 ${prototypeData.name}</h3>
      <p><strong>Tipo:</strong> ${prototypeData.type}</p>
    </div>
    
    <div class="two-column">
      <div>
        <div class="card">
          <h4><span class="card-icon">📝</span>Descripción</h4>
          <p>${prototypeData.description || 'Sin descripción'}</p>
        </div>
        
        <div class="card">
          <h4><span class="card-icon">🔬</span>Hipótesis a Validar</h4>
          <p>${prototypeData.hypothesis_to_validate || 'Sin hipótesis definida'}</p>
        </div>
      </div>
      
      <div>
        <div class="card">
          <h4><span class="card-icon">📊</span>Métricas de Aprendizaje</h4>
          <p>${prototypeData.expected_learning_metrics || 'Sin métricas definidas'}</p>
        </div>
        
        <div class="card">
          <h4><span class="card-icon">🤖</span>Sugerencia de IA</h4>
          <p>${prototypeData.ai_mvp_suggestion || 'Sin sugerencias'}</p>
        </div>
      </div>
    </div>
  `
}

function generateStep11Content(validationData?: ValidationStrategyData): string {
  if (!validationData) {
    return '<div class="no-data">Estrategia de validación no definida</div>'
  }

  return `
    <div class="metrics-row">
      <div class="metric-box">
        <span class="metric-number">${validationData.timeline_weeks || 0}</span>
        <span class="metric-label">Semanas</span>
      </div>
      <div class="metric-box">
        <span class="metric-number">$${validationData.budget_estimate?.toLocaleString() || '0'}</span>
        <span class="metric-label">Presupuesto</span>
      </div>
      <div class="metric-box">
        <span class="metric-number">${validationData.progress_percentage || 0}%</span>
        <span class="metric-label">Progreso</span>
      </div>
    </div>
    
    <div class="two-column">
      <div>
        <div class="card">
          <h4><span class="card-icon">🔬</span>Hipótesis Principal</h4>
          <p>${validationData.hypothesis || 'Sin hipótesis'}</p>
        </div>
        
        <div class="card">
          <h4><span class="card-icon">👥</span>Segmentos Objetivo</h4>
          <p>${validationData.target_segments || 'Sin segmentos definidos'}</p>
        </div>
      </div>
      
      <div>
        <div class="card">
          <h4><span class="card-icon">🛠️</span>Métodos de Validación</h4>
          <p>${validationData.validation_methods?.join(', ') || 'Sin métodos definidos'}</p>
        </div>
        
        <div class="card">
          <h4><span class="card-icon">✅</span>Criterios de Éxito</h4>
          <p>${validationData.success_criteria || 'Sin criterios definidos'}</p>
        </div>
      </div>
    </div>
  `
}

function generateStep12Content(actorsData?: EcosystemActorsData): string {
  if (!actorsData || actorsData.length === 0) {
    return '<div class="no-data">Mapa del ecosistema no completado</div>'
  }

  const actorsCards = actorsData.map(actor => `
    <div class="card">
      <h4><span class="card-icon">${getActorTypeIcon(actor.actor_type)}</span>${actor.actor_name}</h4>
      <p><strong>Tipo:</strong> ${actor.actor_type}</p>
      <p><strong>Rol:</strong> ${actor.role_description || 'Sin descripción'}</p>
      <p><strong>Soporte:</strong> ${actor.support_types?.join(', ') || 'No especificado'}</p>
      <p><strong>Estado:</strong> ${actor.relationship_status || 'No especificado'}</p>
    </div>
  `).join('')

  return `
    <p style="text-align: center; color: #6b7280; margin-bottom: 1rem;">
      ${actorsData.length} actores clave identificados
    </p>
    <div class="${actorsData.length > 3 ? 'three-column' : 'two-column'}">
      ${actorsCards}
    </div>
  `
}

function generateStep13Content(reflectionData?: SustainabilityReflectionData): string {
  if (!reflectionData) {
    return '<div class="no-data">Reflexión de sostenibilidad no completada</div>'
  }

  return `
    <div class="three-column">
      <div class="card">
        <h4><span class="card-icon">⚖️</span>Equilibrio de Impactos</h4>
        <p>${reflectionData.social_impact_balance || 'No definido'}</p>
      </div>
      
      <div class="card">
        <h4><span class="card-icon">🎯</span>Decisiones Sostenibles</h4>
        <p>${reflectionData.sustainability_decisions || 'No definidas'}</p>
      </div>
      
      <div class="card">
        <h4><span class="card-icon">📈</span>Estrategia de Escalamiento</h4>
        <p>${reflectionData.scaling_strategy || 'No definida'}</p>
      </div>
    </div>
    
    ${reflectionData.ai_generated_reflection ? `
      <div class="highlight-box">
        <h3>🤖 Reflexión Integral de IA</h3>
        <p>${reflectionData.ai_generated_reflection}</p>
      </div>
    ` : ''}
  `
}

function generateConclusionsContent(data: JournalData): string {
  const selectedIdea = data.step4?.find(idea => idea.selected)
  
  return `
    <div class="metrics-row">
      <div class="metric-box">
        <span class="metric-number">${data.step3?.length || 0}</span>
        <span class="metric-label">Tendencias</span>
      </div>
      <div class="metric-box">
        <span class="metric-number">${data.step4?.length || 0}</span>
        <span class="metric-label">Ideas</span>
      </div>
      <div class="metric-box">
        <span class="metric-number">${data.step9InnovationPatterns?.length || 0}</span>
        <span class="metric-label">Patrones</span>
      </div>
      <div class="metric-box">
        <span class="metric-number">${data.step12EcosystemActors?.length || 0}</span>
        <span class="metric-label">Actores</span>
      </div>
    </div>
    
    <div class="two-column">
      <div>
        <h3>✅ Logros Principales</h3>
        <ul class="list-enhanced">
          <li><strong>Análisis Efectual Completo</strong><br>Inventario de medios, problema identificado, y propuesta de valor</li>
          <li><strong>Modelo Sostenible</strong><br>Triple impacto social, ambiental y económico integrado</li>
          <li><strong>Estrategia Clara</strong><br>Roadmap de implementación definido</li>
          <li><strong>Ecosistema Mapeado</strong><br>Red de alianzas y actores clave identificados</li>
        </ul>
      </div>
      
      <div>
        <div class="highlight-box">
          <h3>🚀 Próximos Pasos</h3>
          <p><strong>Oportunidad:</strong> ${selectedIdea?.idea || 'Emprendimiento sostenible definido'}</p>
          <p><strong>Cliente:</strong> ${data.step5Buyer?.name || 'Buyer persona'} identificado</p>
          <p><strong>Diferenciación:</strong> Modelo sostenible con impacto verificable</p>
          <p><strong>Viabilidad:</strong> Recursos y capacidades mapeadas</p>
        </div>
        
        <div class="card">
          <h4><span class="card-icon">⚡</span>Acciones Inmediatas</h4>
          <ul>
            <li>Validar hipótesis con usuarios reales</li>
            <li>Desarrollar prototipo funcional</li>
            <li>Establecer métricas de impacto</li>
            <li>Buscar mentores y recursos</li>
          </ul>
        </div>
      </div>
    </div>
  `
}

function getPresentationScript(): string {
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
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') previousSlide();
      if (e.key === 'Home') showSlide(0);
      if (e.key === 'End') showSlide(totalSlides - 1);
    });
    
    // Initialize
    updateSlideCounter();
    
    console.log('🎬 Presentación cargada con', totalSlides, 'slides');
  `
}

// Helper functions
function getTrendIcon(type: string): string {
  const icons = {
    'Social': '👥',
    'Tecnológica': '💻',
    'Ambiental': '🌍',
    'Cultural': '🎨',
    'Consumo': '🛒',
    'Política': '🏛️',
    'Económica': '📈'
  }
  return icons[type as keyof typeof icons] || '📊'
}

function getActorTypeIcon(type: string): string {
  const icons = {
    'financial': '💰',
    'academic': '🎓',
    'business': '🏢',
    'social': '🤝',
    'institutional': '🏛️'
  }
  return icons[type as keyof typeof icons] || '🤝'
}