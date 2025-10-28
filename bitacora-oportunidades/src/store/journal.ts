import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'
import { debounce } from '../lib/utils'
import type { Database } from '../lib/database.types'

type Tables = Database['public']['Tables']
type Team = Tables['teams']['Row']
type Journal = Tables['journals']['Row']
type Idea = Tables['ideas']['Row']
type Step1Data = Tables['step1_means']['Row']
type Step2Data = Tables['step2_problem']['Row']
type Step3Data = Tables['step3_trends']['Row']
type Step4Data = Tables['step4_ideas']['Row']
type Step4EvaluationData = Tables['step4_idea_evaluation']['Row']
type Step5BuyerData = Tables['step5_buyer']['Row']
type Step5VPData = Tables['step5_vpcanvas']['Row']

interface JournalState {
  // Current selection
  currentTeam: Team | null
  currentJournal: Journal | null
  currentIdea: Idea | null
  
  // Data
  teams: Team[]
  journals: Journal[]
  ideas: Idea[]
  step1Data: Step1Data[]
  step2Data: Step2Data | null
  step3Data: Step3Data[]
  step4Data: Step4Data[]
  step4EvaluationData: Step4EvaluationData | null
  step5BuyerData: Step5BuyerData | null
  step5VPData: Step5VPData | null
  
  // Loading states
  loading: boolean
  saving: boolean
  
  // Actions
  setCurrentTeam: (team: Team | null) => void
  setCurrentJournal: (journal: Journal | null) => void
  setCurrentIdea: (idea: Idea | null) => void
  loadTeams: () => Promise<void>
  loadJournals: (teamId: string) => Promise<void>
  loadIdeas: (journalId: string) => Promise<void>
  loadJournalData: (journalId: string) => Promise<void>
  loadIdeaData: (ideaId: string) => Promise<void>
  createTeam: (name: string) => Promise<Team>
  createJournal: (teamId: string, title: string) => Promise<Journal>
  createIdea: (journalId: string, ideaData: Partial<Idea>) => Promise<Idea>
  deleteTeam: (teamId: string) => Promise<void>
  deleteJournal: (journalId: string) => Promise<void>
  deleteIdea: (ideaId: string) => Promise<void>
  
  // Auto-save functions
  saveStep1Data: (journalId: string, memberId: string, data: Partial<Step1Data>) => Promise<void>
  saveStep1DataForIdea: (ideaId: string, memberId: string, data: Partial<Step1Data>) => Promise<void>
  saveStep2Data: (journalId: string, data: Partial<Step2Data>) => Promise<void>
  saveStep2DataForIdea: (ideaId: string, data: Partial<Step2Data>) => Promise<void>
  saveStep3Data: (journalId: string, trends: Partial<Step3Data>[]) => Promise<void>
  saveStep3DataForIdea: (ideaId: string, trends: Partial<Step3Data>[]) => Promise<void>
  saveStep4Data: (journalId: string, ideas: Partial<Step4Data>[]) => Promise<void>
  saveStep4EvaluationData: (ideaId: string, data: Partial<Step4EvaluationData>) => Promise<void>
  saveStep5BuyerData: (journalId: string, data: Partial<Step5BuyerData>) => Promise<void>
  saveStep5BuyerDataForIdea: (ideaId: string, data: Partial<Step5BuyerData>) => Promise<void>
  saveStep5VPData: (journalId: string, data: Partial<Step5VPData>) => Promise<void>
  saveStep5VPDataForIdea: (ideaId: string, data: Partial<Step5VPData>) => Promise<void>
  
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
        currentIdea: null,
      teams: [],
      journals: [],
      ideas: [],
      step1Data: [],
      step2Data: null,
      step3Data: [],
      step4Data: [],
      step4EvaluationData: null,
      step5BuyerData: null,
      step5VPData: null,
      loading: false,
      saving: false,

      setCurrentTeam: (team) => set({ currentTeam: team }),
      setCurrentJournal: (journal) => set({ currentJournal: journal }),
      setCurrentIdea: (idea) => set({ currentIdea: idea }),

      loadTeams: async () => {
        set({ loading: true })
        try {
          // For development: get all teams without auth
          const { data, error } = await supabase
            .from('teams')
            .select('*')
            .order('created_at', { ascending: false })

          if (error) throw error
          set({ teams: data || [], loading: false })
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

      loadIdeas: async (journalId: string) => {
        set({ loading: true })
        try {
          const { data, error } = await supabase
            .from('ideas')
            .select('*')
            .eq('journal_id', journalId)
            .order('created_at', { ascending: false })

          if (error) throw error
          set({ ideas: data || [], loading: false })
        } catch (error) {
          console.error('Error loading ideas:', error)
          set({ loading: false })
        }
      },

      loadJournalData: async (journalId: string) => {
        set({ loading: true })
        try {
          const [step1Result, step2Result, step3Result, step4Result, step5BuyerResult, step5VPResult] = await Promise.all([
            supabase.from('step1_means').select('*').eq('journal_id', journalId),
            supabase.from('step2_problem').select('*').eq('journal_id', journalId).maybeSingle(),
            supabase.from('step3_trends').select('*').eq('journal_id', journalId).order('created_at'),
            supabase.from('step4_ideas').select('*').eq('journal_id', journalId).order('created_at'),
            supabase.from('step5_buyer').select('*').eq('journal_id', journalId).maybeSingle(),
            supabase.from('step5_vpcanvas').select('*').eq('journal_id', journalId).maybeSingle(),
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

      loadIdeaData: async (ideaId: string) => {
        set({ loading: true })
        try {
          const [step1Result, step2Result, step3Result, step4EvalResult, step5BuyerResult, step5VPResult] = await Promise.all([
            supabase.from('step1_means').select('*').eq('idea_id', ideaId),
            supabase.from('step2_problem').select('*').eq('idea_id', ideaId).maybeSingle(),
            supabase.from('step3_trends').select('*').eq('idea_id', ideaId).order('created_at'),
            supabase.from('step4_idea_evaluation').select('*').eq('idea_id', ideaId).maybeSingle(),
            supabase.from('step5_buyer').select('*').eq('idea_id', ideaId).maybeSingle(),
            supabase.from('step5_vpcanvas').select('*').eq('idea_id', ideaId).maybeSingle(),
          ])

          set({
            step1Data: step1Result.data || [],
            step2Data: step2Result.data || null,
            step3Data: step3Result.data || [],
            step4EvaluationData: step4EvalResult.data || null,
            step5BuyerData: step5BuyerResult.data || null,
            step5VPData: step5VPResult.data || null,
            loading: false,
          })
        } catch (error) {
          console.error('Error loading idea data:', error)
          set({ loading: false })
        }
      },

      createTeam: async (name: string) => {
        const { data, error } = await supabase
          .from('teams')
          .insert({ 
            name 
            // Skip created_by for now
          })
          .select()
          .single()

        if (error) throw error

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
        
        // Set the new journal as current
        set({ currentJournal: data })
        
        // Reload journals to update the list
        await get().loadJournals(teamId)
        
        return data
      },

      createIdea: async (journalId: string, ideaData: Partial<Idea>) => {
        const { data, error } = await supabase
          .from('ideas')
          .insert({ 
            journal_id: journalId,
            ...ideaData
          })
          .select()
          .single()

        if (error) throw error
        
        // Set the new idea as current
        set({ currentIdea: data })
        
        // Reload ideas to update the list
        await get().loadIdeas(journalId)
        
        return data
      },

      deleteTeam: async (teamId: string) => {
        const { error } = await supabase
          .from('teams')
          .delete()
          .eq('id', teamId)

        if (error) throw error

        // Update local state
        const { teams, currentTeam } = get()
        const updatedTeams = teams.filter(team => team.id !== teamId)
        
        set({ 
          teams: updatedTeams,
          currentTeam: currentTeam?.id === teamId ? null : currentTeam,
          journals: currentTeam?.id === teamId ? [] : get().journals,
          currentJournal: currentTeam?.id === teamId ? null : get().currentJournal
        })
      },

      deleteJournal: async (journalId: string) => {
        const { error } = await supabase
          .from('journals')
          .delete()
          .eq('id', journalId)

        if (error) throw error

        // Update local state
        const { journals, currentJournal, currentTeam } = get()
        const updatedJournals = journals.filter(journal => journal.id !== journalId)
        
        set({ 
          journals: updatedJournals,
          currentJournal: currentJournal?.id === journalId ? null : currentJournal
        })

        // Clear data if this was the current journal
        if (currentJournal?.id === journalId) {
          set({
            ideas: [],
            currentIdea: null,
            step1Data: [],
            step2Data: null,
            step3Data: [],
            step4Data: [],
            step4EvaluationData: null,
            step5BuyerData: null,
            step5VPData: null
          })
        }
      },

      saveStep1Data: async (journalId: string, memberId: string, data: Partial<Step1Data>) => {
        set({ saving: true })
        try {
          // Use demo user ID for development
          const demoUserId = '00000000-0000-0000-0000-000000000000'
          
          const { error } = await supabase
            .from('step1_means')
            .upsert({
              journal_id: journalId,
              member_id: demoUserId,
              ...data
            }, {
              onConflict: 'journal_id,member_id'
            })

          if (error) throw error
          await get().loadJournalData(journalId)
        } catch (error) {
          console.error('Error saving step 1 data:', error)
        } finally {
          set({ saving: false })
        }
      },

      deleteIdea: async (ideaId: string) => {
        const { error } = await supabase
          .from('ideas')
          .delete()
          .eq('id', ideaId)

        if (error) throw error

        // Update local state
        const { ideas, currentIdea } = get()
        const updatedIdeas = ideas.filter(idea => idea.id !== ideaId)
        
        set({ 
          ideas: updatedIdeas,
          currentIdea: currentIdea?.id === ideaId ? null : currentIdea
        })

        // Clear data if this was the current idea
        if (currentIdea?.id === ideaId) {
          set({
            step2Data: null,
            step3Data: [],
            step4EvaluationData: null,
            step5BuyerData: null,
            step5VPData: null
          })
        }
      },

      saveStep1DataForIdea: async (ideaId: string, memberId: string, data: Partial<Step1Data>) => {
        set({ saving: true })
        try {
          // Use demo user ID for development
          const demoUserId = '00000000-0000-0000-0000-000000000000'
          
          const { error } = await supabase
            .from('step1_means')
            .upsert({
              idea_id: ideaId,
              member_id: demoUserId,
              ...data
            }, {
              onConflict: 'idea_id,member_id'
            })

          if (error) throw error
          await get().loadIdeaData(ideaId)
        } catch (error) {
          console.error('Error saving step 1 data for idea:', error)
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
            }, {
              onConflict: 'journal_id'
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

      saveStep4EvaluationData: async (ideaId: string, data: Partial<Step4EvaluationData>) => {
        set({ saving: true })
        try {
          const { error } = await supabase
            .from('step4_idea_evaluation')
            .upsert({
              idea_id: ideaId,
              ...data
            }, {
              onConflict: 'idea_id'
            })

          if (error) throw error
          
          // Update only the step4 evaluation data in local state
          set({ step4EvaluationData: { idea_id: ideaId, ...data } as Step4EvaluationData })
        } catch (error) {
          console.error('Error saving step 4 evaluation data:', error)
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
            }, {
              onConflict: 'journal_id'
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
            }, {
              onConflict: 'journal_id'
            })

          if (error) throw error
          
          await get().loadJournalData(journalId)
        } catch (error) {
          console.error('Error saving step 5 VP data:', error)
        } finally {
          set({ saving: false })
        }
      },

      // New functions for idea-specific data
      saveStep2DataForIdea: async (ideaId: string, data: Partial<Step2Data>) => {
        set({ saving: true })
        try {
          const { error } = await supabase
            .from('step2_problem')
            .upsert({
              idea_id: ideaId,
              ...data
            }, {
              onConflict: 'idea_id'
            })

          if (error) throw error
          
          await get().loadIdeaData(ideaId)
        } catch (error) {
          console.error('Error saving step 2 data for idea:', error)
        } finally {
          set({ saving: false })
        }
      },

      saveStep3DataForIdea: async (ideaId: string, trends: Partial<Step3Data>[]) => {
        set({ saving: true })
        try {
          // Delete existing trends for this idea
          await supabase
            .from('step3_trends')
            .delete()
            .eq('idea_id', ideaId)

          // Insert new trends
          if (trends.length > 0) {
            const { error } = await supabase
              .from('step3_trends')
              .insert(trends.map(trend => ({
                idea_id: ideaId,
                ...trend
              })))

            if (error) throw error
          }
          
          await get().loadIdeaData(ideaId)
        } catch (error) {
          console.error('Error saving step 3 data for idea:', error)
        } finally {
          set({ saving: false })
        }
      },

      saveStep5BuyerDataForIdea: async (ideaId: string, data: Partial<Step5BuyerData>) => {
        set({ saving: true })
        try {
          const { error } = await supabase
            .from('step5_buyer')
            .upsert({
              idea_id: ideaId,
              ...data
            }, {
              onConflict: 'idea_id'
            })

          if (error) throw error
          
          await get().loadIdeaData(ideaId)
        } catch (error) {
          console.error('Error saving step 5 buyer data for idea:', error)
        } finally {
          set({ saving: false })
        }
      },

      saveStep5VPDataForIdea: async (ideaId: string, data: Partial<Step5VPData>) => {
        set({ saving: true })
        try {
          const { error } = await supabase
            .from('step5_vpcanvas')
            .upsert({
              idea_id: ideaId,
              ...data
            }, {
              onConflict: 'idea_id'
            })

          if (error) throw error
          
          await get().loadIdeaData(ideaId)
        } catch (error) {
          console.error('Error saving step 5 VP data for idea:', error)
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
        currentIdea: state.currentIdea,
      }),
      onRehydrateStorage: () => (state) => {
        // State rehydrated from localStorage
      }
    }
  )
)