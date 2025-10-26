import { CheckCircle, Circle, Lock } from 'lucide-react'
import { getProgressColor, getProgressBgColor } from '../../lib/progress/calcProgress'
import type { StepProgress } from '../../lib/progress/calcProgress'

interface ProgressBadgeProps {
  stepProgress: StepProgress
}

export default function ProgressBadge({ stepProgress }: ProgressBadgeProps) {
  const { step, completed, progress, locked } = stepProgress

  const getIcon = () => {
    if (locked) return <Lock className="h-5 w-5 text-gray-400" />
    if (completed) return <CheckCircle className="h-5 w-5 text-green-600" />
    return <Circle className="h-5 w-5 text-gray-400" />
  }

  const getStatusText = () => {
    if (locked) return 'Bloqueado'
    if (completed) return 'Completado'
    if (progress === 0) return 'Sin iniciar'
    return 'En progreso'
  }

  return (
    <div className={`flex items-center space-x-3 p-3 rounded-lg ${getProgressBgColor(progress)}`}>
      {getIcon()}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-900">Paso {step}</span>
          <span className={`text-sm font-medium ${getProgressColor(progress)}`}>
            {progress}%
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-sm text-gray-600">{getStatusText()}</span>
          {!locked && (
            <div className="w-20 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  completed ? 'bg-green-500' : 'bg-primary-500'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}