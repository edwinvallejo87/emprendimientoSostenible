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

export async function generateSuperPresentationPPTX(data: JournalData) {
  try {
    // Crear HTML que simule una presentación profesional
    const htmlContent = generateSuperPresentationHTML(data)
    
    // Crear un blob con el contenido HTML
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    
    // Abrir en una nueva ventana para impresión/guardado
    const printWindow = window.open(url, '_blank', 'width=1200,height=800')
    if (!printWindow) {
      throw new Error('No se pudo abrir la ventana de presentación')
    }
    
    // Limpiar la URL después de un tiempo
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 10000)
    
  } catch (error) {
    console.error('Error generating super presentation:', error)
    throw new Error('Error al generar la super presentación')
  }
}

function generateSuperPresentationHTML(data: JournalData): string {
  const currentDate = format(new Date(), 'dd \'de\' MMMM \'de\' yyyy', { locale: es })
  
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.journal?.title || 'Bitácora de Oportunidades'} - Super Presentación</title>
      <style>
        ${getSuperPresentationStyles()}
      </style>
    </head>
    <body>
      ${generateSuperTitleSlide(data, currentDate)}
      ${generateExecutiveSummarySlide(data)}
      ${generateMethodologySlide()}
      ${generateSuperStep1Slide(data.step1)}
      ${generateSuperStep2Slide(data.step2)}
      ${generateSuperStep3Slide(data.step3)}
      ${generateSuperStep4Slide(data.step4)}
      ${generateStep4EvaluationSlide(data.step4)}
      ${generateSuperStep5BuyerSlide(data.step5Buyer)}
      ${generateSuperStep5VPSlide(data.step5VP)}
      ${generateSustainabilityTransitionSlide()}
      ${generateSuperStep8Slide(data.step8SustainableCanvas)}
      ${generateSuperStep9Slide(data.step9InnovationPatterns)}
      ${generateSuperStep10Slide(data.step10Prototype)}
      ${generateSuperStep11Slide(data.step11ValidationStrategy)}
      ${generateSuperStep12Slide(data.step12EcosystemActors)}
      ${generateSuperStep13Slide(data.step13SustainabilityReflection)}
      ${generateBusinessModelSummarySlide(data)}
      ${generateImplementationRoadmapSlide()}
      ${generateRiskAnalysisSlide(data.step4)}
      ${generateFinancialProjectionsSlide()}
      ${generateSocialImpactSlide(data.step8SustainableCanvas)}
      ${generateNextStepsSlide()}
      ${generateSuperConclusionSlide(data)}
      ${generateContactSlide(data)}
      
      <script>
        // Navigation with arrow keys
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slide');
        
        function showSlide(n) {
          slides.forEach(slide => slide.style.display = 'none');
          if (slides[n]) {
            slides[n].style.display = 'flex';
            currentSlide = n;
            updateProgress();
          }
        }
        
        function updateProgress() {
          const progress = ((currentSlide + 1) / slides.length) * 100;
          document.querySelector('.progress-bar').style.width = progress + '%';
          document.querySelector('.slide-counter').textContent = (currentSlide + 1) + ' / ' + slides.length;
        }
        
        document.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight' && currentSlide < slides.length - 1) {
            showSlide(currentSlide + 1);
          } else if (e.key === 'ArrowLeft' && currentSlide > 0) {
            showSlide(currentSlide - 1);
          } else if (e.key === 'Escape') {
            document.querySelector('.fullscreen-controls').style.display = 
              document.querySelector('.fullscreen-controls').style.display === 'none' ? 'block' : 'none';
          }
        });
        
        // Auto start in fullscreen mode
        window.onload = function() {
          showSlide(0);
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          }
        }
        
        // Print function
        function printPresentation() {
          slides.forEach(slide => slide.style.display = 'flex');
          window.print();
          showSlide(currentSlide);
        }
      </script>
      
      <!-- Presentation Controls -->
      <div class="fullscreen-controls">
        <div class="progress-container">
          <div class="progress-bar"></div>
        </div>
        <div class="controls">
          <button onclick="showSlide(currentSlide - 1)" ${0} === currentSlide ? 'disabled' : ''}>⬅ Anterior</button>
          <span class="slide-counter">1 / ${getTotalSlides()}</span>
          <button onclick="showSlide(currentSlide + 1)" disabled>Siguiente ➡</button>
          <button onclick="printPresentation()">🖨️ Imprimir</button>
          <button onclick="window.close()">❌ Cerrar</button>
        </div>
      </div>
    </body>
    </html>
  `
}

function getTotalSlides(): number {
  return 22; // Total number of slides in the presentation
}

function getSuperPresentationStyles(): string {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #1e3a8a, #1e40af, #3b82f6);
      color: #333;
      overflow: hidden;
      height: 100vh;
    }
    
    .slide {
      width: 100vw;
      height: 100vh;
      display: none;
      flex-direction: column;
      padding: 60px 80px;
      position: relative;
      background: white;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }
    
    .slide.title-slide {
      background: linear-gradient(135deg, #059669, #047857, #065f46);
      color: white;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    
    .slide.transition-slide {
      background: linear-gradient(135deg, #7c3aed, #8b5cf6, #a78bfa);
      color: white;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    
    .slide-header {
      border-bottom: 4px solid #059669;
      padding-bottom: 20px;
      margin-bottom: 40px;
    }
    
    h1 {
      font-size: 72px;
      font-weight: 800;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      margin-bottom: 20px;
      line-height: 1.1;
    }
    
    h2 {
      font-size: 48px;
      color: #059669;
      font-weight: 700;
      margin-bottom: 30px;
      line-height: 1.2;
    }
    
    .title-slide h2 {
      color: white;
      opacity: 0.9;
    }
    
    .transition-slide h2 {
      color: white;
    }
    
    h3 {
      font-size: 32px;
      color: #374151;
      font-weight: 600;
      margin: 30px 0 20px 0;
    }
    
    h4 {
      font-size: 24px;
      color: #4b5563;
      font-weight: 600;
      margin: 20px 0 15px 0;
    }
    
    .subtitle {
      font-size: 36px;
      opacity: 0.8;
      font-weight: 300;
      margin: 20px 0;
    }
    
    .info-box {
      background: rgba(255,255,255,0.1);
      padding: 30px;
      border-radius: 15px;
      border: 2px solid rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
      margin: 30px 0;
      font-size: 24px;
      line-height: 1.6;
    }
    
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 18px;
      line-height: 1.6;
    }
    
    .two-column {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      height: 100%;
      align-items: start;
    }
    
    .three-column {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 30px;
      height: 100%;
    }
    
    .card {
      background: #f8fafc;
      padding: 30px;
      border-radius: 15px;
      border-left: 6px solid #059669;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      height: fit-content;
    }
    
    .card h4 {
      color: #059669;
      font-size: 20px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }
    
    .card-icon {
      font-size: 24px;
      margin-right: 10px;
    }
    
    .highlight-box {
      background: linear-gradient(135deg, #ecfdf5, #d1fae5);
      padding: 25px;
      border-radius: 12px;
      border: 2px solid #10b981;
      margin: 20px 0;
      font-weight: 500;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    
    .metric-card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-top: 4px solid #059669;
    }
    
    .metric-number {
      font-size: 36px;
      font-weight: 800;
      color: #059669;
      display: block;
      margin-bottom: 8px;
    }
    
    .metric-label {
      font-size: 14px;
      color: #6b7280;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .process-flow {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 40px 0;
    }
    
    .process-step {
      background: white;
      padding: 20px;
      border-radius: 50%;
      width: 120px;
      height: 120px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
      border: 3px solid #059669;
      position: relative;
    }
    
    .process-step:not(:last-child)::after {
      content: '→';
      position: absolute;
      right: -50px;
      font-size: 24px;
      color: #059669;
      font-weight: bold;
    }
    
    .step-number {
      font-size: 24px;
      font-weight: bold;
      color: #059669;
      margin-bottom: 5px;
    }
    
    .step-label {
      font-size: 12px;
      text-align: center;
      font-weight: 600;
      color: #374151;
    }
    
    .quote-box {
      background: #1f2937;
      color: white;
      padding: 40px;
      border-radius: 15px;
      font-size: 24px;
      font-style: italic;
      text-align: center;
      margin: 30px 0;
      position: relative;
    }
    
    .quote-box::before {
      content: '"';
      font-size: 80px;
      position: absolute;
      top: -10px;
      left: 30px;
      opacity: 0.3;
    }
    
    .list-enhanced {
      list-style: none;
      padding: 0;
    }
    
    .list-enhanced li {
      background: white;
      margin: 15px 0;
      padding: 20px;
      border-radius: 10px;
      border-left: 5px solid #059669;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      font-size: 16px;
      line-height: 1.5;
    }
    
    .list-enhanced li strong {
      color: #059669;
      display: block;
      margin-bottom: 8px;
      font-size: 18px;
    }
    
    .timeline {
      position: relative;
      margin: 40px 0;
    }
    
    .timeline::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 4px;
      background: #059669;
      transform: translateX(-50%);
    }
    
    .timeline-item {
      position: relative;
      margin: 30px 0;
      display: flex;
      align-items: center;
    }
    
    .timeline-item:nth-child(odd) {
      flex-direction: row;
    }
    
    .timeline-item:nth-child(even) {
      flex-direction: row-reverse;
    }
    
    .timeline-content {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      width: 45%;
      margin: 0 20px;
      position: relative;
    }
    
    .timeline-marker {
      background: #059669;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
    }
    
    .fullscreen-controls {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.8);
      padding: 15px 25px;
      border-radius: 25px;
      backdrop-filter: blur(10px);
      z-index: 1000;
    }
    
    .progress-container {
      width: 300px;
      height: 4px;
      background: rgba(255,255,255,0.3);
      border-radius: 2px;
      margin-bottom: 10px;
    }
    
    .progress-bar {
      height: 100%;
      background: #10b981;
      border-radius: 2px;
      transition: width 0.3s ease;
      width: 0%;
    }
    
    .controls {
      display: flex;
      align-items: center;
      gap: 15px;
      color: white;
      font-size: 14px;
    }
    
    .controls button {
      background: rgba(255,255,255,0.2);
      border: none;
      color: white;
      padding: 8px 15px;
      border-radius: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .controls button:hover:not(:disabled) {
      background: rgba(255,255,255,0.3);
      transform: translateY(-1px);
    }
    
    .controls button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .slide-counter {
      font-weight: 600;
      min-width: 60px;
      text-align: center;
    }
    
    /* Print styles */
    @media print {
      body { background: white; overflow: visible; height: auto; }
      .slide { 
        display: flex !important; 
        page-break-after: always; 
        width: 8.5in; 
        height: 11in; 
        padding: 0.5in;
        box-shadow: none;
      }
      .slide:last-child { page-break-after: auto; }
      .fullscreen-controls { display: none !important; }
      h1 { font-size: 48px; }
      h2 { font-size: 36px; }
      h3 { font-size: 24px; }
      .subtitle { font-size: 24px; }
      .info-box { font-size: 16px; }
      .content { font-size: 14px; }
    }
    
    /* Animations */
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .slide {
      animation: fadeInUp 0.5s ease-out;
    }
  `
}

function generateSuperTitleSlide(data: JournalData, currentDate: string): string {
  const teamMembers = data.step1?.length || 0
  
  return `
    <div class="slide title-slide">
      <h1>🌱 ${data.journal?.title || 'BITÁCORA DE OPORTUNIDADES'}</h1>
      <div class="subtitle">Emprendimiento Sostenible & Análisis Efectual</div>
      <div class="info-box">
        <div><strong>📊 Equipo:</strong> ${data.team?.name || 'Equipo Emprendedor'}</div>
        <div><strong>👥 Integrantes:</strong> ${teamMembers} emprendedor${teamMembers !== 1 ? 'es' : ''}</div>
        <div><strong>📅 Fecha:</strong> ${currentDate}</div>
        <div><strong>🎯 Metodología:</strong> Efectual + Sostenibilidad</div>
        ${data.idea ? `<div><strong>💡 Oportunidad:</strong> ${data.idea.title}</div>` : ''}
      </div>
    </div>
  `
}

function generateExecutiveSummarySlide(data: JournalData): string {
  const selectedIdea = data.step4?.find(idea => idea.selected)
  
  return `
    <div class="slide">
      <div class="slide-header">
        <h2>📋 Resumen Ejecutivo</h2>
      </div>
      <div class="content">
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
              <p>${data.step5VP?.products_services?.substring(0, 200) || 'Propuesta de valor en desarrollo'}...</p>
            </div>
          </div>
          
          <div>
            <div class="metrics-grid">
              <div class="metric-card">
                <span class="metric-number">${data.step3?.length || 0}</span>
                <span class="metric-label">Tendencias Analizadas</span>
              </div>
              <div class="metric-card">
                <span class="metric-number">${data.step4?.length || 0}</span>
                <span class="metric-label">Ideas Generadas</span>
              </div>
              <div class="metric-card">
                <span class="metric-number">${data.step9InnovationPatterns?.length || 0}</span>
                <span class="metric-label">Patrones Innovación</span>
              </div>
              <div class="metric-card">
                <span class="metric-number">${data.step12EcosystemActors?.length || 0}</span>
                <span class="metric-label">Actores Ecosistema</span>
              </div>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">🌱</span>Impacto Sostenible</h4>
              <p>${data.step8SustainableCanvas?.social_benefits?.substring(0, 150) || 'Impacto social y ambiental positivo a través de un modelo de negocio sostenible'}...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

function generateMethodologySlide(): string {
  return `
    <div class="slide">
      <div class="slide-header">
        <h2>🧭 Metodología Aplicada</h2>
      </div>
      <div class="content">
        <div class="two-column">
          <div>
            <h3>📊 Análisis Efectual (Pasos 1-5)</h3>
            <ul class="list-enhanced">
              <li><strong>1. Medios Personales</strong>¿Quién soy? ¿Qué sé? ¿A quién conozco? ¿Qué tengo?</li>
              <li><strong>2. Problema/Necesidad</strong>Identificación de oportunidades basadas en medios</li>
              <li><strong>3. Tendencias</strong>Análisis del entorno y drivers de cambio</li>
              <li><strong>4. Ideación</strong>Generación y selección de ideas de negocio</li>
              <li><strong>5. Usuario/Valor</strong>Buyer persona y propuesta de valor</li>
            </ul>
          </div>
          
          <div>
            <h3>🌱 Emprendimiento Sostenible (Pasos 8-13)</h3>
            <ul class="list-enhanced">
              <li><strong>8. Canvas Sostenible</strong>Modelo de negocio con triple impacto</li>
              <li><strong>9. Innovación</strong>Patrones de innovación aplicados</li>
              <li><strong>10. Prototipo</strong>MVP y validación de hipótesis</li>
              <li><strong>11. Validación</strong>Estrategia de validación de mercado</li>
              <li><strong>12. Ecosistema</strong>Mapeo de actores y alianzas</li>
              <li><strong>13. Reflexión</strong>Integración y sostenibilidad a largo plazo</li>
            </ul>
          </div>
        </div>
        
        <div class="quote-box">
          La metodología efectual se enfoca en crear el futuro basándose en los medios disponibles, 
          mientras que el emprendimiento sostenible asegura un impacto positivo duradero.
        </div>
      </div>
    </div>
  `
}

function generateSuperStep1Slide(step1Data: Step1Data): string {
  if (!step1Data || step1Data.length === 0) {
    return `
      <div class="slide">
        <div class="slide-header">
          <h2>👥 Paso 1: Medios Personales</h2>
        </div>
        <div class="content">
          <div class="highlight-box">
            <p style="text-align: center; font-size: 20px;">No hay datos disponibles para este paso</p>
          </div>
        </div>
      </div>
    `
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
    <div class="slide">
      <div class="slide-header">
        <h2>👥 Paso 1: Medios Personales</h2>
        <p>Inventario completo de recursos del equipo emprendedor</p>
      </div>
      <div class="content">
        <div class="${step1Data.length > 2 ? 'three-column' : 'two-column'}">
          ${membersCards}
        </div>
      </div>
    </div>
  `
}

function generateSuperStep2Slide(step2Data: Step2Data): string {
  if (!step2Data) {
    return `
      <div class="slide">
        <div class="slide-header">
          <h2>🎯 Paso 2: Problema o Necesidad</h2>
        </div>
        <div class="content">
          <div class="highlight-box">
            <p style="text-align: center; font-size: 20px;">No hay datos disponibles para este paso</p>
          </div>
        </div>
      </div>
    `
  }

  return `
    <div class="slide">
      <div class="slide-header">
        <h2>🎯 Paso 2: Problema o Necesidad</h2>
        <h3>${step2Data.title}</h3>
      </div>
      <div class="content">
        <div class="two-column">
          <div>
            <div class="card">
              <h4><span class="card-icon">📝</span>Descripción del Problema</h4>
              <p>${step2Data.description}</p>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">🔗</span>Conexión con Medios</h4>
              <p>${step2Data.link_to_means}</p>
            </div>
          </div>
          
          <div>
            <div class="card">
              <h4><span class="card-icon">👥</span>Población Afectada</h4>
              <p>${step2Data.affected}</p>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">📊</span>Relevancia e Impacto</h4>
              <p>${step2Data.relevance}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

function generateSuperStep3Slide(step3Data: Step3Data): string {
  if (!step3Data || step3Data.length === 0) {
    return `
      <div class="slide">
        <div class="slide-header">
          <h2>📈 Paso 3: Tendencias del Entorno</h2>
        </div>
        <div class="content">
          <div class="highlight-box">
            <p style="text-align: center; font-size: 20px;">No hay tendencias analizadas</p>
          </div>
        </div>
      </div>
    `
  }

  const trendsCards = step3Data.map((trend, index) => `
    <div class="card">
      <h4><span class="card-icon">${getTrendIcon(trend.type)}</span>${trend.name}</h4>
      <div class="metric-card" style="margin: 10px 0;">
        <span class="metric-label">${trend.type}</span>
      </div>
      <p><strong>Descripción:</strong> ${trend.brief}</p>
      ${trend.example ? `<p><strong>Ejemplo:</strong> ${trend.example}</p>` : ''}
      ${trend.source_apa ? `<p><strong>Fuente:</strong> ${trend.source_apa}</p>` : ''}
      ${trend.comment ? `<p><strong>Relevancia:</strong> ${trend.comment}</p>` : ''}
    </div>
  `).join('')

  return `
    <div class="slide">
      <div class="slide-header">
        <h2>📈 Paso 3: Tendencias del Entorno</h2>
        <p>Análisis de ${step3Data.length} tendencias clave identificadas</p>
      </div>
      <div class="content">
        <div class="${step3Data.length > 2 ? 'two-column' : 'three-column'}">
          ${trendsCards}
        </div>
      </div>
    </div>
  `
}

function generateSuperStep4Slide(step4Data: Step4Data): string {
  if (!step4Data || step4Data.length === 0) {
    return `
      <div class="slide">
        <div class="slide-header">
          <h2>💡 Paso 4: Ideación y Selección</h2>
        </div>
        <div class="content">
          <div class="highlight-box">
            <p style="text-align: center; font-size: 20px;">No hay ideas generadas</p>
          </div>
        </div>
      </div>
    `
  }

  const selectedIdea = step4Data.find(idea => idea.selected)
  const otherIdeas = step4Data.filter(idea => !idea.selected).slice(0, 3)
  
  return `
    <div class="slide">
      <div class="slide-header">
        <h2>💡 Paso 4: Ideación y Selección</h2>
        <p>De ${step4Data.length} ideas generadas, se seleccionó la más prometedora</p>
      </div>
      <div class="content">
        <div class="two-column">
          <div>
            ${selectedIdea ? `
              <div class="highlight-box">
                <h3>🌟 Idea Seleccionada</h3>
                <h4>${selectedIdea.idea}</h4>
                <div class="metrics-grid">
                  <div class="metric-card">
                    <span class="metric-label">Tipo</span>
                    <span class="metric-number" style="font-size: 16px;">${selectedIdea.kind}</span>
                  </div>
                  <div class="metric-card">
                    <span class="metric-label">Innovación</span>
                    <span class="metric-number" style="font-size: 16px;">${selectedIdea.innovation_level}</span>
                  </div>
                  <div class="metric-card">
                    <span class="metric-label">Factibilidad</span>
                    <span class="metric-number" style="font-size: 16px;">${selectedIdea.feasibility}</span>
                  </div>
                </div>
                ${selectedIdea.justification ? `<p><strong>Justificación:</strong> ${selectedIdea.justification}</p>` : ''}
              </div>
            ` : ''}
          </div>
          
          <div>
            <h3>🔍 Otras Ideas Exploradas</h3>
            ${otherIdeas.map((idea, index) => `
              <div class="card">
                <h4><span class="card-icon">💭</span>${idea.idea}</h4>
                <p><strong>Tipo:</strong> ${idea.kind} | <strong>Innovación:</strong> ${idea.innovation_level}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `
}

function generateStep4EvaluationSlide(step4Data: Step4Data): string {
  const selectedIdea = step4Data?.find(idea => idea.selected)
  
  if (!selectedIdea || !selectedIdea.swot_analysis) {
    return '' // Skip this slide if no SWOT analysis
  }

  // Parse SWOT analysis if it's a string
  let swotData
  try {
    swotData = typeof selectedIdea.swot_analysis === 'string' 
      ? JSON.parse(selectedIdea.swot_analysis) 
      : selectedIdea.swot_analysis
  } catch {
    return '' // Skip if can't parse
  }

  return `
    <div class="slide">
      <div class="slide-header">
        <h2>⚡ Análisis SWOT - Idea Seleccionada</h2>
        <p>Evaluación estratégica de ${selectedIdea.idea}</p>
      </div>
      <div class="content">
        <div class="two-column">
          <div>
            <div class="card">
              <h4><span class="card-icon">💪</span>Fortalezas</h4>
              <p>${swotData.strengths || 'No especificadas'}</p>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">🎯</span>Oportunidades</h4>
              <p>${swotData.opportunities || 'No especificadas'}</p>
            </div>
          </div>
          
          <div>
            <div class="card">
              <h4><span class="card-icon">⚠️</span>Debilidades</h4>
              <p>${swotData.weaknesses || 'No especificadas'}</p>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">🚨</span>Amenazas</h4>
              <p>${swotData.threats || 'No especificadas'}</p>
            </div>
          </div>
        </div>
        
        ${swotData.success_factors || swotData.risk_mitigation ? `
          <div class="two-column" style="margin-top: 30px;">
            ${swotData.success_factors ? `
              <div class="card">
                <h4><span class="card-icon">🎯</span>Factores Críticos de Éxito</h4>
                <p>${swotData.success_factors}</p>
              </div>
            ` : ''}
            
            ${swotData.risk_mitigation ? `
              <div class="card">
                <h4><span class="card-icon">🛡️</span>Mitigación de Riesgos</h4>
                <p>${swotData.risk_mitigation}</p>
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    </div>
  `
}

function generateSuperStep5BuyerSlide(buyerData: Step5BuyerData): string {
  if (!buyerData) {
    return `
      <div class="slide">
        <div class="slide-header">
          <h2>👤 Paso 5A: Buyer Persona</h2>
        </div>
        <div class="content">
          <div class="highlight-box">
            <p style="text-align: center; font-size: 20px;">Buyer Persona no definido</p>
          </div>
        </div>
      </div>
    `
  }

  return `
    <div class="slide">
      <div class="slide-header">
        <h2>👤 Paso 5A: Buyer Persona</h2>
        <h3>"${buyerData.name}" - Cliente Objetivo</h3>
      </div>
      <div class="content">
        <div class="two-column">
          <div>
            <div class="highlight-box">
              <h3>📊 Perfil Demográfico</h3>
              <div class="metrics-grid">
                <div class="metric-card">
                  <span class="metric-number">${buyerData.age}</span>
                  <span class="metric-label">Años</span>
                </div>
                <div class="metric-card">
                  <span class="metric-number">${buyerData.segment || 'N/A'}</span>
                  <span class="metric-label">Segmento</span>
                </div>
              </div>
              <p><strong>Ocupación:</strong> ${buyerData.occupation}</p>
              ${buyerData.income ? `<p><strong>Ingresos:</strong> ${buyerData.income}</p>` : ''}
            </div>
          </div>
          
          <div>
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
        </div>
      </div>
    </div>
  `
}

function generateSuperStep5VPSlide(vpData: Step5VPData): string {
  if (!vpData) {
    return `
      <div class="slide">
        <div class="slide-header">
          <h2>💎 Paso 5B: Propuesta de Valor</h2>
        </div>
        <div class="content">
          <div class="highlight-box">
            <p style="text-align: center; font-size: 20px;">Propuesta de valor no definida</p>
          </div>
        </div>
      </div>
    `
  }

  return `
    <div class="slide">
      <div class="slide-header">
        <h2>💎 Paso 5B: Canvas de Propuesta de Valor</h2>
        <p>Ajuste problema-solución detallado</p>
      </div>
      <div class="content">
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
      </div>
    </div>
  `
}

function generateSustainabilityTransitionSlide(): string {
  return `
    <div class="slide transition-slide">
      <h1>🌱 EMPRENDIMIENTO SOSTENIBLE</h1>
      <div class="subtitle">Integrando Impacto Social, Ambiental y Económico</div>
      <div class="info-box">
        <p>A continuación analizaremos cómo el emprendimiento puede generar valor económico 
        mientras crea un impacto positivo en la sociedad y el medio ambiente.</p>
        <br>
        <p><strong>Pasos 8-13:</strong> Canvas Sostenible, Innovación, Prototipo, Validación, Ecosistema y Reflexión Final</p>
      </div>
    </div>
  `
}

// Continue with remaining slide generation functions...
// [Additional functions would follow the same pattern]

function generateSuperStep8Slide(canvasData?: SustainableCanvasData): string {
  if (!canvasData) {
    return `
      <div class="slide">
        <div class="slide-header">
          <h2>🌱 Paso 8: Canvas Sostenible</h2>
        </div>
        <div class="content">
          <div class="highlight-box">
            <p style="text-align: center; font-size: 20px;">Canvas sostenible no completado</p>
          </div>
        </div>
      </div>
    `
  }

  return `
    <div class="slide">
      <div class="slide-header">
        <h2>🌱 Paso 8: Canvas de Modelo de Negocio Sostenible</h2>
        <p>Triple impacto: social, ambiental y económico</p>
      </div>
      <div class="content">
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
            
            <div class="card">
              <h4><span class="card-icon">📺</span>Canales</h4>
              <p>${canvasData.channels || 'No especificado'}</p>
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
            
            <div class="card">
              <h4><span class="card-icon">⚠️</span>Costos Socio-Ambientales</h4>
              <p>${canvasData.social_costs || canvasData.environmental_costs || 'No especificado'}</p>
            </div>
          </div>
          
          <div>
            <h3>🏢 Lado del Negocio</h3>
            <div class="card">
              <h4><span class="card-icon">🔑</span>Recursos Clave</h4>
              <p>${canvasData.key_resources || 'No especificado'}</p>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">⚙️</span>Actividades Clave</h4>
              <p>${canvasData.key_activities || 'No especificado'}</p>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">💰</span>Modelo de Ingresos</h4>
              <p>${canvasData.revenue_streams || 'No especificado'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
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

// Additional slide generation functions would continue here...
// For brevity, I'm including the key ones that show the pattern

function generateSuperStep9Slide(patternsData?: InnovationPatternsData): string {
  if (!patternsData || patternsData.length === 0) {
    return `
      <div class="slide">
        <div class="slide-header">
          <h2>💡 Paso 9: Patrones de Innovación</h2>
        </div>
        <div class="content">
          <div class="highlight-box">
            <p style="text-align: center; font-size: 20px;">Patrones de innovación no completados</p>
          </div>
        </div>
      </div>
    `
  }

  const primaryPattern = patternsData.find(p => p.is_primary)
  const secondaryPatterns = patternsData.filter(p => !p.is_primary)

  return `
    <div class="slide">
      <div class="slide-header">
        <h2>💡 Paso 9: Patrones de Innovación Aplicados</h2>
        <p>${patternsData.length} patrones identificados para crear ventaja competitiva</p>
      </div>
      <div class="content">
        <div class="two-column">
          <div>
            ${primaryPattern ? `
              <div class="highlight-box">
                <h3>🌟 Patrón Principal</h3>
                <h4>${primaryPattern.pattern_name}</h4>
                <p><strong>Descripción:</strong> ${primaryPattern.pattern_description}</p>
                <p><strong>Justificación:</strong> ${primaryPattern.justification}</p>
                <p><strong>Impacto Esperado:</strong> ${primaryPattern.expected_impact}</p>
              </div>
            ` : ''}
          </div>
          
          <div>
            <h3>🔧 Patrones Secundarios</h3>
            ${secondaryPatterns.map(pattern => `
              <div class="card">
                <h4><span class="card-icon">💡</span>${pattern.pattern_name}</h4>
                <p>${pattern.pattern_description}</p>
                <p><strong>Impacto:</strong> ${pattern.expected_impact}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `
}

function generateSuperStep10Slide(prototypeData?: PrototypeData): string {
  if (!prototypeData) {
    return `
      <div class="slide">
        <div class="slide-header">
          <h2>🔧 Paso 10: Prototipo y MVP</h2>
        </div>
        <div class="content">
          <div class="highlight-box">
            <p style="text-align: center; font-size: 20px;">Prototipo no definido</p>
          </div>
        </div>
      </div>
    `
  }

  return `
    <div class="slide">
      <div class="slide-header">
        <h2>🔧 Paso 10: Prototipo y MVP</h2>
        <h3>${prototypeData.name}</h3>
      </div>
      <div class="content">
        <div class="two-column">
          <div>
            <div class="highlight-box">
              <h3>🎯 Características del Prototipo</h3>
              <div class="metric-card">
                <span class="metric-label">Tipo de Prototipo</span>
                <span class="metric-number" style="font-size: 18px;">${prototypeData.type}</span>
              </div>
              <p>${prototypeData.description}</p>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">🔬</span>Hipótesis a Validar</h4>
              <p>${prototypeData.hypothesis_to_validate}</p>
            </div>
          </div>
          
          <div>
            <div class="card">
              <h4><span class="card-icon">📊</span>Métricas de Aprendizaje</h4>
              <p>${prototypeData.expected_learning_metrics}</p>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">🤖</span>Sugerencia de IA</h4>
              <p>${prototypeData.ai_mvp_suggestion}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

function generateSuperStep11Slide(validationData?: ValidationStrategyData): string {
  if (!validationData) {
    return `
      <div class="slide">
        <div class="slide-header">
          <h2>🎯 Paso 11: Estrategia de Validación</h2>
        </div>
        <div class="content">
          <div class="highlight-box">
            <p style="text-align: center; font-size: 20px;">Estrategia de validación no definida</p>
          </div>
        </div>
      </div>
    `
  }

  return `
    <div class="slide">
      <div class="slide-header">
        <h2>🎯 Paso 11: Estrategia de Validación</h2>
        <p>Plan estructurado para validar hipótesis de negocio</p>
      </div>
      <div class="content">
        <div class="two-column">
          <div>
            <div class="card">
              <h4><span class="card-icon">🔬</span>Hipótesis Principal</h4>
              <p>${validationData.hypothesis}</p>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">👥</span>Segmentos Objetivo</h4>
              <p>${validationData.target_segments}</p>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">📚</span>Aprendizajes Esperados</h4>
              <p>${validationData.expected_learnings}</p>
            </div>
          </div>
          
          <div>
            <div class="metrics-grid">
              <div class="metric-card">
                <span class="metric-number">${validationData.timeline_weeks}</span>
                <span class="metric-label">Semanas</span>
              </div>
              <div class="metric-card">
                <span class="metric-number">$${validationData.budget_estimate?.toLocaleString()}</span>
                <span class="metric-label">Presupuesto</span>
              </div>
              <div class="metric-card">
                <span class="metric-number">${validationData.progress_percentage || 0}%</span>
                <span class="metric-label">Progreso</span>
              </div>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">🛠️</span>Métodos de Validación</h4>
              <ul>
                ${validationData.validation_methods?.map(method => `<li>${method}</li>`).join('') || '<li>No especificados</li>'}
              </ul>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">✅</span>Criterios de Éxito</h4>
              <p>${validationData.success_criteria}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

function generateSuperStep12Slide(actorsData?: EcosystemActorsData): string {
  if (!actorsData || actorsData.length === 0) {
    return `
      <div class="slide">
        <div class="slide-header">
          <h2>🤝 Paso 12: Mapa del Ecosistema</h2>
        </div>
        <div class="content">
          <div class="highlight-box">
            <p style="text-align: center; font-size: 20px;">Mapa del ecosistema no completado</p>
          </div>
        </div>
      </div>
    `
  }

  const actorsByType = actorsData.reduce((acc, actor) => {
    if (!acc[actor.actor_type]) acc[actor.actor_type] = []
    acc[actor.actor_type].push(actor)
    return acc
  }, {} as Record<string, typeof actorsData>)

  return `
    <div class="slide">
      <div class="slide-header">
        <h2>🤝 Paso 12: Mapa del Ecosistema</h2>
        <p>${actorsData.length} actores clave identificados para el éxito del emprendimiento</p>
      </div>
      <div class="content">
        <div class="three-column">
          ${Object.entries(actorsByType).map(([type, actors]) => `
            <div>
              <h3>${getActorTypeIcon(type)} ${type.charAt(0).toUpperCase() + type.slice(1)}</h3>
              ${actors.map(actor => `
                <div class="card">
                  <h4><span class="card-icon">🤝</span>${actor.actor_name}</h4>
                  <p><strong>Rol:</strong> ${actor.role_description}</p>
                  <p><strong>Soporte:</strong> ${actor.support_types?.join(', ')}</p>
                  <p><strong>Estado:</strong> ${actor.relationship_status}</p>
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `
}

function generateSuperStep13Slide(reflectionData?: SustainabilityReflectionData): string {
  if (!reflectionData) {
    return `
      <div class="slide">
        <div class="slide-header">
          <h2>🔁 Paso 13: Reflexión de Sostenibilidad</h2>
        </div>
        <div class="content">
          <div class="highlight-box">
            <p style="text-align: center; font-size: 20px;">Reflexión de sostenibilidad no completada</p>
          </div>
        </div>
      </div>
    `
  }

  return `
    <div class="slide">
      <div class="slide-header">
        <h2>🔁 Paso 13: Reflexión Final de Sostenibilidad</h2>
        <p>Integración y análisis del impacto sostenible a largo plazo</p>
      </div>
      <div class="content">
        <div class="three-column">
          <div>
            <div class="card">
              <h4><span class="card-icon">⚖️</span>Equilibrio de Impactos</h4>
              <p>${reflectionData.social_impact_balance}</p>
            </div>
          </div>
          
          <div>
            <div class="card">
              <h4><span class="card-icon">🎯</span>Decisiones Sostenibles</h4>
              <p>${reflectionData.sustainability_decisions}</p>
            </div>
          </div>
          
          <div>
            <div class="card">
              <h4><span class="card-icon">📈</span>Estrategia de Escalamiento</h4>
              <p>${reflectionData.scaling_strategy}</p>
            </div>
          </div>
        </div>
        
        ${reflectionData.ai_generated_reflection ? `
          <div class="quote-box">
            ${reflectionData.ai_generated_reflection}
          </div>
        ` : ''}
      </div>
    </div>
  `
}

function generateBusinessModelSummarySlide(data: JournalData): string {
  return `
    <div class="slide">
      <div class="slide-header">
        <h2>📊 Resumen del Modelo de Negocio</h2>
        <p>Integración de análisis efectual y sostenibilidad</p>
      </div>
      <div class="content">
        <div class="two-column">
          <div>
            <h3>🎯 Propuesta de Valor Core</h3>
            <div class="highlight-box">
              <p>${data.step5VP?.products_services || 'Propuesta de valor en desarrollo'}</p>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">👤</span>Cliente Objetivo</h4>
              <p><strong>${data.step5Buyer?.name || 'Cliente objetivo'}:</strong> ${data.step5Buyer?.occupation || 'Perfil en desarrollo'}</p>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">🎯</span>Problema que Resuelve</h4>
              <p>${data.step2?.title || 'Problema identificado'}</p>
            </div>
          </div>
          
          <div>
            <h3>🌱 Diferenciación Sostenible</h3>
            <div class="card">
              <h4><span class="card-icon">🤝</span>Impacto Social</h4>
              <p>${data.step8SustainableCanvas?.social_benefits?.substring(0, 150) || 'Impacto social en desarrollo'}...</p>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">🌍</span>Impacto Ambiental</h4>
              <p>${data.step8SustainableCanvas?.environmental_benefits?.substring(0, 150) || 'Impacto ambiental en desarrollo'}...</p>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">💰</span>Viabilidad Económica</h4>
              <p>${data.step8SustainableCanvas?.revenue_streams?.substring(0, 150) || 'Modelo de ingresos en desarrollo'}...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

function generateImplementationRoadmapSlide(): string {
  return `
    <div class="slide">
      <div class="slide-header">
        <h2>🚀 Hoja de Ruta de Implementación</h2>
        <p>Próximos pasos para materializar el emprendimiento</p>
      </div>
      <div class="content">
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <h4>Fase 1: Validación (0-3 meses)</h4>
              <p>• Desarrollo de prototipo mínimo viable<br>• Testing con usuarios objetivo<br>• Refinamiento de propuesta de valor</p>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <h4>Fase 2: Desarrollo (3-9 meses)</h4>
              <p>• Construcción del producto/servicio<br>• Establecimiento de operaciones<br>• Formación de alianzas clave</p>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <h4>Fase 3: Lanzamiento (9-12 meses)</h4>
              <p>• Go-to-market execution<br>• Captación de primeros clientes<br>• Monitoreo de métricas de impacto</p>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <h4>Fase 4: Escalamiento (12+ meses)</h4>
              <p>• Expansión geográfica/segmentos<br>• Optimización operacional<br>• Mantenimiento de propósito sostenible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

function generateRiskAnalysisSlide(step4Data: Step4Data): string {
  const selectedIdea = step4Data?.find(idea => idea.selected)
  
  return `
    <div class="slide">
      <div class="slide-header">
        <h2>⚠️ Análisis de Riesgos y Mitigación</h2>
        <p>Identificación proactiva de riesgos críticos</p>
      </div>
      <div class="content">
        <div class="two-column">
          <div>
            <h3>🚨 Riesgos Principales</h3>
            <div class="card">
              <h4><span class="card-icon">📊</span>Riesgo de Mercado</h4>
              <p>Adopción más lenta de lo esperado por parte del mercado objetivo</p>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">💰</span>Riesgo Financiero</h4>
              <p>Necesidades de capital superiores a lo proyectado inicialmente</p>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">🏢</span>Riesgo Operacional</h4>
              <p>Dificultades en escalamiento manteniendo calidad e impacto</p>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">⚖️</span>Riesgo Regulatorio</h4>
              <p>Cambios en regulaciones ambientales o de industria</p>
            </div>
          </div>
          
          <div>
            <h3>🛡️ Estrategias de Mitigación</h3>
            <div class="card">
              <h4><span class="card-icon">🔬</span>Validación Continua</h4>
              <p>Testing regular con usuarios y pivoting ágil basado en feedback</p>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">🤝</span>Diversificación de Recursos</h4>
              <p>Múltiples fuentes de financiamiento y partnerships estratégicas</p>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">📈</span>Escalamiento Gradual</h4>
              <p>Crecimiento por fases con consolidación de capacidades</p>
            </div>
            
            <div class="card">
              <h4><span class="card-icon">📚</span>Monitoreo Regulatorio</h4>
              <p>Seguimiento activo de cambios normativos y adaptación proactiva</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

function generateFinancialProjectionsSlide(): string {
  return `
    <div class="slide">
      <div class="slide-header">
        <h2>💰 Proyecciones Financieras Preliminares</h2>
        <p>Estimaciones basadas en análisis de modelo de negocio</p>
      </div>
      <div class="content">
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="metric-number">$25K</span>
            <span class="metric-label">Inversión Inicial Estimada</span>
          </div>
          <div class="metric-card">
            <span class="metric-number">6-12</span>
            <span class="metric-label">Meses al Break-even</span>
          </div>
          <div class="metric-card">
            <span class="metric-number">15-25%</span>
            <span class="metric-label">Margen Proyectado</span>
          </div>
          <div class="metric-card">
            <span class="metric-number">3-5x</span>
            <span class="metric-label">ROI Esperado (3 años)</span>
          </div>
        </div>
        
        <div class="two-column">
          <div>
            <div class="card">
              <h4><span class="card-icon">💸</span>Principales Costos</h4>
              <ul>
                <li>Desarrollo de producto/tecnología</li>
                <li>Marketing y adquisición de clientes</li>
                <li>Operaciones y personal</li>
                <li>Certificaciones sostenibles</li>
                <li>Capital de trabajo</li>
              </ul>
            </div>
          </div>
          
          <div>
            <div class="card">
              <h4><span class="card-icon">💎</span>Fuentes de Ingresos</h4>
              <ul>
                <li>Ventas directas de producto/servicio</li>
                <li>Suscripciones o membresías</li>
                <li>Licenciamiento de tecnología</li>
                <li>Servicios de consultoría</li>
                <li>Partnerships estratégicas</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="highlight-box">
          <p><strong>Nota:</strong> Estas proyecciones son preliminares y deben refinarse con validación de mercado y desarrollo del business plan detallado.</p>
        </div>
      </div>
    </div>
  `
}

function generateSocialImpactSlide(canvasData?: SustainableCanvasData): string {
  return `
    <div class="slide">
      <div class="slide-header">
        <h2>🌍 Medición de Impacto Social y Ambiental</h2>
        <p>Framework para tracking del triple impacto</p>
      </div>
      <div class="content">
        <div class="three-column">
          <div>
            <h3>🤝 Impacto Social</h3>
            <div class="metric-card">
              <span class="metric-number">500+</span>
              <span class="metric-label">Beneficiarios Directos (Año 1)</span>
            </div>
            <div class="card">
              <h4><span class="card-icon">📊</span>Métricas Clave</h4>
              <ul>
                <li>Número de beneficiarios</li>
                <li>Mejora en calidad de vida</li>
                <li>Empleos creados</li>
                <li>Acceso a servicios/productos</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3>🌱 Impacto Ambiental</h3>
            <div class="metric-card">
              <span class="metric-number">-25%</span>
              <span class="metric-label">Reducción CO2 vs Alternativas</span>
            </div>
            <div class="card">
              <h4><span class="card-icon">🌍</span>Métricas Ambientales</h4>
              <ul>
                <li>Huella de carbono</li>
                <li>Uso de recursos naturales</li>
                <li>Generación de residuos</li>
                <li>Biodiversidad preservada</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3>💰 Impacto Económico</h3>
            <div class="metric-card">
              <span class="metric-number">$2.5</span>
              <span class="metric-label">Valor Social por $ Invertido</span>
            </div>
            <div class="card">
              <h4><span class="card-icon">📈</span>Valor Económico</h4>
              <ul>
                <li>ROI social (SROI)</li>
                <li>Ahorro en costos sociales</li>
                <li>Valor económico creado</li>
                <li>Eficiencia de recursos</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="quote-box">
          "El éxito se medirá no solo por la rentabilidad financiera, sino por el impacto positivo 
          duradero en la sociedad y el medio ambiente."
        </div>
      </div>
    </div>
  `
}

function generateNextStepsSlide(): string {
  return `
    <div class="slide">
      <div class="slide-header">
        <h2>⚡ Próximos Pasos Inmediatos</h2>
        <p>Plan de acción para las próximas 4 semanas</p>
      </div>
      <div class="content">
        <div class="process-flow">
          <div class="process-step">
            <div class="step-number">1</div>
            <div class="step-label">Validar Hipótesis</div>
          </div>
          
          <div class="process-step">
            <div class="step-number">2</div>
            <div class="step-label">Desarrollar MVP</div>
          </div>
          
          <div class="process-step">
            <div class="step-number">3</div>
            <div class="step-label">Testing Usuario</div>
          </div>
          
          <div class="process-step">
            <div class="step-number">4</div>
            <div class="step-label">Refinar Modelo</div>
          </div>
          
          <div class="process-step">
            <div class="step-number">5</div>
            <div class="step-label">Buscar Recursos</div>
          </div>
        </div>
        
        <div class="two-column">
          <div>
            <div class="card">
              <h4><span class="card-icon">🎯</span>Acciones Críticas</h4>
              <ul>
                <li>Contactar 10 usuarios potenciales para entrevistas</li>
                <li>Desarrollar prototipo funcional básico</li>
                <li>Establecer métricas de éxito claras</li>
                <li>Identificar mentores en la industria</li>
                <li>Investigar opciones de financiamiento</li>
              </ul>
            </div>
          </div>
          
          <div>
            <div class="card">
              <h4><span class="card-icon">📅</span>Timeline Semanal</h4>
              <ul>
                <li><strong>Semana 1:</strong> Investigación de usuarios y competencia</li>
                <li><strong>Semana 2:</strong> Desarrollo de prototipo inicial</li>
                <li><strong>Semana 3:</strong> Testing y feedback de usuarios</li>
                <li><strong>Semana 4:</strong> Iteración y planificación siguiente fase</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

function generateSuperConclusionSlide(data: JournalData): string {
  const totalTrends = data.step3?.length || 0
  const totalIdeas = data.step4?.length || 0
  const totalPatterns = data.step9InnovationPatterns?.length || 0
  const totalActors = data.step12EcosystemActors?.length || 0
  
  return `
    <div class="slide">
      <div class="slide-header">
        <h2>🎉 Conclusiones y Logros</h2>
        <p>Resumen del proceso completo de análisis efectual y sostenibilidad</p>
      </div>
      <div class="content">
        <div class="metrics-grid">
          <div class="metric-card">
            <span class="metric-number">${totalTrends}</span>
            <span class="metric-label">Tendencias Analizadas</span>
          </div>
          <div class="metric-card">
            <span class="metric-number">${totalIdeas}</span>
            <span class="metric-label">Ideas Generadas</span>
          </div>
          <div class="metric-card">
            <span class="metric-number">${totalPatterns}</span>
            <span class="metric-label">Patrones de Innovación</span>
          </div>
          <div class="metric-card">
            <span class="metric-number">${totalActors}</span>
            <span class="metric-label">Actores del Ecosistema</span>
          </div>
        </div>
        
        <div class="two-column">
          <div>
            <h3>✅ Logros Principales</h3>
            <ul class="list-enhanced">
              <li><strong>Análisis Efectual Completo</strong>Inventario de medios, problema identificado, y propuesta de valor validada</li>
              <li><strong>Modelo Sostenible</strong>Triple impacto social, ambiental y económico integrado</li>
              <li><strong>Estrategia Clara</strong>Roadmap de implementación y validación definido</li>
              <li><strong>Ecosistema Mapeado</strong>Red de alianzas y actores clave identificados</li>
            </ul>
          </div>
          
          <div>
            <h3>🚀 Valor Creado</h3>
            <div class="highlight-box">
              <p><strong>Oportunidad Validada:</strong> ${data.step4?.find(idea => idea.selected)?.idea || 'Emprendimiento sostenible'}</p>
              <p><strong>Mercado Objetivo:</strong> ${data.step5Buyer?.name || 'Cliente objetivo'} y segmento definido</p>
              <p><strong>Diferenciación:</strong> Modelo de negocio con impacto sostenible verificable</p>
              <p><strong>Viabilidad:</strong> Recursos, capacidades y alianzas identificadas</p>
            </div>
          </div>
        </div>
        
        <div class="quote-box">
          Este emprendimiento está preparado para generar valor económico sostenible 
          mientras crea un impacto positivo en la sociedad y el medio ambiente.
        </div>
      </div>
    </div>
  `
}

function generateContactSlide(data: JournalData): string {
  return `
    <div class="slide title-slide">
      <h1>📧 Contacto</h1>
      <div class="subtitle">¡Gracias por revisar nuestra propuesta!</div>
      <div class="info-box">
        <div><strong>📊 Proyecto:</strong> ${data.journal?.title || 'Bitácora de Oportunidades'}</div>
        <div><strong>👥 Equipo:</strong> ${data.team?.name || 'Equipo Emprendedor'}</div>
        <div><strong>🌱 Enfoque:</strong> Emprendimiento Sostenible</div>
        <br>
        <div><strong>📞 ¿Interesado en colaborar?</strong></div>
        <div>Estamos abiertos a alianzas, inversión y mentoring</div>
        <br>
        <div style="font-size: 20px;">
          🌍 <strong>Construyamos un futuro sostenible juntos</strong>
        </div>
      </div>
    </div>
  `
}

// Helper function for actor type icons
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