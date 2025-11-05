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
      sustainable_canvas: {
        Row: {
          id: string
          idea_id: string
          customer_segments: string | null
          value_propositions: string | null
          products_services: string | null
          channels: string | null
          customer_relationships: string | null
          revenue_streams: string | null
          social_benefits: string | null
          environmental_benefits: string | null
          key_resources: string | null
          key_activities: string | null
          key_partnerships: string | null
          cost_structure: string | null
          social_costs: string | null
          environmental_costs: string | null
          sustainability_reflection: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          idea_id: string
          customer_segments?: string | null
          value_propositions?: string | null
          products_services?: string | null
          channels?: string | null
          customer_relationships?: string | null
          revenue_streams?: string | null
          social_benefits?: string | null
          environmental_benefits?: string | null
          key_resources?: string | null
          key_activities?: string | null
          key_partnerships?: string | null
          cost_structure?: string | null
          social_costs?: string | null
          environmental_costs?: string | null
          sustainability_reflection?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          idea_id?: string
          customer_segments?: string | null
          value_propositions?: string | null
          products_services?: string | null
          channels?: string | null
          customer_relationships?: string | null
          revenue_streams?: string | null
          social_benefits?: string | null
          environmental_benefits?: string | null
          key_resources?: string | null
          key_activities?: string | null
          key_partnerships?: string | null
          cost_structure?: string | null
          social_costs?: string | null
          environmental_costs?: string | null
          sustainability_reflection?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sustainable_canvas_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: true
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          }
        ]
      }
      innovation_patterns: {
        Row: {
          id: string
          idea_id: string
          pattern_name: string
          pattern_description: string | null
          justification: string | null
          expected_impact: string | null
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          idea_id: string
          pattern_name: string
          pattern_description?: string | null
          justification?: string | null
          expected_impact?: string | null
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          idea_id?: string
          pattern_name?: string
          pattern_description?: string | null
          justification?: string | null
          expected_impact?: string | null
          is_primary?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "innovation_patterns_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          }
        ]
      }
      prototypes: {
        Row: {
          id: string
          idea_id: string
          name: string
          type: 'concept' | 'wireframe' | 'mockup' | 'mvp' | 'physical' | 'digital' | 'service'
          description: string | null
          hypothesis_to_validate: string | null
          expected_learning_metrics: string | null
          image_url: string | null
          video_url: string | null
          external_link: string | null
          link_description: string | null
          ai_mvp_suggestion: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          idea_id: string
          name: string
          type: 'concept' | 'wireframe' | 'mockup' | 'mvp' | 'physical' | 'digital' | 'service'
          description?: string | null
          hypothesis_to_validate?: string | null
          expected_learning_metrics?: string | null
          image_url?: string | null
          video_url?: string | null
          external_link?: string | null
          link_description?: string | null
          ai_mvp_suggestion?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          idea_id?: string
          name?: string
          type?: 'concept' | 'wireframe' | 'mockup' | 'mvp' | 'physical' | 'digital' | 'service'
          description?: string | null
          hypothesis_to_validate?: string | null
          expected_learning_metrics?: string | null
          image_url?: string | null
          video_url?: string | null
          external_link?: string | null
          link_description?: string | null
          ai_mvp_suggestion?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prototypes_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: true
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          }
        ]
      }
      validation_strategies: {
        Row: {
          id: string
          idea_id: string
          hypothesis: string
          target_segments: string | null
          validation_methods: ('interview' | 'survey' | 'landing_page' | 'ab_test' | 'observation' | 'focus_group' | 'prototype_test')[]
          expected_learnings: string | null
          success_criteria: string | null
          timeline_weeks: number | null
          budget_estimate: number | null
          progress_percentage: number
          results_summary: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          idea_id: string
          hypothesis: string
          target_segments?: string | null
          validation_methods: ('interview' | 'survey' | 'landing_page' | 'ab_test' | 'observation' | 'focus_group' | 'prototype_test')[]
          expected_learnings?: string | null
          success_criteria?: string | null
          timeline_weeks?: number | null
          budget_estimate?: number | null
          progress_percentage?: number
          results_summary?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          idea_id?: string
          hypothesis?: string
          target_segments?: string | null
          validation_methods?: ('interview' | 'survey' | 'landing_page' | 'ab_test' | 'observation' | 'focus_group' | 'prototype_test')[]
          expected_learnings?: string | null
          success_criteria?: string | null
          timeline_weeks?: number | null
          budget_estimate?: number | null
          progress_percentage?: number
          results_summary?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "validation_strategies_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: true
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          }
        ]
      }
      ecosystem_actors: {
        Row: {
          id: string
          idea_id: string
          actor_name: string
          actor_type: 'financial' | 'academic' | 'business' | 'social' | 'institutional'
          role_description: string | null
          support_types: ('funding' | 'mentorship' | 'infrastructure' | 'networking' | 'technical' | 'legal' | 'marketing')[]
          benefit_to_venture: string | null
          benefit_to_actor: string | null
          contact_info: string | null
          relationship_status: string
          created_at: string
        }
        Insert: {
          id?: string
          idea_id: string
          actor_name: string
          actor_type: 'financial' | 'academic' | 'business' | 'social' | 'institutional'
          role_description?: string | null
          support_types: ('funding' | 'mentorship' | 'infrastructure' | 'networking' | 'technical' | 'legal' | 'marketing')[]
          benefit_to_venture?: string | null
          benefit_to_actor?: string | null
          contact_info?: string | null
          relationship_status?: string
          created_at?: string
        }
        Update: {
          id?: string
          idea_id?: string
          actor_name?: string
          actor_type?: 'financial' | 'academic' | 'business' | 'social' | 'institutional'
          role_description?: string | null
          support_types?: ('funding' | 'mentorship' | 'infrastructure' | 'networking' | 'technical' | 'legal' | 'marketing')[]
          benefit_to_venture?: string | null
          benefit_to_actor?: string | null
          contact_info?: string | null
          relationship_status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ecosystem_actors_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          }
        ]
      }
      sustainability_reflections: {
        Row: {
          id: string
          idea_id: string
          social_impact_balance: string | null
          sustainability_decisions: string | null
          scaling_strategy: string | null
          ai_generated_reflection: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          idea_id: string
          social_impact_balance?: string | null
          sustainability_decisions?: string | null
          scaling_strategy?: string | null
          ai_generated_reflection?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          idea_id?: string
          social_impact_balance?: string | null
          sustainability_decisions?: string | null
          scaling_strategy?: string | null
          ai_generated_reflection?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sustainability_reflections_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: true
            referencedRelation: "ideas"
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