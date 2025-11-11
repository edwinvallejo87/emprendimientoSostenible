-- Create sustainability module tables

-- Sustainable Canvas table
CREATE TABLE IF NOT EXISTS sustainable_canvas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  value_propositions TEXT,
  key_partnerships TEXT,
  key_activities TEXT,
  key_resources TEXT,
  cost_structure TEXT,
  revenue_streams TEXT,
  customer_segments TEXT,
  customer_relationships TEXT,
  channels TEXT,
  social_impact TEXT,
  environmental_impact TEXT,
  governance_model TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(idea_id)
);

-- Innovation Patterns table
CREATE TABLE IF NOT EXISTS innovation_patterns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  pattern_type TEXT NOT NULL,
  description TEXT NOT NULL,
  implementation TEXT,
  examples TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Prototypes table
CREATE TABLE IF NOT EXISTS prototypes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  prototype_type TEXT,
  description TEXT,
  features TEXT,
  testing_plan TEXT,
  expected_outcomes TEXT,
  resources_needed TEXT,
  timeline TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(idea_id)
);

-- Validation Strategies table
CREATE TABLE IF NOT EXISTS validation_strategies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  strategy_type TEXT,
  description TEXT,
  target_audience TEXT,
  methodology TEXT,
  success_metrics TEXT,
  timeline TEXT,
  budget_estimate TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(idea_id)
);

-- Ecosystem Actors table
CREATE TABLE IF NOT EXISTS ecosystem_actors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  actor_type TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  relationship TEXT,
  influence_level TEXT,
  collaboration_potential TEXT,
  contact_info TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sustainability Reflections table
CREATE TABLE IF NOT EXISTS sustainability_reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  social_impact_balance TEXT,
  sustainability_decisions TEXT,
  scaling_strategy TEXT,
  ai_generated_reflection TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(idea_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sustainable_canvas_idea_id ON sustainable_canvas(idea_id);
CREATE INDEX IF NOT EXISTS idx_innovation_patterns_idea_id ON innovation_patterns(idea_id);
CREATE INDEX IF NOT EXISTS idx_prototypes_idea_id ON prototypes(idea_id);
CREATE INDEX IF NOT EXISTS idx_validation_strategies_idea_id ON validation_strategies(idea_id);
CREATE INDEX IF NOT EXISTS idx_ecosystem_actors_idea_id ON ecosystem_actors(idea_id);
CREATE INDEX IF NOT EXISTS idx_sustainability_reflections_idea_id ON sustainability_reflections(idea_id);

-- Enable Row Level Security
ALTER TABLE sustainable_canvas ENABLE ROW LEVEL SECURITY;
ALTER TABLE innovation_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE prototypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_actors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sustainability_reflections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow authenticated users to manage their own data)
CREATE POLICY "Users can view their own sustainable_canvas" ON sustainable_canvas FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert their own sustainable_canvas" ON sustainable_canvas FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Users can update their own sustainable_canvas" ON sustainable_canvas FOR UPDATE USING (TRUE);
CREATE POLICY "Users can delete their own sustainable_canvas" ON sustainable_canvas FOR DELETE USING (TRUE);

CREATE POLICY "Users can view their own innovation_patterns" ON innovation_patterns FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert their own innovation_patterns" ON innovation_patterns FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Users can update their own innovation_patterns" ON innovation_patterns FOR UPDATE USING (TRUE);
CREATE POLICY "Users can delete their own innovation_patterns" ON innovation_patterns FOR DELETE USING (TRUE);

CREATE POLICY "Users can view their own prototypes" ON prototypes FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert their own prototypes" ON prototypes FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Users can update their own prototypes" ON prototypes FOR UPDATE USING (TRUE);
CREATE POLICY "Users can delete their own prototypes" ON prototypes FOR DELETE USING (TRUE);

CREATE POLICY "Users can view their own validation_strategies" ON validation_strategies FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert their own validation_strategies" ON validation_strategies FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Users can update their own validation_strategies" ON validation_strategies FOR UPDATE USING (TRUE);
CREATE POLICY "Users can delete their own validation_strategies" ON validation_strategies FOR DELETE USING (TRUE);

CREATE POLICY "Users can view their own ecosystem_actors" ON ecosystem_actors FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert their own ecosystem_actors" ON ecosystem_actors FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Users can update their own ecosystem_actors" ON ecosystem_actors FOR UPDATE USING (TRUE);
CREATE POLICY "Users can delete their own ecosystem_actors" ON ecosystem_actors FOR DELETE USING (TRUE);

CREATE POLICY "Users can view their own sustainability_reflections" ON sustainability_reflections FOR SELECT USING (TRUE);
CREATE POLICY "Users can insert their own sustainability_reflections" ON sustainability_reflections FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Users can update their own sustainability_reflections" ON sustainability_reflections FOR UPDATE USING (TRUE);
CREATE POLICY "Users can delete their own sustainability_reflections" ON sustainability_reflections FOR DELETE USING (TRUE);