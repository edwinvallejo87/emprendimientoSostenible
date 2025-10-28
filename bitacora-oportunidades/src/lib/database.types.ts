export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      teams: {
        Row: {
          id: string
          name: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_by?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: 'owner' | 'member' | 'viewer'
          joined_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          role: 'owner' | 'member' | 'viewer'
          joined_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          role?: 'owner' | 'member' | 'viewer'
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      journals: {
        Row: {
          id: string
          team_id: string
          title: string
          status: 'draft' | 'in_progress' | 'ready'
          progress: number
          updated_at: string
        }
        Insert: {
          id?: string
          team_id: string
          title: string
          status?: 'draft' | 'in_progress' | 'ready'
          progress?: number
          updated_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          title?: string
          status?: 'draft' | 'in_progress' | 'ready'
          progress?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "journals_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      ideas: {
        Row: {
          id: string
          journal_id: string
          title: string
          description: string | null
          target_market: string | null
          unique_value: string | null
          resources_needed: string[] | null
          implementation_complexity: 'Low' | 'Medium' | 'High' | null
          market_potential: 'Low' | 'Medium' | 'High' | null
          alignment_score: number | null
          reasoning: string | null
          status: 'draft' | 'in_progress' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          journal_id: string
          title: string
          description?: string | null
          target_market?: string | null
          unique_value?: string | null
          resources_needed?: string[] | null
          implementation_complexity?: 'Low' | 'Medium' | 'High' | null
          market_potential?: 'Low' | 'Medium' | 'High' | null
          alignment_score?: number | null
          reasoning?: string | null
          status?: 'draft' | 'in_progress' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          journal_id?: string
          title?: string
          description?: string | null
          target_market?: string | null
          unique_value?: string | null
          resources_needed?: string[] | null
          implementation_complexity?: 'Low' | 'Medium' | 'High' | null
          market_potential?: 'Low' | 'Medium' | 'High' | null
          alignment_score?: number | null
          reasoning?: string | null
          status?: 'draft' | 'in_progress' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ideas_journal_id_fkey"
            columns: ["journal_id"]
            isOneToOne: false
            referencedRelation: "journals"
            referencedColumns: ["id"]
          }
        ]
      }
      step1_means: {
        Row: {
          id: string
          journal_id: string
          member_id: string
          who_i_am: string | null
          what_i_know: string | null
          who_i_know: string | null
          what_i_have: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          journal_id: string
          member_id: string
          who_i_am?: string | null
          what_i_know?: string | null
          who_i_know?: string | null
          what_i_have?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          journal_id?: string
          member_id?: string
          who_i_am?: string | null
          what_i_know?: string | null
          who_i_know?: string | null
          what_i_have?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "step1_means_journal_id_fkey"
            columns: ["journal_id"]
            isOneToOne: false
            referencedRelation: "journals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "step1_means_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      step2_problem: {
        Row: {
          id: string
          journal_id: string | null
          idea_id: string | null
          title: string | null
          description: string | null
          affected: string | null
          relevance: string | null
          link_to_means: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          journal_id?: string | null
          idea_id?: string | null
          title?: string | null
          description?: string | null
          affected?: string | null
          relevance?: string | null
          link_to_means?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          journal_id?: string | null
          idea_id?: string | null
          title?: string | null
          description?: string | null
          affected?: string | null
          relevance?: string | null
          link_to_means?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "step2_problem_journal_id_fkey"
            columns: ["journal_id"]
            isOneToOne: false
            referencedRelation: "journals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "step2_problem_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          }
        ]
      }
      step3_trends: {
        Row: {
          id: string
          journal_id: string | null
          idea_id: string | null
          name: string | null
          type: 'Social' | 'Tecnológica' | 'Ambiental' | 'Cultural' | 'Consumo' | null
          brief: string | null
          example: string | null
          source_apa: string | null
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          journal_id?: string | null
          idea_id?: string | null
          name?: string | null
          type?: 'Social' | 'Tecnológica' | 'Ambiental' | 'Cultural' | 'Consumo' | null
          brief?: string | null
          example?: string | null
          source_apa?: string | null
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          journal_id?: string | null
          idea_id?: string | null
          name?: string | null
          type?: 'Social' | 'Tecnológica' | 'Ambiental' | 'Cultural' | 'Consumo' | null
          brief?: string | null
          example?: string | null
          source_apa?: string | null
          comment?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "step3_trends_journal_id_fkey"
            columns: ["journal_id"]
            isOneToOne: false
            referencedRelation: "journals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "step3_trends_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          }
        ]
      }
      step4_ideas: {
        Row: {
          id: string
          journal_id: string
          idea: string | null
          kind: string | null
          innovation_level: 'Incremental' | 'Radical' | null
          feasibility: 'Alta' | 'Media' | 'Baja' | null
          selected: boolean
          justification: string | null
          created_at: string
        }
        Insert: {
          id?: string
          journal_id: string
          idea?: string | null
          kind?: string | null
          innovation_level?: 'Incremental' | 'Radical' | null
          feasibility?: 'Alta' | 'Media' | 'Baja' | null
          selected?: boolean
          justification?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          journal_id?: string
          idea?: string | null
          kind?: string | null
          innovation_level?: 'Incremental' | 'Radical' | null
          feasibility?: 'Alta' | 'Media' | 'Baja' | null
          selected?: boolean
          justification?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "step4_ideas_journal_id_fkey"
            columns: ["journal_id"]
            isOneToOne: false
            referencedRelation: "journals"
            referencedColumns: ["id"]
          }
        ]
      }
      step4_idea_evaluation: {
        Row: {
          id: string
          idea_id: string
          strengths: string | null
          weaknesses: string | null
          opportunities: string | null
          threats: string | null
          success_factors: string | null
          risk_mitigation: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          idea_id: string
          strengths?: string | null
          weaknesses?: string | null
          opportunities?: string | null
          threats?: string | null
          success_factors?: string | null
          risk_mitigation?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          idea_id?: string
          strengths?: string | null
          weaknesses?: string | null
          opportunities?: string | null
          threats?: string | null
          success_factors?: string | null
          risk_mitigation?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "step4_idea_evaluation_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          }
        ]
      }
      step5_buyer: {
        Row: {
          id: string
          journal_id: string | null
          idea_id: string | null
          name: string | null
          age: number | null
          occupation: string | null
          motivations: string | null
          pains: string | null
          needs: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          journal_id?: string | null
          idea_id?: string | null
          name?: string | null
          age?: number | null
          occupation?: string | null
          motivations?: string | null
          pains?: string | null
          needs?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          journal_id?: string | null
          idea_id?: string | null
          name?: string | null
          age?: number | null
          occupation?: string | null
          motivations?: string | null
          pains?: string | null
          needs?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "step5_buyer_journal_id_fkey"
            columns: ["journal_id"]
            isOneToOne: false
            referencedRelation: "journals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "step5_buyer_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          }
        ]
      }
      step5_vpcanvas: {
        Row: {
          id: string
          journal_id: string | null
          idea_id: string | null
          customer_jobs: string | null
          customer_pains: string | null
          customer_gains: string | null
          products_services: string | null
          pain_relievers: string | null
          gain_creators: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          journal_id?: string | null
          idea_id?: string | null
          customer_jobs?: string | null
          customer_pains?: string | null
          customer_gains?: string | null
          products_services?: string | null
          pain_relievers?: string | null
          gain_creators?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          journal_id?: string | null
          idea_id?: string | null
          customer_jobs?: string | null
          customer_pains?: string | null
          customer_gains?: string | null
          products_services?: string | null
          pain_relievers?: string | null
          gain_creators?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "step5_vpcanvas_journal_id_fkey"
            columns: ["journal_id"]
            isOneToOne: false
            referencedRelation: "journals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "step5_vpcanvas_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          }
        ]
      }
      activity_log: {
        Row: {
          id: string
          journal_id: string
          member_id: string
          step: number
          field: string
          old_value: string | null
          new_value: string | null
          ts: string
        }
        Insert: {
          id?: string
          journal_id: string
          member_id: string
          step: number
          field: string
          old_value?: string | null
          new_value?: string | null
          ts?: string
        }
        Update: {
          id?: string
          journal_id?: string
          member_id?: string
          step?: number
          field?: string
          old_value?: string | null
          new_value?: string | null
          ts?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_journal_id_fkey"
            columns: ["journal_id"]
            isOneToOne: false
            referencedRelation: "journals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}