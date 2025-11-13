import pptxgen from 'pptxgenjs'
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

export async function generateProfessionalPPTX(data: JournalData) {
  try {
    console.log('🎯 Generando presentación PPTX profesional con datos:', data)
    
    const pres = new pptxgen()
    
    // Configuración de la presentación
    pres.author = data.team?.name || 'Equipo Emprendedor'
    pres.company = 'Bitácora de Oportunidades'
    pres.title = data.journal?.title || 'Análisis de Emprendimiento'
    pres.subject = 'Análisis Efectual y Sostenible'
    
    // Definir layout estándar
    pres.defineLayout({ name: 'CUSTOM', width: 10, height: 7.5 })
    pres.layout = 'CUSTOM'
    
    const currentDate = format(new Date(), 'dd \'de\' MMMM \'de\' yyyy', { locale: es })
    
    // Análisis de contenido disponible
    const contentAnalysis = analyzeAvailableContent(data)
    console.log('📊 Análisis de contenido:', contentAnalysis)
    
    // Generar slides completas con todos los datos
    generateTitleSlide(pres, data, currentDate)
    generateProjectOverviewSlide(pres, data, contentAnalysis)
    
    // STEP 1: Análisis del equipo - slides detalladas
    if (contentAnalysis.hasTeamAnalysis) {
      generateTeamOverviewSlide(pres, data.step1!)
      // Slide individual por cada integrante si hay más de 2
      if (data.step1!.length > 2) {
        data.step1!.forEach((member, index) => {
          if (hasSignificantMemberData(member)) {
            generateIndividualMemberSlide(pres, member, index + 1)
          }
        })
      }
      generateTeamSynthesisSlide(pres, data.step1!)
    }
    
    // STEP 2: Problema - análisis completo
    if (contentAnalysis.hasProblemAnalysis) {
      generateProblemAnalysisSlide(pres, data.step2!)
      generateProblemImpactSlide(pres, data.step2!)
    }
    
    // STEP 3: Tendencias - slide por cada tendencia importante
    if (contentAnalysis.hasMarketAnalysis) {
      generateMarketOverviewSlide(pres, data.step3!)
      // Slide individual por tendencia si hay más de 3
      if (data.step3!.length > 3) {
        data.step3!.slice(0, 5).forEach((trend, index) => {
          if (trend.name?.trim() && trend.brief?.trim()) {
            generateIndividualTrendSlide(pres, trend, index + 1)
          }
        })
      }
      generateMarketImplicationsSlide(pres, data.step3!)
    }
    
    // STEP 4: Ideación - proceso completo
    if (contentAnalysis.hasIdeationProcess) {
      generateIdeationOverviewSlide(pres, data.step4!)
      generateIdeaComparisonSlide(pres, data.step4!)
      if (data.step4!.find(idea => idea.is_selected)) {
        generateSelectedIdeaDetailSlide(pres, data.step4!)
      }
    }
    
    // STEP 5: Modelo de negocio - slides separadas
    if (data.step5Buyer?.name?.trim()) {
      generateBuyerPersonaSlide(pres, data.step5Buyer)
    }
    if (data.step5VP?.value_proposition?.trim()) {
      generateValuePropositionSlide(pres, data.step5VP)
    }
    
    // STEP 8: Canvas sostenible - análisis detallado
    console.log('🌱 Verificando datos de sostenibilidad step8:', data.step8SustainableCanvas)
    if (data.step8SustainableCanvas && (
      data.step8SustainableCanvas.social_benefits?.trim() || 
      data.step8SustainableCanvas.environmental_benefits?.trim() || 
      data.step8SustainableCanvas.economic_benefits?.trim()
    )) {
      console.log('✅ Generando slide de Canvas Sostenible')
      generateSustainableCanvasSlide(pres, data.step8SustainableCanvas)
    }
    
    // STEP 9: Patrones de innovación
    console.log('🔬 Verificando patrones de innovación step9:', data.step9InnovationPatterns)
    if (data.step9InnovationPatterns && data.step9InnovationPatterns.length > 0) {
      console.log('✅ Generando slide de Patrones de Innovación')
      generateInnovationPatternsSlide(pres, data.step9InnovationPatterns)
    }
    
    // STEP 10: Prototipo
    console.log('🛠️ Verificando prototipo step10:', data.step10Prototype)
    if (data.step10Prototype && (data.step10Prototype.description?.trim() || data.step10Prototype.prototype_type?.trim())) {
      console.log('✅ Generando slide de Prototipo')
      generatePrototypeSlide(pres, data.step10Prototype)
    }
    
    // STEP 11: Validación
    console.log('✅ Verificando validación step11:', data.step11ValidationStrategy)
    if (data.step11ValidationStrategy && (data.step11ValidationStrategy.strategy?.trim() || data.step11ValidationStrategy.methods?.trim())) {
      console.log('✅ Generando slide de Estrategia de Validación')
      generateValidationStrategySlide(pres, data.step11ValidationStrategy)
    }
    
    // STEP 12: Ecosistema
    console.log('🌐 Verificando ecosistema step12:', data.step12EcosystemActors)
    if (data.step12EcosystemActors && data.step12EcosystemActors.length > 0) {
      console.log('✅ Generando slide de Ecosistema')
      generateEcosystemSlide(pres, data.step12EcosystemActors)
    }
    
    // STEP 13: Reflexión
    console.log('💭 Verificando reflexión step13:', data.step13SustainabilityReflection)
    if (data.step13SustainabilityReflection && (data.step13SustainabilityReflection.reflection?.trim() || data.step13SustainabilityReflection.next_steps?.trim())) {
      console.log('✅ Generando slide de Reflexión de Sostenibilidad')
      generateSustainabilityReflectionSlide(pres, data.step13SustainabilityReflection)
    }
    
    // SLIDE DE RESUMEN DE SOSTENIBILIDAD (siempre incluir si hay algún dato)
    console.log('🌍 Verificando si hay datos de sostenibilidad para slide de resumen')
    if (data.step8SustainableCanvas || data.step9InnovationPatterns || data.step10Prototype || 
        data.step11ValidationStrategy || data.step12EcosystemActors || data.step13SustainabilityReflection) {
      console.log('✅ Generando slide de Resumen de Sostenibilidad')
      generateSustainabilitySummarySlide(pres, data)
    }
    
    // Slides finales de síntesis
    generateStrategicAnalysisSlide(pres, data, contentAnalysis)
    generateActionPlanSlide(pres, data, contentAnalysis)
    generateConclusionsSlide(pres, data, contentAnalysis)
    
    // Descargar la presentación
    const fileName = `${data.journal?.title?.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'Analisis_Emprendimiento'}_${format(new Date(), 'yyyy-MM-dd')}.pptx`
    
    await pres.writeFile({ fileName })
    
    console.log('✅ Presentación PPTX generada exitosamente:', fileName)
    
  } catch (error) {
    console.error('Error generando presentación PPTX:', error)
    throw new Error('Error al generar la presentación PowerPoint')
  }
}

function generateTitleSlide(pres: any, data: JournalData, currentDate: string) {
  const slide = pres.addSlide()
  
  slide.addText(data.journal?.title || 'Oportunidad de Negocio', {
    x: 0.5, y: 1.5, w: 9, h: 1.5,
    fontSize: 36, bold: true, align: 'center',
    color: '1f2937'
  })
  
  slide.addText(data.team?.name || 'Equipo Emprendedor', {
    x: 0.5, y: 3, w: 9, h: 0.8,
    fontSize: 24, align: 'center',
    color: '4b5563'
  })
  
  if (data.step2?.title) {
    slide.addText(data.step2.title, {
      x: 0.5, y: 4, w: 9, h: 0.8,
      fontSize: 18, align: 'center', italic: true,
      color: '2563eb'
    })
  }
  
  slide.addText(currentDate, {
    x: 7, y: 6.5, w: 2.5, h: 0.5,
    fontSize: 14, align: 'right',
    color: '6b7280'
  })
}

function generateExecutiveSummarySlide(pres: any, data: JournalData) {
  const slide = pres.addSlide()
  
  slide.addText('Resumen Ejecutivo', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32, bold: true, color: '1f2937'
  })
  
  let yPos = 1.5
  const lineHeight = 0.6
  
  const summaryData = [
    { label: 'Problema:', value: data.step2?.title || 'Por identificar' },
    { label: 'Solución:', value: getSelectedIdea(data) || 'En desarrollo' },
    { label: 'Cliente:', value: data.step5Buyer?.name || 'Segmento por definir' },
    { label: 'Equipo:', value: data.step1?.length ? `${data.step1.length} integrante${data.step1.length > 1 ? 's' : ''}` : 'Por definir' },
    { label: 'Estado:', value: getProjectStatus(data) },
    { label: 'Próximo paso:', value: getNextMajorStep(data) }
  ]
  
  summaryData.forEach(item => {
    slide.addText([
      { text: item.label + ' ', options: { bold: true, color: '1f2937' } },
      { text: item.value, options: { color: '4b5563' } }
    ], {
      x: 0.8, y: yPos, w: 8.5, h: 0.5,
      fontSize: 16
    })
    yPos += lineHeight
  })
}

function generateProblemSlide(pres: any, step2Data: any) {
  const slide = pres.addSlide()
  
  slide.addText('Análisis del Problema', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32, bold: true, color: '1f2937'
  })
  
  slide.addText(step2Data.title, {
    x: 0.8, y: 1.5, w: 8.5, h: 0.8,
    fontSize: 24, bold: true, color: '2563eb'
  })
  
  slide.addText(step2Data.description, {
    x: 0.8, y: 2.4, w: 8.5, h: 1.5,
    fontSize: 14, color: '374151'
  })
  
  slide.addText([
    { text: 'Población afectada: ', options: { bold: true } },
    { text: step2Data.affected }
  ], {
    x: 0.8, y: 4.2, w: 8.5, h: 0.8,
    fontSize: 14, color: '374151'
  })
  
  slide.addText([
    { text: 'Relevancia: ', options: { bold: true } },
    { text: step2Data.relevance }
  ], {
    x: 0.8, y: 5.2, w: 8.5, h: 0.8,
    fontSize: 14, color: '374151'
  })
}

function generateTrendsSlide(pres: any, trendsData: any[]) {
  const slide = pres.addSlide()
  
  slide.addText('Tendencias del Entorno', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32, bold: true, color: '1f2937'
  })
  
  slide.addText(`${trendsData.length} tendencias identificadas:`, {
    x: 0.8, y: 1.5, w: 8.5, h: 0.5,
    fontSize: 16, bold: true, color: '374151'
  })
  
  let yPos = 2.2
  trendsData.slice(0, 4).forEach((trend, index) => {
    slide.addText([
      { text: `${index + 1}. ${trend.name}`, options: { bold: true } },
      { text: ` (${trend.type})`, options: { italic: true, color: '6b7280' } }
    ], {
      x: 1, y: yPos, w: 8, h: 0.4,
      fontSize: 14, color: '1f2937'
    })
    
    slide.addText(trend.brief, {
      x: 1.2, y: yPos + 0.4, w: 7.5, h: 0.6,
      fontSize: 12, color: '4b5563'
    })
    
    yPos += 1.2
  })
  
  if (trendsData.length > 4) {
    slide.addText(`... y ${trendsData.length - 4} tendencias adicionales`, {
      x: 1, y: yPos, w: 8, h: 0.4,
      fontSize: 12, italic: true, color: '6b7280'
    })
  }
}

function generateIdeationSlide(pres: any, ideasData: any[]) {
  const slide = pres.addSlide()
  
  slide.addText('Proceso de Ideación', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32, bold: true, color: '1f2937'
  })
  
  slide.addText(`${ideasData.length} ideas generadas:`, {
    x: 0.8, y: 1.5, w: 8.5, h: 0.5,
    fontSize: 16, bold: true, color: '374151'
  })
  
  let yPos = 2.2
  ideasData.forEach((idea, index) => {
    const isSelected = idea.is_selected
    
    slide.addText([
      { text: `${index + 1}. ${idea.name}`, options: { bold: true, color: isSelected ? '16a34a' : '1f2937' } },
      { text: isSelected ? ' ✓ SELECCIONADA' : '', options: { bold: true, color: '16a34a' } }
    ], {
      x: 1, y: yPos, w: 8, h: 0.4,
      fontSize: 14
    })
    
    slide.addText(idea.description, {
      x: 1.2, y: yPos + 0.4, w: 7.5, h: 0.6,
      fontSize: 12, color: '4b5563'
    })
    
    yPos += 1
  })
}

function generateBuyerSlide(pres: any, buyerData: any) {
  const slide = pres.addSlide()
  
  slide.addText('Cliente Objetivo', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32, bold: true, color: '1f2937'
  })
  
  slide.addText(buyerData.name, {
    x: 0.8, y: 1.5, w: 8.5, h: 0.6,
    fontSize: 24, bold: true, color: '2563eb'
  })
  
  const sections = [
    { title: 'Demografía:', content: buyerData.demographics },
    { title: 'Necesidades:', content: buyerData.needs },
    { title: 'Puntos de dolor:', content: buyerData.pain_points }
  ]
  
  let yPos = 2.5
  sections.forEach(section => {
    slide.addText(section.title, {
      x: 0.8, y: yPos, w: 2, h: 0.4,
      fontSize: 14, bold: true, color: '1f2937'
    })
    
    slide.addText(section.content, {
      x: 0.8, y: yPos + 0.4, w: 8.5, h: 0.8,
      fontSize: 12, color: '4b5563'
    })
    
    yPos += 1.4
  })
}

function generateValuePropSlide(pres: any, vpData: any) {
  const slide = pres.addSlide()
  
  slide.addText('Propuesta de Valor', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32, bold: true, color: '1f2937'
  })
  
  slide.addText(vpData.value_proposition, {
    x: 0.8, y: 1.8, w: 8.5, h: 1.2,
    fontSize: 16, color: '1f2937',
    fill: { color: 'f8f9fa' },
    margin: [10, 10, 10, 10]
  })
  
  slide.addText([
    { text: 'Beneficios únicos: ', options: { bold: true } },
    { text: vpData.unique_benefits }
  ], {
    x: 0.8, y: 3.5, w: 8.5, h: 0.8,
    fontSize: 14, color: '374151'
  })
  
  slide.addText([
    { text: '¿Por qué nosotros?: ', options: { bold: true } },
    { text: vpData.why_us }
  ], {
    x: 0.8, y: 4.8, w: 8.5, h: 0.8,
    fontSize: 14, color: '374151'
  })
}

function generateTeamSlide(pres: any, teamData: any[]) {
  const slide = pres.addSlide()
  
  slide.addText('Nuestro Equipo', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32, bold: true, color: '1f2937'
  })
  
  slide.addText(`Equipo de ${teamData.length} integrante${teamData.length > 1 ? 's' : ''}:`, {
    x: 0.8, y: 1.5, w: 8.5, h: 0.5,
    fontSize: 16, bold: true, color: '374151'
  })
  
  let yPos = 2.2
  teamData.slice(0, 3).forEach((member, index) => {
    slide.addText(`Integrante ${index + 1}:`, {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 14, bold: true, color: '1f2937'
    })
    
    const memberInfo = []
    if (member.who_i_am) memberInfo.push(`Perfil: ${member.who_i_am}`)
    if (member.what_i_know) memberInfo.push(`Conocimientos: ${member.what_i_know}`)
    if (member.what_i_have) memberInfo.push(`Recursos: ${member.what_i_have}`)
    
    slide.addText(memberInfo.join(' • '), {
      x: 1, y: yPos + 0.4, w: 8, h: 0.8,
      fontSize: 12, color: '4b5563'
    })
    
    yPos += 1.4
  })
  
  if (teamData.length > 3) {
    slide.addText(`... y ${teamData.length - 3} integrante${teamData.length > 4 ? 's' : ''} adicional${teamData.length > 4 ? 'es' : ''}`, {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 12, italic: true, color: '6b7280'
    })
  }
}

function generateDevelopmentSlide(pres: any, data: JournalData) {
  const slide = pres.addSlide()
  
  slide.addText('Desarrollo y Sostenibilidad', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32, bold: true, color: '1f2937'
  })
  
  let yPos = 1.5
  
  if (data.step10Prototype) {
    slide.addText([
      { text: 'Prototipo: ', options: { bold: true } },
      { text: data.step10Prototype.prototype_type }
    ], {
      x: 0.8, y: yPos, w: 8.5, h: 0.5,
      fontSize: 16, color: '1f2937'
    })
    
    slide.addText(data.step10Prototype.description, {
      x: 0.8, y: yPos + 0.5, w: 8.5, h: 0.8,
      fontSize: 14, color: '4b5563'
    })
    
    yPos += 1.5
  }
  
  if (data.step8SustainableCanvas) {
    slide.addText('Impacto Sostenible Planificado:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.5,
      fontSize: 16, bold: true, color: '1f2937'
    })
    
    yPos += 0.6
    
    const impacts = [
      { type: 'Social', benefit: data.step8SustainableCanvas.social_benefits },
      { type: 'Ambiental', benefit: data.step8SustainableCanvas.environmental_benefits },
      { type: 'Económico', benefit: data.step8SustainableCanvas.economic_benefits }
    ]
    
    impacts.forEach(impact => {
      slide.addText([
        { text: `${impact.type}: `, options: { bold: true } },
        { text: impact.benefit }
      ], {
        x: 1, y: yPos, w: 8, h: 0.6,
        fontSize: 12, color: '4b5563'
      })
      yPos += 0.7
    })
  }
}

function generateValidationSlide(pres: any, data: JournalData) {
  const slide = pres.addSlide()
  
  slide.addText('Validación y Ecosistema', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32, bold: true, color: '1f2937'
  })
  
  let yPos = 1.5
  
  if (data.step11ValidationStrategy) {
    slide.addText('Estrategia de Validación:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.5,
      fontSize: 16, bold: true, color: '1f2937'
    })
    
    slide.addText(data.step11ValidationStrategy.strategy, {
      x: 0.8, y: yPos + 0.5, w: 8.5, h: 0.8,
      fontSize: 14, color: '4b5563'
    })
    
    slide.addText([
      { text: 'Métodos: ', options: { bold: true } },
      { text: data.step11ValidationStrategy.methods }
    ], {
      x: 0.8, y: yPos + 1.3, w: 8.5, h: 0.6,
      fontSize: 12, color: '4b5563'
    })
    
    yPos += 2.5
  }
  
  if (data.step12EcosystemActors?.length > 0) {
    slide.addText(`Actores del Ecosistema (${data.step12EcosystemActors.length}):`, {
      x: 0.8, y: yPos, w: 8.5, h: 0.5,
      fontSize: 16, bold: true, color: '1f2937'
    })
    
    yPos += 0.6
    data.step12EcosystemActors.slice(0, 3).forEach(actor => {
      slide.addText(`• ${actor.actor_name} - ${actor.role}`, {
        x: 1, y: yPos, w: 8, h: 0.4,
        fontSize: 12, color: '4b5563'
      })
      yPos += 0.5
    })
  }
}

function generateNextStepsSlide(pres: any, data: JournalData) {
  const slide = pres.addSlide()
  
  slide.addText('Próximos Pasos', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32, bold: true, color: '1f2937'
  })
  
  const nextSteps = getSpecificNextSteps(data)
  
  slide.addText('Actividades prioritarias:', {
    x: 0.8, y: 1.5, w: 8.5, h: 0.5,
    fontSize: 16, bold: true, color: '1f2937'
  })
  
  let yPos = 2.2
  nextSteps.slice(0, 5).forEach((step, index) => {
    slide.addText(`${index + 1}. ${step}`, {
      x: 1, y: yPos, w: 8, h: 0.5,
      fontSize: 14, color: '4b5563'
    })
    yPos += 0.6
  })
  
  slide.addText(`Estado actual: ${getCompletionStatus(data)}% completado`, {
    x: 0.8, y: 6, w: 8.5, h: 0.5,
    fontSize: 14, bold: true, color: '16a34a'
  })
}

// Análisis de contenido disponible
interface ContentAnalysis {
  hasTeamAnalysis: boolean
  hasProblemAnalysis: boolean
  hasMarketAnalysis: boolean
  hasIdeationProcess: boolean
  hasBusinessModel: boolean
  hasSustainabilityAnalysis: boolean
  hasPrototypeOrValidation: boolean
  completionPercentage: number
  mainGaps: string[]
  keyStrengths: string[]
}

function analyzeAvailableContent(data: JournalData): ContentAnalysis {
  const analysis: ContentAnalysis = {
    hasTeamAnalysis: false,
    hasProblemAnalysis: false,
    hasMarketAnalysis: false,
    hasIdeationProcess: false,
    hasBusinessModel: false,
    hasSustainabilityAnalysis: false,
    hasPrototypeOrValidation: false,
    completionPercentage: 0,
    mainGaps: [],
    keyStrengths: []
  }
  
  // Verificar análisis del equipo
  if (data.step1?.length > 0 && data.step1.some(member => 
    member.who_i_am?.trim() || member.what_i_know?.trim() || member.who_i_know?.trim() || member.what_i_have?.trim()
  )) {
    analysis.hasTeamAnalysis = true
    analysis.keyStrengths.push('Análisis de recursos del equipo completado')
  } else {
    analysis.mainGaps.push('Mapeo de recursos y capacidades del equipo')
  }
  
  // Verificar análisis del problema
  if (data.step2?.title?.trim() && data.step2?.description?.trim()) {
    analysis.hasProblemAnalysis = true
    analysis.keyStrengths.push('Problema claramente identificado')
  } else {
    analysis.mainGaps.push('Identificación y validación del problema')
  }
  
  // Verificar análisis de mercado
  if (data.step3?.length > 0 && data.step3.some(trend => trend.name?.trim() && trend.brief?.trim())) {
    analysis.hasMarketAnalysis = true
    analysis.keyStrengths.push('Análisis de tendencias del mercado')
  } else {
    analysis.mainGaps.push('Investigación de tendencias y mercado')
  }
  
  // Verificar proceso de ideación
  if (data.step4?.length > 0 && data.step4.some(idea => idea.name?.trim() && idea.description?.trim())) {
    analysis.hasIdeationProcess = true
    analysis.keyStrengths.push('Proceso de generación de ideas')
  } else {
    analysis.mainGaps.push('Generación y evaluación de soluciones')
  }
  
  // Verificar modelo de negocio
  if ((data.step5Buyer?.name?.trim() && data.step5Buyer?.demographics?.trim()) || 
      (data.step5VP?.value_proposition?.trim())) {
    analysis.hasBusinessModel = true
    analysis.keyStrengths.push('Elementos del modelo de negocio definidos')
  } else {
    analysis.mainGaps.push('Definición del modelo de negocio')
  }
  
  // Verificar análisis de sostenibilidad (cualquier campo de sostenibilidad)
  if (data.step8SustainableCanvas?.social_benefits?.trim() || 
      data.step8SustainableCanvas?.environmental_benefits?.trim() ||
      data.step8SustainableCanvas?.economic_benefits?.trim() ||
      data.step9InnovationPatterns?.length > 0 ||
      data.step13SustainabilityReflection?.reflection?.trim()) {
    analysis.hasSustainabilityAnalysis = true
    analysis.keyStrengths.push('Análisis de impacto sostenible')
  } else {
    analysis.mainGaps.push('Evaluación de sostenibilidad e impacto')
  }
  
  // Verificar prototipo o validación (más flexible)
  if (data.step10Prototype?.description?.trim() || 
      data.step10Prototype?.prototype_type?.trim() ||
      data.step11ValidationStrategy?.strategy?.trim() ||
      data.step11ValidationStrategy?.methods?.trim() ||
      data.step12EcosystemActors?.length > 0) {
    analysis.hasPrototypeOrValidation = true
    analysis.keyStrengths.push('Desarrollo y validación iniciados')
  } else {
    analysis.mainGaps.push('Prototipado y validación')
  }
  
  // Calcular porcentaje de completitud
  const totalAreas = 7
  const completedAreas = [
    analysis.hasTeamAnalysis,
    analysis.hasProblemAnalysis,
    analysis.hasMarketAnalysis,
    analysis.hasIdeationProcess,
    analysis.hasBusinessModel,
    analysis.hasSustainabilityAnalysis,
    analysis.hasPrototypeOrValidation
  ].filter(Boolean).length
  
  analysis.completionPercentage = Math.round((completedAreas / totalAreas) * 100)
  
  return analysis
}

function generateProjectOverviewSlide(pres: any, data: JournalData, analysis: ContentAnalysis) {
  const slide = pres.addSlide()
  
  slide.addText('Resumen del Proyecto', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32, bold: true, color: '1f2937'
  })
  
  // Información básica del proyecto
  const projectInfo = []
  if (data.step2?.title) projectInfo.push(`Oportunidad: ${data.step2.title}`)
  if (data.step1?.length) projectInfo.push(`Equipo: ${data.step1.length} integrante${data.step1.length > 1 ? 's' : ''}`)
  
  let yPos = 1.5
  projectInfo.forEach(info => {
    slide.addText(info, {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 16, color: '2563eb', bold: true
    })
    yPos += 0.5
  })
  
  // Estado del análisis
  slide.addText(`Progreso del Análisis: ${analysis.completionPercentage}% completado`, {
    x: 0.8, y: yPos + 0.3, w: 8.5, h: 0.5,
    fontSize: 18, bold: true, color: analysis.completionPercentage > 70 ? '16a34a' : analysis.completionPercentage > 40 ? 'ea580c' : 'dc2626'
  })
  
  // Fortalezas identificadas
  if (analysis.keyStrengths.length > 0) {
    slide.addText('Fortalezas del Proyecto:', {
      x: 0.8, y: yPos + 1, w: 8.5, h: 0.5,
      fontSize: 16, bold: true, color: '16a34a'
    })
    
    let strengthsYPos = yPos + 1.5
    analysis.keyStrengths.slice(0, 3).forEach(strength => {
      slide.addText(`✓ ${strength}`, {
        x: 1, y: strengthsYPos, w: 8, h: 0.4,
        fontSize: 14, color: '374151'
      })
      strengthsYPos += 0.4
    })
  }
  
  // Áreas por desarrollar
  if (analysis.mainGaps.length > 0) {
    slide.addText('Áreas Prioritarias por Desarrollar:', {
      x: 0.8, y: 5, w: 8.5, h: 0.5,
      fontSize: 16, bold: true, color: 'ea580c'
    })
    
    let gapsYPos = 5.5
    analysis.mainGaps.slice(0, 3).forEach(gap => {
      slide.addText(`• ${gap}`, {
        x: 1, y: gapsYPos, w: 8, h: 0.4,
        fontSize: 14, color: '374151'
      })
      gapsYPos += 0.4
    })
  }
}

// Funciones auxiliares para verificar contenido significativo
function hasSignificantMemberData(member: any): boolean {
  return !!(member.who_i_am?.trim() || member.what_i_know?.trim() || 
           member.who_i_know?.trim() || member.what_i_have?.trim())
}

// STEP 1: Slides del equipo
function generateTeamOverviewSlide(pres: any, teamData: any[]) {
  const slide = pres.addSlide()
  
  slide.addText('Análisis del Equipo Emprendedor', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32, bold: true, color: '1f2937'
  })
  
  slide.addText(`Equipo conformado por ${teamData.length} integrante${teamData.length > 1 ? 's' : ''}:`, {
    x: 0.8, y: 1.5, w: 8.5, h: 0.5,
    fontSize: 18, color: '374151'
  })
  
  let yPos = 2.2
  teamData.forEach((member, index) => {
    slide.addText(`${index + 1}. Integrante ${index + 1}`, {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 16, bold: true, color: '2563eb'
    })
    
    const highlights = []
    if (member.who_i_am?.trim()) highlights.push(`Perfil: ${member.who_i_am.substring(0, 50)}...`)
    if (member.what_i_know?.trim()) highlights.push(`Expertise: ${member.what_i_know.substring(0, 50)}...`)
    
    if (highlights.length > 0) {
      slide.addText(highlights.join(' | '), {
        x: 1, y: yPos + 0.4, w: 8, h: 0.5,
        fontSize: 12, color: '4b5563'
      })
    }
    
    yPos += 1
  })
  
  // Fortalezas generales del equipo
  slide.addText('Fortalezas Identificadas:', {
    x: 0.8, y: 6.5, w: 8.5, h: 0.4,
    fontSize: 16, bold: true, color: '16a34a'
  })
  
  const teamStrengths = getTeamStrengths(teamData)
  slide.addText(teamStrengths, {
    x: 0.8, y: 7, w: 8.5, h: 0.4,
    fontSize: 12, color: '374151'
  })
}

function generateIndividualMemberSlide(pres: any, member: any, memberNumber: number) {
  const slide = pres.addSlide()
  
  slide.addText(`Integrante ${memberNumber} - Análisis Detallado`, {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 30, bold: true, color: '1f2937'
  })
  
  let yPos = 1.5
  
  if (member.who_i_am?.trim()) {
    slide.addText('Quién Soy:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 18, bold: true, color: '2563eb'
    })
    
    slide.addText(member.who_i_am, {
      x: 0.8, y: yPos + 0.5, w: 8.5, h: 1,
      fontSize: 14, color: '374151'
    })
    yPos += 1.8
  }
  
  if (member.what_i_know?.trim()) {
    slide.addText('Qué Sé:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 18, bold: true, color: '16a34a'
    })
    
    slide.addText(member.what_i_know, {
      x: 0.8, y: yPos + 0.5, w: 8.5, h: 1,
      fontSize: 14, color: '374151'
    })
    yPos += 1.8
  }
  
  if (member.who_i_know?.trim()) {
    slide.addText('A Quién Conozco:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 18, bold: true, color: 'ea580c'
    })
    
    slide.addText(member.who_i_know, {
      x: 0.8, y: yPos + 0.5, w: 8.5, h: 1,
      fontSize: 14, color: '374151'
    })
    yPos += 1.8
  }
  
  if (member.what_i_have?.trim()) {
    slide.addText('Qué Tengo:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 18, bold: true, color: '8b5cf6'
    })
    
    slide.addText(member.what_i_have, {
      x: 0.8, y: yPos + 0.5, w: 8.5, h: 1,
      fontSize: 14, color: '374151'
    })
  }
}

function generateTeamSynthesisSlide(pres: any, teamData: any[]) {
  const slide = pres.addSlide()
  
  slide.addText('Síntesis de Capacidades del Equipo', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 30, bold: true, color: '1f2937'
  })
  
  // Conocimientos colectivos
  const allSkills = teamData.map(m => m.what_i_know).filter(Boolean).join(', ')
  if (allSkills) {
    slide.addText('Conocimientos y Expertise Combinados:', {
      x: 0.8, y: 1.5, w: 8.5, h: 0.4,
      fontSize: 16, bold: true, color: '16a34a'
    })
    
    slide.addText(allSkills, {
      x: 0.8, y: 2, w: 8.5, h: 1.5,
      fontSize: 12, color: '374151'
    })
  }
  
  // Red de contactos
  const allContacts = teamData.map(m => m.who_i_know).filter(Boolean).join(', ')
  if (allContacts) {
    slide.addText('Red de Contactos del Equipo:', {
      x: 0.8, y: 4, w: 8.5, h: 0.4,
      fontSize: 16, bold: true, color: '2563eb'
    })
    
    slide.addText(allContacts, {
      x: 0.8, y: 4.5, w: 8.5, h: 1.5,
      fontSize: 12, color: '374151'
    })
  }
  
  // Recursos disponibles
  const allResources = teamData.map(m => m.what_i_have).filter(Boolean).join(', ')
  if (allResources) {
    slide.addText('Recursos Disponibles:', {
      x: 0.8, y: 6.5, w: 8.5, h: 0.4,
      fontSize: 16, bold: true, color: 'ea580c'
    })
    
    slide.addText(allResources, {
      x: 0.8, y: 7, w: 8.5, h: 0.4,
      fontSize: 12, color: '374151'
    })
  }
}

function getTeamStrengths(teamData: any[]): string {
  const strengths = []
  
  const hasSkills = teamData.some(m => m.what_i_know?.trim())
  const hasContacts = teamData.some(m => m.who_i_know?.trim())
  const hasResources = teamData.some(m => m.what_i_have?.trim())
  
  if (hasSkills) strengths.push('conocimientos especializados')
  if (hasContacts) strengths.push('red de contactos establecida')
  if (hasResources) strengths.push('recursos propios disponibles')
  
  return strengths.length > 0 ? 
    `Equipo con ${strengths.join(', ')} y ${teamData.length} perspectivas complementarias.` :
    `Equipo de ${teamData.length} integrantes con potencial por desarrollar.`
}

// STEP 2: Slides del problema
function generateProblemImpactSlide(pres: any, problemData: any) {
  const slide = pres.addSlide()
  
  slide.addText('Impacto y Oportunidad del Problema', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 30, bold: true, color: '1f2937'
  })
  
  slide.addText(`Análisis de impacto para: ${problemData.title}`, {
    x: 0.8, y: 1.5, w: 8.5, h: 0.6,
    fontSize: 16, color: '2563eb', bold: true
  })
  
  let yPos = 2.5
  
  if (problemData.affected?.trim()) {
    slide.addText('Población y Mercado Afectado:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 16, bold: true, color: '16a34a'
    })
    
    slide.addText(problemData.affected, {
      x: 0.8, y: yPos + 0.5, w: 8.5, h: 1.2,
      fontSize: 14, color: '374151'
    })
    yPos += 2
  }
  
  if (problemData.relevance?.trim()) {
    slide.addText('Relevancia e Impacto Económico:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 16, bold: true, color: 'ea580c'
    })
    
    slide.addText(problemData.relevance, {
      x: 0.8, y: yPos + 0.5, w: 8.5, h: 1.2,
      fontSize: 14, color: '374151'
    })
    yPos += 2
  }
  
  if (problemData.link_to_means?.trim()) {
    slide.addText('Conexión con Recursos del Equipo:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 16, bold: true, color: '8b5cf6'
    })
    
    slide.addText(problemData.link_to_means, {
      x: 0.8, y: yPos + 0.5, w: 8.5, h: 1.2,
      fontSize: 14, color: '374151'
    })
  }
}

// STEP 3: Slides de tendencias
function generateMarketOverviewSlide(pres: any, trendsData: any[]) {
  const slide = pres.addSlide()
  
  slide.addText('Análisis de Tendencias del Mercado', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 30, bold: true, color: '1f2937'
  })
  
  slide.addText(`${trendsData.length} tendencias identificadas que impactan el proyecto:`, {
    x: 0.8, y: 1.5, w: 8.5, h: 0.5,
    fontSize: 16, color: '374151'
  })
  
  // Categorizar tendencias por tipo
  const trendsByType = {}
  trendsData.forEach(trend => {
    const type = trend.type || 'General'
    if (!trendsByType[type]) trendsByType[type] = []
    trendsByType[type].push(trend)
  })
  
  let yPos = 2.5
  Object.entries(trendsByType).forEach(([type, trends]: [string, any[]]) => {
    slide.addText(`${type}: ${trends.length} tendencia${trends.length > 1 ? 's' : ''}`, {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 14, bold: true, color: '2563eb'
    })
    
    const trendNames = trends.map(t => t.name).filter(Boolean).join(', ')
    slide.addText(trendNames, {
      x: 1, y: yPos + 0.4, w: 8, h: 0.6,
      fontSize: 12, color: '4b5563'
    })
    
    yPos += 1.2
  })
  
  // Síntesis general
  slide.addText('Contexto Estratégico:', {
    x: 0.8, y: 6.5, w: 8.5, h: 0.4,
    fontSize: 16, bold: true, color: '16a34a'
  })
  
  slide.addText(`Estas tendencias crean un contexto favorable para innovaciones que aborden problemas emergentes y aprovechen oportunidades tecnológicas.`, {
    x: 0.8, y: 7, w: 8.5, h: 0.4,
    fontSize: 12, color: '374151'
  })
}

function generateIndividualTrendSlide(pres: any, trend: any, trendNumber: number) {
  const slide = pres.addSlide()
  
  slide.addText(`Tendencia ${trendNumber}: ${trend.name}`, {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 28, bold: true, color: '1f2937'
  })
  
  slide.addText(`Categoría: ${trend.type || 'Tendencia General'}`, {
    x: 0.8, y: 1.5, w: 8.5, h: 0.4,
    fontSize: 16, color: '6b7280', italic: true
  })
  
  slide.addText('Descripción y Análisis:', {
    x: 0.8, y: 2.2, w: 8.5, h: 0.4,
    fontSize: 18, bold: true, color: '2563eb'
  })
  
  slide.addText(trend.brief, {
    x: 0.8, y: 2.8, w: 8.5, h: 2.5,
    fontSize: 14, color: '374151'
  })
  
  slide.addText('Implicaciones para Nuestro Proyecto:', {
    x: 0.8, y: 5.8, w: 8.5, h: 0.4,
    fontSize: 16, bold: true, color: '16a34a'
  })
  
  slide.addText('Esta tendencia valida la oportunidad identificada y puede ser un factor diferenciador en nuestra propuesta de valor.', {
    x: 0.8, y: 6.3, w: 8.5, h: 0.8,
    fontSize: 12, color: '374151'
  })
}

function generateMarketImplicationsSlide(pres: any, trendsData: any[]) {
  const slide = pres.addSlide()
  
  slide.addText('Implicaciones Estratégicas del Mercado', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 30, bold: true, color: '1f2937'
  })
  
  slide.addText('Síntesis del Análisis de Tendencias:', {
    x: 0.8, y: 1.5, w: 8.5, h: 0.4,
    fontSize: 16, bold: true, color: '2563eb'
  })
  
  const implications = [
    `${trendsData.length} tendencias analizadas proporcionan contexto estratégico`,
    'Oportunidad validada por factores externos convergentes',
    'Timing favorable para desarrollo de soluciones innovadoras',
    'Mercado en evolución crea demanda por nuevas propuestas de valor'
  ]
  
  let yPos = 2.2
  implications.forEach(implication => {
    slide.addText(`• ${implication}`, {
      x: 0.8, y: yPos, w: 8.5, h: 0.5,
      fontSize: 14, color: '374151'
    })
    yPos += 0.6
  })
  
  slide.addText('Ventana de Oportunidad:', {
    x: 0.8, y: 5.5, w: 8.5, h: 0.4,
    fontSize: 16, bold: true, color: '16a34a'
  })
  
  slide.addText('Las tendencias identificadas crean una ventana de oportunidad para soluciones que combinen innovación tecnológica con impacto social y sostenible.', {
    x: 0.8, y: 6, w: 8.5, h: 1,
    fontSize: 14, color: '374151'
  })
}

function generateTeamResourcesSlide(pres: any, teamData: any[]) {
  const slide = pres.addSlide()
  
  slide.addText('Recursos y Capacidades del Equipo', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 30, bold: true, color: '1f2937'
  })
  
  slide.addText(`Análisis detallado de ${teamData.length} integrante${teamData.length > 1 ? 's' : ''} del equipo:`, {
    x: 0.8, y: 1.5, w: 8.5, h: 0.5,
    fontSize: 16, color: '374151'
  })
  
  let yPos = 2.2
  teamData.forEach((member, index) => {
    slide.addText(`Integrante ${index + 1}:`, {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 16, bold: true, color: '2563eb'
    })
    
    const memberDetails = []
    if (member.who_i_am?.trim()) memberDetails.push(`Perfil: ${member.who_i_am}`)
    if (member.what_i_know?.trim()) memberDetails.push(`Expertise: ${member.what_i_know}`)
    if (member.who_i_know?.trim()) memberDetails.push(`Red: ${member.who_i_know}`)
    if (member.what_i_have?.trim()) memberDetails.push(`Recursos: ${member.what_i_have}`)
    
    if (memberDetails.length > 0) {
      slide.addText(memberDetails.join(' | '), {
        x: 1, y: yPos + 0.4, w: 8, h: 0.8,
        fontSize: 12, color: '4b5563'
      })
    }
    
    yPos += 1.4
  })
  
  // Síntesis de capacidades
  const allSkills = teamData.map(m => m.what_i_know).filter(Boolean).join(', ')
  const allResources = teamData.map(m => m.what_i_have).filter(Boolean).join(', ')
  
  if (allSkills || allResources) {
    slide.addText('Síntesis de Capacidades del Equipo:', {
      x: 0.8, y: 6, w: 8.5, h: 0.4,
      fontSize: 14, bold: true, color: '1f2937'
    })
    
    if (allSkills) {
      slide.addText(`Conocimientos clave: ${allSkills}`, {
        x: 1, y: 6.5, w: 8, h: 0.5,
        fontSize: 12, color: '4b5563'
      })
    }
    
    if (allResources) {
      slide.addText(`Recursos disponibles: ${allResources}`, {
        x: 1, y: 7, w: 8, h: 0.5,
        fontSize: 12, color: '4b5563'
      })
    }
  }
}

function generateConclusionsSlide(pres: any, data: JournalData, analysis: ContentAnalysis) {
  const slide = pres.addSlide()
  
  slide.addText('Conclusiones y Próximos Pasos', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 30, bold: true, color: '1f2937'
  })
  
  // Estado actual
  slide.addText(`Estado del Proyecto: ${analysis.completionPercentage}% del análisis completado`, {
    x: 0.8, y: 1.5, w: 8.5, h: 0.5,
    fontSize: 16, bold: true, color: analysis.completionPercentage > 70 ? '16a34a' : 'ea580c'
  })
  
  // Próximas acciones prioritarias
  slide.addText('Acciones Inmediatas (Próximas 2-4 semanas):', {
    x: 0.8, y: 2.5, w: 8.5, h: 0.5,
    fontSize: 16, bold: true, color: '1f2937'
  })
  
  const priorityActions = getPriorityActions(data, analysis)
  let actionYPos = 3.1
  priorityActions.slice(0, 4).forEach((action, index) => {
    slide.addText(`${index + 1}. ${action}`, {
      x: 1, y: actionYPos, w: 8, h: 0.5,
      fontSize: 14, color: '374151'
    })
    actionYPos += 0.5
  })
  
  // Recomendaciones estratégicas
  slide.addText('Recomendaciones Estratégicas:', {
    x: 0.8, y: 5.5, w: 8.5, h: 0.5,
    fontSize: 16, bold: true, color: '1f2937'
  })
  
  const recommendations = getStrategicRecommendations(data, analysis)
  let recYPos = 6.1
  recommendations.slice(0, 2).forEach(rec => {
    slide.addText(`• ${rec}`, {
      x: 1, y: recYPos, w: 8, h: 0.4,
      fontSize: 14, color: '374151'
    })
    recYPos += 0.5
  })
}

function getPriorityActions(data: JournalData, analysis: ContentAnalysis): string[] {
  const actions = []
  
  if (!analysis.hasTeamAnalysis) {
    actions.push('Completar mapeo detallado de recursos, habilidades y contactos del equipo')
  }
  
  if (!analysis.hasProblemAnalysis) {
    actions.push('Investigar y validar el problema con entrevistas a usuarios potenciales')
  }
  
  if (!analysis.hasMarketAnalysis) {
    actions.push('Analizar tendencias del mercado y factores externos relevantes')
  }
  
  if (!analysis.hasIdeationProcess) {
    actions.push('Realizar sesiones estructuradas de ideación y selección de solución')
  }
  
  if (!analysis.hasBusinessModel) {
    actions.push('Definir buyer persona y propuesta de valor diferenciada')
  }
  
  if (analysis.hasBusinessModel && !analysis.hasPrototypeOrValidation) {
    actions.push('Desarrollar MVP o prototipo para validación temprana')
  }
  
  if (!analysis.hasSustainabilityAnalysis) {
    actions.push('Evaluar impacto social, ambiental y económico del proyecto')
  }
  
  return actions
}

function getStrategicRecommendations(data: JournalData, analysis: ContentAnalysis): string[] {
  const recommendations = []
  
  if (analysis.completionPercentage < 40) {
    recommendations.push('Enfocar esfuerzos en completar el análisis foundacional antes de buscar financiamiento')
  }
  
  if (analysis.hasBusinessModel && analysis.hasPrototypeOrValidation) {
    recommendations.push('El proyecto está listo para buscar mentores especializados y posibles socios estratégicos')
  }
  
  if (analysis.hasTeamAnalysis && analysis.mainGaps.length > 3) {
    recommendations.push('Considerar incorporar nuevos integrantes con habilidades complementarias')
  }
  
  if (analysis.completionPercentage > 70) {
    recommendations.push('Proyecto con base sólida. Momento apropiado para buscar validación externa y feedback de expertos')
  }
  
  return recommendations
}

// Funciones auxiliares
function generateProblemAnalysisSlide(pres: any, problemData: any) {
  const slide = pres.addSlide()
  
  slide.addText('Análisis del Problema', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32, bold: true, color: '1f2937'
  })
  
  slide.addText(problemData.title, {
    x: 0.8, y: 1.5, w: 8.5, h: 0.8,
    fontSize: 24, bold: true, color: '2563eb'
  })
  
  slide.addText(problemData.description, {
    x: 0.8, y: 2.4, w: 8.5, h: 1.5,
    fontSize: 14, color: '374151'
  })
  
  if (problemData.affected?.trim()) {
    slide.addText([
      { text: 'Población afectada: ', options: { bold: true, color: '1f2937' } },
      { text: problemData.affected, options: { color: '4b5563' } }
    ], {
      x: 0.8, y: 4.2, w: 8.5, h: 0.8,
      fontSize: 14
    })
  }
  
  if (problemData.relevance?.trim()) {
    slide.addText([
      { text: 'Impacto y relevancia: ', options: { bold: true, color: '1f2937' } },
      { text: problemData.relevance, options: { color: '4b5563' } }
    ], {
      x: 0.8, y: 5.2, w: 8.5, h: 0.8,
      fontSize: 14
    })
  }
  
  if (problemData.link_to_means?.trim()) {
    slide.addText([
      { text: 'Conexión con recursos del equipo: ', options: { bold: true, color: '1f2937' } },
      { text: problemData.link_to_means, options: { color: '4b5563' } }
    ], {
      x: 0.8, y: 6.2, w: 8.5, h: 0.8,
      fontSize: 14
    })
  }
}

function generateMarketTrendsSlide(pres: any, trendsData: any[]) {
  const slide = pres.addSlide()
  
  slide.addText('Análisis de Tendencias del Mercado', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 30, bold: true, color: '1f2937'
  })
  
  slide.addText(`${trendsData.length} tendencias identificadas que impactan nuestro proyecto:`, {
    x: 0.8, y: 1.5, w: 8.5, h: 0.5,
    fontSize: 16, color: '374151'
  })
  
  let yPos = 2.2
  trendsData.forEach((trend, index) => {
    if (trend.name?.trim() && trend.brief?.trim()) {
      slide.addText([
        { text: `${index + 1}. ${trend.name}`, options: { bold: true, color: '2563eb' } },
        { text: ` (${trend.type || 'Tendencia'})`, options: { italic: true, color: '6b7280' } }
      ], {
        x: 0.8, y: yPos, w: 8.5, h: 0.4,
        fontSize: 14
      })
      
      slide.addText(trend.brief, {
        x: 1, y: yPos + 0.4, w: 8, h: 0.6,
        fontSize: 12, color: '4b5563'
      })
      
      yPos += 1.2
    }
  })
  
  // Síntesis del impacto
  slide.addText('Implicaciones para el proyecto:', {
    x: 0.8, y: 6.5, w: 8.5, h: 0.4,
    fontSize: 14, bold: true, color: '16a34a'
  })
  
  slide.addText(`Estas ${trendsData.length} tendencias ${trendsData.length > 2 ? 'validan la oportunidad' : 'apoyan el desarrollo'} y proporcionan el contexto estratégico para nuestra solución.`, {
    x: 0.8, y: 7, w: 8.5, h: 0.4,
    fontSize: 12, color: '374151'
  })
}

function generateIdeationResultsSlide(pres: any, ideasData: any[]) {
  const slide = pres.addSlide()
  
  slide.addText('Resultados del Proceso de Ideación', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 30, bold: true, color: '1f2937'
  })
  
  const selectedIdea = ideasData.find(idea => idea.is_selected)
  
  slide.addText(`${ideasData.length} ideas generadas y evaluadas:`, {
    x: 0.8, y: 1.5, w: 8.5, h: 0.5,
    fontSize: 16, color: '374151'
  })
  
  let yPos = 2.2
  ideasData.forEach((idea, index) => {
    if (idea.name?.trim()) {
      const isSelected = idea.is_selected
      
      slide.addText([
        { text: `${index + 1}. ${idea.name}`, options: { 
          bold: true, 
          color: isSelected ? '16a34a' : '1f2937' 
        }},
        { text: isSelected ? ' ✓ SELECCIONADA' : '', options: { 
          bold: true, 
          color: '16a34a' 
        }}
      ], {
        x: 0.8, y: yPos, w: 8.5, h: 0.4,
        fontSize: 14
      })
      
      if (idea.description?.trim()) {
        slide.addText(idea.description, {
          x: 1, y: yPos + 0.4, w: 8, h: 0.6,
          fontSize: 12, color: '4b5563'
        })
      }
      
      yPos += 1
    }
  })
  
  if (selectedIdea) {
    slide.addText('Justificación de la selección:', {
      x: 0.8, y: 6.5, w: 8.5, h: 0.4,
      fontSize: 14, bold: true, color: '16a34a'
    })
    
    slide.addText('La idea seleccionada presenta la mejor combinación de viabilidad técnica, deseabilidad del mercado y factibilidad con nuestros recursos actuales.', {
      x: 0.8, y: 7, w: 8.5, h: 0.4,
      fontSize: 12, color: '374151'
    })
  }
}

function generateBusinessModelSlide(pres: any, data: JournalData) {
  const slide = pres.addSlide()
  
  slide.addText('Modelo de Negocio', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32, bold: true, color: '1f2937'
  })
  
  let yPos = 1.5
  
  // Buyer Persona
  if (data.step5Buyer?.name?.trim()) {
    slide.addText('Cliente Objetivo:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.5,
      fontSize: 18, bold: true, color: '2563eb'
    })
    
    slide.addText(data.step5Buyer.name, {
      x: 1, y: yPos + 0.5, w: 8, h: 0.4,
      fontSize: 16, bold: true, color: '1f2937'
    })
    
    if (data.step5Buyer.demographics?.trim()) {
      slide.addText(`Perfil: ${data.step5Buyer.demographics}`, {
        x: 1, y: yPos + 0.9, w: 8, h: 0.5,
        fontSize: 12, color: '4b5563'
      })
    }
    
    if (data.step5Buyer.needs?.trim()) {
      slide.addText(`Necesidades: ${data.step5Buyer.needs}`, {
        x: 1, y: yPos + 1.4, w: 8, h: 0.5,
        fontSize: 12, color: '4b5563'
      })
    }
    
    yPos += 2.5
  }
  
  // Propuesta de Valor
  if (data.step5VP?.value_proposition?.trim()) {
    slide.addText('Propuesta de Valor:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.5,
      fontSize: 18, bold: true, color: '16a34a'
    })
    
    slide.addText(data.step5VP.value_proposition, {
      x: 1, y: yPos + 0.5, w: 8, h: 0.8,
      fontSize: 14, color: '1f2937',
      fill: { color: 'f8f9fa' }
    })
    
    if (data.step5VP.unique_benefits?.trim()) {
      slide.addText(`Beneficios únicos: ${data.step5VP.unique_benefits}`, {
        x: 1, y: yPos + 1.4, w: 8, h: 0.6,
        fontSize: 12, color: '4b5563'
      })
    }
    
    if (data.step5VP.why_us?.trim()) {
      slide.addText(`Ventaja competitiva: ${data.step5VP.why_us}`, {
        x: 1, y: yPos + 2, w: 8, h: 0.6,
        fontSize: 12, color: '4b5563'
      })
    }
  }
}

function generateSustainabilitySlide(pres: any, data: JournalData) {
  const slide = pres.addSlide()
  
  slide.addText('Análisis de Sostenibilidad', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32, bold: true, color: '1f2937'
  })
  
  let yPos = 1.5
  
  if (data.step8SustainableCanvas) {
    slide.addText('Impacto Sostenible Planificado:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.5,
      fontSize: 18, bold: true, color: '16a34a'
    })
    
    yPos += 0.7
    
    if (data.step8SustainableCanvas.social_benefits?.trim()) {
      slide.addText([
        { text: 'Social: ', options: { bold: true, color: '2563eb' } },
        { text: data.step8SustainableCanvas.social_benefits, options: { color: '4b5563' } }
      ], {
        x: 1, y: yPos, w: 8, h: 0.6,
        fontSize: 14
      })
      yPos += 0.8
    }
    
    if (data.step8SustainableCanvas.environmental_benefits?.trim()) {
      slide.addText([
        { text: 'Ambiental: ', options: { bold: true, color: '16a34a' } },
        { text: data.step8SustainableCanvas.environmental_benefits, options: { color: '4b5563' } }
      ], {
        x: 1, y: yPos, w: 8, h: 0.6,
        fontSize: 14
      })
      yPos += 0.8
    }
    
    if (data.step8SustainableCanvas.economic_benefits?.trim()) {
      slide.addText([
        { text: 'Económico: ', options: { bold: true, color: 'ea580c' } },
        { text: data.step8SustainableCanvas.economic_benefits, options: { color: '4b5563' } }
      ], {
        x: 1, y: yPos, w: 8, h: 0.6,
        fontSize: 14
      })
      yPos += 1
    }
  }
  
  if (data.step9InnovationPatterns?.length > 0) {
    slide.addText(`Patrones de Innovación (${data.step9InnovationPatterns.length}):`, {
      x: 0.8, y: yPos, w: 8.5, h: 0.5,
      fontSize: 16, bold: true, color: '8b5cf6'
    })
    
    yPos += 0.6
    data.step9InnovationPatterns.slice(0, 2).forEach(pattern => {
      if (pattern.pattern_name?.trim()) {
        slide.addText(`• ${pattern.pattern_name}: ${pattern.description || 'Patrón identificado'}`, {
          x: 1, y: yPos, w: 8, h: 0.5,
          fontSize: 12, color: '4b5563'
        })
        yPos += 0.6
      }
    })
  }
}

function generateImplementationSlide(pres: any, data: JournalData) {
  const slide = pres.addSlide()
  
  slide.addText('Implementación y Validación', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32, bold: true, color: '1f2937'
  })
  
  let yPos = 1.5
  
  if (data.step10Prototype?.description?.trim()) {
    slide.addText('Prototipo Desarrollado:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.5,
      fontSize: 18, bold: true, color: '2563eb'
    })
    
    slide.addText([
      { text: 'Tipo: ', options: { bold: true } },
      { text: data.step10Prototype.prototype_type || 'MVP inicial' }
    ], {
      x: 1, y: yPos + 0.5, w: 8, h: 0.4,
      fontSize: 14, color: '1f2937'
    })
    
    slide.addText(data.step10Prototype.description, {
      x: 1, y: yPos + 0.9, w: 8, h: 0.8,
      fontSize: 12, color: '4b5563'
    })
    
    yPos += 2.2
  }
  
  if (data.step11ValidationStrategy?.strategy?.trim()) {
    slide.addText('Estrategia de Validación:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.5,
      fontSize: 18, bold: true, color: '16a34a'
    })
    
    slide.addText(data.step11ValidationStrategy.strategy, {
      x: 1, y: yPos + 0.5, w: 8, h: 0.8,
      fontSize: 12, color: '4b5563'
    })
    
    if (data.step11ValidationStrategy.methods?.trim()) {
      slide.addText([
        { text: 'Métodos: ', options: { bold: true } },
        { text: data.step11ValidationStrategy.methods }
      ], {
        x: 1, y: yPos + 1.3, w: 8, h: 0.6,
        fontSize: 12, color: '4b5563'
      })
    }
    
    yPos += 2.5
  }
  
  if (data.step12EcosystemActors?.length > 0) {
    slide.addText(`Actores del Ecosistema (${data.step12EcosystemActors.length}):`, {
      x: 0.8, y: yPos, w: 8.5, h: 0.5,
      fontSize: 16, bold: true, color: '8b5cf6'
    })
    
    let actorYPos = yPos + 0.6
    data.step12EcosystemActors.slice(0, 3).forEach(actor => {
      if (actor.actor_name?.trim()) {
        slide.addText(`• ${actor.actor_name} - ${actor.role || 'Stakeholder'}`, {
          x: 1, y: actorYPos, w: 8, h: 0.4,
          fontSize: 12, color: '4b5563'
        })
        actorYPos += 0.5
      }
    })
  }
}

function getSelectedIdea(data: JournalData): string | null {
  const selected = data.step4?.find(idea => idea.is_selected)
  return selected?.name || data.step4?.[0]?.name || data.idea?.title || null
}

function getProjectStatus(data: JournalData): string {
  const completed = getCompletedStepsCount(data)
  if (completed >= 8) return 'Avanzado'
  if (completed >= 5) return 'Intermedio'  
  if (completed >= 2) return 'Inicial'
  return 'Concepto'
}

function getNextMajorStep(data: JournalData): string {
  if (!data.step1?.length) return 'Análisis del equipo'
  if (!data.step2) return 'Identificar problema'
  if (!data.step4?.length) return 'Generar ideas'
  if (!data.step5VP) return 'Definir propuesta de valor'
  if (!data.step10Prototype) return 'Desarrollar prototipo'
  if (!data.step11ValidationStrategy) return 'Validar con clientes'
  return 'Buscar financiamiento'
}

function getCompletedStepsCount(data: JournalData): number {
  let count = 0
  if (data.step1?.length > 0) count++
  if (data.step2) count++
  if (data.step3?.length > 0) count++
  if (data.step4?.length > 0) count++
  if (data.step5Buyer) count++
  if (data.step5VP) count++
  if (data.step8SustainableCanvas) count++
  if (data.step9InnovationPatterns?.length > 0) count++
  if (data.step10Prototype) count++
  if (data.step11ValidationStrategy) count++
  if (data.step12EcosystemActors?.length > 0) count++
  if (data.step13SustainabilityReflection) count++
  return count
}

function getCompletionStatus(data: JournalData): number {
  return Math.round((getCompletedStepsCount(data) / 12) * 100)
}

function getSpecificNextSteps(data: JournalData): string[] {
  const steps = []
  
  if (!data.step1?.length) steps.push('Completar análisis de medios personales del equipo')
  if (!data.step2) steps.push('Investigar y validar problema del mercado')
  if (!data.step3?.length) steps.push('Analizar tendencias del entorno')
  if (!data.step4?.length) steps.push('Realizar sesiones de ideación')
  if (!data.step5Buyer) steps.push('Definir buyer persona detallado')
  if (!data.step5VP) steps.push('Desarrollar propuesta de valor única')
  if (!data.step10Prototype) steps.push('Crear prototipo/MVP')
  if (!data.step11ValidationStrategy) steps.push('Diseñar estrategia de validación')
  if (!data.step8SustainableCanvas) steps.push('Completar canvas sostenible')
  
  return steps
}

// STEP 4: Slides de ideación
function generateIdeationOverviewSlide(pres: any, ideasData: any[]) {
  const slide = pres.addSlide()
  
  slide.addText('Proceso de Ideación - Resumen', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 30, bold: true, color: '1f2937'
  })
  
  const selectedIdea = ideasData.find(idea => idea.is_selected)
  const totalIdeas = ideasData.length
  
  slide.addText(`Resultado: ${totalIdeas} ideas generadas y evaluadas`, {
    x: 0.8, y: 1.5, w: 8.5, h: 0.5,
    fontSize: 18, color: '2563eb', bold: true
  })
  
  // Estadísticas del proceso
  let yPos = 2.3
  const processStats = [
    `Ideas totales generadas: ${totalIdeas}`,
    `Ideas con descripción detallada: ${ideasData.filter(i => i.description?.trim()).length}`,
    `Ideas seleccionadas para desarrollo: ${selectedIdea ? 1 : 0}`,
    `Proceso de evaluación: ${selectedIdea ? 'Completado' : 'En progreso'}`
  ]
  
  processStats.forEach(stat => {
    slide.addText(`• ${stat}`, {
      x: 1, y: yPos, w: 8, h: 0.4,
      fontSize: 14, color: '374151'
    })
    yPos += 0.5
  })
  
  if (selectedIdea) {
    slide.addText('Idea Seleccionada para Desarrollo:', {
      x: 0.8, y: 5, w: 8.5, h: 0.5,
      fontSize: 16, bold: true, color: '16a34a'
    })
    
    slide.addText(selectedIdea.name, {
      x: 1, y: 5.5, w: 8, h: 0.6,
      fontSize: 16, bold: true, color: '1f2937',
      fill: { color: 'f0f9ff' }
    })
    
    if (selectedIdea.description?.trim()) {
      slide.addText(selectedIdea.description, {
        x: 1, y: 6.2, w: 8, h: 1,
        fontSize: 12, color: '374151'
      })
    }
  }
}

function generateIdeaComparisonSlide(pres: any, ideasData: any[]) {
  const slide = pres.addSlide()
  
  slide.addText('Comparación y Evaluación de Ideas', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 30, bold: true, color: '1f2937'
  })
  
  slide.addText(`Análisis comparativo de ${ideasData.length} propuestas:`, {
    x: 0.8, y: 1.5, w: 8.5, h: 0.5,
    fontSize: 16, color: '374151'
  })
  
  let yPos = 2.3
  for (let index = 0; index < ideasData.length; index++) {
    const idea = ideasData[index]
    if (idea.name?.trim()) {
      const isSelected = idea.is_selected
      
      // Título de la idea
      slide.addText([
        { text: `${index + 1}. ${idea.name}`, options: { 
          bold: true, 
          color: isSelected ? '16a34a' : '1f2937'
        }},
        { text: isSelected ? ' ✓ SELECCIONADA' : '', options: {
          bold: true,
          color: '16a34a'
        }}
      ], {
        x: 0.8, y: yPos, w: 8.5, h: 0.4,
        fontSize: 14
      })
      
      // Descripción
      if (idea.description?.trim()) {
        slide.addText(idea.description.substring(0, 150) + (idea.description.length > 150 ? '...' : ''), {
          x: 1, y: yPos + 0.4, w: 8, h: 0.5,
          fontSize: 11, color: '4b5563'
        })
      }
      
      // Criterios de evaluación implícitos
      const evaluation = getIdeaEvaluationSummary(idea, isSelected)
      slide.addText(evaluation, {
        x: 1, y: yPos + 0.9, w: 8, h: 0.3,
        fontSize: 10, italic: true, color: '6b7280'
      })
      
      yPos += 1.4
      
      if (yPos > 6.5) break // Limitar número de ideas por slide
    }
  }
}

function generateSelectedIdeaDetailSlide(pres: any, ideasData: any[]) {
  const slide = pres.addSlide()
  const selectedIdea = ideasData.find(idea => idea.is_selected)
  
  if (!selectedIdea) return
  
  slide.addText('Idea Seleccionada - Análisis Detallado', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 30, bold: true, color: '1f2937'
  })
  
  slide.addText(selectedIdea.name, {
    x: 0.8, y: 1.5, w: 8.5, h: 0.8,
    fontSize: 20, bold: true, color: '16a34a',
    fill: { color: 'f0f9ff' }
  })
  
  if (selectedIdea.description?.trim()) {
    slide.addText('Descripción de la Solución:', {
      x: 0.8, y: 2.5, w: 8.5, h: 0.4,
      fontSize: 16, bold: true, color: '2563eb'
    })
    
    slide.addText(selectedIdea.description, {
      x: 0.8, y: 3, w: 8.5, h: 1.5,
      fontSize: 14, color: '374151'
    })
  }
  
  // Análisis de la selección
  slide.addText('Justificación de la Selección:', {
    x: 0.8, y: 4.8, w: 8.5, h: 0.4,
    fontSize: 16, bold: true, color: '1f2937'
  })
  
  const justification = [
    'Esta idea presenta la mejor combinación de:',
    '• Viabilidad técnica con recursos disponibles',
    '• Potencial de impacto en el mercado objetivo',
    '• Alineación con capacidades del equipo',
    '• Factibilidad de desarrollo en corto plazo'
  ]
  
  let justYPos = 5.3
  justification.forEach(point => {
    slide.addText(point, {
      x: 1, y: justYPos, w: 8, h: 0.3,
      fontSize: 12, color: '374151'
    })
    justYPos += 0.35
  })
}

// Slides de Buyer Persona y Value Proposition detalladas
function generateBuyerPersonaSlide(pres: any, buyerData: any) {
  const slide = pres.addSlide()
  
  slide.addText('Cliente Objetivo - Buyer Persona', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 30, bold: true, color: '1f2937'
  })
  
  slide.addText(buyerData.name, {
    x: 0.8, y: 1.5, w: 8.5, h: 0.8,
    fontSize: 22, bold: true, color: '2563eb'
  })
  
  let yPos = 2.5
  
  if (buyerData.demographics?.trim()) {
    slide.addText('Perfil Demográfico:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 16, bold: true, color: '16a34a'
    })
    
    slide.addText(buyerData.demographics, {
      x: 0.8, y: yPos + 0.5, w: 8.5, h: 1,
      fontSize: 14, color: '374151'
    })
    yPos += 1.8
  }
  
  if (buyerData.needs?.trim()) {
    slide.addText('Necesidades Identificadas:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 16, bold: true, color: '8b5cf6'
    })
    
    slide.addText(buyerData.needs, {
      x: 0.8, y: yPos + 0.5, w: 8.5, h: 1,
      fontSize: 14, color: '374151'
    })
    yPos += 1.8
  }
  
  if (buyerData.pain_points?.trim()) {
    slide.addText('Puntos de Dolor:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 16, bold: true, color: 'ea580c'
    })
    
    slide.addText(buyerData.pain_points, {
      x: 0.8, y: yPos + 0.5, w: 8.5, h: 1,
      fontSize: 14, color: '374151'
    })
  }
}

function generateValuePropositionSlide(pres: any, vpData: any) {
  const slide = pres.addSlide()
  
  slide.addText('Propuesta de Valor', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32, bold: true, color: '1f2937'
  })
  
  slide.addText('Nuestra Propuesta Central:', {
    x: 0.8, y: 1.5, w: 8.5, h: 0.5,
    fontSize: 16, bold: true, color: '2563eb'
  })
  
  slide.addText(vpData.value_proposition, {
    x: 0.8, y: 2.1, w: 8.5, h: 1.2,
    fontSize: 16, color: '1f2937',
    fill: { color: 'f8f9fa' }
  })
  
  let yPos = 3.8
  
  if (vpData.unique_benefits?.trim()) {
    slide.addText('Beneficios Únicos que Ofrecemos:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 16, bold: true, color: '16a34a'
    })
    
    slide.addText(vpData.unique_benefits, {
      x: 0.8, y: yPos + 0.5, w: 8.5, h: 1,
      fontSize: 14, color: '374151'
    })
    yPos += 1.8
  }
  
  if (vpData.why_us?.trim()) {
    slide.addText('¿Por Qué Elegir Nuestra Solución?', {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 16, bold: true, color: 'ea580c'
    })
    
    slide.addText(vpData.why_us, {
      x: 0.8, y: yPos + 0.5, w: 8.5, h: 1,
      fontSize: 14, color: '374151'
    })
  }
}

// Slides de sostenibilidad detalladas
function generateSustainableCanvasSlide(pres: any, canvasData: any) {
  const slide = pres.addSlide()
  
  slide.addText('Canvas de Sostenibilidad', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 30, bold: true, color: '1f2937'
  })
  
  slide.addText('Análisis de Triple Impacto:', {
    x: 0.8, y: 1.5, w: 8.5, h: 0.5,
    fontSize: 18, color: '16a34a', bold: true
  })
  
  let yPos = 2.3
  
  if (canvasData.social_benefits?.trim()) {
    slide.addText('Impacto Social:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 16, bold: true, color: '2563eb'
    })
    
    slide.addText(canvasData.social_benefits, {
      x: 0.8, y: yPos + 0.5, w: 8.5, h: 1,
      fontSize: 14, color: '374151'
    })
    yPos += 1.8
  }
  
  if (canvasData.environmental_benefits?.trim()) {
    slide.addText('Impacto Ambiental:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 16, bold: true, color: '16a34a'
    })
    
    slide.addText(canvasData.environmental_benefits, {
      x: 0.8, y: yPos + 0.5, w: 8.5, h: 1,
      fontSize: 14, color: '374151'
    })
    yPos += 1.8
  }
  
  if (canvasData.economic_benefits?.trim()) {
    slide.addText('Impacto Económico:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 16, bold: true, color: 'ea580c'
    })
    
    slide.addText(canvasData.economic_benefits, {
      x: 0.8, y: yPos + 0.5, w: 8.5, h: 1,
      fontSize: 14, color: '374151'
    })
  }
}

function generateInnovationPatternsSlide(pres: any, patternsData: any[]) {
  const slide = pres.addSlide()
  
  slide.addText('Patrones de Innovación Identificados', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 28, bold: true, color: '1f2937'
  })
  
  slide.addText(`${patternsData.length} patrones estratégicos de innovación:`, {
    x: 0.8, y: 1.5, w: 8.5, h: 0.5,
    fontSize: 16, color: '8b5cf6', bold: true
  })
  
  let yPos = 2.3
  for (let index = 0; index < patternsData.length; index++) {
    const pattern = patternsData[index]
    if (pattern.pattern_name?.trim()) {
      slide.addText(`${index + 1}. ${pattern.pattern_name}`, {
        x: 0.8, y: yPos, w: 8.5, h: 0.4,
        fontSize: 16, bold: true, color: '2563eb'
      })
      
      if (pattern.description?.trim()) {
        slide.addText(pattern.description, {
          x: 1, y: yPos + 0.5, w: 8, h: 0.8,
          fontSize: 12, color: '374151'
        })
      }
      
      // Agregar implicaciones del patrón
      slide.addText('→ Aplicación en nuestro proyecto: Diferenciación competitiva y escalabilidad', {
        x: 1, y: yPos + 1.3, w: 8, h: 0.3,
        fontSize: 11, italic: true, color: '16a34a'
      })
      
      yPos += 1.8
      if (yPos > 6) break // Limitar para no exceder el espacio
    }
  }
}

function generatePrototypeSlide(pres: any, prototypeData: any) {
  const slide = pres.addSlide()
  
  slide.addText('Desarrollo del Prototipo', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 30, bold: true, color: '1f2937'
  })
  
  slide.addText(`Tipo de Prototipo: ${prototypeData.prototype_type || 'MVP Inicial'}`, {
    x: 0.8, y: 1.5, w: 8.5, h: 0.5,
    fontSize: 18, bold: true, color: '2563eb'
  })
  
  slide.addText('Descripción Técnica:', {
    x: 0.8, y: 2.3, w: 8.5, h: 0.4,
    fontSize: 16, bold: true, color: '1f2937'
  })
  
  slide.addText(prototypeData.description, {
    x: 0.8, y: 2.8, w: 8.5, h: 2,
    fontSize: 14, color: '374151'
  })
  
  // Objetivos del prototipo
  slide.addText('Objetivos de Validación:', {
    x: 0.8, y: 5.2, w: 8.5, h: 0.4,
    fontSize: 16, bold: true, color: '16a34a'
  })
  
  const objectives = [
    '• Validar viabilidad técnica de la solución',
    '• Obtener feedback temprano de usuarios potenciales',
    '• Identificar mejoras antes del desarrollo completo',
    '• Demostrar el concepto a stakeholders e inversionistas'
  ]
  
  let objYPos = 5.7
  objectives.forEach(obj => {
    slide.addText(obj, {
      x: 0.8, y: objYPos, w: 8.5, h: 0.3,
      fontSize: 12, color: '374151'
    })
    objYPos += 0.35
  })
}

function generateValidationStrategySlide(pres: any, validationData: any) {
  const slide = pres.addSlide()
  
  slide.addText('Estrategia de Validación', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 30, bold: true, color: '1f2937'
  })
  
  slide.addText('Enfoque de Validación:', {
    x: 0.8, y: 1.5, w: 8.5, h: 0.4,
    fontSize: 18, bold: true, color: '16a34a'
  })
  
  slide.addText(validationData.strategy, {
    x: 0.8, y: 2, w: 8.5, h: 1.5,
    fontSize: 14, color: '374151'
  })
  
  if (validationData.methods?.trim()) {
    slide.addText('Métodos de Validación:', {
      x: 0.8, y: 4, w: 8.5, h: 0.4,
      fontSize: 16, bold: true, color: '2563eb'
    })
    
    slide.addText(validationData.methods, {
      x: 0.8, y: 4.5, w: 8.5, h: 1.5,
      fontSize: 14, color: '374151'
    })
  }
  
  // Métricas de éxito
  slide.addText('Indicadores Clave de Validación:', {
    x: 0.8, y: 6.3, w: 8.5, h: 0.4,
    fontSize: 14, bold: true, color: 'ea580c'
  })
  
  slide.addText('Tasa de adopción, satisfacción del usuario, viabilidad comercial y feedback cualitativo', {
    x: 0.8, y: 6.8, w: 8.5, h: 0.5,
    fontSize: 12, color: '374151'
  })
}

function generateEcosystemSlide(pres: any, actorsData: any[]) {
  const slide = pres.addSlide()
  
  slide.addText('Mapa del Ecosistema', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 30, bold: true, color: '1f2937'
  })
  
  slide.addText(`${actorsData.length} actores clave identificados en el ecosistema:`, {
    x: 0.8, y: 1.5, w: 8.5, h: 0.5,
    fontSize: 16, color: '8b5cf6', bold: true
  })
  
  // Categorizar actores por rol si es posible
  const actorsByRole = {}
  actorsData.forEach(actor => {
    const role = actor.role || 'Stakeholder'
    if (!actorsByRole[role]) actorsByRole[role] = []
    actorsByRole[role].push(actor.actor_name)
  })
  
  let yPos = 2.3
  Object.entries(actorsByRole).forEach(([role, actors]: [string, string[]]) => {
    slide.addText(`${role}:`, {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 16, bold: true, color: '2563eb'
    })
    
    slide.addText(actors.filter(Boolean).join(', '), {
      x: 1, y: yPos + 0.4, w: 8, h: 0.6,
      fontSize: 14, color: '374151'
    })
    
    yPos += 1.2
  })
  
  // Análisis del ecosistema
  slide.addText('Análisis del Ecosistema:', {
    x: 0.8, y: 6, w: 8.5, h: 0.4,
    fontSize: 16, bold: true, color: '16a34a'
  })
  
  slide.addText(`Ecosistema diverso con ${actorsData.length} actores que proporcionan apoyo, recursos y canales de distribución para el desarrollo sostenible del proyecto.`, {
    x: 0.8, y: 6.5, w: 8.5, h: 0.8,
    fontSize: 12, color: '374151'
  })
}

function generateSustainabilityReflectionSlide(pres: any, reflectionData: any) {
  const slide = pres.addSlide()
  
  slide.addText('Reflexión sobre Sostenibilidad', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 30, bold: true, color: '1f2937'
  })
  
  slide.addText('Reflexión Estratégica:', {
    x: 0.8, y: 1.5, w: 8.5, h: 0.4,
    fontSize: 18, bold: true, color: '16a34a'
  })
  
  slide.addText(reflectionData.reflection, {
    x: 0.8, y: 2, w: 8.5, h: 2.5,
    fontSize: 14, color: '374151'
  })
  
  if (reflectionData.next_steps?.trim()) {
    slide.addText('Siguientes Pasos Identificados:', {
      x: 0.8, y: 5, w: 8.5, h: 0.4,
      fontSize: 16, bold: true, color: '2563eb'
    })
    
    slide.addText(reflectionData.next_steps, {
      x: 0.8, y: 5.5, w: 8.5, h: 1.5,
      fontSize: 14, color: '374151'
    })
  }
}

// Slides de síntesis final
function generateStrategicAnalysisSlide(pres: any, data: JournalData, analysis: ContentAnalysis) {
  const slide = pres.addSlide()
  
  slide.addText('Análisis Estratégico Integral', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 30, bold: true, color: '1f2937'
  })
  
  // Posición competitiva
  slide.addText('Posición Competitiva:', {
    x: 0.8, y: 1.5, w: 8.5, h: 0.4,
    fontSize: 16, bold: true, color: '2563eb'
  })
  
  const competitiveAdvantages = getCompetitiveAdvantages(data)
  slide.addText(competitiveAdvantages, {
    x: 0.8, y: 2, w: 8.5, h: 1,
    fontSize: 12, color: '374151'
  })
  
  // Readiness del proyecto
  slide.addText(`Madurez del Proyecto: ${analysis.completionPercentage}%`, {
    x: 0.8, y: 3.3, w: 8.5, h: 0.4,
    fontSize: 16, bold: true, color: analysis.completionPercentage > 70 ? '16a34a' : 'ea580c'
  })
  
  // Factores críticos de éxito
  slide.addText('Factores Críticos de Éxito:', {
    x: 0.8, y: 4, w: 8.5, h: 0.4,
    fontSize: 16, bold: true, color: '16a34a'
  })
  
  const successFactors = [
    '• Validación continua con usuarios reales',
    '• Desarrollo iterativo y ágil del producto',
    '• Construcción de alianzas estratégicas',
    '• Medición de impacto sostenible',
    '• Escalabilidad del modelo de negocio'
  ]
  
  let factorYPos = 4.5
  successFactors.forEach(factor => {
    slide.addText(factor, {
      x: 0.8, y: factorYPos, w: 8.5, h: 0.3,
      fontSize: 12, color: '374151'
    })
    factorYPos += 0.35
  })
}

function generateActionPlanSlide(pres: any, data: JournalData, analysis: ContentAnalysis) {
  const slide = pres.addSlide()
  
  slide.addText('Plan de Acción Prioritario', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 30, bold: true, color: '1f2937'
  })
  
  // Próximos 30 días
  slide.addText('Próximos 30 Días (Crítico):', {
    x: 0.8, y: 1.5, w: 8.5, h: 0.4,
    fontSize: 16, bold: true, color: 'dc2626'
  })
  
  const shortTermActions = getShortTermActions(analysis)
  let stYPos = 1.9
  shortTermActions.slice(0, 3).forEach(action => {
    slide.addText(`• ${action}`, {
      x: 0.8, y: stYPos, w: 8.5, h: 0.3,
      fontSize: 12, color: '374151'
    })
    stYPos += 0.35
  })
  
  // Próximos 90 días
  slide.addText('Próximos 90 Días (Estratégico):', {
    x: 0.8, y: 3.5, w: 8.5, h: 0.4,
    fontSize: 16, bold: true, color: 'ea580c'
  })
  
  const mediumTermActions = getMediumTermActions(analysis)
  let mtYPos = 3.9
  mediumTermActions.slice(0, 4).forEach(action => {
    slide.addText(`• ${action}`, {
      x: 0.8, y: mtYPos, w: 8.5, h: 0.3,
      fontSize: 12, color: '374151'
    })
    mtYPos += 0.35
  })
  
  // Hitos clave
  slide.addText('Hitos de Validación (6 meses):', {
    x: 0.8, y: 5.8, w: 8.5, h: 0.4,
    fontSize: 16, bold: true, color: '16a34a'
  })
  
  slide.addText('MVP funcional, 50+ usuarios beta, validación de mercado, plan de escalabilidad', {
    x: 0.8, y: 6.3, w: 8.5, h: 0.6,
    fontSize: 12, color: '374151'
  })
}

// Funciones auxiliares para análisis
function getIdeaEvaluationSummary(idea: any, isSelected: boolean): string {
  if (isSelected) {
    return 'Evaluación: Alta viabilidad + Impacto potencial + Alineación con recursos'
  }
  const hasDescription = idea.description?.trim()
  return hasDescription ? 'Evaluación: Pendiente análisis detallado' : 'Evaluación: Requiere desarrollo conceptual'
}

function getCompetitiveAdvantages(data: JournalData): string {
  const advantages = []
  
  if (data.step1?.length > 1) advantages.push('equipo multidisciplinario')
  if (data.step2?.relevance) advantages.push('problema validado')
  if (data.step8SustainableCanvas) advantages.push('enfoque sostenible')
  if (data.step10Prototype) advantages.push('prototipo desarrollado')
  
  return advantages.length > 0 ?
    `Ventajas competitivas: ${advantages.join(', ')} y conocimiento profundo del mercado objetivo.` :
    'Proyecto en fase temprana con potencial de diferenciación por desarrollar.'
}

function getShortTermActions(analysis: ContentAnalysis): string[] {
  const actions = []
  
  if (!analysis.hasTeamAnalysis) actions.push('Completar mapeo de recursos y capacidades del equipo')
  if (!analysis.hasProblemAnalysis) actions.push('Validar problema con 10+ entrevistas a usuarios potenciales')
  if (!analysis.hasBusinessModel) actions.push('Definir buyer persona y propuesta de valor específica')
  if (analysis.completionPercentage < 50) actions.push('Priorizar completar análisis foundacional')
  
  return actions.length > 0 ? actions : ['Continuar con validación de mercado', 'Desarrollar prototipo funcional', 'Buscar feedback de mentores']
}

function getMediumTermActions(analysis: ContentAnalysis): string[] {
  const actions = []
  
  if (analysis.hasBusinessModel) actions.push('Desarrollar MVP para testing con usuarios reales')
  if (analysis.hasSustainabilityAnalysis) actions.push('Implementar métricas de impacto sostenible')
  if (!analysis.hasPrototypeOrValidation) actions.push('Crear estrategia de validación con clientes')
  
  actions.push('Establecer alianzas estratégicas con actores del ecosistema')
  actions.push('Preparar pitch para inversionistas y programas de aceleración')
  
  return actions
}

// Slide de resumen de sostenibilidad
function generateSustainabilitySummarySlide(pres: any, data: JournalData) {
  const slide = pres.addSlide()
  
  slide.addText('Resumen de Sostenibilidad y Desarrollo', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 28, bold: true, color: '1f2937'
  })
  
  slide.addText('Enfoque Integral de Sostenibilidad del Proyecto:', {
    x: 0.8, y: 1.3, w: 8.5, h: 0.5,
    fontSize: 16, color: '16a34a', bold: true
  })
  
  let yPos = 1.9
  let hasContent = false
  
  // Canvas sostenible
  if (data.step8SustainableCanvas && (
    data.step8SustainableCanvas.social_benefits?.trim() ||
    data.step8SustainableCanvas.environmental_benefits?.trim() ||
    data.step8SustainableCanvas.economic_benefits?.trim()
  )) {
    slide.addText('🌱 Impacto Sostenible Planificado:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 14, bold: true, color: '2563eb'
    })
    
    const impacts = []
    if (data.step8SustainableCanvas.social_benefits?.trim()) impacts.push(`Social: ${data.step8SustainableCanvas.social_benefits.substring(0, 50)}...`)
    if (data.step8SustainableCanvas.environmental_benefits?.trim()) impacts.push(`Ambiental: ${data.step8SustainableCanvas.environmental_benefits.substring(0, 50)}...`)
    if (data.step8SustainableCanvas.economic_benefits?.trim()) impacts.push(`Económico: ${data.step8SustainableCanvas.economic_benefits.substring(0, 50)}...`)
    
    slide.addText(impacts.join(' | '), {
      x: 0.8, y: yPos + 0.4, w: 8.5, h: 0.6,
      fontSize: 11, color: '374151'
    })
    yPos += 1.1
    hasContent = true
  }
  
  // Patrones de innovación
  if (data.step9InnovationPatterns && data.step9InnovationPatterns.length > 0) {
    slide.addText(`🔬 Patrones de Innovación (${data.step9InnovationPatterns.length}):`, {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 14, bold: true, color: '8b5cf6'
    })
    
    const patternNames = data.step9InnovationPatterns
      .filter(p => p.pattern_name?.trim())
      .map(p => p.pattern_name)
      .slice(0, 3)
      .join(', ')
    
    slide.addText(patternNames + (data.step9InnovationPatterns.length > 3 ? '...' : ''), {
      x: 0.8, y: yPos + 0.4, w: 8.5, h: 0.4,
      fontSize: 11, color: '374151'
    })
    yPos += 0.9
    hasContent = true
  }
  
  // Prototipo
  if (data.step10Prototype && (data.step10Prototype.description?.trim() || data.step10Prototype.prototype_type?.trim())) {
    slide.addText('🛠️ Desarrollo de Prototipo:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 14, bold: true, color: 'ea580c'
    })
    
    const prototypeInfo = data.step10Prototype.prototype_type || 'MVP inicial'
    slide.addText(`Tipo: ${prototypeInfo} - ${(data.step10Prototype.description || 'En desarrollo').substring(0, 80)}...`, {
      x: 0.8, y: yPos + 0.4, w: 8.5, h: 0.4,
      fontSize: 11, color: '374151'
    })
    yPos += 0.9
    hasContent = true
  }
  
  // Validación y ecosistema
  if (data.step11ValidationStrategy || data.step12EcosystemActors) {
    slide.addText('✅ Validación y Ecosistema:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 14, bold: true, color: '16a34a'
    })
    
    const validationInfo = []
    if (data.step11ValidationStrategy?.strategy?.trim()) {
      validationInfo.push(`Estrategia: ${data.step11ValidationStrategy.strategy.substring(0, 40)}...`)
    }
    if (data.step12EcosystemActors?.length > 0) {
      validationInfo.push(`${data.step12EcosystemActors.length} actores del ecosistema`)
    }
    
    slide.addText(validationInfo.join(' | '), {
      x: 0.8, y: yPos + 0.4, w: 8.5, h: 0.4,
      fontSize: 11, color: '374151'
    })
    yPos += 0.9
    hasContent = true
  }
  
  // Reflexión de sostenibilidad
  if (data.step13SustainabilityReflection?.reflection?.trim()) {
    slide.addText('💭 Reflexión Estratégica:', {
      x: 0.8, y: yPos, w: 8.5, h: 0.4,
      fontSize: 14, bold: true, color: '6b7280'
    })
    
    slide.addText(data.step13SustainabilityReflection.reflection.substring(0, 100) + '...', {
      x: 0.8, y: yPos + 0.4, w: 8.5, h: 0.6,
      fontSize: 11, color: '374151'
    })
    hasContent = true
  }
  
  if (!hasContent) {
    slide.addText('Análisis de sostenibilidad en desarrollo...', {
      x: 0.8, y: 2.5, w: 8.5, h: 0.5,
      fontSize: 14, italic: true, color: '6b7280'
    })
    
    slide.addText('Este proyecto incluye un enfoque de sostenibilidad integral que considera impacto social, ambiental y económico.', {
      x: 0.8, y: 3.2, w: 8.5, h: 0.8,
      fontSize: 12, color: '374151'
    })
  }
}