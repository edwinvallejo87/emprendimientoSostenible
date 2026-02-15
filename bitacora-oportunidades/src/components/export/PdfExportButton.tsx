import { useState } from 'react'
import { FileDown, Loader2, FileText, Download } from 'lucide-react'
import { useJournalStore } from '../../store/journal'
import { generateComprehensivePDF } from '../../lib/pdf/comprehensivePdfGenerator'

interface PdfExportButtonProps {
  disabled?: boolean
}

export default function PdfExportButton({ disabled = false }: PdfExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const {
    currentJournal,
    currentTeam,
    currentIdea,
    step1Data,
    step2Data,
    step3Data,
    step4Data,
    step4EvaluationData,
    step5BuyerData,
    step5VPData,
    // Sustainability data
    sustainableCanvasData,
    innovationPatternsData,
    prototypeData,
    validationStrategyData,
    ecosystemActorsData,
    sustainabilityReflectionData,
  } = useJournalStore()

  const handleExport = async () => {
    if (!currentJournal || disabled) return

    setIsExporting(true)
    try {
      console.log('🔥 DEBUGGING PDF EXPORT BUTTON DATA:')
      console.log('- step4EvaluationData:', step4EvaluationData)
      console.log('- sustainableCanvasData:', sustainableCanvasData)
      console.log('- innovationPatternsData:', innovationPatternsData)
      console.log('- prototypeData:', prototypeData)
      console.log('- validationStrategyData:', validationStrategyData)
      console.log('- ecosystemActorsData:', ecosystemActorsData)
      console.log('- sustainabilityReflectionData:', sustainabilityReflectionData)

      const journalData = {
        journal: currentJournal,
        team: currentTeam,
        idea: currentIdea,
        // Effectual analysis data (steps 1-5)
        step1: step1Data,
        step2: step2Data,
        step3: step3Data,
        step4: step4Data,
        step4EvaluationData: step4EvaluationData, // Agregamos los datos de evaluación SWOT
        step5Buyer: step5BuyerData,
        step5VP: step5VPData,
        // Sustainability data (steps 8-13)
        step8SustainableCanvas: sustainableCanvasData,
        step9InnovationPatterns: innovationPatternsData,
        step10Prototype: prototypeData,
        step11ValidationStrategy: validationStrategyData,
        step12EcosystemActors: ecosystemActorsData,
        step13SustainabilityReflection: sustainabilityReflectionData,
      }

      await generateComprehensivePDF(journalData)
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Error al generar el PDF. Por favor intenta de nuevo.')
    } finally {
      setIsExporting(false)
    }
  }

  if (!currentJournal) {
    return null
  }

  return (
    <button
      onClick={handleExport}
      disabled={disabled || isExporting}
      className={`
        flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
        ${disabled 
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
          : 'bg-green-600 text-white hover:bg-green-700'
        }
        ${isExporting ? 'opacity-75' : ''}
      `}
      title={disabled ? 'Completa todos los pasos para exportar' : 'Exportar bitácora completa como PDF'}
    >
      {isExporting ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <FileText size={20} />
      )}
      <span>
        {isExporting 
          ? 'Generando PDF...' 
          : 'Exportar PDF Completo 📄'
        }
      </span>
    </button>
  )
}