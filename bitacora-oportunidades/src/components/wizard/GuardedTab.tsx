import { Lock } from 'lucide-react'
import type { StepProgress } from '../../lib/progress/calcProgress'

interface GuardedTabProps {
  stepProgress: StepProgress
  isActive: boolean
  onClick: () => void
  title: string
}

export default function GuardedTab({ stepProgress, isActive, onClick, title }: GuardedTabProps) {
  const { step, completed, progress, locked } = stepProgress

  const handleClick = () => {
    if (!locked) {
      onClick()
    }
  }

  const getProgressColor = () => {
    if (locked) return 'text-gray-400'
    if (completed) return 'text-green-600'
    if (progress > 0) return 'text-yellow-600'
    return 'text-gray-500'
  }

  const getBorderColor = () => {
    if (isActive && !locked) return 'border-primary-500'
    if (locked) return 'border-gray-200'
    if (completed) return 'border-green-300'
    return 'border-gray-300'
  }

  const getBgColor = () => {
    if (isActive && !locked) return 'bg-primary-50'
    if (locked) return 'bg-gray-50'
    if (completed) return 'bg-green-50'
    return 'bg-white'
  }

  return (
    <button
      onClick={handleClick}
      disabled={locked}
      className={`
        relative flex items-center justify-between w-full p-4 text-left border-2 rounded-lg transition-all
        ${getBorderColor()} ${getBgColor()}
        ${locked ? 'cursor-not-allowed opacity-60' : 'hover:shadow-md cursor-pointer'}
      `}
    >
      <div className="flex items-center space-x-3">
        <div className={`
          flex items-center justify-center w-8 h-8 rounded-full border-2
          ${locked ? 'border-gray-300 bg-gray-100' : 
            completed ? 'border-green-500 bg-green-100' :
            isActive ? 'border-primary-500 bg-primary-100' : 'border-gray-300 bg-gray-100'}
        `}>
          {locked ? (
            <Lock className="h-4 w-4 text-gray-400" />
          ) : (
            <span className={`text-sm font-bold ${getProgressColor()}`}>
              {step}
            </span>
          )}
        </div>
        
        <div>
          <h3 className={`font-medium ${locked ? 'text-gray-400' : 'text-gray-900'}`}>
            {title}
          </h3>
          <p className={`text-sm ${getProgressColor()}`}>
            {locked ? 'Bloqueado' : completed ? 'Completado' : `${progress}% completado`}
          </p>
        </div>
      </div>

      {!locked && (
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                completed ? 'bg-green-500' : 'bg-primary-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={`text-xs font-medium w-8 ${getProgressColor()}`}>
            {progress}%
          </span>
        </div>
      )}
    </button>
  )
}