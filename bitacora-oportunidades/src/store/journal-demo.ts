import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Database } from '../lib/database.types'
import { 
  demoTeams, 
  demoJournals, 
  demoStep1Data, 
  demoStep2Data, 
  demoStep3Data, 
  demoStep4Data, 
  demoStep5BuyerData, 
  demoStep5VPData 
} from './demo-data'

type Tables = Database['public']['Tables']
type Team = Tables['teams']['Row']
type Journal = Tables['journals']['Row']
type Step1Data = Tables['step1_means']['Row']
type Step2Data = Tables['step2_problem']['Row']
type Step3Data = Tables['step3_trends']['Row']
type Step4Data = Tables['step4_ideas']['Row']
type Step5BuyerData = Tables['step5_buyer']['Row']
type Step5VPData = Tables['step5_vpcanvas']['Row']

interface JournalState {
  // Current selection
  currentTeam: Team | null
  currentJournal: Journal | null
  
  // Data
  teams: Team[]
  journals: Journal[]
  step1Data: Step1Data[]
  step2Data: Step2Data | null
  step3Data: Step3Data[]
  step4Data: Step4Data[]
  step5BuyerData: Step5BuyerData | null
  step5VPData: Step5VPData | null
  
  // Loading states
  loading: boolean
  saving: boolean
  
  // Actions
  setCurrentTeam: (team: Team | null) => void
  setCurrentJournal: (journal: Journal | null) => void
  loadTeams: () => Promise<void>
  loadJournals: (teamId: string) => Promise<void>
  loadJournalData: (journalId: string) => Promise<void>
  createTeam: (name: string) => Promise<Team>
  createJournal: (teamId: string, title: string) => Promise<Journal>
  
  // Auto-save functions (demo mode - just update local state)
  saveStep1Data: (journalId: string, memberId: string, data: Partial<Step1Data>) => Promise<void>
  saveStep2Data: (journalId: string, data: Partial<Step2Data>) => Promise<void>
  saveStep3Data: (journalId: string, trends: Partial<Step3Data>[]) => Promise<void>
  saveStep4Data: (journalId: string, ideas: Partial<Step4Data>[]) => Promise<void>
  saveStep5BuyerData: (journalId: string, data: Partial<Step5BuyerData>) => Promise<void>
  saveStep5VPData: (journalId: string, data: Partial<Step5VPData>) => Promise<void>
  
  // Real-time updates (no-op in demo)
  subscribeToJournal: (journalId: string) => void
  unsubscribeFromJournal: () => void
}

// Simulate async delays for realistic feel
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentTeam: null,
      currentJournal: null,
      teams: [],
      journals: [],
      step1Data: [],
      step2Data: null,
      step3Data: [],
      step4Data: [],
      step5BuyerData: null,
      step5VPData: null,
      loading: false,
      saving: false,

      setCurrentTeam: (team) => set({ currentTeam: team }),
      setCurrentJournal: (journal) => set({ currentJournal: journal }),

      loadTeams: async () => {
        set({ loading: true })
        await delay(500) // Simulate network delay
        set({ teams: demoTeams as Team[], loading: false })
      },

      loadJournals: async (teamId: string) => {
        set({ loading: true })
        await delay(300)
        const filteredJournals = demoJournals.filter(j => j.team_id === teamId)
        set({ journals: filteredJournals as Journal[], loading: false })
      },

      loadJournalData: async (journalId: string) => {
        set({ loading: true })
        await delay(400)
        
        // Load demo data for the specific journal
        const step1 = journalId === 'journal-1' ? demoStep1Data : []
        const step2 = journalId === 'journal-1' ? demoStep2Data : null
        const step3 = journalId === 'journal-1' ? demoStep3Data : []
        const step4 = journalId === 'journal-1' ? demoStep4Data : []
        const step5Buyer = journalId === 'journal-1' ? demoStep5BuyerData : null
        const step5VP = journalId === 'journal-1' ? demoStep5VPData : null
        
        set({
          step1Data: step1 as Step1Data[],
          step2Data: step2 as Step2Data | null,
          step3Data: step3 as Step3Data[],
          step4Data: step4 as Step4Data[],
          step5BuyerData: step5Buyer as Step5BuyerData | null,
          step5VPData: step5VP as Step5VPData | null,
          loading: false,
        })
      },

      createTeam: async (name: string) => {
        const newTeam = {
          id: `team-${Date.now()}`,
          name,
          created_by: 'demo-user-123',
          created_at: new Date().toISOString()
        } as Team

        const currentTeams = get().teams
        set({ teams: [...currentTeams, newTeam] })
        return newTeam
      },

      createJournal: async (teamId: string, title: string) => {
        const newJournal = {
          id: `journal-${Date.now()}`,
          team_id: teamId,
          title,
          status: 'draft' as const,
          progress: 0,
          updated_at: new Date().toISOString()
        } as Journal

        const currentJournals = get().journals
        set({ journals: [...currentJournals, newJournal] })
        return newJournal
      },

      saveStep1Data: async (journalId: string, memberId: string, data: Partial<Step1Data>) => {
        set({ saving: true })
        await delay(200)
        
        const currentData = get().step1Data
        const existingIndex = currentData.findIndex(d => d.journal_id === journalId && d.member_id === memberId)
        
        if (existingIndex >= 0) {
          // Check if data actually changed to avoid unnecessary updates
          const existing = currentData[existingIndex]
          const hasChanges = Object.keys(data).some(key => 
            existing[key as keyof Step1Data] !== data[key as keyof Partial<Step1Data>]
          )
          
          if (hasChanges) {
            const updated = [...currentData]
            updated[existingIndex] = { 
              ...updated[existingIndex], 
              ...data,
              updated_at: new Date().toISOString()
            }
            set({ step1Data: updated })
          }
        } else {
          // Only create if there's actual data
          const hasData = Object.values(data).some(value => value && value.toString().trim().length > 0)
          if (hasData) {
            const newData = {
              id: `step1-${Date.now()}`,
              journal_id: journalId,
              member_id: memberId,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              who_i_am: '',
              what_i_know: '',
              who_i_know: '',
              what_i_have: '',
              ...data
            } as Step1Data
            set({ step1Data: [...currentData, newData] })
          }
        }
        
        set({ saving: false })
      },

      saveStep2Data: async (journalId: string, data: Partial<Step2Data>) => {
        set({ saving: true })
        await delay(200)
        
        const updatedData = {
          id: `step2-${journalId}`,
          journal_id: journalId,
          updated_at: new Date().toISOString(),
          ...data
        } as Step2Data
        
        set({ step2Data: updatedData, saving: false })
      },

      saveStep3Data: async (journalId: string, trends: Partial<Step3Data>[]) => {
        set({ saving: true })
        await delay(300)
        
        const updatedTrends = trends.map((trend, index) => ({
          id: `trend-${journalId}-${index}`,
          journal_id: journalId,
          created_at: new Date().toISOString(),
          ...trend
        })) as Step3Data[]
        
        set({ step3Data: updatedTrends, saving: false })
      },

      saveStep4Data: async (journalId: string, ideas: Partial<Step4Data>[]) => {
        set({ saving: true })
        await delay(300)
        
        const updatedIdeas = ideas.map((idea, index) => ({
          id: `idea-${journalId}-${index}`,
          journal_id: journalId,
          created_at: new Date().toISOString(),
          ...idea
        })) as Step4Data[]
        
        set({ step4Data: updatedIdeas, saving: false })
      },

      saveStep5BuyerData: async (journalId: string, data: Partial<Step5BuyerData>) => {
        set({ saving: true })
        await delay(200)
        
        const updatedData = {
          id: `buyer-${journalId}`,
          journal_id: journalId,
          updated_at: new Date().toISOString(),
          ...data
        } as Step5BuyerData
        
        set({ step5BuyerData: updatedData, saving: false })
      },

      saveStep5VPData: async (journalId: string, data: Partial<Step5VPData>) => {
        set({ saving: true })
        await delay(200)
        
        const updatedData = {
          id: `vp-${journalId}`,
          journal_id: journalId,
          updated_at: new Date().toISOString(),
          ...data
        } as Step5VPData
        
        set({ step5VPData: updatedData, saving: false })
      },

      subscribeToJournal: (journalId: string) => {
        // No-op in demo mode
        console.log(`Demo: Subscribed to journal ${journalId}`)
      },

      unsubscribeFromJournal: () => {
        // No-op in demo mode
        console.log('Demo: Unsubscribed from journal')
      },
    }),
    {
      name: 'journal-demo-storage',
      partialize: (state) => ({
        currentTeam: state.currentTeam,
        currentJournal: state.currentJournal,
      })
    }
  )
)