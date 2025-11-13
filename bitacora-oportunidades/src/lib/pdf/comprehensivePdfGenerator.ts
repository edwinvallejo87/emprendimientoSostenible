import jsPDF from 'jspdf'
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
  step5Buyer?: { name: string; age: number; occupation: string; motivations: string; pains: string; needs: string }
  step5VP?: { customer_jobs: string; customer_pains: string; customer_gains: string; products_services: string; pain_relievers: string; gain_creators: string }
  step8SustainableCanvas?: { 
    customer_segments?: string
    value_propositions?: string
    products_services?: string
    channels?: string
    customer_relationships?: string
    revenue_streams?: string
    social_benefits: string
    environmental_benefits: string
    economic_benefits?: string
    key_resources?: string
    key_activities?: string
    key_partnerships?: string
    cost_structure?: string
    social_costs?: string
    environmental_costs?: string
    sustainability_reflection?: string
  }
  step9InnovationPatterns?: Array<{ pattern_name: string; description: string }>
  step10Prototype?: { prototype_type: string; description: string }
  step11ValidationStrategy?: { strategy: string; methods: string }
  step12EcosystemActors?: Array<{ actor_name: string; role: string }>
  step13SustainabilityReflection?: { reflection: string; next_steps: string }
}

export async function generateComprehensivePDF(data: JournalData) {
  console.log('📄 Iniciando generación de PDF completo...')
  console.log('🔍 Datos recibidos:', data)
  
  // Los datos ya vienen en el formato correcto desde el store
  // No necesitamos conversión especial de IA aquí
  let enrichedData = data
  console.log('📊 Datos recibidos directamente del store, procesando...')
  
  console.log('📊 Step1 data:', enrichedData.step1)
  console.log('📊 Step2 data:', enrichedData.step2)
  console.log('📊 Step3 data:', enrichedData.step3)
  console.log('📊 Step4 data:', enrichedData.step4)
  console.log('📊 Step5Buyer data:', enrichedData.step5Buyer)
  console.log('📊 Step5VP data:', enrichedData.step5VP)
  console.log('🌱 DETAILED Sustainability data analysis:')
  console.log('- step8SustainableCanvas:', enrichedData.step8SustainableCanvas)
  console.log('- step9InnovationPatterns:', enrichedData.step9InnovationPatterns)
  console.log('- step10Prototype:', enrichedData.step10Prototype)
  console.log('- step11ValidationStrategy:', enrichedData.step11ValidationStrategy)  
  console.log('- step12EcosystemActors:', enrichedData.step12EcosystemActors)
  console.log('- step13SustainabilityReflection:', enrichedData.step13SustainabilityReflection)
  
  console.log('🔍 PdfExportButton data keys:', Object.keys(enrichedData))
  console.log('🔍 Full received data:', enrichedData)
  
  // Detailed canvas analysis - EVERY field must be included
  if (enrichedData.step8SustainableCanvas) {
    console.log('🎯 COMPLETE Canvas sostenible field verification:')
    console.log('📋 ALL available fields in data:', Object.keys(enrichedData.step8SustainableCanvas))
    
    // Check each field individually
    const canvas = enrichedData.step8SustainableCanvas
    console.log('✅ customer_segments:', !!canvas.customer_segments?.trim(), '- Length:', canvas.customer_segments?.length || 0)
    console.log('✅ value_propositions:', !!canvas.value_propositions?.trim(), '- Length:', canvas.value_propositions?.length || 0)
    console.log('✅ products_services:', !!canvas.products_services?.trim(), '- Length:', canvas.products_services?.length || 0)
    console.log('✅ channels:', !!canvas.channels?.trim(), '- Length:', canvas.channels?.length || 0)
    console.log('✅ customer_relationships:', !!canvas.customer_relationships?.trim(), '- Length:', canvas.customer_relationships?.length || 0)
    console.log('✅ revenue_streams:', !!canvas.revenue_streams?.trim(), '- Length:', canvas.revenue_streams?.length || 0)
    console.log('✅ social_benefits:', !!canvas.social_benefits?.trim(), '- Length:', canvas.social_benefits?.length || 0)
    console.log('✅ environmental_benefits:', !!canvas.environmental_benefits?.trim(), '- Length:', canvas.environmental_benefits?.length || 0)
    console.log('✅ economic_benefits:', !!canvas.economic_benefits?.trim(), '- Length:', canvas.economic_benefits?.length || 0)
    console.log('✅ key_resources:', !!canvas.key_resources?.trim(), '- Length:', canvas.key_resources?.length || 0)
    console.log('✅ key_activities:', !!canvas.key_activities?.trim(), '- Length:', canvas.key_activities?.length || 0)
    console.log('✅ key_partnerships:', !!canvas.key_partnerships?.trim(), '- Length:', canvas.key_partnerships?.length || 0)
    console.log('✅ cost_structure:', !!canvas.cost_structure?.trim(), '- Length:', canvas.cost_structure?.length || 0)
    console.log('✅ social_costs:', !!canvas.social_costs?.trim(), '- Length:', canvas.social_costs?.length || 0)
    console.log('✅ environmental_costs:', !!canvas.environmental_costs?.trim(), '- Length:', canvas.environmental_costs?.length || 0)
    console.log('✅ sustainability_reflection:', !!canvas.sustainability_reflection?.trim(), '- Length:', canvas.sustainability_reflection?.length || 0)
  }
  
  // Crear documento PDF con configuración profesional
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = 210
  const pageHeight = 297
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  let yPos = margin
  
  // Configurar fuentes
  pdf.setFont('helvetica')
  
  // PORTADA
  generateCoverPage(pdf, enrichedData, pageWidth, pageHeight, margin)
  
  // ÍNDICE
  pdf.addPage()
  yPos = generateTableOfContents(pdf, margin, contentWidth)
  
  // STEP 1: MEDIOS PERSONALES
  pdf.addPage()
  yPos = margin
  yPos = generateStep1Section(pdf, enrichedData, yPos, margin, contentWidth, pageHeight)
  
  // STEP 2: PROBLEMA
  if (yPos > 200) {
    pdf.addPage()
    yPos = margin
  }
  yPos = generateStep2Section(pdf, enrichedData, yPos, margin, contentWidth, pageHeight)
  
  // STEP 3: TENDENCIAS
  if (yPos > 180) {
    pdf.addPage()
    yPos = margin
  }
  yPos = generateStep3Section(pdf, enrichedData, yPos, margin, contentWidth, pageHeight)
  
  // STEP 4: IDEACIÓN
  if (yPos > 200) {
    pdf.addPage()
    yPos = margin
  }
  yPos = generateStep4Section(pdf, enrichedData, yPos, margin, contentWidth, pageHeight)
  
  // STEP 5: MODELO DE NEGOCIO
  if (yPos > 180) {
    pdf.addPage()
    yPos = margin
  }
  yPos = generateStep5Section(pdf, enrichedData, yPos, margin, contentWidth, pageHeight)
  
  // NOTA SOBRE PASOS 6 Y 7
  if (yPos > 200) {
    pdf.addPage()
    yPos = margin
  }
  yPos = generateMethodologyNoteSection(pdf, yPos, margin, contentWidth, pageHeight)
  
  // STEPS 8-13: SOSTENIBILIDAD Y DESARROLLO
  if (yPos > 150) {
    pdf.addPage()
    yPos = margin
  }
  yPos = generateSustainabilitySection(pdf, enrichedData, yPos, margin, contentWidth, pageHeight)
  
  // CONCLUSIONES Y PRÓXIMOS PASOS
  if (yPos > 200) {
    pdf.addPage()
    yPos = margin
  }
  generateConclusionsSection(pdf, enrichedData, yPos, margin, contentWidth)
  
  // Descargar PDF
  const fileName = `${data.journal?.title?.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'Bitacora_Completa'}_${format(new Date(), 'yyyy-MM-dd')}.pdf`
  pdf.save(fileName)
  
  console.log('✅ PDF completo generado exitosamente:', fileName)
}

function generateCoverPage(pdf: any, data: JournalData, pageWidth: number, pageHeight: number, margin: number) {
  const centerX = pageWidth / 2
  
  // Título principal
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('BITÁCORA DE OPORTUNIDADES', centerX, 60, { align: 'center' })
  
  // Subtítulo
  pdf.setFontSize(18)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Análisis Efectual y Sostenible', centerX, 80, { align: 'center' })
  
  // Información del proyecto
  if (data.journal?.title) {
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text(data.journal.title, centerX, 110, { align: 'center' })
  }
  
  if (data.team?.name) {
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Equipo: ${data.team.name}`, centerX, 130, { align: 'center' })
  }
  
  // Descripción breve
  if (data.idea?.description) {
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    const description = data.idea.description.substring(0, 200) + '...'
    const descLines = pdf.splitTextToSize(description, 140)
    pdf.text(descLines, centerX, 160, { align: 'center' })
  }
  
  // Fecha
  const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es })
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text(currentDate, centerX, pageHeight - 40, { align: 'center' })
  
  // Logo o decoración
  pdf.setDrawColor(100, 150, 200)
  pdf.setLineWidth(2)
  pdf.line(margin, 200, pageWidth - margin, 200)
  pdf.line(margin, 210, pageWidth - margin, 210)
}

function generateTableOfContents(pdf: any, margin: number, contentWidth: number): number {
  let yPos = margin
  
  pdf.setFontSize(18)
  pdf.setFont('helvetica', 'bold')
  pdf.text('ÍNDICE', margin, yPos)
  yPos += 20
  
  const sections = [
    'Portada',
    '1. Análisis de Medios Personales',
    '2. Identificación del Problema',
    '3. Análisis de Tendencias',
    '4. Proceso de Ideación',
    '5. Modelo de Negocio',
    'MÓDULO DE SOSTENIBILIDAD',
    '8. Canvas Sostenible',
    '9. Patrones de Innovación',
    '10. Prototipo y Desarrollo',
    '11. Estrategia de Validación',
    '12. Mapeo del Ecosistema',
    '13. Reflexión de Sostenibilidad',
    'Conclusiones y Próximos Pasos'
  ]
  
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  
  sections.forEach((section, index) => {
    pdf.text(`${section}`, margin + 5, yPos)
    yPos += 15
  })
  
  return yPos
}

function generateStep1Section(pdf: any, data: JournalData, yPos: number, margin: number, contentWidth: number, pageHeight: number): number {
  yPos = addSectionHeader(pdf, '1. ANÁLISIS DE MEDIOS PERSONALES', yPos, margin)
  
  console.log('🔍 Generando Step1 section, data:', data.step1)
  
  if (data.step1 && data.step1.length > 0) {
    data.step1.forEach((member, index) => {
      // Verificar espacio en página
      if (yPos > pageHeight - 80) {
        pdf.addPage()
        yPos = margin
      }
      
      yPos = addSubsection(pdf, `Integrante ${index + 1}`, yPos, margin)
      
      if (member.who_i_am?.trim()) {
        yPos = addFieldContent(pdf, 'Quién soy:', member.who_i_am, yPos, margin, contentWidth, pageHeight)
      }
      
      if (member.what_i_know?.trim()) {
        yPos = addFieldContent(pdf, 'Qué sé:', member.what_i_know, yPos, margin, contentWidth, pageHeight)
      }
      
      if (member.who_i_know?.trim()) {
        yPos = addFieldContent(pdf, 'A quién conozco:', member.who_i_know, yPos, margin, contentWidth, pageHeight)
      }
      
      if (member.what_i_have?.trim()) {
        yPos = addFieldContent(pdf, 'Qué tengo:', member.what_i_have, yPos, margin, contentWidth, pageHeight)
      }
      
      yPos += 10
    })
  } else {
    yPos = addNoDataMessage(pdf, 'No se ha completado el análisis de medios personales', yPos, margin)
  }
  
  return yPos
}

function generateStep2Section(pdf: any, data: JournalData, yPos: number, margin: number, contentWidth: number, pageHeight: number): number {
  yPos = addSectionHeader(pdf, '2. IDENTIFICACIÓN DEL PROBLEMA', yPos, margin)
  
  console.log('🔍 Generando Step2 section, data:', data.step2)
  
  if (data.step2) {
    yPos = addFieldContent(pdf, 'Título del problema:', data.step2.title, yPos, margin, contentWidth, pageHeight)
    yPos = addFieldContent(pdf, 'Descripción:', data.step2.description, yPos, margin, contentWidth, pageHeight)
    yPos = addFieldContent(pdf, 'Población afectada:', data.step2.affected, yPos, margin, contentWidth, pageHeight)
    yPos = addFieldContent(pdf, 'Relevancia:', data.step2.relevance, yPos, margin, contentWidth, pageHeight)
    yPos = addFieldContent(pdf, 'Vínculo con medios:', data.step2.link_to_means, yPos, margin, contentWidth, pageHeight)
  } else {
    yPos = addNoDataMessage(pdf, 'No se ha identificado el problema', yPos, margin)
  }
  
  return yPos
}

function generateStep3Section(pdf: any, data: JournalData, yPos: number, margin: number, contentWidth: number, pageHeight: number): number {
  yPos = addSectionHeader(pdf, '3. ANÁLISIS DE TENDENCIAS', yPos, margin)
  
  if (data.step3 && data.step3.length > 0) {
    data.step3.forEach((trend, index) => {
      if (trend.name?.trim()) {  // Solo mostrar tendencias con nombre válido
        if (yPos > pageHeight - 60) {
          pdf.addPage()
          yPos = margin
        }
        
        yPos = addSubsection(pdf, `Tendencia ${index + 1}: ${trend.name}`, yPos, margin)
        if (trend.type?.trim()) {
          yPos = addFieldContent(pdf, 'Tipo:', trend.type, yPos, margin, contentWidth, pageHeight)
        }
        if (trend.brief?.trim()) {
          yPos = addFieldContent(pdf, 'Descripción:', trend.brief, yPos, margin, contentWidth, pageHeight)
        }
        yPos += 5
      }
    })
  } else {
    yPos = addNoDataMessage(pdf, 'No se han analizado tendencias del mercado', yPos, margin)
  }
  
  return yPos
}

function generateStep4Section(pdf: any, data: JournalData, yPos: number, margin: number, contentWidth: number, pageHeight: number): number {
  yPos = addSectionHeader(pdf, '4. PROCESO DE IDEACIÓN', yPos, margin)
  
  console.log('🔍 Step4 data:', data.step4)
  console.log('🔍 Step4EvaluationData:', data.step4EvaluationData)
  
  // Primero mostrar ideas regulares si las hay
  if (data.step4 && data.step4.length > 0) {
    data.step4.forEach((idea, index) => {
      if (idea.name?.trim()) {
        if (yPos > pageHeight - 40) {
          pdf.addPage()
          yPos = margin
        }
        
        const selectedText = idea.is_selected ? ' ✓ SELECCIONADA' : ''
        yPos = addSubsection(pdf, `${index + 1}. ${idea.name}${selectedText}`, yPos, margin)
        if (idea.description?.trim()) {
          yPos = addFieldContent(pdf, 'Descripción:', idea.description, yPos, margin, contentWidth, pageHeight)
        }
        yPos += 5
      }
    })
  }
  
  // Luego mostrar evaluación SWOT si existe
  if (data.step4EvaluationData) {
    console.log('🎯 AGREGANDO ANÁLISIS SWOT:', data.step4EvaluationData.strengths?.substring(0, 50) + '...')
    
    if (yPos > pageHeight - 80) {
      pdf.addPage()
      yPos = margin
    }
    
    yPos = addSubsection(pdf, 'Análisis SWOT de la Idea', yPos, margin)
    
    if (data.step4EvaluationData.strengths?.trim()) {
      console.log('✅ Agregando fortalezas SWOT')
      yPos = addFieldContent(pdf, 'Fortalezas:', data.step4EvaluationData.strengths, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step4EvaluationData.weaknesses?.trim()) {
      console.log('✅ Agregando debilidades SWOT')
      yPos = addFieldContent(pdf, 'Debilidades:', data.step4EvaluationData.weaknesses, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step4EvaluationData.opportunities?.trim()) {
      console.log('✅ Agregando oportunidades SWOT')
      yPos = addFieldContent(pdf, 'Oportunidades:', data.step4EvaluationData.opportunities, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step4EvaluationData.threats?.trim()) {
      console.log('✅ Agregando amenazas SWOT')
      yPos = addFieldContent(pdf, 'Amenazas:', data.step4EvaluationData.threats, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step4EvaluationData.success_factors?.trim()) {
      console.log('✅ Agregando factores de éxito SWOT')
      yPos = addFieldContent(pdf, 'Factores de éxito:', data.step4EvaluationData.success_factors, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step4EvaluationData.risk_mitigation?.trim()) {
      console.log('✅ Agregando mitigación de riesgos SWOT')
      yPos = addFieldContent(pdf, 'Mitigación de riesgos:', data.step4EvaluationData.risk_mitigation, yPos, margin, contentWidth, pageHeight)
    }
  } else {
    console.log('❌ No hay datos de evaluación SWOT')
  }
  
  // Si no hay ni ideas ni evaluación
  if ((!data.step4 || data.step4.length === 0) && !data.step4EvaluationData) {
    yPos = addNoDataMessage(pdf, 'No se han generado ideas ni evaluación', yPos, margin)
  }
  
  return yPos
}

function generateStep5Section(pdf: any, data: JournalData, yPos: number, margin: number, contentWidth: number, pageHeight: number): number {
  yPos = addSectionHeader(pdf, '5. MODELO DE NEGOCIO', yPos, margin)
  
  // Buyer Persona
  if (data.step5Buyer && hasValidBuyerData(data.step5Buyer)) {
    yPos = addSubsection(pdf, 'Cliente Objetivo (Buyer Persona)', yPos, margin)
    if (data.step5Buyer.name?.trim()) {
      yPos = addFieldContent(pdf, 'Nombre:', data.step5Buyer.name, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step5Buyer.age) {
      yPos = addFieldContent(pdf, 'Edad:', data.step5Buyer.age.toString() + ' años', yPos, margin, contentWidth, pageHeight)
    }
    if (data.step5Buyer.occupation?.trim()) {
      yPos = addFieldContent(pdf, 'Ocupación:', data.step5Buyer.occupation, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step5Buyer.motivations?.trim()) {
      yPos = addFieldContent(pdf, 'Motivaciones:', data.step5Buyer.motivations, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step5Buyer.pains?.trim()) {
      yPos = addFieldContent(pdf, 'Puntos de dolor:', data.step5Buyer.pains, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step5Buyer.needs?.trim()) {
      yPos = addFieldContent(pdf, 'Necesidades:', data.step5Buyer.needs, yPos, margin, contentWidth, pageHeight)
    }
    yPos += 10
  } else {
    yPos = addNoDataMessage(pdf, 'No se ha definido el buyer persona', yPos, margin)
    yPos += 15
  }
  
  // Value Proposition Canvas
  if (data.step5VP && hasValidVPData(data.step5VP)) {
    if (yPos > pageHeight - 80) {
      pdf.addPage()
      yPos = margin
    }
    
    yPos = addSubsection(pdf, 'Canvas de Propuesta de Valor', yPos, margin)
    
    if (data.step5VP.customer_jobs?.trim()) {
      yPos = addFieldContent(pdf, 'Trabajos del cliente:', data.step5VP.customer_jobs, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step5VP.customer_pains?.trim()) {
      yPos = addFieldContent(pdf, 'Dolores del cliente:', data.step5VP.customer_pains, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step5VP.customer_gains?.trim()) {
      yPos = addFieldContent(pdf, 'Ganancias del cliente:', data.step5VP.customer_gains, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step5VP.products_services?.trim()) {
      yPos = addFieldContent(pdf, 'Productos y servicios:', data.step5VP.products_services, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step5VP.pain_relievers?.trim()) {
      yPos = addFieldContent(pdf, 'Aliviadores de dolor:', data.step5VP.pain_relievers, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step5VP.gain_creators?.trim()) {
      yPos = addFieldContent(pdf, 'Creadores de ganancia:', data.step5VP.gain_creators, yPos, margin, contentWidth, pageHeight)
    }
  } else {
    yPos = addNoDataMessage(pdf, 'No se ha completado el canvas de propuesta de valor', yPos, margin)
    yPos += 15
  }
  
  return yPos
}

function generateSustainabilitySection(pdf: any, data: JournalData, yPos: number, margin: number, contentWidth: number, pageHeight: number): number {
  yPos = addSectionHeader(pdf, 'MÓDULO DE SOSTENIBILIDAD', yPos, margin)
  
  // Step 8: Canvas Sostenible
  if (data.step8SustainableCanvas) {
    yPos = addSubsection(pdf, '8. Canvas Sostenible', yPos, margin)
    
    console.log('🌱 Generando Canvas Sostenible con datos:', data.step8SustainableCanvas)
    
    // Verificar espacio para nueva página
    if (yPos > pageHeight - 100) {
      pdf.addPage()
      yPos = margin
      yPos = addSubsection(pdf, '8. Canvas Sostenible (continuación)', yPos, margin)
    }
    
    // Segmentos de clientes
    if (data.step8SustainableCanvas.customer_segments?.trim()) {
      console.log('✅ Agregando segmentos de clientes:', data.step8SustainableCanvas.customer_segments.substring(0, 100) + '...')
      yPos = addFieldContent(pdf, 'Segmentos de clientes:', data.step8SustainableCanvas.customer_segments, yPos, margin, contentWidth, pageHeight)
    } else {
      console.log('❌ Segmentos de clientes vacío')
    }
    
    // Propuesta de valor
    if (data.step8SustainableCanvas.value_propositions?.trim()) {
      console.log('✅ Agregando propuestas de valor')
      yPos = addFieldContent(pdf, 'Propuestas de valor:', data.step8SustainableCanvas.value_propositions, yPos, margin, contentWidth, pageHeight)
    } else {
      console.log('❌ Propuestas de valor vacío')
    }
    
    // Productos y servicios
    if (data.step8SustainableCanvas.products_services?.trim()) {
      console.log('✅ Agregando productos y servicios')
      yPos = addFieldContent(pdf, 'Productos y servicios:', data.step8SustainableCanvas.products_services, yPos, margin, contentWidth, pageHeight)
    } else {
      console.log('❌ Productos y servicios vacío')
    }
    
    // Canales
    if (data.step8SustainableCanvas.channels?.trim()) {
      console.log('✅ Agregando canales')
      yPos = addFieldContent(pdf, 'Canales:', data.step8SustainableCanvas.channels, yPos, margin, contentWidth, pageHeight)
    } else {
      console.log('❌ Canales vacío')
    }
    
    // Relaciones con clientes
    if (data.step8SustainableCanvas.customer_relationships?.trim()) {
      console.log('✅ Agregando relaciones con clientes')
      yPos = addFieldContent(pdf, 'Relaciones con clientes:', data.step8SustainableCanvas.customer_relationships, yPos, margin, contentWidth, pageHeight)
    } else {
      console.log('❌ Relaciones con clientes vacío')
    }
    
    // Flujos de ingresos
    if (data.step8SustainableCanvas.revenue_streams?.trim()) {
      console.log('✅ Agregando flujos de ingresos')
      yPos = addFieldContent(pdf, 'Flujos de ingresos:', data.step8SustainableCanvas.revenue_streams, yPos, margin, contentWidth, pageHeight)
    } else {
      console.log('❌ Flujos de ingresos vacío')
    }
    
    // Beneficios sociales
    if (data.step8SustainableCanvas.social_benefits?.trim()) {
      console.log('✅ Agregando beneficios sociales:', data.step8SustainableCanvas.social_benefits.substring(0, 100) + '...')
      yPos = addFieldContent(pdf, 'Beneficios sociales:', data.step8SustainableCanvas.social_benefits, yPos, margin, contentWidth, pageHeight)
    } else {
      console.log('❌ Beneficios sociales vacío')
    }
    
    // Beneficios ambientales
    if (data.step8SustainableCanvas.environmental_benefits?.trim()) {
      console.log('✅ Agregando beneficios ambientales')
      yPos = addFieldContent(pdf, 'Beneficios ambientales:', data.step8SustainableCanvas.environmental_benefits, yPos, margin, contentWidth, pageHeight)
    } else {
      console.log('❌ Beneficios ambientales vacío')
    }
    
    // Beneficios económicos
    if (data.step8SustainableCanvas.economic_benefits?.trim()) {
      console.log('✅ Agregando beneficios económicos')
      yPos = addFieldContent(pdf, 'Beneficios económicos:', data.step8SustainableCanvas.economic_benefits, yPos, margin, contentWidth, pageHeight)
    } else {
      console.log('❌ Beneficios económicos vacío')
    }
    
    // Recursos clave
    if (data.step8SustainableCanvas.key_resources?.trim()) {
      console.log('✅ Agregando recursos clave')
      yPos = addFieldContent(pdf, 'Recursos clave:', data.step8SustainableCanvas.key_resources, yPos, margin, contentWidth, pageHeight)
    } else {
      console.log('❌ Recursos clave vacío')
    }
    
    // Actividades clave
    if (data.step8SustainableCanvas.key_activities?.trim()) {
      console.log('✅ Agregando actividades clave')
      yPos = addFieldContent(pdf, 'Actividades clave:', data.step8SustainableCanvas.key_activities, yPos, margin, contentWidth, pageHeight)
    } else {
      console.log('❌ Actividades clave vacío')
    }
    
    // Socios clave
    if (data.step8SustainableCanvas.key_partnerships?.trim()) {
      console.log('✅ Agregando socios clave')
      yPos = addFieldContent(pdf, 'Socios clave:', data.step8SustainableCanvas.key_partnerships, yPos, margin, contentWidth, pageHeight)
    } else {
      console.log('❌ Socios clave vacío')
    }
    
    // Estructura de costos
    if (data.step8SustainableCanvas.cost_structure?.trim()) {
      console.log('✅ Agregando estructura de costos')
      yPos = addFieldContent(pdf, 'Estructura de costos:', data.step8SustainableCanvas.cost_structure, yPos, margin, contentWidth, pageHeight)
    } else {
      console.log('❌ Estructura de costos vacío')
    }
    
    // Costos sociales
    if (data.step8SustainableCanvas.social_costs?.trim()) {
      console.log('✅ Agregando costos sociales')
      yPos = addFieldContent(pdf, 'Costos sociales:', data.step8SustainableCanvas.social_costs, yPos, margin, contentWidth, pageHeight)
    } else {
      console.log('❌ Costos sociales vacío')
    }
    
    // Costos ambientales
    if (data.step8SustainableCanvas.environmental_costs?.trim()) {
      console.log('✅ Agregando costos ambientales')
      yPos = addFieldContent(pdf, 'Costos ambientales:', data.step8SustainableCanvas.environmental_costs, yPos, margin, contentWidth, pageHeight)
    } else {
      console.log('❌ Costos ambientales vacío')
    }
    
    // Reflexión de sostenibilidad
    if (data.step8SustainableCanvas.sustainability_reflection?.trim()) {
      console.log('✅ Agregando reflexión de sostenibilidad')
      yPos = addFieldContent(pdf, 'Reflexión de sostenibilidad:', data.step8SustainableCanvas.sustainability_reflection, yPos, margin, contentWidth, pageHeight)
    } else {
      console.log('❌ Reflexión de sostenibilidad vacío')
    }
    
    yPos += 10
  } else {
    yPos = addNoDataMessage(pdf, 'No se ha completado el canvas sostenible', yPos, margin)
    yPos += 15
  }
  
  // Step 9: Patrones de Innovación
  console.log('🔬 Verificando Patrones de Innovación:', data.step9InnovationPatterns)
  if (data.step9InnovationPatterns && data.step9InnovationPatterns.length > 0) {
    if (yPos > pageHeight - 80) {
      pdf.addPage()
      yPos = margin
    }
    
    yPos = addSubsection(pdf, '9. Patrones de Innovación', yPos, margin)
    console.log('📝 Procesando', data.step9InnovationPatterns.length, 'patrones de innovación')
    console.log('📝 Patrones completos:', data.step9InnovationPatterns)
    
    data.step9InnovationPatterns.forEach((pattern, index) => {
      if (pattern.pattern_name?.trim()) {
        console.log(`✅ Patrón ${index + 1} - Nombre: ${pattern.pattern_name}`)
        console.log(`✅ Patrón ${index + 1} - Descripción: ${pattern.pattern_description?.substring(0, 100)}...`)
        console.log(`✅ Patrón ${index + 1} - Justificación: ${pattern.justification?.substring(0, 50)}...`)
        
        const fullDescription = `${pattern.pattern_description || 'Sin descripción'}\n\nJustificación: ${pattern.justification || 'No definida'}\n\nImpacto esperado: ${pattern.expected_impact || 'No definido'}\n\nPrioridad: ${pattern.is_primary ? 'Principal' : 'Secundario'}`
        
        yPos = addFieldContent(pdf, `${index + 1}. ${pattern.pattern_name}:`, fullDescription, yPos, margin, contentWidth, pageHeight)
      } else {
        console.log(`❌ Patrón ${index + 1} sin nombre válido`)
      }
    })
    yPos += 10
  } else {
    yPos = addNoDataMessage(pdf, 'No se han identificado patrones de innovación', yPos, margin)
    yPos += 15
  }
  
  // Step 10: Prototipo
  if (data.step10Prototype) {
    if (yPos > pageHeight - 60) {
      pdf.addPage()
      yPos = margin
    }
    
    console.log('🔧 Datos completos del prototipo:', data.step10Prototype)
    
    yPos = addSubsection(pdf, '10. Prototipo y Desarrollo', yPos, margin)
    
    if (data.step10Prototype.name?.trim()) {
      yPos = addFieldContent(pdf, 'Nombre del prototipo:', data.step10Prototype.name, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step10Prototype.type?.trim()) {
      yPos = addFieldContent(pdf, 'Tipo de prototipo:', data.step10Prototype.type, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step10Prototype.description?.trim()) {
      yPos = addFieldContent(pdf, 'Descripción:', data.step10Prototype.description, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step10Prototype.hypothesis_to_validate?.trim()) {
      yPos = addFieldContent(pdf, 'Hipótesis a validar:', data.step10Prototype.hypothesis_to_validate, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step10Prototype.expected_learning_metrics?.trim()) {
      yPos = addFieldContent(pdf, 'Métricas de aprendizaje esperadas:', data.step10Prototype.expected_learning_metrics, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step10Prototype.ai_mvp_suggestion?.trim()) {
      yPos = addFieldContent(pdf, 'Sugerencia de MVP:', data.step10Prototype.ai_mvp_suggestion, yPos, margin, contentWidth, pageHeight)
    }
    yPos += 10
  } else {
    yPos = addNoDataMessage(pdf, 'No se ha desarrollado prototipo', yPos, margin)
    yPos += 15
  }
  
  // Step 11: Validación
  if (data.step11ValidationStrategy) {
    if (yPos > pageHeight - 60) {
      pdf.addPage()
      yPos = margin
    }
    
    console.log('🎯 Datos completos de validación:', data.step11ValidationStrategy)
    
    yPos = addSubsection(pdf, '11. Estrategia de Validación', yPos, margin)
    
    if (data.step11ValidationStrategy.hypothesis?.trim()) {
      yPos = addFieldContent(pdf, 'Hipótesis:', data.step11ValidationStrategy.hypothesis, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step11ValidationStrategy.target_segments?.trim()) {
      yPos = addFieldContent(pdf, 'Segmentos objetivo:', data.step11ValidationStrategy.target_segments, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step11ValidationStrategy.validation_methods && Array.isArray(data.step11ValidationStrategy.validation_methods)) {
      yPos = addFieldContent(pdf, 'Métodos de validación:', data.step11ValidationStrategy.validation_methods.join(', '), yPos, margin, contentWidth, pageHeight)
    }
    if (data.step11ValidationStrategy.expected_learnings?.trim()) {
      yPos = addFieldContent(pdf, 'Aprendizajes esperados:', data.step11ValidationStrategy.expected_learnings, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step11ValidationStrategy.success_criteria?.trim()) {
      yPos = addFieldContent(pdf, 'Criterios de éxito:', data.step11ValidationStrategy.success_criteria, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step11ValidationStrategy.timeline_weeks) {
      yPos = addFieldContent(pdf, 'Duración estimada:', `${data.step11ValidationStrategy.timeline_weeks} semanas`, yPos, margin, contentWidth, pageHeight)
    }
    if (data.step11ValidationStrategy.budget_estimate) {
      yPos = addFieldContent(pdf, 'Presupuesto estimado:', `$${data.step11ValidationStrategy.budget_estimate}`, yPos, margin, contentWidth, pageHeight)
    }
    yPos += 10
  } else {
    yPos = addNoDataMessage(pdf, 'No se ha definido estrategia de validación', yPos, margin)
    yPos += 15
  }
  
  // Step 12: Ecosistema
  if (data.step12EcosystemActors && data.step12EcosystemActors.length > 0) {
    if (yPos > pageHeight - 80) {
      pdf.addPage()
      yPos = margin
    }
    
    console.log('🤝 Datos completos del ecosistema:', data.step12EcosystemActors)
    
    yPos = addSubsection(pdf, '12. Mapeo del Ecosistema', yPos, margin)
    data.step12EcosystemActors.forEach((actor, index) => {
      console.log(`🤝 Actor ${index + 1}:`, actor)
      
      const actorDetails = `Tipo: ${actor.actor_type || 'No especificado'}\n\nDescripción del rol: ${actor.role_description || actor.role || 'No definido'}\n\nBeneficio para el emprendimiento: ${actor.benefit_to_venture || 'No definido'}\n\nBeneficio para el actor: ${actor.benefit_to_actor || 'No definido'}\n\nTipos de apoyo: ${Array.isArray(actor.support_types) ? actor.support_types.join(', ') : 'No especificado'}\n\nEstado de la relación: ${actor.relationship_status || 'No definido'}`
      
      yPos = addFieldContent(pdf, `${index + 1}. ${actor.actor_name}:`, actorDetails, yPos, margin, contentWidth, pageHeight)
    })
    yPos += 10
  } else {
    console.log('❌ No hay actores del ecosistema o array vacío')
    yPos = addNoDataMessage(pdf, 'No se han identificado actores del ecosistema', yPos, margin)
    yPos += 15
  }
  
  // Step 13: Reflexión
  if (data.step13SustainabilityReflection) {
    if (yPos > pageHeight - 60) {
      pdf.addPage()
      yPos = margin
    }
    
    yPos = addSubsection(pdf, '13. Reflexión de Sostenibilidad', yPos, margin)
    yPos = addFieldContent(pdf, 'Reflexión:', data.step13SustainabilityReflection.reflection, yPos, margin, contentWidth, pageHeight)
    yPos = addFieldContent(pdf, 'Próximos pasos:', data.step13SustainabilityReflection.next_steps, yPos, margin, contentWidth, pageHeight)
  }
  
  return yPos
}

function generateConclusionsSection(pdf: any, data: JournalData, yPos: number, margin: number, contentWidth: number) {
  yPos = addSectionHeader(pdf, 'CONCLUSIONES Y PRÓXIMOS PASOS', yPos, margin)
  
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  
  const conclusions = [
    'Este análisis efectual proporciona una base sólida para el desarrollo del emprendimiento.',
    'Los medios personales identificados conectan directamente con la oportunidad de mercado.',
    'El enfoque sostenible asegura impacto positivo a largo plazo.',
    'Las próximas acciones se centran en validación y desarrollo iterativo.'
  ]
  
  conclusions.forEach(conclusion => {
    const lines = pdf.splitTextToSize(`• ${conclusion}`, contentWidth)
    pdf.text(lines, margin, yPos)
    yPos += lines.length * 6 + 5
  })
  
  yPos += 15
  
  pdf.setFont('helvetica', 'bold')
  pdf.text('Generado por Bitácora de Oportunidades', margin, yPos)
  yPos += 10
  
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Fecha: ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es })}`, margin, yPos)
}

// Funciones auxiliares
function addSectionHeader(pdf: any, title: string, yPos: number, margin: number): number {
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.text(title, margin, yPos)
  return yPos + 15
}

function addSubsection(pdf: any, title: string, yPos: number, margin: number): number {
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text(title, margin, yPos)
  return yPos + 10
}

function addFieldContent(pdf: any, label: string, content: string, yPos: number, margin: number, contentWidth: number, pageHeight: number): number {
  // Verificar si necesitamos nueva página
  if (yPos > pageHeight - 40) {
    pdf.addPage()
    yPos = margin
  }
  
  // Si el contenido es undefined, null o vacío, no mostrar nada
  if (!content || content.trim() === '' || content === 'undefined' || content === 'null') {
    return yPos
  }
  
  // Agregar etiqueta
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'bold')
  pdf.text(label, margin, yPos)
  
  // Agregar contenido
  pdf.setFont('helvetica', 'normal')
  const lines = pdf.splitTextToSize(content, contentWidth - 20)
  pdf.text(lines, margin + 5, yPos + 8)
  
  return yPos + (lines.length * 5) + 15
}

function addNoDataMessage(pdf: any, message: string, yPos: number, margin: number): number {
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'italic')
  pdf.text(message, margin, yPos)
  return yPos + 20
}

// Funciones auxiliares para validar datos
function hasValidBuyerData(buyer: any): boolean {
  return !!(buyer.name?.trim() || buyer.occupation?.trim() || buyer.motivations?.trim() || 
           buyer.pains?.trim() || buyer.needs?.trim())
}

function hasValidVPData(vp: any): boolean {
  return !!(vp.customer_jobs?.trim() || vp.customer_pains?.trim() || vp.customer_gains?.trim() ||
           vp.products_services?.trim() || vp.pain_relievers?.trim() || vp.gain_creators?.trim())
}

function generateMethodologyNoteSection(pdf: any, yPos: number, margin: number, contentWidth: number, pageHeight: number): number {
  yPos = addSectionHeader(pdf, 'NOTA METODOLÓGICA', yPos, margin)
  
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  
  const explanationText = `
Esta bitácora sigue la metodología efectual desarrollada por Saras Sarasvathy, complementada con un módulo de sostenibilidad. 

Los pasos están organizados de la siguiente manera:

• Pasos 1-5: Análisis Efectual Básico
  - Medios personales, problema, tendencias, ideación y modelo de negocio inicial

• Pasos 6-7: No implementados en esta versión
  - Estos corresponden a análisis avanzados que se desarrollarán en futuras versiones

• Pasos 8-13: Módulo de Sostenibilidad
  - Enfoque en triple impacto (social, ambiental, económico)
  - Desarrollo sostenible y validación del emprendimiento

Esta estructura permite una transición natural del análisis efectual tradicional hacia un enfoque más amplio que considera la sostenibilidad como elemento central del emprendimiento.`
  
  const lines = pdf.splitTextToSize(explanationText, contentWidth)
  pdf.text(lines, margin, yPos)
  
  return yPos + (lines.length * 5) + 20
}

// Función para convertir datos de IA al formato del journal
function convertAIDataToJournalFormat(data: JournalData): JournalData {
  console.log('🤖 Convirtiendo datos de IA al formato de journal...')
  
  // Si ya tenemos datos regulares, los usamos
  if (data.step1?.length > 0 || data.step2 || data.step3?.length > 0) {
    console.log('✅ Ya hay datos regulares, usando esos')
    return data
  }
  
  // Si hay datos de IA en la idea, los convertimos
  const aiData = (data.idea as any)?.ai_generated_data
  if (!aiData) {
    console.log('❌ No hay datos de IA encontrados')
    return data
  }
  
  console.log('🔄 Convirtiendo datos de IA:', aiData)
  
  return {
    ...data,
    // Step 1: Medios personales
    step1: aiData.step1 ? [{
      who_i_am: aiData.step1.who_i_am || 'Perfil profesional generado por IA',
      what_i_know: aiData.step1.what_i_know || 'Conocimientos identificados',
      who_i_know: aiData.step1.who_i_know || 'Red de contactos disponible',
      what_i_have: aiData.step1.what_i_have || 'Recursos disponibles'
    }] : data.step1,
    
    // Step 2: Problema
    step2: aiData.step2 ? {
      title: aiData.step2.title || 'Problema identificado',
      description: aiData.step2.description || 'Descripción del problema',
      affected: aiData.step2.affected || 'Población afectada',
      relevance: aiData.step2.relevance || 'Relevancia del problema',
      link_to_means: aiData.step2.link_to_means || 'Conexión con medios disponibles'
    } : data.step2,
    
    // Step 3: Tendencias
    step3: aiData.step3 && Array.isArray(aiData.step3) ? aiData.step3.map((trend: any) => ({
      name: trend.name || 'Tendencia identificada',
      type: trend.type || 'Social',
      brief: trend.brief || trend.description || 'Descripción de la tendencia'
    })) : data.step3,
    
    // Step 4: Ideas (convertir SWOT a formato de ideas)
    step4: aiData.step4 && typeof aiData.step4 === 'object' ? [{
      name: aiData.idea?.title || 'Análisis SWOT de la Idea',
      description: `FORTALEZAS: ${aiData.step4.strengths || 'No definido'}\n\nDEBILIDADES: ${aiData.step4.weaknesses || 'No definido'}\n\nOPORTUNIDADES: ${aiData.step4.opportunities || 'No definido'}\n\nAMENAZAS: ${aiData.step4.threats || 'No definido'}\n\nFACTORES DE ÉXITO: ${aiData.step4.success_factors || 'No definido'}\n\nMITIGACIÓN DE RIESGOS: ${aiData.step4.risk_mitigation || 'No definido'}`,
      is_selected: true
    }] : (aiData.idea ? [{
      name: aiData.idea.title || 'Idea Principal',
      description: aiData.idea.description || 'Descripción generada por IA',
      is_selected: true
    }] : data.step4),
    
    // Step 5: Buyer y VP
    step5Buyer: aiData.step5Buyer ? {
      name: aiData.step5Buyer.name || 'Cliente objetivo',
      age: aiData.step5Buyer.age || 30,
      occupation: aiData.step5Buyer.occupation || 'Profesional',
      motivations: aiData.step5Buyer.motivations || 'Motivaciones del cliente',
      pains: aiData.step5Buyer.pains || 'Puntos de dolor identificados',
      needs: aiData.step5Buyer.needs || 'Necesidades del cliente'
    } : data.step5Buyer,
    
    step5VP: aiData.step5VP ? {
      customer_jobs: aiData.step5VP.customer_jobs || 'Trabajos del cliente',
      customer_pains: aiData.step5VP.customer_pains || 'Dolores del cliente',
      customer_gains: aiData.step5VP.customer_gains || 'Ganancias del cliente',
      products_services: aiData.step5VP.products_services || 'Productos y servicios',
      pain_relievers: aiData.step5VP.pain_relievers || 'Aliviadores de dolor',
      gain_creators: aiData.step5VP.gain_creators || 'Creadores de ganancia'
    } : data.step5VP,
    
    // Sostenibilidad
    step8SustainableCanvas: aiData.step8SustainableCanvas ? {
      customer_segments: aiData.step8SustainableCanvas.customer_segments || '',
      value_propositions: aiData.step8SustainableCanvas.value_propositions || '',
      products_services: aiData.step8SustainableCanvas.products_services || '',
      channels: aiData.step8SustainableCanvas.channels || '',
      customer_relationships: aiData.step8SustainableCanvas.customer_relationships || '',
      revenue_streams: aiData.step8SustainableCanvas.revenue_streams || '',
      social_benefits: aiData.step8SustainableCanvas.social_benefits || '',
      environmental_benefits: aiData.step8SustainableCanvas.environmental_benefits || '',
      economic_benefits: aiData.step8SustainableCanvas.revenue_streams || '', // Economic benefits mapped from revenue streams
      key_resources: aiData.step8SustainableCanvas.key_resources || '',
      key_activities: aiData.step8SustainableCanvas.key_activities || '',
      key_partnerships: aiData.step8SustainableCanvas.key_partnerships || '',
      cost_structure: aiData.step8SustainableCanvas.cost_structure || '',
      social_costs: aiData.step8SustainableCanvas.social_costs || '',
      environmental_costs: aiData.step8SustainableCanvas.environmental_costs || '',
      sustainability_reflection: aiData.step8SustainableCanvas.sustainability_reflection || ''
    } : data.step8SustainableCanvas,
    
    step9InnovationPatterns: aiData.step9InnovationPatterns && Array.isArray(aiData.step9InnovationPatterns) ? 
      aiData.step9InnovationPatterns.map((pattern: any) => ({
        pattern_name: pattern.pattern_name || 'Patrón de innovación',
        description: `${pattern.pattern_description || pattern.description || 'Descripción del patrón'}\n\nJustificación: ${pattern.justification || 'No definida'}\n\nImpacto esperado: ${pattern.expected_impact || 'No definido'}\n\nPrioridad: ${pattern.is_primary ? 'Principal' : 'Secundario'}`
      })) : data.step9InnovationPatterns,
    
    step10Prototype: aiData.step10Prototype ? {
      prototype_type: aiData.step10Prototype.type || aiData.step10Prototype.prototype_type || 'MVP',
      description: `${aiData.step10Prototype.description || 'Prototipo desarrollado'}\n\nNombre: ${aiData.step10Prototype.name || 'No definido'}\n\nHipótesis a validar: ${aiData.step10Prototype.hypothesis_to_validate || 'No definida'}\n\nMétricas de aprendizaje: ${aiData.step10Prototype.expected_learning_metrics || 'No definidas'}\n\nSugerencia de MVP: ${aiData.step10Prototype.ai_mvp_suggestion || 'No definida'}`
    } : data.step10Prototype,
    
    step11ValidationStrategy: aiData.step11ValidationStrategy ? {
      strategy: aiData.step11ValidationStrategy.hypothesis || aiData.step11ValidationStrategy.strategy || 'Estrategia de validación',
      methods: Array.isArray(aiData.step11ValidationStrategy.validation_methods) ? 
        `Métodos: ${aiData.step11ValidationStrategy.validation_methods.join(', ')}\n\nCriterios de éxito: ${aiData.step11ValidationStrategy.success_criteria || 'No definido'}\n\nTiempo estimado: ${aiData.step11ValidationStrategy.timeline_weeks || 'No definido'} semanas\n\nPresupuesto: $${aiData.step11ValidationStrategy.budget_estimate || 'No definido'}` : 
        aiData.step11ValidationStrategy.methods || 'Métodos de validación'
    } : data.step11ValidationStrategy,
    
    step12EcosystemActors: aiData.step12EcosystemActors && Array.isArray(aiData.step12EcosystemActors) ? 
      aiData.step12EcosystemActors.map((actor: any) => ({
        actor_name: actor.actor_name || 'Actor del ecosistema',
        role: `${actor.role_description || actor.role || 'Rol en el ecosistema'}\n\nTipo: ${actor.actor_type || 'No especificado'}\n\nBeneficio para el emprendimiento: ${actor.benefit_to_venture || 'No definido'}\n\nBeneficio para el actor: ${actor.benefit_to_actor || 'No definido'}\n\nTipos de apoyo: ${Array.isArray(actor.support_types) ? actor.support_types.join(', ') : 'No especificado'}`
      })) : data.step12EcosystemActors,
    
    step13SustainabilityReflection: aiData.step13SustainabilityReflection ? {
      reflection: aiData.step13SustainabilityReflection.ai_generated_reflection || 
                 aiData.step13SustainabilityReflection.reflection || 
                 aiData.step13SustainabilityReflection.social_impact_balance || 
                 'Reflexión sobre sostenibilidad',
      next_steps: aiData.step13SustainabilityReflection.next_steps || 
                 aiData.step13SustainabilityReflection.scaling_strategy || 
                 'Próximos pasos definidos'
    } : data.step13SustainabilityReflection
  }
}