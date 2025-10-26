-- Create custom types
CREATE TYPE team_role AS ENUM ('owner', 'member', 'viewer');
CREATE TYPE journal_status AS ENUM ('draft', 'in_progress', 'ready');
CREATE TYPE trend_type AS ENUM ('Social', 'Tecnológica', 'Ambiental', 'Cultural', 'Consumo');
CREATE TYPE innovation_level AS ENUM ('Incremental', 'Radical');
CREATE TYPE feasibility_level AS ENUM ('Alta', 'Media', 'Baja');

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create tables
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role team_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(team_id, user_id)
);

CREATE TABLE journals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status journal_status DEFAULT 'draft',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE step1_means (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journal_id UUID REFERENCES journals(id) ON DELETE CASCADE,
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  who_i_am TEXT,
  what_i_know TEXT,
  who_i_know TEXT,
  what_i_have TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(journal_id, member_id)
);

CREATE TABLE step2_problem (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journal_id UUID REFERENCES journals(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  affected TEXT,
  relevance TEXT,
  link_to_means TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(journal_id)
);

CREATE TABLE step3_trends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journal_id UUID REFERENCES journals(id) ON DELETE CASCADE,
  name TEXT,
  type trend_type,
  brief TEXT,
  example TEXT,
  source_apa TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE step4_ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journal_id UUID REFERENCES journals(id) ON DELETE CASCADE,
  idea TEXT,
  kind TEXT,
  innovation_level innovation_level,
  feasibility feasibility_level,
  selected BOOLEAN DEFAULT false,
  justification TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE step5_buyer (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journal_id UUID REFERENCES journals(id) ON DELETE CASCADE,
  name TEXT,
  age INTEGER,
  occupation TEXT,
  motivations TEXT,
  pains TEXT,
  needs TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(journal_id)
);

CREATE TABLE step5_vpcanvas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journal_id UUID REFERENCES journals(id) ON DELETE CASCADE,
  customer_jobs TEXT,
  customer_pains TEXT,
  customer_gains TEXT,
  products_services TEXT,
  pain_relievers TEXT,
  gain_creators TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(journal_id)
);

CREATE TABLE activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journal_id UUID REFERENCES journals(id) ON DELETE CASCADE,
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  step INTEGER NOT NULL,
  field TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  ts TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE step1_means ENABLE ROW LEVEL SECURITY;
ALTER TABLE step2_problem ENABLE ROW LEVEL SECURITY;
ALTER TABLE step3_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE step4_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE step5_buyer ENABLE ROW LEVEL SECURITY;
ALTER TABLE step5_vpcanvas ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Teams: users can see teams they belong to
CREATE POLICY "Users can view teams they belong to" ON teams
  FOR SELECT USING (
    id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create teams" ON teams
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Team owners can update teams" ON teams
  FOR UPDATE USING (
    id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- Team members: users can see members of their teams
CREATE POLICY "Users can view team members of their teams" ON team_members
  FOR SELECT USING (
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Team owners can manage team members" ON team_members
  FOR ALL USING (
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

CREATE POLICY "Users can join teams" ON team_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Journals: users can see journals of their teams
CREATE POLICY "Users can view journals of their teams" ON journals
  FOR SELECT USING (
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can create journals" ON journals
  FOR INSERT WITH CHECK (
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can update journals" ON journals
  FOR UPDATE USING (
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'member')
    )
  );

-- Step data: users can access data for journals of their teams
CREATE POLICY "Users can access step1_means of their team journals" ON step1_means
  FOR ALL USING (
    journal_id IN (
      SELECT j.id FROM journals j
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access step2_problem of their team journals" ON step2_problem
  FOR ALL USING (
    journal_id IN (
      SELECT j.id FROM journals j
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access step3_trends of their team journals" ON step3_trends
  FOR ALL USING (
    journal_id IN (
      SELECT j.id FROM journals j
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access step4_ideas of their team journals" ON step4_ideas
  FOR ALL USING (
    journal_id IN (
      SELECT j.id FROM journals j
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access step5_buyer of their team journals" ON step5_buyer
  FOR ALL USING (
    journal_id IN (
      SELECT j.id FROM journals j
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access step5_vpcanvas of their team journals" ON step5_vpcanvas
  FOR ALL USING (
    journal_id IN (
      SELECT j.id FROM journals j
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can access activity_log of their team journals" ON activity_log
  FOR ALL USING (
    journal_id IN (
      SELECT j.id FROM journals j
      JOIN team_members tm ON j.team_id = tm.team_id
      WHERE tm.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_team_members_team_user ON team_members(team_id, user_id);
CREATE INDEX idx_journals_team_id ON journals(team_id);
CREATE INDEX idx_step1_means_journal_id ON step1_means(journal_id);
CREATE INDEX idx_step2_problem_journal_id ON step2_problem(journal_id);
CREATE INDEX idx_step3_trends_journal_id ON step3_trends(journal_id);
CREATE INDEX idx_step4_ideas_journal_id ON step4_ideas(journal_id);
CREATE INDEX idx_step5_buyer_journal_id ON step5_buyer(journal_id);
CREATE INDEX idx_step5_vpcanvas_journal_id ON step5_vpcanvas(journal_id);
CREATE INDEX idx_activity_log_journal_id ON activity_log(journal_id);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_step1_means_updated_at BEFORE UPDATE ON step1_means FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_step2_problem_updated_at BEFORE UPDATE ON step2_problem FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_step5_buyer_updated_at BEFORE UPDATE ON step5_buyer FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_step5_vpcanvas_updated_at BEFORE UPDATE ON step5_vpcanvas FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_journals_updated_at BEFORE UPDATE ON journals FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();