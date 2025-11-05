-- ROBUST RLS FIX: Complete solution for sustainability tables RLS policies
-- This script should work even if previous attempts failed

-- First, ensure RLS is enabled
ALTER TABLE sustainable_canvas ENABLE ROW LEVEL SECURITY;
ALTER TABLE innovation_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE prototypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE validation_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_actors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sustainability_reflections ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies for these tables (using cascade to handle dependencies)
DROP POLICY IF EXISTS "Users can access sustainable_canvas of their team ideas" ON sustainable_canvas;
DROP POLICY IF EXISTS "sustainable_canvas_policy" ON sustainable_canvas;
DROP POLICY IF EXISTS "Enable all operations for team members" ON sustainable_canvas;

DROP POLICY IF EXISTS "Users can access innovation_patterns of their team ideas" ON innovation_patterns;
DROP POLICY IF EXISTS "innovation_patterns_policy" ON innovation_patterns;
DROP POLICY IF EXISTS "Enable all operations for team members" ON innovation_patterns;

DROP POLICY IF EXISTS "Users can access prototypes of their team ideas" ON prototypes;
DROP POLICY IF EXISTS "prototypes_policy" ON prototypes;
DROP POLICY IF EXISTS "Enable all operations for team members" ON prototypes;

DROP POLICY IF EXISTS "Users can access validation_strategies of their team ideas" ON validation_strategies;
DROP POLICY IF EXISTS "validation_strategies_policy" ON validation_strategies;
DROP POLICY IF EXISTS "Enable all operations for team members" ON validation_strategies;

DROP POLICY IF EXISTS "Users can access ecosystem_actors of their team ideas" ON ecosystem_actors;
DROP POLICY IF EXISTS "ecosystem_actors_policy" ON ecosystem_actors;
DROP POLICY IF EXISTS "Enable all operations for team members" ON ecosystem_actors;

DROP POLICY IF EXISTS "Users can access sustainability_reflections of their team ideas" ON sustainability_reflections;
DROP POLICY IF EXISTS "sustainability_reflections_policy" ON sustainability_reflections;
DROP POLICY IF EXISTS "Enable all operations for team members" ON sustainability_reflections;

-- Create comprehensive policies that allow all operations for team members
CREATE POLICY "Enable all operations for team members" ON sustainable_canvas
  FOR ALL TO authenticated
  USING (
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

CREATE POLICY "Enable all operations for team members" ON innovation_patterns
  FOR ALL TO authenticated
  USING (
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

CREATE POLICY "Enable all operations for team members" ON prototypes
  FOR ALL TO authenticated
  USING (
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

CREATE POLICY "Enable all operations for team members" ON validation_strategies
  FOR ALL TO authenticated
  USING (
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

CREATE POLICY "Enable all operations for team members" ON ecosystem_actors
  FOR ALL TO authenticated
  USING (
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

CREATE POLICY "Enable all operations for team members" ON sustainability_reflections
  FOR ALL TO authenticated
  USING (
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