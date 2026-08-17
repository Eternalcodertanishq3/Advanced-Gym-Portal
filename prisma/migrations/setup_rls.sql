-- ═══════════════════════════════════════════════════════════════
-- 🦅 GymFlow SaaS — PostgreSQL Row-Level Security (RLS) Policies
-- Enforces physical database-level tenant isolation across all tables
-- ═══════════════════════════════════════════════════════════════

-- Function to safely enable RLS and create tenant isolation policy on a table
CREATE OR REPLACE FUNCTION enable_tenant_rls(table_name text) RETURNS void AS $$
BEGIN
  -- 1. Enable Row Level Security on the table
  EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', table_name);

  -- 2. Drop existing policy if present
  EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_policy ON %I;', table_name);

  -- 3. Create tenant isolation policy using session variable 'app.current_tenant_id'
  -- Allows access if tenant_id matches, or if app.current_tenant_id is 'SUPER_ADMIN_BYPASS'
  EXECUTE format('
    CREATE POLICY tenant_isolation_policy ON %I
    AS RESTRICTIVE
    USING (
      tenant_id = NULLIF(current_setting(''app.current_tenant_id'', true), '''')
      OR current_setting(''app.current_tenant_id'', true) = ''SUPER_ADMIN_BYPASS''
    )
    WITH CHECK (
      tenant_id = NULLIF(current_setting(''app.current_tenant_id'', true), '''')
      OR current_setting(''app.current_tenant_id'', true) = ''SUPER_ADMIN_BYPASS''
    );
  ', table_name);
END;
$$ LANGUAGE plpgsql;

-- Apply RLS across all tenant-scoped tables
DO $$
DECLARE
  tbl text;
  tenant_tables text[] := ARRAY[
    'branches',
    'users',
    'plans',
    'subscriptions',
    'payments',
    'attendances',
    'gym_classes',
    'pt_sessions',
    'workout_plans',
    'diet_plans',
    'equipments',
    'products',
    'sales',
    'tasks',
    'conversations',
    'notifications',
    'documents',
    'visitor_passes',
    'gym_settings',
    'backups',
    'testimonials'
  ];
BEGIN
  FOREACH tbl IN ARRAY tenant_tables LOOP
    -- Only apply if table exists in the current schema
    IF EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = tbl
    ) THEN
      PERFORM enable_tenant_rls(tbl);
    END IF;
  END LOOP;
END;
$$;
