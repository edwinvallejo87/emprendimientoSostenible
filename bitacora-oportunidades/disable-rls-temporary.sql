-- TEMPORARY SOLUTION: Disable RLS for sustainability tables
-- This is only for testing - re-enable RLS after testing is complete

-- Disable RLS temporarily on all sustainability tables
ALTER TABLE sustainable_canvas DISABLE ROW LEVEL SECURITY;
ALTER TABLE innovation_patterns DISABLE ROW LEVEL SECURITY;
ALTER TABLE prototypes DISABLE ROW LEVEL SECURITY;
ALTER TABLE validation_strategies DISABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_actors DISABLE ROW LEVEL SECURITY;
ALTER TABLE sustainability_reflections DISABLE ROW LEVEL SECURITY;

-- Note: This makes these tables accessible to all authenticated users temporarily
-- Remember to re-enable RLS and fix policies after testing