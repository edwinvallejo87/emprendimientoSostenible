import PptxExportButton from './PptxExportButton'
import PdfExportButton from './PdfExportButton'

interface ExportButtonsProps {
  disabled?: boolean
}

export default function ExportButtons({ disabled = false }: ExportButtonsProps) {
  return (
    <div className="flex justify-center gap-4">
      <PdfExportButton disabled={disabled} />
      <PptxExportButton disabled={disabled} />
    </div>
  )
}