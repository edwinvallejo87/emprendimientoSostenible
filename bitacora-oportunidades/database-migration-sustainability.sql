-- ========================================
-- MIGRATION: Adding Sustainability Modules
-- Date: 2024-11-04
-- Purpose: Extend app for Module 3 - Sustainable Entrepreneurship
-- ========================================

-- 1. Create new enums for sustainability modules
CREATE TYPE prototype_type AS ENUM ('concept', 'wireframe', 'mockup', 'mvp', 'physical', 'digital', 'service');
CREATE TYPE validation_method AS ENUM ('interview', 'survey', 'landing_page', 'ab_test', 'observation', 'focus_group', 'prototype_test');
CREATE TYPE ecosystem_actor_type AS ENUM ('financial', 'academic', 'business', 'social', 'institutional');
CREATE TYPE support_type AS ENUM ('funding', 'mentorship', 'infrastructure', 'networking', 'technical', 'legal', 'marketing');

-- 2. Canvas Sostenible (Sustainable Canvas) - 14 blocks
CREATE TABLE sustainable_canvas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  -- Customer side (7 blocks)
  customer_segments TEXT, -- Segmentos de clientes
  value_propositions TEXT, -- Propuestas de valor
  products_services TEXT, -- Productos y servicios
  channels TEXT, -- Canales
  customer_relationships TEXT, -- Relaciones con clientes
  revenue_streams TEXT, -- Flujos de ingresos
  social_benefits TEXT, -- Beneficios sociales
  environmental_benefits TEXT, -- Beneficios ambientales
  -- Business side (6 blocks)
  key_resources TEXT, -- Recursos clave
  key_activities TEXT, -- Actividades clave
  key_partnerships TEXT, -- Alianzas clave
  cost_structure TEXT, -- Estructura de costos
  social_costs TEXT, -- Costos sociales
  environmental_costs TEXT, -- Costos ambientales
  -- Sustainability reflection
  sustainability_reflection TEXT, -- Auto-generated reflection
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(idea_id)
);

-- 3. Innovation Patterns (Business Model Navigator patterns)
CREATE TABLE innovation_patterns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  pattern_name TEXT NOT NULL, -- e.g., "Subscription", "Product as Service"
  pattern_description TEXT, -- Description of the pattern
  justification TEXT, -- Why this pattern applies
  expected_impact TEXT, -- Expected impact of applying this pattern
  is_primary BOOLEAN DEFAULT false, -- Is this the main pattern?
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Prototypes and MVP
CREATE TABLE prototypes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type prototype_type NOT NULL,
  description TEXT,
  hypothesis_to_validate TEXT, -- What hypothesis does this prototype test?
  expected_learning_metrics TEXT, -- What metrics will we track?
  -- Media attachments
  image_url TEXT, -- Image URL
  video_url TEXT, -- Video URL  
  external_link TEXT, -- Figma, Canva, Miro, etc.
  link_description TEXT, -- Description of the external link
  -- AI-generated MVP suggestion
  ai_mvp_suggestion TEXT, -- AI-generated MVP experiment
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(idea_id) -- One prototype per idea for now
);

-- 5. Validation Strategy
CREATE TABLE validation_strategies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  hypothesis TEXT NOT NULL, -- Main hypothesis to validate
  target_segments TEXT, -- Who are we validating with?
  validation_methods validation_method[] NOT NULL, -- Array of methods
  expected_learnings TEXT, -- What do we expect to learn?
  success_criteria TEXT, -- How do we define success?
  timeline_weeks INTEGER, -- How many weeks for validation?
  budget_estimate DECIMAL(10,2), -- Estimated budget
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  results_summary TEXT, -- Summary of validation results
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(idea_id)
);

-- 6. Ecosystem Map (Daniel Isenberg model)
CREATE TABLE ecosystem_actors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  actor_name TEXT NOT NULL,
  actor_type ecosystem_actor_type NOT NULL,
  role_description TEXT, -- What role they play
  support_types support_type[] NOT NULL, -- Types of support they provide
  benefit_to_venture TEXT, -- How they benefit our venture
  benefit_to_actor TEXT, -- How we benefit them (reciprocity)
  contact_info TEXT, -- Optional contact information
  relationship_status TEXT DEFAULT 'potential', -- potential, contacted, committed
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Final Reflection
CREATE TABLE sustainability_reflections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  social_impact_balance TEXT, -- How model balances social, environmental, economic impact
  sustainability_decisions TEXT, -- What decisions make it sustainable?
  scaling_strategy TEXT, -- How can it scale without losing purpose?
  ai_generated_reflection TEXT, -- AI-enhanced reflection in APA format
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(idea_id)
);

-- ========================================
-- INDEXES for performance
-- ========================================
CREATE INDEX idx_sustainable_canvas_idea_id ON sustainable_canvas(idea_id);
CREATE INDEX idx_innovation_patterns_idea_id ON innovation_patterns(idea_id);
CREATE INDEX idx_prototypes_idea_id ON prototypes(idea_id);
CREATE INDEX idx_validation_strategies_idea_id ON validation_strategies(idea_id);
CREATE INDEX idx_ecosystem_actors_idea_id ON ecosystem_actors(idea_id);
CREATE INDEX idx_ecosystem_actors_type ON ecosystem_actors(actor_type);
CREATE INDEX idx_sustainability_reflections_idea_id ON sustainability_reflections(idea_id);

-- ========================================
-- ROW LEVEL SECURITY (RLS) Policies
-- ========================================

-- Enable RLS on all new tables
ALTER TABLE sustainable_canvas ENABLE ROW LEVEL SECURITY;
ALTER TABLE innovation_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE prototypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_actors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sustainability_reflections ENABLE ROW LEVEL SECURITY;

-- Sustainable Canvas policies
CREATE POLICY "Users can access sustainable_canvas of their team ideas" ON sustainable_canvas
  FOR ALL USING (
    idea_id IN (
      SELECT i.id FROM ideas i
      JOIN journals j ON i.journal_id = j.id
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

-- Innovation Patterns policies
CREATE POLICY "Users can access innovation_patterns of their team ideas" ON innovation_patterns
  FOR ALL USING (
    idea_id IN (
      SELECT i.id FROM ideas i
      JOIN journals j ON i.journal_id = j.id
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

-- Prototypes policies
CREATE POLICY "Users can access prototypes of their team ideas" ON prototypes
  FOR ALL USING (
    idea_id IN (
      SELECT i.id FROM ideas i
      JOIN journals j ON i.journal_id = j.id
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

-- Validation Strategies policies
CREATE POLICY "Users can access validation_strategies of their team ideas" ON validation_strategies
  FOR ALL USING (
    idea_id IN (
      SELECT i.id FROM ideas i
      JOIN journals j ON i.journal_id = j.id
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

-- Ecosystem Actors policies
CREATE POLICY "Users can access ecosystem_actors of their team ideas" ON ecosystem_actors
  FOR ALL USING (
    idea_id IN (
      SELECT i.id FROM ideas i
      JOIN journals j ON i.journal_id = j.id
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

-- Sustainability Reflections policies
CREATE POLICY "Users can access sustainability_reflections of their team ideas" ON sustainability_reflections
  FOR ALL USING (
    idea_id IN (
      SELECT i.id FROM ideas i
      JOIN journals j ON i.journal_id = j.id
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

-- ========================================
-- TRIGGERS for updated_at
-- ========================================
CREATE TRIGGER update_sustainable_canvas_updated_at 
  BEFORE UPDATE ON sustainable_canvas 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_prototypes_updated_at 
  BEFORE UPDATE ON prototypes 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_validation_strategies_updated_at 
  BEFORE UPDATE ON validation_strategies 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_sustainability_reflections_updated_at 
  BEFORE UPDATE ON sustainability_reflections 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ========================================
-- SAMPLE DATA for Innovation Patterns Library
-- ========================================
-- Note: This will be moved to a separate file or integrated into the app
-- Common Business Model Navigator patterns that can be suggested

-- ========================================
-- FUNCTIONS for AI Integration
-- ========================================

-- Function to auto-generate sustainability reflection
CREATE OR REPLACE FUNCTION generate_sustainability_reflection(canvas_id UUID)
RETURNS TEXT AS $$
DECLARE
  canvas_data sustainable_canvas%ROWTYPE;
  reflection TEXT;
BEGIN
  SELECT * INTO canvas_data FROM sustainable_canvas WHERE id = canvas_id;
  
  IF canvas_data IS NULL THEN
    RETURN 'Canvas not found';
  END IF;
  
  -- Basic reflection template (this would be enhanced with AI in the app)
  reflection := 'El modelo equilibra viabilidad financiera, impacto ambiental y beneficio social porque ';
  
  IF canvas_data.social_benefits IS NOT NULL AND canvas_data.environmental_benefits IS NOT NULL THEN
    reflection := reflection || 'integra beneficios sociales (' || LEFT(canvas_data.social_benefits, 100) || '...) ';
    reflection := reflection || 'y ambientales (' || LEFT(canvas_data.environmental_benefits, 100) || '...) ';
    reflection := reflection || 'dentro de una estructura de costos viable.';
  ELSE
    reflection := reflection || 'considera los tres pilares de la sostenibilidad en su diseño.';
  END IF;
  
  RETURN reflection;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- REALTIME SUBSCRIPTIONS
-- ========================================
-- Enable realtime for the new tables (to be configured in Supabase dashboard)
-- ALTER PUBLICATION supabase_realtime ADD TABLE sustainable_canvas;
-- ALTER PUBLICATION supabase_realtime ADD TABLE innovation_patterns;
-- ALTER PUBLICATION supabase_realtime ADD TABLE prototypes;
-- ALTER PUBLICATION supabase_realtime ADD TABLE validation_strategies;
-- ALTER PUBLICATION supabase_realtime ADD TABLE ecosystem_actors;
-- ALTER PUBLICATION supabase_realtime ADD TABLE sustainability_reflections;