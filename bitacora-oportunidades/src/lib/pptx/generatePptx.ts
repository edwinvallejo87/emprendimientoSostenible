// @ts-ignore - No hay tipos oficiales para pptxgenjs
import PptxGenJS from 'pptxgenjs'
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

export async function generatePPTX(data: JournalData) {
  try {
    console.log('Iniciando generación de PPTX...')
    
    // Verificar que PptxGenJS esté disponible
    if (typeof PptxGenJS === 'undefined') {
      throw new Error('PptxGenJS no está disponible')
    }
    
    const pptx = new PptxGenJS()
    console.log('PptxGenJS inicializado')
    
    // Configuración del documento con validación
    if (data.team?.name) pptx.author = data.team.name
    if (data.journal?.title) pptx.title = `${data.journal.title} - Análisis de Oportunidades`
    pptx.subject = 'Bitácora de Oportunidades - Metodología Efectual'
    
    console.log('Creando slides...')
    
    // Crear slides con manejo de errores individual
    try { createTitleSlide(pptx, data) } catch (e) { console.error('Error en slide título:', e) }
    try { createOverviewSlide(pptx, data) } catch (e) { console.error('Error en slide overview:', e) }
    try { createStep1Slide(pptx, data.step1) } catch (e) { console.error('Error en slide step1:', e) }
    try { createStep2Slide(pptx, data.step2) } catch (e) { console.error('Error en slide step2:', e) }
    try { createStep3Slide(pptx, data.step3) } catch (e) { console.error('Error en slide step3:', e) }
    try { createStep4Slide(pptx, data.step4) } catch (e) { console.error('Error en slide step4:', e) }
    try { createStep5Slide(pptx, data.step5Buyer, data.step5VP) } catch (e) { console.error('Error en slide step5:', e) }
    try { createConclusionSlide(pptx, data) } catch (e) { console.error('Error en slide conclusión:', e) }
    
    console.log('Slides creados, generando archivo...')
    
    // Generar y descargar el archivo
    const currentDate = format(new Date(), 'yyyy-MM-dd')
    const safeTitle = data.journal?.title?.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'Bitacora'
    const fileName = `${safeTitle}_${currentDate}.pptx`
    
    console.log('Descargando archivo:', fileName)
    
    // Usar writeFile sin async/await ya que puede no ser promise
    pptx.writeFile({ fileName })
    
    console.log('PPTX generado exitosamente')
    
  } catch (error) {
    console.error('Error detallado generando PPTX:', error)
    throw new Error(`Error al generar la presentación PowerPoint: ${error instanceof Error ? error.message : 'Error desconocido'}`)
  }
}

function createTitleSlide(pptx: any, data: JournalData) {
  const slide = pptx.addSlide()
  
  // Fondo con gradiente
  slide.background = { fill: { type: 'solid', color: '059669' } }
  
  // Título principal
  slide.addText(data.journal?.title || 'Bitácora de Oportunidades', {
    x: 0.5,
    y: 2,
    w: 9,
    h: 1.5,
    fontSize: 44,
    color: 'FFFFFF',
    bold: true,
    align: 'center',
    fontFace: 'Arial'
  })
  
  // Subtítulo
  slide.addText('Análisis de Oportunidades', {
    x: 0.5,
    y: 3.8,
    w: 9,
    h: 0.8,
    fontSize: 28,
    color: 'F3F4F6',
    align: 'center',
    fontFace: 'Arial'
  })
  
  // Información del equipo
  const currentDate = format(new Date(), 'dd \'de\' MMMM \'de\' yyyy', { locale: es })
  slide.addText(`Equipo: ${data.team?.name || 'Sin nombre'}\nFecha: ${currentDate}\nMetodología: Efectual`, {
    x: 0.5,
    y: 5.2,
    w: 9,
    h: 1.5,
    fontSize: 18,
    color: 'E5E7EB',
    align: 'center',
    fontFace: 'Arial'
  })
}

function createOverviewSlide(pptx: any, data: JournalData) {
  const slide = pptx.addSlide()
  
  // Título
  slide.addText('Metodología Efectual', {
    x: 0.5,
    y: 0.5,
    w: 9,
    h: 1,
    fontSize: 36,
    color: '059669',
    bold: true,
    align: 'center',
    fontFace: 'Arial'
  })
  
  // Descripción
  slide.addText('Los 5 pasos del análisis de oportunidades', {
    x: 0.5,
    y: 1.5,
    w: 9,
    h: 0.6,
    fontSize: 20,
    color: '374151',
    align: 'center',
    fontFace: 'Arial'
  })
  
  // Pasos
  const steps = [
    '1. Medios Personales',
    '2. Problema o Necesidad',
    '3. Tendencias del Entorno',
    '4. Ideación y Selección',
    '5. Usuario y Propuesta de Valor'
  ]
  
  steps.forEach((step, index) => {
    slide.addText(step, {
      x: 1,
      y: 2.5 + (index * 0.8),
      w: 8,
      h: 0.6,
      fontSize: 24,
      color: '1F2937',
      fontFace: 'Arial',
      bullet: { code: '•' }
    })
  })
}

function createStep1Slide(pptx: any, step1Data: Step1Data) {
  const slide = pptx.addSlide()
  
  slide.addText('Paso 1: Medios Personales', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.8,
    fontSize: 32,
    color: '059669',
    bold: true,
    align: 'center',
    fontFace: 'Arial'
  })
  
  slide.addText('Inventario de recursos del equipo emprendedor', {
    x: 0.5,
    y: 1,
    w: 9,
    h: 0.5,
    fontSize: 18,
    color: '6B7280',
    align: 'center',
    italic: true,
    fontFace: 'Arial'
  })
  
  if (!step1Data || step1Data.length === 0) {
    slide.addText('No hay datos disponibles para este paso', {
      x: 0.5,
      y: 3,
      w: 9,
      h: 1,
      fontSize: 20,
      color: '9CA3AF',
      align: 'center',
      italic: true,
      fontFace: 'Arial'
    })
    return
  }
  
  step1Data.forEach((member, index) => {
    const yPos = 2 + (index * 2.5)
    
    slide.addText(`Miembro ${index + 1}`, {
      x: 0.5,
      y: yPos,
      w: 9,
      h: 0.4,
      fontSize: 20,
      color: '374151',
      bold: true,
      fontFace: 'Arial'
    })
    
    let content = ''
    if (member.who_i_am) content += `• Quién soy: ${member.who_i_am.substring(0, 100)}...\n`
    if (member.what_i_know) content += `• Qué sé: ${member.what_i_know.substring(0, 100)}...\n`
    if (member.who_i_know) content += `• A quién conozco: ${member.who_i_know.substring(0, 100)}...\n`
    if (member.what_i_have) content += `• Qué tengo: ${member.what_i_have.substring(0, 100)}...`
    
    slide.addText(content, {
      x: 0.8,
      y: yPos + 0.4,
      w: 8.7,
      h: 2,
      fontSize: 14,
      color: '4B5563',
      fontFace: 'Arial'
    })
  })
}

function createStep2Slide(pptx: any, step2Data: Step2Data) {
  const slide = pptx.addSlide()
  
  slide.addText('Paso 2: Problema o Necesidad', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.8,
    fontSize: 32,
    color: '059669',
    bold: true,
    align: 'center',
    fontFace: 'Arial'
  })
  
  if (!step2Data) {
    slide.addText('No hay datos disponibles para este paso', {
      x: 0.5,
      y: 3,
      w: 9,
      h: 1,
      fontSize: 20,
      color: '9CA3AF',
      align: 'center',
      italic: true,
      fontFace: 'Arial'
    })
    return
  }
  
  // Título del problema
  slide.addText(step2Data.title, {
    x: 0.5,
    y: 1.2,
    w: 9,
    h: 0.8,
    fontSize: 24,
    color: '1F2937',
    bold: true,
    align: 'center',
    fontFace: 'Arial'
  })
  
  // Descripción (resumida)
  slide.addText(`Descripción: ${step2Data.description.substring(0, 200)}...`, {
    x: 0.5,
    y: 2.2,
    w: 9,
    h: 1.2,
    fontSize: 16,
    color: '4B5563',
    fontFace: 'Arial'
  })
  
  // Afectados (resumido)
  slide.addText(`Personas afectadas: ${step2Data.affected.substring(0, 200)}...`, {
    x: 0.5,
    y: 3.6,
    w: 9,
    h: 1.2,
    fontSize: 16,
    color: '4B5563',
    fontFace: 'Arial'
  })
  
  // Relevancia (resumida)
  slide.addText(`Relevancia: ${step2Data.relevance.substring(0, 200)}...`, {
    x: 0.5,
    y: 5,
    w: 9,
    h: 1.2,
    fontSize: 16,
    color: '4B5563',
    fontFace: 'Arial'
  })
}

function createStep3Slide(pptx: any, step3Data: Step3Data) {
  const slide = pptx.addSlide()
  
  slide.addText('Paso 3: Tendencias del Entorno', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.8,
    fontSize: 32,
    color: '059669',
    bold: true,
    align: 'center',
    fontFace: 'Arial'
  })
  
  if (!step3Data || step3Data.length === 0) {
    slide.addText('No hay datos disponibles para este paso', {
      x: 0.5,
      y: 3,
      w: 9,
      h: 1,
      fontSize: 20,
      color: '9CA3AF',
      align: 'center',
      italic: true,
      fontFace: 'Arial'
    })
    return
  }
  
  step3Data.forEach((trend, index) => {
    const yPos = 1.5 + (index * 1.1)
    
    slide.addText(`${index + 1}. ${trend.name} (${trend.type})`, {
      x: 0.5,
      y: yPos,
      w: 9,
      h: 0.4,
      fontSize: 18,
      color: '374151',
      bold: true,
      fontFace: 'Arial'
    })
    
    slide.addText(trend.brief.substring(0, 120) + '...', {
      x: 0.8,
      y: yPos + 0.4,
      w: 8.7,
      h: 0.6,
      fontSize: 14,
      color: '4B5563',
      fontFace: 'Arial'
    })
  })
}

function createStep4Slide(pptx: any, step4Data: Step4Data) {
  const slide = pptx.addSlide()
  
  slide.addText('Paso 4: Ideación', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.8,
    fontSize: 32,
    color: '059669',
    bold: true,
    align: 'center',
    fontFace: 'Arial'
  })
  
  if (!step4Data || step4Data.length === 0) {
    slide.addText('No hay datos disponibles para este paso', {
      x: 0.5,
      y: 3,
      w: 9,
      h: 1,
      fontSize: 20,
      color: '9CA3AF',
      align: 'center',
      italic: true,
      fontFace: 'Arial'
    })
    return
  }
  
  const selectedIdea = step4Data.find(idea => idea.selected)
  
  if (selectedIdea) {
    slide.addText('💡 Idea Seleccionada', {
      x: 0.5,
      y: 1.2,
      w: 9,
      h: 0.6,
      fontSize: 24,
      color: '3B82F6',
      bold: true,
      align: 'center',
      fontFace: 'Arial'
    })
    
    slide.addText(selectedIdea.idea, {
      x: 0.5,
      y: 1.9,
      w: 9,
      h: 1,
      fontSize: 20,
      color: '1F2937',
      align: 'center',
      fontFace: 'Arial'
    })
    
    slide.addText(`Tipo: ${selectedIdea.kind} | Innovación: ${selectedIdea.innovation_level} | Factibilidad: ${selectedIdea.feasibility}`, {
      x: 0.5,
      y: 3,
      w: 9,
      h: 0.6,
      fontSize: 16,
      color: '6B7280',
      align: 'center',
      fontFace: 'Arial'
    })
    
    if (selectedIdea.justification) {
      slide.addText(`Justificación: ${selectedIdea.justification.substring(0, 300)}...`, {
        x: 0.5,
        y: 3.8,
        w: 9,
        h: 2,
        fontSize: 14,
        color: '4B5563',
        fontFace: 'Arial'
      })
    }
  }
  
  // Total de ideas generadas
  slide.addText(`Total de ideas generadas: ${step4Data.length}`, {
    x: 0.5,
    y: 6,
    w: 9,
    h: 0.5,
    fontSize: 16,
    color: '6B7280',
    align: 'center',
    fontFace: 'Arial'
  })
}

function createStep5Slide(pptx: any, buyerData: Step5BuyerData, vpData: Step5VPData) {
  const slide = pptx.addSlide()
  
  slide.addText('Paso 5: Usuario y Propuesta de Valor', {
    x: 0.5,
    y: 0.3,
    w: 9,
    h: 0.8,
    fontSize: 32,
    color: '059669',
    bold: true,
    align: 'center',
    fontFace: 'Arial'
  })
  
  // Buyer Persona (lado izquierdo)
  slide.addText('👤 Buyer Persona', {
    x: 0.5,
    y: 1.2,
    w: 4.5,
    h: 0.6,
    fontSize: 20,
    color: '3B82F6',
    bold: true,
    fontFace: 'Arial'
  })
  
  if (buyerData) {
    const buyerInfo = `• Nombre: ${buyerData.name}
• Edad: ${buyerData.age} años
• Ocupación: ${buyerData.occupation}
• Motivaciones: ${buyerData.motivations.substring(0, 100)}...
• Frustraciones: ${buyerData.pains.substring(0, 100)}...
• Necesidades: ${buyerData.needs.substring(0, 100)}...`
    
    slide.addText(buyerInfo, {
      x: 0.5,
      y: 1.8,
      w: 4.5,
      h: 4,
      fontSize: 12,
      color: '4B5563',
      fontFace: 'Arial'
    })
  } else {
    slide.addText('No completado', {
      x: 0.5,
      y: 2,
      w: 4.5,
      h: 0.5,
      fontSize: 14,
      color: '9CA3AF',
      italic: true,
      fontFace: 'Arial'
    })
  }
  
  // Value Proposition Canvas (lado derecho)
  slide.addText('💎 Propuesta de Valor', {
    x: 5,
    y: 1.2,
    w: 4.5,
    h: 0.6,
    fontSize: 20,
    color: 'D946EF',
    bold: true,
    fontFace: 'Arial'
  })
  
  if (vpData) {
    const vpInfo = `Cliente:
• Trabajos: ${vpData.customer_jobs.substring(0, 80)}...
• Dolores: ${vpData.customer_pains.substring(0, 80)}...
• Alegrías: ${vpData.customer_gains.substring(0, 80)}...

Propuesta:
• Productos/Servicios: ${vpData.products_services.substring(0, 80)}...
• Aliviadores: ${vpData.pain_relievers.substring(0, 80)}...
• Generadores: ${vpData.gain_creators.substring(0, 80)}...`
    
    slide.addText(vpInfo, {
      x: 5,
      y: 1.8,
      w: 4.5,
      h: 4,
      fontSize: 11,
      color: '4B5563',
      fontFace: 'Arial'
    })
  } else {
    slide.addText('No completado', {
      x: 5,
      y: 2,
      w: 4.5,
      h: 0.5,
      fontSize: 14,
      color: '9CA3AF',
      italic: true,
      fontFace: 'Arial'
    })
  }
}

function createConclusionSlide(pptx: any, data: JournalData) {
  const slide = pptx.addSlide()
  
  slide.addText('Conclusiones', {
    x: 0.5,
    y: 1,
    w: 9,
    h: 1,
    fontSize: 36,
    color: '059669',
    bold: true,
    align: 'center',
    fontFace: 'Arial'
  })
  
  const conclusions = [
    '✅ Análisis completo usando metodología efectual',
    '🎯 Oportunidad identificada y validada',
    '💡 Idea seleccionada con justificación sólida',
    '👥 Cliente específico definido',
    '🚀 Propuesta de valor articulada'
  ]
  
  conclusions.forEach((conclusion, index) => {
    slide.addText(conclusion, {
      x: 1,
      y: 2.5 + (index * 0.8),
      w: 8,
      h: 0.6,
      fontSize: 22,
      color: '1F2937',
      fontFace: 'Arial'
    })
  })
  
  slide.addText('¡Listo para implementar!', {
    x: 0.5,
    y: 6.5,
    w: 9,
    h: 0.8,
    fontSize: 28,
    color: '059669',
    bold: true,
    align: 'center',
    fontFace: 'Arial'
  })
}