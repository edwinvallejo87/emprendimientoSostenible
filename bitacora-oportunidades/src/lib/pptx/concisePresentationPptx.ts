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

export async function generateConcisePresentationPPTX(data: JournalData) {
  try {
    console.log('🎬 Generando presentación concisa con datos:', data)
    const htmlContent = generateConcisePresentationHTML(data)
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    
    const printWindow = window.open(url, '_blank', 'width=1400,height=900,scrollbars=yes')
    if (!printWindow) {
      throw new Error('No se pudo abrir la ventana de presentación')
    }
    
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 30000)
    
  } catch (error) {
    console.error('Error generating concise presentation:', error)
    throw new Error('Error al generar la presentación concisa')
  }
}

function generateConcisePresentationHTML(data: JournalData): string {
  const currentDate = format(new Date(), 'dd \'de\' MMMM \'de\' yyyy', { locale: es })
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.journal?.title || 'Bitácora de Oportunidades'} - Presentación Concisa</title>
      <style>
        ${getConciseStyles()}
      </style>
    </head>
    <body>
      <div class="presentation-container">
        <div class="nav-bar">
          <button onclick="previousSlide()" id="prevBtn">← Anterior</button>
          <span id="slideCounter">1 / 5</span>
          <button onclick="nextSlide()" id="nextBtn">Siguiente →</button>
          <button onclick="window.print()" class="print-btn">🖨️ Imprimir</button>
        </div>

        <div class="slides-container" id="slidesContainer">
          ${generateConciseSlides(data, currentDate)}
        </div>
      </div>

      <script>
        ${getPresentationScript()}
      </script>
    </body>
    </html>
  `
}

function generateConciseSlides(data: JournalData, currentDate: string): string {
  const completedSteps = getCompletedSteps(data)
  
  let slides = `
    <!-- Slide 1: Portada -->
    <div class="slide title-slide active">
      <h1>🌱 ${data.journal?.title || 'Presentación de Oportunidad de Negocio'}</h1>
      <div class="subtitle">Análisis Efectual y Sostenible</div>
      
      <div class="overview-grid">
        <div class="overview-item">
          <span class="metric">${data.team?.name || 'Nuestro Equipo'}</span>
          <span class="label">Equipo Emprendedor</span>
        </div>
        <div class="overview-item">
          <span class="metric">${data.idea?.title || 'Nuestra Idea'}</span>
          <span class="label">Oportunidad</span>
        </div>
      </div>
      
      <div class="date">${currentDate}</div>
    </div>
  `
  
  // Problema y Oportunidad (siempre mostrar)
  slides += generateProblemSlide(data)
  
  // Solución (si hay idea o step4)
  if (data.idea || data.step4?.length > 0) {
    slides += generateSolutionSlide(data)
  }
  
  // Modelo de Negocio (si hay datos)
  if (data.step5Buyer || data.step5VP) {
    slides += generateBusinessModelSlide(data)
  }
  
  // Impacto y Sostenibilidad (si hay datos)
  if (data.step8SustainableCanvas || data.step9InnovationPatterns?.length > 0 || data.step10Prototype) {
    slides += generateSustainabilitySlide(data)
  }
  
  // Equipo y Recursos
  if (data.step1?.length > 0) {
    slides += generateTeamSlide(data)
  }
  
  // Validación y Próximos Pasos
  slides += generateValidationSlide(data)
  
  return slides
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

function hasEffectualAnalysis(data: JournalData): boolean {
  return !!(data.step1?.length > 0 && data.step2 && data.step3?.length > 0)
}

function hasSustainabilityAnalysis(data: JournalData): boolean {
  return !!(data.step8SustainableCanvas || data.step9InnovationPatterns?.length > 0 || data.step10Prototype)
}

function generateProblemSlide(data: JournalData): string {
  return `
    <div class="slide">
      <h2>🎯 El Problema</h2>
      
      <div class="content-grid">
        ${data.step2 ? `
          <div class="problem-card">
            <h3>${data.step2.title}</h3>
            <p class="problem-description">${data.step2.description}</p>
            
            <div class="problem-details">
              <div class="detail-item">
                <strong>Afectados:</strong> ${data.step2.affected}
              </div>
              <div class="detail-item">
                <strong>Impacto:</strong> ${data.step2.relevance}
              </div>
            </div>
          </div>
        ` : `
          <div class="problem-card">
            <h3>Oportunidad Identificada</h3>
            <p class="problem-description">Hemos identificado una oportunidad en el mercado que requiere una solución innovadora.</p>
            
            <div class="problem-details">
              <div class="detail-item">
                <strong>Estado:</strong> Análisis en desarrollo
              </div>
            </div>
          </div>
        `}
        
        ${data.step3?.length > 0 ? `
          <div class="trends-card">
            <h3>📈 Tendencias del Mercado</h3>
            <div class="trends-list">
              ${data.step3.slice(0, 3).map(trend => `
                <div class="trend-item">
                  <span class="trend-name">${trend.name}</span>
                  <span class="trend-type">${trend.type}</span>
                </div>
              `).join('')}
              ${data.step3.length > 3 ? `<div class="more-trends">+${data.step3.length - 3} tendencias más</div>` : ''}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `
}

function generateSolutionSlide(data: JournalData): string {
  const selectedIdea = data.step4?.find(idea => idea.is_selected) || data.step4?.[0]
  
  return `
    <div class="slide">
      <h2>💡 Nuestra Solución</h2>
      
      <div class="solution-grid">
        <div class="main-solution">
          <h3>${selectedIdea?.name || data.idea?.title || 'Solución Innovadora'}</h3>
          <p class="solution-description">
            ${selectedIdea?.description || data.idea?.description || 'Una solución que aborda las necesidades identificadas del mercado.'}
          </p>
        </div>
        
        ${data.step4?.length > 0 ? `
          <div class="ideas-explored">
            <h4>💭 Proceso de Ideación</h4>
            <div class="ideas-count">${data.step4.length} ideas evaluadas</div>
            <div class="selected-idea">
              ✅ Idea seleccionada: ${selectedIdea?.name || 'Principal'}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `
}

function generateTeamSlide(data: JournalData): string {
  return `
    <div class="slide">
      <h2>👥 Nuestro Equipo</h2>
      
      <div class="team-grid">
        ${data.step1?.map((member, index) => `
          <div class="team-member">
            <h4>👤 Emprendedor ${index + 1}</h4>
            ${member.who_i_am ? `<p><strong>Perfil:</strong> ${member.who_i_am}</p>` : ''}
            ${member.what_i_know ? `<p><strong>Conocimientos:</strong> ${member.what_i_know}</p>` : ''}
            ${member.who_i_know ? `<p><strong>Red de Contactos:</strong> ${member.who_i_know}</p>` : ''}
            ${member.what_i_have ? `<p><strong>Recursos:</strong> ${member.what_i_have}</p>` : ''}
          </div>
        `).join('')}
      </div>
      
      <div class="team-summary">
        <strong>Fortalezas del Equipo:</strong> Equipo multidisciplinario con ${data.step1.length} integrantes
      </div>
    </div>
  `
}

function generateValidationSlide(data: JournalData): string {
  const hasValidation = data.step11ValidationStrategy
  const hasPrototype = data.step10Prototype
  const hasEcosystem = data.step12EcosystemActors?.length > 0
  
  return `
    <div class="slide">
      <h2>🚀 Validación y Próximos Pasos</h2>
      
      <div class="validation-grid">
        ${hasPrototype ? `
          <div class="validation-card completed">
            <h4>🛠️ Prototipo</h4>
            <p><strong>Tipo:</strong> ${data.step10Prototype.prototype_type}</p>
            <p>${data.step10Prototype.description}</p>
          </div>
        ` : `
          <div class="validation-card pending">
            <h4>🛠️ Prototipo</h4>
            <p>Desarrollo del MVP en progreso</p>
          </div>
        `}
        
        ${hasValidation ? `
          <div class="validation-card completed">
            <h4>✅ Estrategia de Validación</h4>
            <p><strong>Enfoque:</strong> ${data.step11ValidationStrategy.strategy}</p>
            <p><strong>Métodos:</strong> ${data.step11ValidationStrategy.methods}</p>
          </div>
        ` : `
          <div class="validation-card pending">
            <h4>✅ Validación</h4>
            <p>Definiendo estrategia de validación con clientes</p>
          </div>
        `}
        
        ${hasEcosystem ? `
          <div class="validation-card completed">
            <h4>🌐 Ecosistema</h4>
            <p>${data.step12EcosystemActors.length} actores identificados</p>
            <p>Red de stakeholders mapeada</p>
          </div>
        ` : `
          <div class="validation-card pending">
            <h4>🌐 Ecosistema</h4>
            <p>Mapeo de stakeholders en desarrollo</p>
          </div>
        `}
      </div>
      
      <div class="next-steps">
        <h4>📋 Siguientes Pasos Inmediatos</h4>
        <ul class="steps-list">
          ${!hasPrototype ? '<li>Desarrollar prototipo funcional</li>' : ''}
          ${!hasValidation ? '<li>Implementar estrategia de validación</li>' : ''}
          ${!hasEcosystem ? '<li>Mapear ecosistema completo</li>' : ''}
          <li>Buscar financiamiento y socios estratégicos</li>
          <li>Preparar lanzamiento al mercado</li>
        </ul>
      </div>
    </div>
  `
}

function generateEffectualSlide(data: JournalData): string {
  const selectedIdea = data.step4?.find(idea => idea.is_selected)
  
  return `
    <div class="slide">
      <h2>🎯 Análisis Efectual Completado</h2>
      
      <div class="content-grid">
        <div class="summary-card">
          <h3>💡 Oportunidad Identificada</h3>
          <div class="highlight">${data.step2?.title || 'Problema identificado'}</div>
          <p>${data.step2?.description || 'Descripción del problema'}</p>
        </div>
        
        <div class="summary-card">
          <h3>🎯 Idea Seleccionada</h3>
          <div class="highlight">${selectedIdea?.name || data.idea?.title || 'Idea principal'}</div>
          <p>${selectedIdea?.description || data.idea?.description || 'Solución propuesta'}</p>
        </div>
        
        <div class="summary-card">
          <h3>👥 Recursos del Equipo</h3>
          <div class="resources">
            <div class="resource-item">📊 <strong>${data.step1?.length || 0}</strong> Emprendedores</div>
            <div class="resource-item">📈 <strong>${data.step3?.length || 0}</strong> Tendencias Analizadas</div>
            <div class="resource-item">💡 <strong>${data.step4?.length || 0}</strong> Ideas Generadas</div>
          </div>
        </div>
      </div>
    </div>
  `
}

function generateEffectualPendingSlide(): string {
  return `
    <div class="slide">
      <h2>🎯 Análisis Efectual</h2>
      
      <div class="pending-content">
        <div class="pending-icon">⏳</div>
        <h3>Análisis en Progreso</h3>
        <p>Complete los primeros pasos para ver el análisis efectual:</p>
        
        <div class="pending-list">
          <div class="pending-item">1️⃣ Medios Personales</div>
          <div class="pending-item">2️⃣ Problema/Necesidad</div>
          <div class="pending-item">3️⃣ Tendencias del Entorno</div>
          <div class="pending-item">4️⃣ Generación de Ideas</div>
        </div>
      </div>
    </div>
  `
}

function generateBusinessModelSlide(data: JournalData): string {
  return `
    <div class="slide">
      <h2>💼 Modelo de Negocio</h2>
      
      <div class="business-grid">
        <div class="business-card buyer">
          <h3>👤 Cliente Objetivo</h3>
          <div class="buyer-name">${data.step5Buyer?.name || 'Cliente Principal'}</div>
          <div class="buyer-details">
            <p><strong>Demografía:</strong> ${data.step5Buyer?.demographics || 'No definido'}</p>
            <p><strong>Necesidades:</strong> ${data.step5Buyer?.needs || 'No definidas'}</p>
            <p><strong>Puntos de Dolor:</strong> ${data.step5Buyer?.pain_points || 'No definidos'}</p>
          </div>
        </div>
        
        <div class="business-card value">
          <h3>💎 Propuesta de Valor</h3>
          <div class="value-prop">${data.step5VP?.value_proposition || 'Propuesta de valor'}</div>
          <div class="value-details">
            <p><strong>Beneficios Únicos:</strong> ${data.step5VP?.unique_benefits || 'No definidos'}</p>
            <p><strong>Por qué nosotros:</strong> ${data.step5VP?.why_us || 'No definido'}</p>
          </div>
        </div>
      </div>
    </div>
  `
}

function generateBusinessPendingSlide(): string {
  return `
    <div class="slide">
      <h2>💼 Modelo de Negocio</h2>
      
      <div class="pending-content">
        <div class="pending-icon">⏳</div>
        <h3>Definición en Progreso</h3>
        <p>Complete el Paso 5 para ver el modelo de negocio:</p>
        
        <div class="pending-list">
          <div class="pending-item">5️⃣A Buyer Persona</div>
          <div class="pending-item">5️⃣B Propuesta de Valor</div>
        </div>
      </div>
    </div>
  `
}

function generateSustainabilitySlide(data: JournalData): string {
  return `
    <div class="slide">
      <h2>🌱 Impacto Sostenible</h2>
      
      <div class="sustainability-grid">
        ${data.step8SustainableCanvas ? `
          <div class="impact-card social">
            <h3>👥 Social</h3>
            <p>${data.step8SustainableCanvas.social_benefits}</p>
          </div>
          <div class="impact-card environmental">
            <h3>🌍 Ambiental</h3>
            <p>${data.step8SustainableCanvas.environmental_benefits}</p>
          </div>
          <div class="impact-card economic">
            <h3>💰 Económico</h3>
            <p>${data.step8SustainableCanvas.economic_benefits}</p>
          </div>
        ` : ''}
        
        ${data.step10Prototype ? `
          <div class="prototype-card">
            <h3>🛠️ Prototipo</h3>
            <div class="prototype-type">${data.step10Prototype.prototype_type}</div>
            <p>${data.step10Prototype.description}</p>
          </div>
        ` : ''}
        
        ${data.step9InnovationPatterns?.length > 0 ? `
          <div class="innovation-card">
            <h3>🔬 Innovación</h3>
            <div class="patterns-count">${data.step9InnovationPatterns.length} patrones identificados</div>
            <p>${data.step9InnovationPatterns[0]?.description || 'Patrones de innovación aplicados'}</p>
          </div>
        ` : ''}
      </div>
    </div>
  `
}

function generateSustainabilityPendingSlide(): string {
  return `
    <div class="slide">
      <h2>🌱 Impacto Sostenible</h2>
      
      <div class="pending-content">
        <div class="pending-icon">⏳</div>
        <h3>Análisis de Sostenibilidad en Progreso</h3>
        <p>Complete los módulos de sostenibilidad:</p>
        
        <div class="pending-list">
          <div class="pending-item">8️⃣ Canvas Sostenible</div>
          <div class="pending-item">9️⃣ Patrones de Innovación</div>
          <div class="pending-item">🔟 Prototipo</div>
          <div class="pending-item">1️⃣1️⃣ Validación</div>
          <div class="pending-item">1️⃣2️⃣ Ecosistema</div>
        </div>
      </div>
    </div>
  `
}

function generateNextStepsSlide(data: JournalData, completedSteps: string[]): string {
  const pendingSteps = [
    'Medios Personales', 'Problema/Necesidad', 'Tendencias', 'Ideación', 
    'Buyer Persona', 'Propuesta de Valor', 'Canvas Sostenible', 
    'Patrones de Innovación', 'Prototipo', 'Validación', 'Ecosistema', 'Reflexión'
  ].filter(step => !completedSteps.includes(step))

  return `
    <div class="slide">
      <h2>🚀 Próximos Pasos</h2>
      
      <div class="next-steps-grid">
        <div class="progress-card">
          <h3>📊 Progreso Actual</h3>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(completedSteps.length / 12) * 100}%"></div>
          </div>
          <p><strong>${completedSteps.length} de 12 pasos</strong> completados</p>
        </div>
        
        <div class="recommendations-card">
          <h3>💡 Recomendaciones</h3>
          ${pendingSteps.length > 0 ? `
            <div class="next-action">
              <strong>Siguiente paso:</strong> ${pendingSteps[0]}
            </div>
            <ul class="pending-steps">
              ${pendingSteps.slice(0, 3).map(step => `<li>${step}</li>`).join('')}
              ${pendingSteps.length > 3 ? `<li>... y ${pendingSteps.length - 3} más</li>` : ''}
            </ul>
          ` : `
            <div class="completed-message">
              <strong>🎉 ¡Análisis Completo!</strong>
              <p>Has completado todos los pasos del análisis efectual y sostenible.</p>
            </div>
          `}
        </div>
      </div>
    </div>
  `
}

function getConciseStyles(): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .nav-bar button:hover { background: #3730a3; }
    .nav-bar button:disabled { background: #6b7280; cursor: not-allowed; }
    
    #slideCounter {
      color: white;
      font-weight: 500;
      min-width: 60px;
      text-align: center;
    }
    
    .slides-container {
      width: 100%;
      height: 100vh;
      position: relative;
    }
    
    .slide {
      display: none;
      width: 90%;
      max-width: 1200px;
      height: 85vh;
      margin: 0 auto;
      padding: 80px 60px 60px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      overflow-y: auto;
    }
    
    .slide.active { display: block; }
    
    .title-slide {
      text-align: center;
      background: linear-gradient(135deg, #f0f4f8, #e2e8f0);
      color: #2d3748;
    }
    
    .title-slide h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .subtitle {
      font-size: 1.5rem;
      color: #4a5568;
      margin-bottom: 3rem;
    }
    
    .overview-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
      margin: 3rem 0;
    }
    
    .overview-item {
      text-align: center;
      padding: 1.5rem;
      background: white;
      border-radius: 15px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .overview-item .metric {
      display: block;
      font-size: 2.5rem;
      font-weight: bold;
      color: #4f46e5;
      margin-bottom: 0.5rem;
    }
    
    .overview-item .label {
      color: #6b7280;
      font-weight: 500;
    }
    
    .date {
      position: absolute;
      bottom: 30px;
      right: 60px;
      color: #6b7280;
      font-style: italic;
    }
    
    h2 {
      font-size: 2.5rem;
      margin-bottom: 2rem;
      text-align: center;
      color: #2d3748;
    }
    
    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }
    
    .problem-card, .trends-card {
      background: #f8fafc;
      padding: 2rem;
      border-radius: 15px;
      border-left: 4px solid #dc2626;
    }
    
    .trends-card {
      border-left-color: #059669;
    }
    
    .problem-description {
      font-size: 1.1rem;
      line-height: 1.6;
      margin: 1rem 0;
    }
    
    .problem-details {
      margin-top: 1.5rem;
    }
    
    .detail-item {
      margin-bottom: 0.5rem;
      color: #4a5568;
    }
    
    .trends-list {
      margin-top: 1rem;
    }
    
    .trend-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .trend-name {
      font-weight: 500;
    }
    
    .trend-type {
      color: #6b7280;
      font-size: 0.9rem;
    }
    
    .more-trends {
      text-align: center;
      color: #6b7280;
      font-style: italic;
      margin-top: 0.5rem;
    }
    
    .solution-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      margin-top: 2rem;
    }
    
    .main-solution {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 2rem;
      border-radius: 15px;
    }
    
    .main-solution h3 {
      font-size: 1.8rem;
      margin-bottom: 1rem;
    }
    
    .solution-description {
      font-size: 1.1rem;
      line-height: 1.6;
    }
    
    .ideas-explored {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 15px;
      border-left: 4px solid #4f46e5;
    }
    
    .ideas-count {
      font-size: 1.2rem;
      font-weight: bold;
      color: #4f46e5;
      margin: 0.5rem 0;
    }
    
    .selected-idea {
      background: #dcfce7;
      padding: 0.5rem;
      border-radius: 8px;
      color: #166534;
      margin-top: 1rem;
    }
    
    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    .team-member {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 15px;
      border-left: 4px solid #8b5cf6;
    }
    
    .team-member h4 {
      color: #8b5cf6;
      margin-bottom: 1rem;
    }
    
    .team-member p {
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }
    
    .team-summary {
      text-align: center;
      margin-top: 2rem;
      padding: 1rem;
      background: #ede9fe;
      border-radius: 10px;
      color: #6b21a8;
    }
    
    .validation-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    .validation-card {
      padding: 1.5rem;
      border-radius: 15px;
      border-left: 4px solid #10b981;
    }
    
    .validation-card.completed {
      background: #ecfdf5;
      border-left-color: #10b981;
    }
    
    .validation-card.pending {
      background: #fef3c7;
      border-left-color: #f59e0b;
    }
    
    .validation-card h4 {
      margin-bottom: 1rem;
    }
    
    .next-steps {
      margin-top: 3rem;
      background: #f8fafc;
      padding: 2rem;
      border-radius: 15px;
      border-left: 4px solid #4f46e5;
    }
    
    .next-steps h4 {
      color: #4f46e5;
      margin-bottom: 1rem;
    }
    
    .steps-list {
      list-style: none;
      padding: 0;
    }
    
    .steps-list li {
      background: white;
      padding: 0.75rem 1rem;
      margin-bottom: 0.5rem;
      border-radius: 8px;
      border-left: 3px solid #4f46e5;
    }
    
    .summary-card {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 15px;
      border-left: 4px solid #4f46e5;
    }
    
    .summary-card h3 {
      font-size: 1.2rem;
      margin-bottom: 1rem;
      color: #2d3748;
    }
    
    .highlight {
      font-size: 1.1rem;
      font-weight: bold;
      color: #4f46e5;
      margin-bottom: 0.5rem;
    }
    
    .resources {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .resource-item {
      color: #4a5568;
      font-size: 0.95rem;
    }
    
    .pending-content {
      text-align: center;
      padding: 3rem;
    }
    
    .pending-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    
    .pending-content h3 {
      font-size: 1.8rem;
      margin-bottom: 1rem;
      color: #4a5568;
    }
    
    .pending-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }
    
    .pending-item {
      background: #fef3c7;
      padding: 1rem;
      border-radius: 10px;
      font-weight: 500;
      color: #92400e;
    }
    
    .business-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-top: 2rem;
    }
    
    .business-card {
      padding: 2rem;
      border-radius: 15px;
      color: white;
    }
    
    .business-card.buyer { background: linear-gradient(135deg, #667eea, #764ba2); }
    .business-card.value { background: linear-gradient(135deg, #f093fb, #f5576c); }
    
    .buyer-name, .value-prop {
      font-size: 1.3rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }
    
    .sustainability-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    .impact-card, .prototype-card, .innovation-card {
      padding: 1.5rem;
      border-radius: 15px;
      color: white;
    }
    
    .impact-card.social { background: linear-gradient(135deg, #43a047, #66bb6a); }
    .impact-card.environmental { background: linear-gradient(135deg, #2e7d32, #43a047); }
    .impact-card.economic { background: linear-gradient(135deg, #1976d2, #42a5f5); }
    .prototype-card { background: linear-gradient(135deg, #8e24aa, #ab47bc); }
    .innovation-card { background: linear-gradient(135deg, #ff6f00, #ff8f00); }
    
    .next-steps-grid {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 2rem;
      margin-top: 2rem;
    }
    
    .progress-card, .recommendations-card {
      background: #f8fafc;
      padding: 2rem;
      border-radius: 15px;
      border-left: 4px solid #4f46e5;
    }
    
    .progress-bar {
      background: #e5e7eb;
      height: 20px;
      border-radius: 10px;
      overflow: hidden;
      margin: 1rem 0;
    }
    
    .progress-fill {
      background: linear-gradient(90deg, #667eea, #764ba2);
      height: 100%;
      border-radius: 10px;
      transition: width 0.5s ease;
    }
    
    .next-action {
      background: #dbeafe;
      padding: 1rem;
      border-radius: 10px;
      margin-bottom: 1rem;
      color: #1e40af;
    }
    
    .pending-steps {
      list-style: none;
      padding: 0;
    }
    
    .pending-steps li {
      background: #f3f4f6;
      padding: 0.5rem 1rem;
      margin-bottom: 0.5rem;
      border-radius: 8px;
      border-left: 3px solid #6b7280;
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
    }
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
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') previousSlide();
      if (e.key === 'Home') showSlide(0);
      if (e.key === 'End') showSlide(totalSlides - 1);
    });
    
    updateSlideCounter();
    console.log('🎬 Presentación concisa cargada con', totalSlides, 'slides');
  `
}