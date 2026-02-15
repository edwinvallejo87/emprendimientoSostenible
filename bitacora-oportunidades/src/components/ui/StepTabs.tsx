import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'

export interface TabConfig {
  id: string
  label: string
  icon?: LucideIcon
  component: React.ReactNode
  completed?: boolean
}

interface StepTabsProps {
  tabs: TabConfig[]
  defaultTab?: string
}

export default function StepTabs({ tabs, defaultTab }: StepTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const activeContent = tabs.find(t => t.id === activeTab)?.component

  return (
    <div>
      {/* Tab Bar */}
      <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm mb-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                isActive
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {tab.label}
              {tab.completed && (
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  isActive
                    ? 'bg-green-400 ring-2 ring-green-400/30'
                    : 'bg-green-500 ring-2 ring-green-500/20'
                }`} />
              )}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white/40 rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeContent}
      </div>
    </div>
  )
}
