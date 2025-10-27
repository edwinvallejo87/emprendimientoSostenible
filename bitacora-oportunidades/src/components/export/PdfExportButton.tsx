import { useState } from 'react'
import { FileDown, Loader2 } from 'lucide-react'
import { useJournalStore } from '../../store/journal'
import { generatePDF } from '../../lib/pdf/generatePdf'

interface PdfExportButtonProps {
  disabled?: boolean
}

export default function PdfExportButton({ disabled = false }: PdfExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const {
    currentJournal,
    currentTeam,
    step1Data,
    step2Data,
    step3Data,
    step4Data,
    step5BuyerData,
    step5VPData,
  } = useJournalStore()

  const handleExport = async () => {
    if (!currentJournal || !currentTeam || disabled) return

    setIsExporting(true)
    try {
      const journalData = {
        journal: currentJournal,
        team: currentTeam,
        step1: step1Data,
        step2: step2Data,
        step3: step3Data,
        step4: step4Data,
        step5Buyer: step5BuyerData,
        step5VP: step5VPData,
      }

      await generatePDF(journalData)
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Error al generar el PDF. Por favor intenta de nuevo.')
    } finally {
      setIsExporting(false)
    }
  }

  if (!currentJournal || !currentTeam) {
    return null
  }

  return (
    <button
      onClick={handleExport}
      disabled={disabled || isExporting}
      className={`
        flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
        ${disabled 
          ? 'bg-stone-200 text-stone-500 cursor-not-allowed' 
          : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
        }
        ${isExporting ? 'opacity-75' : ''}
      `}
      title={disabled ? 'Completa todos los pasos para exportar' : 'Exportar bitácora a PDF'}
    >
      {isExporting ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <FileDown size={20} />
      )}
      <span>
        {isExporting ? 'Generando PDF...' : 'Exportar PDF'}
      </span>
    </button>
  )
}