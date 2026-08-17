-- ============================================================
-- SCRIPT DE BANCO DE DADOS SUPABASE (POSTGRESQL) - PSICOFLOW
-- Executar no SQL Editor do seu projeto Supabase
-- ============================================================

-- 1. Tabela de Psicólogas
CREATE TABLE IF NOT EXISTS public.psychologists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  crp TEXT NOT NULL,
  specialty TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela de Pacientes
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psychologist_id UUID REFERENCES public.psychologists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INT,
  phone TEXT,
  email TEXT,
  diagnosis TEXT,
  session_day TEXT,
  status TEXT DEFAULT 'Ativo',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabela de Prontuários & Anotações Sigilosas
CREATE TABLE IF NOT EXISTS public.clinical_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  session_num INT NOT NULL DEFAULT 1,
  date DATE DEFAULT CURRENT_DATE,
  summary TEXT NOT NULL,
  confidential_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabela de Atividades Atribuídas
CREATE TABLE IF NOT EXISTS public.assigned_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  assigned_date DATE DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'Pendente',
  patient_response JSONB,
  submitted_at TIMESTAMPTZ,
  access_token UUID DEFAULT gen_random_uuid() UNIQUE
);

-- Habilitar Row Level Security (RLS) para LGPD
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assigned_activities ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso
CREATE POLICY "Permitir leitura total para teste" ON public.patients FOR ALL USING (true);
CREATE POLICY "Permitir leitura prontuários" ON public.clinical_notes FOR ALL USING (true);
CREATE POLICY "Permitir leitura atividades" ON public.assigned_activities FOR ALL USING (true);
