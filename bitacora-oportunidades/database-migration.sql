-- Nueva estructura de base de datos para Ideas dentro de Journals
-- Ejecutar en Supabase SQL Editor

-- 1. Crear tabla IDEAS
CREATE TABLE IF NOT EXISTS ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journal_id UUID REFERENCES journals(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_market TEXT,
  unique_value TEXT,
  resources_needed TEXT[], -- Array de strings
  implementation_complexity VARCHAR(10) CHECK (implementation_complexity IN ('Low', 'Medium', 'High')),
  market_potential VARCHAR(10) CHECK (market_potential IN ('Low', 'Medium', 'High')),
  alignment_score INTEGER CHECK (alignment_score >= 0 AND alignment_score <= 100),
  reasoning TEXT,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Modificar tablas existentes para referenciar IDEAS en lugar de JOURNALS
-- Agregar columna idea_id a las tablas de pasos

-- Step 1: Medios personales (mantener como está, es por equipo/journal, no por idea)
-- No cambiar step1_means

-- Step 2: Problema (ahora por idea)
ALTER TABLE step2_problem ADD COLUMN idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE;
ALTER TABLE step2_problem ALTER COLUMN journal_id DROP NOT NULL;

-- Step 3: Tendencias (ahora por idea)  
ALTER TABLE step3_trends ADD COLUMN idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE;
ALTER TABLE step3_trends ALTER COLUMN journal_id DROP NOT NULL;

-- Step 4: Ideación (reemplazar con tabla de evaluación de idea única)
CREATE TABLE IF NOT EXISTS step4_idea_evaluation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  strengths TEXT,
  weaknesses TEXT,
  opportunities TEXT,
  threats TEXT,
  success_factors TEXT,
  risk_mitigation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Usuario y Propuesta de Valor (ahora por idea)
ALTER TABLE step5_buyer ADD COLUMN idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE;
ALTER TABLE step5_buyer ALTER COLUMN journal_id DROP NOT NULL;

ALTER TABLE step5_vpcanvas ADD COLUMN idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE;
ALTER TABLE step5_vpcanvas ALTER COLUMN journal_id DROP NOT NULL;

-- 3. Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_ideas_journal_id ON ideas(journal_id);
CREATE INDEX IF NOT EXISTS idx_step2_idea_id ON step2_problem(idea_id);
CREATE INDEX IF NOT EXISTS idx_step3_idea_id ON step3_trends(idea_id);
CREATE INDEX IF NOT EXISTS idx_step4_idea_id ON step4_idea_evaluation(idea_id);
CREATE INDEX IF NOT EXISTS idx_step5_buyer_idea_id ON step5_buyer(idea_id);
CREATE INDEX IF NOT EXISTS idx_step5_vp_idea_id ON step5_vpcanvas(idea_id);

-- 4. Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ideas_updated_at 
  BEFORE UPDATE ON ideas 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 5. RLS (Row Level Security) policies para ideas
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- Política para ideas: acceso público en modo demo
CREATE POLICY "Enable all operations for ideas" ON ideas
  FOR ALL USING (true);

-- Políticas para las nuevas referencias de idea_id
CREATE POLICY "Enable all operations for step2_problem_ideas" ON step2_problem
  FOR ALL USING (idea_id IS NOT NULL);

CREATE POLICY "Enable all operations for step3_trends_ideas" ON step3_trends
  FOR ALL USING (idea_id IS NOT NULL);

CREATE POLICY "Enable all operations for step4_idea_evaluation" ON step4_idea_evaluation
  FOR ALL USING (true);

CREATE POLICY "Enable all operations for step5_buyer_ideas" ON step5_buyer
  FOR ALL USING (idea_id IS NOT NULL);

CREATE POLICY "Enable all operations for step5_vpcanvas_ideas" ON step5_vpcanvas
  FOR ALL USING (idea_id IS NOT NULL);

-- 6. Función helper para crear idea completa
CREATE OR REPLACE FUNCTION create_idea_from_generation(
  p_journal_id UUID,
  p_title VARCHAR(255),
  p_description TEXT,
  p_target_market TEXT,
  p_unique_value TEXT,
  p_resources_needed TEXT[],
  p_implementation_complexity VARCHAR(10),
  p_market_potential VARCHAR(10),
  p_alignment_score INTEGER,
  p_reasoning TEXT
)
RETURNS UUID AS $$
DECLARE
  new_idea_id UUID;
BEGIN
  INSERT INTO ideas (
    journal_id, title, description, target_market, unique_value,
    resources_needed, implementation_complexity, market_potential,
    alignment_score, reasoning, status
  ) VALUES (
    p_journal_id, p_title, p_description, p_target_market, p_unique_value,
    p_resources_needed, p_implementation_complexity, p_market_potential,
    p_alignment_score, p_reasoning, 'draft'
  ) RETURNING id INTO new_idea_id;
  
  RETURN new_idea_id;
END;
$$ LANGUAGE plpgsql;