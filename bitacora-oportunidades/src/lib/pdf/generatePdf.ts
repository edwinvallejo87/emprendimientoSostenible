import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Database } from '../database.types'

type Tables = Database['public']['Tables']
type Team = Tables['teams']['Row']
type Journal = Tables['journals']['Row']
type Step1Data = Tables['step1_means']['Row'][]
type Step2Data = Tables['step2_problem']['Row'] | null
type Step3Data = Tables['step3_trends']['Row'][]
type Step4Data = Tables['step4_ideas']['Row'][]
type Step5BuyerData = Tables['step5_buyer']['Row'] | null
type Step5VPData = Tables['step5_vpcanvas']['Row'] | null

interface JournalData {
  journal: Journal
  team: Team
  step1: Step1Data
  step2: Step2Data
  step3: Step3Data
  step4: Step4Data
  step5Buyer: Step5BuyerData
  step5VP: Step5VPData
}

export async function generatePDF(data: JournalData) {
  // Generate HTML content
  const htmlContent = generateHTMLContent(data)
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    throw new Error('No se pudo abrir la ventana de impresión')
  }

  // Write content to the new window
  printWindow.document.write(htmlContent)
  printWindow.document.close()

  // Wait for content to load then print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)
  }
}

function generateHTMLContent(data: JournalData): string {
  const currentDate = format(new Date(), 'dd \'de\' MMMM \'de\' yyyy', { locale: es })
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bitácora de Oportunidades - ${data.journal.title}</title>
      <style>
        ${getStyleSheet()}
      </style>
    </head>
    <body>
      ${generatePortada(data, currentDate)}
      ${generateStep1Content(data.step1)}
      ${generateStep2Content(data.step2)}
      ${generateStep3Content(data.step3)}
      ${generateStep4Content(data.step4)}
      ${generateStep5Content(data.step5Buyer, data.step5VP)}
      ${generateReferences(data.step3)}
    </body>
    </html>
  `
}

function getStyleSheet(): string {
  return `
    @media print {
      body { margin: 0; }
      .page-break { page-break-before: always; }
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1c1917;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20mm;
      background: white;
    }
    
    .portada {
      text-align: center;
      margin-bottom: 60px;
      padding: 40px 0;
      border-bottom: 3px solid #059669;
    }
    
    .portada h1 {
      font-size: 28px;
      color: #059669;
      margin-bottom: 10px;
    }
    
    .portada h2 {
      font-size: 22px;
      color: #374151;
      margin-bottom: 20px;
    }
    
    .portada .info {
      font-size: 16px;
      color: #6b7280;
      margin-bottom: 10px;
    }
    
    .step-section {
      margin-bottom: 40px;
      border-left: 4px solid #059669;
      padding-left: 20px;
    }
    
    .step-title {
      font-size: 20px;
      color: #059669;
      margin-bottom: 15px;
      font-weight: 600;
    }
    
    .subsection {
      margin-bottom: 20px;
    }
    
    .subsection h4 {
      font-size: 16px;
      color: #374151;
      margin-bottom: 8px;
      font-weight: 600;
    }
    
    .content-box {
      background: #f9fafb;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      margin-bottom: 15px;
    }
    
    .member-box {
      background: #ecfdf5;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 10px;
      border-left: 3px solid #059669;
    }
    
    .trend-box, .idea-box {
      background: #fef3c7;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 10px;
      border-left: 3px solid #f59e0b;
    }
    
    .selected-idea {
      background: #dbeafe;
      border-left-color: #3b82f6;
    }
    
    .canvas-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 15px;
    }
    
    .canvas-section {
      background: #fef7ff;
      padding: 15px;
      border-radius: 8px;
      border: 2px solid #d946ef;
    }
    
    .canvas-section h5 {
      color: #a21caf;
      font-weight: 600;
      margin-bottom: 10px;
    }
    
    .references {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
    }
    
    .references h3 {
      color: #374151;
      margin-bottom: 15px;
    }
    
    .reference-item {
      margin-bottom: 8px;
      padding-left: 15px;
      text-indent: -15px;
    }
    
    p, li {
      margin-bottom: 8px;
    }
    
    strong {
      color: #374151;
    }
  `
}

function generatePortada(data: JournalData, currentDate: string): string {
  return `
    <div class="portada">
      <h1>Bitácora de Oportunidades</h1>
      <h2>${data.journal.title}</h2>
      <div class="info"><strong>Equipo:</strong> ${data.team.name}</div>
      <div class="info"><strong>Fecha de generación:</strong> ${currentDate}</div>
      <div class="info"><strong>Metodología:</strong> Análisis Efectual</div>
    </div>
  `
}

function generateStep1Content(step1Data: Step1Data): string {
  if (!step1Data || step1Data.length === 0) {
    return `
      <div class="step-section">
        <h3 class="step-title">Paso 1: Medios Personales</h3>
        <p><em>No hay datos disponibles para este paso.</em></p>
      </div>
    `
  }

  const membersContent = step1Data.map((member, index) => `
    <div class="member-box">
      <h4>Miembro ${index + 1}</h4>
      ${member.who_i_am ? `<p><strong>Quién soy:</strong> ${member.who_i_am}</p>` : ''}
      ${member.what_i_know ? `<p><strong>Qué sé:</strong> ${member.what_i_know}</p>` : ''}
      ${member.who_i_know ? `<p><strong>A quién conozco:</strong> ${member.who_i_know}</p>` : ''}
      ${member.what_i_have ? `<p><strong>Qué tengo:</strong> ${member.what_i_have}</p>` : ''}
    </div>
  `).join('')

  return `
    <div class="step-section">
      <h3 class="step-title">Paso 1: Medios Personales</h3>
      <p><em>Inventario de recursos actuales del equipo emprendedor según teoría efectual.</em></p>
      ${membersContent}
    </div>
  `
}

function generateStep2Content(step2Data: Step2Data): string {
  if (!step2Data) {
    return `
      <div class="step-section">
        <h3 class="step-title">Paso 2: Problema o Necesidad</h3>
        <p><em>No hay datos disponibles para este paso.</em></p>
      </div>
    `
  }

  return `
    <div class="step-section">
      <h3 class="step-title">Paso 2: Problema o Necesidad</h3>
      <div class="content-box">
        <h4>${step2Data.title}</h4>
        <div class="subsection">
          <h4>Descripción del problema</h4>
          <p>${step2Data.description}</p>
        </div>
        <div class="subsection">
          <h4>Personas afectadas</h4>
          <p>${step2Data.affected}</p>
        </div>
        <div class="subsection">
          <h4>Relevancia</h4>
          <p>${step2Data.relevance}</p>
        </div>
        <div class="subsection">
          <h4>Vínculo con medios personales</h4>
          <p>${step2Data.link_to_means}</p>
        </div>
      </div>
    </div>
  `
}

function generateStep3Content(step3Data: Step3Data): string {
  if (!step3Data || step3Data.length === 0) {
    return `
      <div class="step-section">
        <h3 class="step-title">Paso 3: Tendencias</h3>
        <p><em>No hay datos disponibles para este paso.</em></p>
      </div>
    `
  }

  const trendsContent = step3Data.map((trend, index) => `
    <div class="trend-box">
      <h4>${index + 1}. ${trend.name} (${trend.type})</h4>
      <p><strong>Descripción:</strong> ${trend.brief}</p>
      <p><strong>Ejemplo:</strong> ${trend.example}</p>
      ${trend.source_apa ? `<p><strong>Fuente:</strong> ${trend.source_apa}</p>` : ''}
      ${trend.comment ? `<p><strong>Comentario:</strong> ${trend.comment}</p>` : ''}
    </div>
  `).join('')

  return `
    <div class="step-section">
      <h3 class="step-title">Paso 3: Tendencias</h3>
      <p><em>Fuerzas del entorno que pueden influir en el problema o crear nuevas oportunidades.</em></p>
      ${trendsContent}
    </div>
  `
}

function generateStep4Content(step4Data: Step4Data): string {
  if (!step4Data || step4Data.length === 0) {
    return `
      <div class="step-section">
        <h3 class="step-title">Paso 4: Ideación</h3>
        <p><em>No hay datos disponibles para este paso.</em></p>
      </div>
    `
  }

  const selectedIdea = step4Data.find(idea => idea.selected)
  const otherIdeas = step4Data.filter(idea => !idea.selected)

  const selectedContent = selectedIdea ? `
    <div class="subsection">
      <h4>💡 Idea Seleccionada</h4>
      <div class="idea-box selected-idea">
        <p><strong>Idea:</strong> ${selectedIdea.idea}</p>
        <p><strong>Tipo:</strong> ${selectedIdea.kind}</p>
        <p><strong>Nivel de innovación:</strong> ${selectedIdea.innovation_level}</p>
        <p><strong>Factibilidad:</strong> ${selectedIdea.feasibility}</p>
        ${selectedIdea.justification ? `<p><strong>Justificación:</strong> ${selectedIdea.justification}</p>` : ''}
      </div>
    </div>
  ` : ''

  const otherIdeasContent = otherIdeas.length > 0 ? `
    <div class="subsection">
      <h4>Otras ideas generadas</h4>
      ${otherIdeas.map((idea, index) => `
        <div class="idea-box">
          <p><strong>${index + 1}. ${idea.idea}</strong></p>
          <p>Tipo: ${idea.kind} | Innovación: ${idea.innovation_level} | Factibilidad: ${idea.feasibility}</p>
        </div>
      `).join('')}
    </div>
  ` : ''

  return `
    <div class="step-section">
      <h3 class="step-title">Paso 4: Ideación</h3>
      <p><em>Múltiples alternativas de solución evaluadas con criterios efectuales.</em></p>
      ${selectedContent}
      ${otherIdeasContent}
    </div>
  `
}

function generateStep5Content(buyerData: Step5BuyerData, vpData: Step5VPData): string {
  const buyerContent = buyerData ? `
    <div class="subsection">
      <h4>👤 Buyer Persona</h4>
      <div class="content-box">
        <p><strong>Nombre:</strong> ${buyerData.name}</p>
        <p><strong>Edad:</strong> ${buyerData.age} años</p>
        <p><strong>Ocupación:</strong> ${buyerData.occupation}</p>
        <p><strong>Motivaciones:</strong> ${buyerData.motivations}</p>
        <p><strong>Frustraciones:</strong> ${buyerData.pains}</p>
        <p><strong>Necesidades:</strong> ${buyerData.needs}</p>
      </div>
    </div>
  ` : '<p><em>Buyer Persona no completado.</em></p>'

  const canvasContent = vpData ? `
    <div class="subsection">
      <h4>🎯 Value Proposition Canvas</h4>
      <div class="canvas-container">
        <div class="canvas-section">
          <h5>PERFIL DEL CLIENTE</h5>
          <p><strong>Trabajos del cliente:</strong> ${vpData.customer_jobs}</p>
          <p><strong>Dolores:</strong> ${vpData.customer_pains}</p>
          <p><strong>Alegrías:</strong> ${vpData.customer_gains}</p>
        </div>
        <div class="canvas-section">
          <h5>PROPUESTA DE VALOR</h5>
          <p><strong>Productos/Servicios:</strong> ${vpData.products_services}</p>
          <p><strong>Aliviadores de dolor:</strong> ${vpData.pain_relievers}</p>
          <p><strong>Generadores de alegría:</strong> ${vpData.gain_creators}</p>
        </div>
      </div>
    </div>
  ` : '<p><em>Value Proposition Canvas no completado.</em></p>'

  return `
    <div class="step-section page-break">
      <h3 class="step-title">Paso 5: Usuario y Propuesta de Valor</h3>
      <p><em>Primer cliente específico y propuesta de valor mínima viable.</em></p>
      ${buyerContent}
      ${canvasContent}
    </div>
  `
}

function generateReferences(step3Data: Step3Data): string {
  if (!step3Data || step3Data.length === 0) {
    return ''
  }

  const references = step3Data
    .filter(trend => trend.source_apa && trend.source_apa.trim().length > 0)
    .map(trend => trend.source_apa)

  if (references.length === 0) {
    return ''
  }

  const referencesContent = references.map(ref => `
    <div class="reference-item">${ref}</div>
  `).join('')

  return `
    <div class="references page-break">
      <h3>Referencias</h3>
      ${referencesContent}
    </div>
  `
}