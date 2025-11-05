-- Fix RLS policies for sustainability tables
-- This script ensures RLS is enabled and policies are working correctly

-- Enable RLS on all sustainability tables (in case it wasn't enabled)
ALTER TABLE sustainable_canvas ENABLE ROW LEVEL SECURITY;
ALTER TABLE innovation_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE prototypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_actors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sustainability_reflections ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to ensure they work correctly
DROP POLICY IF EXISTS "Users can access sustainable_canvas of their team ideas" ON sustainable_canvas;
DROP POLICY IF EXISTS "Users can access innovation_patterns of their team ideas" ON innovation_patterns;
DROP POLICY IF EXISTS "Users can access prototypes of their team ideas" ON prototypes;
DROP POLICY IF EXISTS "Users can access validation_strategies of their team ideas" ON validation_strategies;
DROP POLICY IF EXISTS "Users can access ecosystem_actors of their team ideas" ON ecosystem_actors;
DROP POLICY IF EXISTS "Users can access sustainability_reflections of their team ideas" ON sustainability_reflections;

-- Recreate policies with proper permissions for INSERT, UPDATE, SELECT, DELETE
CREATE POLICY "Users can access sustainable_canvas of their team ideas" ON sustainable_canvas
  FOR ALL USING (
    idea_id IN (
      SELECT i.id FROM ideas i
      JOIN journals j ON i.journal_id = j.id
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  )
  WITH CHECK (
    idea_id IN (
      SELECT i.id FROM ideas i
      JOIN journals j ON i.journal_id = j.id
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access innovation_patterns of their team ideas" ON innovation_patterns
  FOR ALL USING (
    idea_id IN (
      SELECT i.id FROM ideas i
      JOIN journals j ON i.journal_id = j.id
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  )
  WITH CHECK (
    idea_id IN (
      SELECT i.id FROM ideas i
      JOIN journals j ON i.journal_id = j.id
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access prototypes of their team ideas" ON prototypes
  FOR ALL USING (
    idea_id IN (
      SELECT i.id FROM ideas i
      JOIN journals j ON i.journal_id = j.id
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  )
  WITH CHECK (
    idea_id IN (
      SELECT i.id FROM ideas i
      JOIN journals j ON i.journal_id = j.id
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access validation_strategies of their team ideas" ON validation_strategies
  FOR ALL USING (
    idea_id IN (
      SELECT i.id FROM ideas i
      JOIN journals j ON i.journal_id = j.id
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  )
  WITH CHECK (
    idea_id IN (
      SELECT i.id FROM ideas i
      JOIN journals j ON i.journal_id = j.id
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access ecosystem_actors of their team ideas" ON ecosystem_actors
  FOR ALL USING (
    idea_id IN (
      SELECT i.id FROM ideas i
      JOIN journals j ON i.journal_id = j.id
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  )
  WITH CHECK (
    idea_id IN (
      SELECT i.id FROM ideas i
      JOIN journals j ON i.journal_id = j.id
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access sustainability_reflections of their team ideas" ON sustainability_reflections
  FOR ALL USING (
    idea_id IN (
      SELECT i.id FROM ideas i
      JOIN journals j ON i.journal_id = j.id
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  )
  WITH CHECK (
    idea_id IN (
      SELECT i.id FROM ideas i
      JOIN journals j ON i.journal_id = j.id
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );