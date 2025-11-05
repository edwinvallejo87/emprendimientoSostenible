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

export async function generateSimplePPTX(data: JournalData) {
  try {
    // Crear HTML que simule slides de PowerPoint
    const htmlContent = generatePresentationHTML(data)
    
    // Crear un blob con el contenido HTML
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    
    // Abrir en una nueva ventana para impresión/guardado
    const printWindow = window.open(url, '_blank')
    if (!printWindow) {
      throw new Error('No se pudo abrir la ventana de presentación')
    }
    
    // Limpiar la URL después de un tiempo
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 10000)
    
  } catch (error) {
    console.error('Error generating presentation:', error)
    throw new Error('Error al generar la presentación')
  }
}

function generatePresentationHTML(data: JournalData): string {
  const currentDate = format(new Date(), 'dd \'de\' MMMM \'de\' yyyy', { locale: es })
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.journal?.title || 'Bitácora de Oportunidades'} - Presentación</title>
      <style>
        ${getPresentationStyles()}
      </style>
    </head>
    <body>
      ${generateTitleSlide(data, currentDate)}
      ${generateOverviewSlide()}
      ${generateStep1Slide(data.step1)}
      ${generateStep2Slide(data.step2)}
      ${generateStep3Slide(data.step3)}
      ${generateStep4Slide(data.step4)}
      ${generateStep5Slide(data.step5Buyer, data.step5VP)}
      ${generateSustainabilityOverviewSlide()}
      ${generateStep8Slide(data.step8SustainableCanvas)}
      ${generateStep9Slide(data.step9InnovationPatterns)}
      ${generateStep10Slide(data.step10Prototype)}
      ${generateStep11Slide(data.step11ValidationStrategy)}
      ${generateStep12Slide(data.step12EcosystemActors)}
      ${generateStep13Slide(data.step13SustainabilityReflection)}
      ${generateConclusionSlide()}
      
      <script>
        // Auto print cuando se carga
        window.onload = function() {
          setTimeout(() => {
            window.print();
          }, 1000);
        }
      </script>
    </body>
    </html>
  `
}

function getPresentationStyles(): string {
  return `
    @media screen {
      body { 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 20px;
        background: #f5f5f5;
      }
    }
    
    @media print {
      body { margin: 0; padding: 0; }
      .slide { page-break-after: always; }
      .slide:last-child { page-break-after: auto; }
    }
    
    .slide {
      width: 10in;
      height: 7.5in;
      margin: 20px auto;
      padding: 40px;
      background: white;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      position: relative;
      box-sizing: border-box;
    }
    
    .slide-title {
      background: linear-gradient(135deg, #059669, #047857);
      color: white;
    }
    
    .slide-content {
      background: white;
    }
    
    h1 {
      font-size: 48px;
      color: white;
      text-align: center;
      margin: 60px 0 20px 0;
      font-weight: bold;
    }
    
    h2 {
      font-size: 36px;
      color: #059669;
      text-align: center;
      margin: 20px 0;
      font-weight: bold;
    }
    
    h3 {
      font-size: 28px;
      color: #374151;
      margin: 20px 0 15px 0;
      font-weight: 600;
    }
    
    .subtitle {
      font-size: 24px;
      color: #e5e7eb;
      text-align: center;
      margin: 10px 0;
    }
    
    .info {
      font-size: 18px;
      color: #d1d5db;
      text-align: center;
      margin: 20px 0;
      line-height: 1.6;
    }
    
    .content {
      flex: 1;
      padding: 20px 0;
    }
    
    .step-list {
      list-style: none;
      padding: 0;
      margin: 40px 0;
    }
    
    .step-list li {
      font-size: 24px;
      color: #1f2937;
      margin: 15px 0;
      padding: 10px 20px;
      background: #f9fafb;
      border-left: 4px solid #059669;
      border-radius: 4px;
    }
    
    .member-box, .trend-box, .idea-box {
      background: #f3f4f6;
      padding: 20px;
      margin: 15px 0;
      border-radius: 8px;
      border-left: 4px solid #059669;
    }
    
    .member-title, .trend-title, .idea-title {
      font-size: 20px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 10px;
    }
    
    .member-content, .trend-content, .idea-content {
      font-size: 14px;
      color: #4b5563;
      line-height: 1.5;
    }
    
    .selected-idea {
      background: #dbeafe;
      border-left-color: #3b82f6;
    }
    
    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-top: 20px;
    }
    
    .buyer-section, .vp-section {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      border: 2px solid #e5e7eb;
    }
    
    .buyer-section h4, .vp-section h4 {
      color: #3b82f6;
      font-size: 18px;
      margin-bottom: 15px;
    }
    
    .conclusion-list {
      list-style: none;
      padding: 0;
      margin: 40px 0;
    }
    
    .conclusion-list li {
      font-size: 22px;
      color: #1f2937;
      margin: 20px 0;
      padding: 15px 25px;
      background: #ecfdf5;
      border-radius: 8px;
    }
    
    .final-message {
      font-size: 32px;
      color: #059669;
      text-align: center;
      font-weight: bold;
      margin: 40px 0;
    }
  `
}

function generateTitleSlide(data: JournalData, currentDate: string): string {
  return `
    <div class="slide slide-title">
      <h1>${data.journal?.title || 'Bitácora de Oportunidades'}</h1>
      <div class="subtitle">Análisis de Oportunidades</div>
      <div class="info">
        <strong>Equipo:</strong> ${data.team?.name || 'Sin nombre'}<br>
        <strong>Fecha:</strong> ${currentDate}<br>
        <strong>Metodología:</strong> Efectual
      </div>
    </div>
  `
}

function generateOverviewSlide(): string {
  return `
    <div class="slide slide-content">
      <h2>Metodología Efectual</h2>
      <div class="content">
        <p style="text-align: center; font-size: 20px; color: #6b7280; margin-bottom: 30px;">
          Los 5 pasos del análisis de oportunidades
        </p>
        <ul class="step-list">
          <li>1. Medios Personales</li>
          <li>2. Problema o Necesidad</li>
          <li>3. Tendencias del Entorno</li>
          <li>4. Ideación y Selección</li>
          <li>5. Usuario y Propuesta de Valor</li>
        </ul>
      </div>
    </div>
  `
}

function generateStep1Slide(step1Data: Step1Data): string {
  if (!step1Data || step1Data.length === 0) {
    return `
      <div class="slide slide-content">
        <h2>Paso 1: Medios Personales</h2>
        <div class="content">
          <p style="text-align: center; color: #9ca3af; font-style: italic;">
            No hay datos disponibles para este paso
          </p>
        </div>
      </div>
    `
  }

  const membersContent = step1Data.map((member, index) => `
    <div class="member-box">
      <div class="member-title">Miembro ${index + 1}</div>
      <div class="member-content">
        ${member.who_i_am ? `<p><strong>Quién soy:</strong> ${member.who_i_am.substring(0, 150)}...</p>` : ''}
        ${member.what_i_know ? `<p><strong>Qué sé:</strong> ${member.what_i_know.substring(0, 150)}...</p>` : ''}
        ${member.who_i_know ? `<p><strong>A quién conozco:</strong> ${member.who_i_know.substring(0, 150)}...</p>` : ''}
        ${member.what_i_have ? `<p><strong>Qué tengo:</strong> ${member.what_i_have.substring(0, 150)}...</p>` : ''}
      </div>
    </div>
  `).join('')

  return `
    <div class="slide slide-content">
      <h2>Paso 1: Medios Personales</h2>
      <div class="content">
        <p style="text-align: center; color: #6b7280; font-style: italic; margin-bottom: 20px;">
          Inventario de recursos del equipo emprendedor
        </p>
        ${membersContent}
      </div>
    </div>
  `
}

function generateStep2Slide(step2Data: Step2Data): string {
  if (!step2Data) {
    return `
      <div class="slide slide-content">
        <h2>Paso 2: Problema o Necesidad</h2>
        <div class="content">
          <p style="text-align: center; color: #9ca3af; font-style: italic;">
            No hay datos disponibles para este paso
          </p>
        </div>
      </div>
    `
  }

  return `
    <div class="slide slide-content">
      <h2>Paso 2: Problema o Necesidad</h2>
      <div class="content">
        <h3>${step2Data.title}</h3>
        <p><strong>Descripción:</strong> ${step2Data.description.substring(0, 300)}...</p>
        <p><strong>Personas afectadas:</strong> ${step2Data.affected.substring(0, 250)}...</p>
        <p><strong>Relevancia:</strong> ${step2Data.relevance.substring(0, 250)}...</p>
      </div>
    </div>
  `
}

function generateStep3Slide(step3Data: Step3Data): string {
  if (!step3Data || step3Data.length === 0) {
    return `
      <div class="slide slide-content">
        <h2>Paso 3: Tendencias del Entorno</h2>
        <div class="content">
          <p style="text-align: center; color: #9ca3af; font-style: italic;">
            No hay datos disponibles para este paso
          </p>
        </div>
      </div>
    `
  }

  const trendsContent = step3Data.map((trend, index) => `
    <div class="trend-box">
      <div class="trend-title">${index + 1}. ${trend.name} (${trend.type})</div>
      <div class="trend-content">
        <p>${trend.brief.substring(0, 200)}...</p>
        ${trend.example ? `<p><strong>Ejemplo:</strong> ${trend.example.substring(0, 150)}...</p>` : ''}
      </div>
    </div>
  `).join('')

  return `
    <div class="slide slide-content">
      <h2>Paso 3: Tendencias del Entorno</h2>
      <div class="content">
        ${trendsContent}
      </div>
    </div>
  `
}

function generateStep4Slide(step4Data: Step4Data): string {
  if (!step4Data || step4Data.length === 0) {
    return `
      <div class="slide slide-content">
        <h2>Paso 4: Ideación</h2>
        <div class="content">
          <p style="text-align: center; color: #9ca3af; font-style: italic;">
            No hay datos disponibles para este paso
          </p>
        </div>
      </div>
    `
  }

  const selectedIdea = step4Data.find(idea => idea.selected)
  
  const selectedContent = selectedIdea ? `
    <div class="idea-box selected-idea">
      <div class="idea-title">💡 Idea Seleccionada</div>
      <div class="idea-content">
        <p><strong>${selectedIdea.idea}</strong></p>
        <p>Tipo: ${selectedIdea.kind} | Innovación: ${selectedIdea.innovation_level} | Factibilidad: ${selectedIdea.feasibility}</p>
        ${selectedIdea.justification ? `<p><strong>Justificación:</strong> ${selectedIdea.justification.substring(0, 200)}...</p>` : ''}
      </div>
    </div>
  ` : ''

  return `
    <div class="slide slide-content">
      <h2>Paso 4: Ideación</h2>
      <div class="content">
        ${selectedContent}
        <p style="text-align: center; color: #6b7280; margin-top: 20px;">
          <strong>Total de ideas generadas:</strong> ${step4Data.length}
        </p>
      </div>
    </div>
  `
}

function generateStep5Slide(buyerData: Step5BuyerData, vpData: Step5VPData): string {
  const buyerContent = buyerData ? `
    <div class="buyer-section">
      <h4>👤 Buyer Persona</h4>
      <p><strong>Nombre:</strong> ${buyerData.name}</p>
      <p><strong>Edad:</strong> ${buyerData.age} años</p>
      <p><strong>Ocupación:</strong> ${buyerData.occupation}</p>
      <p><strong>Motivaciones:</strong> ${buyerData.motivations.substring(0, 100)}...</p>
      <p><strong>Frustraciones:</strong> ${buyerData.pains.substring(0, 100)}...</p>
      <p><strong>Necesidades:</strong> ${buyerData.needs.substring(0, 100)}...</p>
    </div>
  ` : '<div class="buyer-section"><h4>👤 Buyer Persona</h4><p>No completado</p></div>'

  const vpContent = vpData ? `
    <div class="vp-section">
      <h4>💎 Propuesta de Valor</h4>
      <p><strong>Trabajos del cliente:</strong> ${vpData.customer_jobs.substring(0, 100)}...</p>
      <p><strong>Dolores:</strong> ${vpData.customer_pains.substring(0, 100)}...</p>
      <p><strong>Alegrías:</strong> ${vpData.customer_gains.substring(0, 100)}...</p>
      <p><strong>Productos/Servicios:</strong> ${vpData.products_services.substring(0, 100)}...</p>
      <p><strong>Aliviadores:</strong> ${vpData.pain_relievers.substring(0, 100)}...</p>
      <p><strong>Generadores:</strong> ${vpData.gain_creators.substring(0, 100)}...</p>
    </div>
  ` : '<div class="vp-section"><h4>💎 Propuesta de Valor</h4><p>No completado</p></div>'

  return `
    <div class="slide slide-content">
      <h2>Paso 5: Usuario y Propuesta de Valor</h2>
      <div class="content">
        <div class="two-column">
          ${buyerContent}
          ${vpContent}
        </div>
      </div>
    </div>
  `
}

function generateSustainabilityOverviewSlide(): string {
  return `
    <div class="slide slide-content">
      <h2>🌱 Módulo: Emprendimiento Sostenible</h2>
      <div class="content">
        <div class="overview-text">
          <p>Continuamos con el análisis de sostenibilidad que integra impacto social, ambiental y económico.</p>
        </div>
        <ul class="overview-list">
          <li>🌱 Canvas Sostenible Interactivo</li>
          <li>💡 Patrones de Innovación</li>
          <li>🔧 Prototipo y MVP</li>
          <li>🎯 Estrategia de Validación</li>
          <li>🤝 Mapa del Ecosistema</li>
          <li>🌍 Reflexión de Sostenibilidad</li>
        </ul>
      </div>
    </div>
  `
}

function generateStep8Slide(canvasData?: SustainableCanvasData): string {
  const content = canvasData ? `
    <div class="canvas-grid">
      <div class="canvas-section">
        <h4>👥 Lado del Cliente</h4>
        <p><strong>Segmentos:</strong> ${canvasData.customer_segments?.substring(0, 80) || 'N/A'}...</p>
        <p><strong>Propuestas de Valor:</strong> ${canvasData.value_propositions?.substring(0, 80) || 'N/A'}...</p>
        <p><strong>Beneficios Sociales:</strong> ${canvasData.social_benefits?.substring(0, 80) || 'N/A'}...</p>
        <p><strong>Beneficios Ambientales:</strong> ${canvasData.environmental_benefits?.substring(0, 80) || 'N/A'}...</p>
      </div>
      <div class="canvas-section">
        <h4>🏢 Lado del Negocio</h4>
        <p><strong>Recursos Clave:</strong> ${canvasData.key_resources?.substring(0, 80) || 'N/A'}...</p>
        <p><strong>Actividades Clave:</strong> ${canvasData.key_activities?.substring(0, 80) || 'N/A'}...</p>
        <p><strong>Alianzas:</strong> ${canvasData.key_partnerships?.substring(0, 80) || 'N/A'}...</p>
        <p><strong>Costos Sostenibles:</strong> ${canvasData.environmental_costs?.substring(0, 80) || 'N/A'}...</p>
      </div>
    </div>
  ` : '<p>Canvas sostenible no completado</p>'

  return `
    <div class="slide slide-content">
      <h2>Paso 8: Canvas Sostenible</h2>
      <div class="content">
        ${content}
      </div>
    </div>
  `
}

function generateStep9Slide(patternsData?: InnovationPatternsData): string {
  const content = patternsData && patternsData.length > 0 ? `
    <div class="patterns-list">
      ${patternsData.map(pattern => `
        <div class="pattern-item">
          <h4>💡 ${pattern.pattern_name} ${pattern.is_primary ? '(Principal)' : ''}</h4>
          <p>${pattern.pattern_description?.substring(0, 120) || 'Sin descripción'}...</p>
          <p><strong>Justificación:</strong> ${pattern.justification?.substring(0, 100) || 'N/A'}...</p>
        </div>
      `).join('')}
    </div>
  ` : '<p>Patrones de innovación no completados</p>'

  return `
    <div class="slide slide-content">
      <h2>Paso 9: Patrones de Innovación</h2>
      <div class="content">
        ${content}
      </div>
    </div>
  `
}

function generateStep10Slide(prototypeData?: PrototypeData): string {
  const content = prototypeData ? `
    <div class="prototype-info">
      <h4>🔧 ${prototypeData.name}</h4>
      <p><strong>Tipo:</strong> ${prototypeData.type}</p>
      <p><strong>Descripción:</strong> ${prototypeData.description?.substring(0, 150) || 'Sin descripción'}...</p>
      <p><strong>Hipótesis a validar:</strong> ${prototypeData.hypothesis_to_validate?.substring(0, 120) || 'N/A'}...</p>
      <p><strong>Métricas esperadas:</strong> ${prototypeData.expected_learning_metrics?.substring(0, 100) || 'N/A'}...</p>
    </div>
  ` : '<p>Prototipo no completado</p>'

  return `
    <div class="slide slide-content">
      <h2>Paso 10: Prototipo y MVP</h2>
      <div class="content">
        ${content}
      </div>
    </div>
  `
}

function generateStep11Slide(validationData?: ValidationStrategyData): string {
  const content = validationData ? `
    <div class="validation-info">
      <h4>🎯 Estrategia de Validación</h4>
      <p><strong>Hipótesis:</strong> ${validationData.hypothesis?.substring(0, 120) || 'N/A'}...</p>
      <p><strong>Segmentos objetivo:</strong> ${validationData.target_segments?.substring(0, 100) || 'N/A'}...</p>
      <p><strong>Métodos:</strong> ${validationData.validation_methods?.join(', ') || 'N/A'}</p>
      <p><strong>Cronograma:</strong> ${validationData.timeline_weeks || 0} semanas</p>
      <p><strong>Presupuesto:</strong> $${validationData.budget_estimate || 0}</p>
      <p><strong>Progreso:</strong> ${validationData.progress_percentage || 0}%</p>
    </div>
  ` : '<p>Estrategia de validación no completada</p>'

  return `
    <div class="slide slide-content">
      <h2>Paso 11: Estrategia de Validación</h2>
      <div class="content">
        ${content}
      </div>
    </div>
  `
}

function generateStep12Slide(actorsData?: EcosystemActorsData): string {
  const content = actorsData && actorsData.length > 0 ? `
    <div class="actors-grid">
      ${actorsData.map(actor => `
        <div class="actor-item">
          <h4>🤝 ${actor.actor_name}</h4>
          <p><strong>Tipo:</strong> ${actor.actor_type}</p>
          <p><strong>Rol:</strong> ${actor.role_description?.substring(0, 100) || 'N/A'}...</p>
          <p><strong>Soporte:</strong> ${actor.support_types?.join(', ') || 'N/A'}</p>
          <p><strong>Estado:</strong> ${actor.relationship_status}</p>
        </div>
      `).join('')}
    </div>
  ` : '<p>Mapa del ecosistema no completado</p>'

  return `
    <div class="slide slide-content">
      <h2>Paso 12: Mapa del Ecosistema</h2>
      <div class="content">
        ${content}
      </div>
    </div>
  `
}

function generateStep13Slide(reflectionData?: SustainabilityReflectionData): string {
  const content = reflectionData ? `
    <div class="reflection-sections">
      <div class="reflection-item">
        <h4>⚖️ Equilibrio de Impactos</h4>
        <p>${reflectionData.social_impact_balance?.substring(0, 150) || 'N/A'}...</p>
      </div>
      <div class="reflection-item">
        <h4>🎯 Decisiones Sostenibles</h4>
        <p>${reflectionData.sustainability_decisions?.substring(0, 150) || 'N/A'}...</p>
      </div>
      <div class="reflection-item">
        <h4>🚀 Estrategia de Escalamiento</h4>
        <p>${reflectionData.scaling_strategy?.substring(0, 150) || 'N/A'}...</p>
      </div>
    </div>
  ` : '<p>Reflexión de sostenibilidad no completada</p>'

  return `
    <div class="slide slide-content">
      <h2>Paso 13: Reflexión de Sostenibilidad</h2>
      <div class="content">
        ${content}
      </div>
    </div>
  `
}

function generateConclusionSlide(): string {
  return `
    <div class="slide slide-content">
      <h2>🎉 Conclusiones</h2>
      <div class="content">
        <ul class="conclusion-list">
          <li>✅ Análisis efectual completo (pasos 1-5)</li>
          <li>🌱 Módulos de sostenibilidad integrados (pasos 8-13)</li>
          <li>🎯 Oportunidad identificada y validada</li>
          <li>💡 Idea sostenible con triple impacto</li>
          <li>👥 Cliente y ecosistema definidos</li>
          <li>🚀 Estrategia de implementación lista</li>
        </ul>
        <div class="final-message">🌱 ¡Listo para emprender sosteniblemente!</div>
      </div>
    </div>
  `
}