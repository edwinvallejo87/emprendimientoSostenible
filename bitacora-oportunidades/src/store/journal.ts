import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import { debounce } from '../lib/utils'
import type { Database } from '../lib/database.types'

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
  
  // Auto-save functions
  saveStep1Data: (journalId: string, memberId: string, data: Partial<Step1Data>) => Promise<void>
  saveStep2Data: (journalId: string, data: Partial<Step2Data>) => Promise<void>
  saveStep3Data: (journalId: string, trends: Partial<Step3Data>[]) => Promise<void>
  saveStep4Data: (journalId: string, ideas: Partial<Step4Data>[]) => Promise<void>
  saveStep5BuyerData: (journalId: string, data: Partial<Step5BuyerData>) => Promise<void>
  saveStep5VPData: (journalId: string, data: Partial<Step5VPData>) => Promise<void>
  
  // Real-time updates
  subscribeToJournal: (journalId: string) => void
  unsubscribeFromJournal: () => void
}

const debouncedSave = debounce(async (fn: () => Promise<void>) => {
  await fn()
}, 600)

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
        try {
          // First, get teams where user is owner
          const { data: ownedTeams, error: ownedError } = await supabase
            .from('teams')
            .select('*')
            .eq('created_by', (await supabase.auth.getUser()).data.user?.id)
            .order('created_at', { ascending: false })

          if (ownedError) throw ownedError

          // Then, get teams where user is member
          const { data: memberTeams, error: memberError } = await supabase
            .from('team_members')
            .select(`
              teams(*)
            `)
            .eq('user_id', (await supabase.auth.getUser()).data.user?.id)

          if (memberError) throw memberError

          // Combine and deduplicate teams
          const allTeams = [
            ...(ownedTeams || []),
            ...(memberTeams?.map(m => m.teams).filter(Boolean) || [])
          ]
          
          // Remove duplicates by id
          const uniqueTeams = allTeams.filter((team, index, self) => 
            index === self.findIndex(t => t.id === team.id)
          )

          set({ teams: uniqueTeams, loading: false })
        } catch (error) {
          console.error('Error loading teams:', error)
          set({ teams: [], loading: false })
        }
      },

      loadJournals: async (teamId: string) => {
        set({ loading: true })
        try {
          const { data, error } = await supabase
            .from('journals')
            .select('*')
            .eq('team_id', teamId)
            .order('updated_at', { ascending: false })

          if (error) throw error
          set({ journals: data || [], loading: false })
        } catch (error) {
          console.error('Error loading journals:', error)
          set({ loading: false })
        }
      },

      loadJournalData: async (journalId: string) => {
        set({ loading: true })
        try {
          const [step1Result, step2Result, step3Result, step4Result, step5BuyerResult, step5VPResult] = await Promise.all([
            supabase.from('step1_means').select('*').eq('journal_id', journalId),
            supabase.from('step2_problem').select('*').eq('journal_id', journalId).single(),
            supabase.from('step3_trends').select('*').eq('journal_id', journalId).order('created_at'),
            supabase.from('step4_ideas').select('*').eq('journal_id', journalId).order('created_at'),
            supabase.from('step5_buyer').select('*').eq('journal_id', journalId).single(),
            supabase.from('step5_vpcanvas').select('*').eq('journal_id', journalId).single(),
          ])

          set({
            step1Data: step1Result.data || [],
            step2Data: step2Result.data || null,
            step3Data: step3Result.data || [],
            step4Data: step4Result.data || [],
            step5BuyerData: step5BuyerResult.data || null,
            step5VPData: step5VPResult.data || null,
            loading: false,
          })
        } catch (error) {
          console.error('Error loading journal data:', error)
          set({ loading: false })
        }
      },

      createTeam: async (name: string) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Usuario no autenticado')
        
        const { data, error } = await supabase
          .from('teams')
          .insert({ 
            name, 
            created_by: user.id 
          })
          .select()
          .single()

        if (error) throw error

        // Add current user as owner in team_members
        const { error: memberError } = await supabase
          .from('team_members')
          .insert({
            team_id: data.id,
            user_id: user.id,
            role: 'owner'
          })
        
        if (memberError) {
          console.error('Error adding team member:', memberError)
          // Don't throw here, team was created successfully
        }

        await get().loadTeams()
        return data
      },

      createJournal: async (teamId: string, title: string) => {
        const { data, error } = await supabase
          .from('journals')
          .insert({ team_id: teamId, title })
          .select()
          .single()

        if (error) throw error
        await get().loadJournals(teamId)
        return data
      },

      saveStep1Data: async (journalId: string, memberId: string, data: Partial<Step1Data>) => {
        set({ saving: true })
        try {
          const { error } = await supabase
            .from('step1_means')
            .upsert({
              journal_id: journalId,
              member_id: memberId,
              ...data
            })

          if (error) throw error
          await get().loadJournalData(journalId)
        } catch (error) {
          console.error('Error saving step 1 data:', error)
        } finally {
          set({ saving: false })
        }
      },

      saveStep2Data: async (journalId: string, data: Partial<Step2Data>) => {
        set({ saving: true })
        try {
          const { error } = await supabase
            .from('step2_problem')
            .upsert({
              journal_id: journalId,
              ...data
            })

          if (error) throw error
          await get().loadJournalData(journalId)
        } catch (error) {
          console.error('Error saving step 2 data:', error)
        } finally {
          set({ saving: false })
        }
      },

      saveStep3Data: async (journalId: string, trends: Partial<Step3Data>[]) => {
        set({ saving: true })
        try {
          // Delete existing trends
          await supabase
            .from('step3_trends')
            .delete()
            .eq('journal_id', journalId)

          // Insert new trends
          if (trends.length > 0) {
            const { error } = await supabase
              .from('step3_trends')
              .insert(trends.map(trend => ({
                journal_id: journalId,
                ...trend
              })))

            if (error) throw error
          }

          await get().loadJournalData(journalId)
        } catch (error) {
          console.error('Error saving step 3 data:', error)
        } finally {
          set({ saving: false })
        }
      },

      saveStep4Data: async (journalId: string, ideas: Partial<Step4Data>[]) => {
        set({ saving: true })
        try {
          // Delete existing ideas
          await supabase
            .from('step4_ideas')
            .delete()
            .eq('journal_id', journalId)

          // Insert new ideas
          if (ideas.length > 0) {
            const { error } = await supabase
              .from('step4_ideas')
              .insert(ideas.map(idea => ({
                journal_id: journalId,
                ...idea
              })))

            if (error) throw error
          }

          await get().loadJournalData(journalId)
        } catch (error) {
          console.error('Error saving step 4 data:', error)
        } finally {
          set({ saving: false })
        }
      },

      saveStep5BuyerData: async (journalId: string, data: Partial<Step5BuyerData>) => {
        set({ saving: true })
        try {
          const { error } = await supabase
            .from('step5_buyer')
            .upsert({
              journal_id: journalId,
              ...data
            })

          if (error) throw error
          await get().loadJournalData(journalId)
        } catch (error) {
          console.error('Error saving step 5 buyer data:', error)
        } finally {
          set({ saving: false })
        }
      },

      saveStep5VPData: async (journalId: string, data: Partial<Step5VPData>) => {
        set({ saving: true })
        try {
          const { error } = await supabase
            .from('step5_vpcanvas')
            .upsert({
              journal_id: journalId,
              ...data
            })

          if (error) throw error
          await get().loadJournalData(journalId)
        } catch (error) {
          console.error('Error saving step 5 VP data:', error)
        } finally {
          set({ saving: false })
        }
      },

      subscribeToJournal: (journalId: string) => {
        // Subscribe to real-time updates for the journal
        supabase
          .channel(`journal-${journalId}`)
          .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'step1_means', filter: `journal_id=eq.${journalId}` },
            () => get().loadJournalData(journalId)
          )
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'step2_problem', filter: `journal_id=eq.${journalId}` },
            () => get().loadJournalData(journalId)
          )
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'step3_trends', filter: `journal_id=eq.${journalId}` },
            () => get().loadJournalData(journalId)
          )
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'step4_ideas', filter: `journal_id=eq.${journalId}` },
            () => get().loadJournalData(journalId)
          )
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'step5_buyer', filter: `journal_id=eq.${journalId}` },
            () => get().loadJournalData(journalId)
          )
          .on('postgres_changes',
            { event: '*', schema: 'public', table: 'step5_vpcanvas', filter: `journal_id=eq.${journalId}` },
            () => get().loadJournalData(journalId)
          )
          .subscribe()
      },

      unsubscribeFromJournal: () => {
        supabase.removeAllChannels()
      },
    }),
    {
      name: 'journal-storage',
      partialize: (state) => ({
        currentTeam: state.currentTeam,
        currentJournal: state.currentJournal,
      })
    }
  )
)