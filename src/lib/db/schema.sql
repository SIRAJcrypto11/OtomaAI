-- NEXUS AI 2.1 — Master Database Schema
-- Provider: Vercel Postgres (Neon-powered)

-- 1. Workspaces (Multi-tenancy root)
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID NOT NULL,
    plan TEXT DEFAULT 'Starter' CHECK (plan IN ('Starter', 'Professional', 'Enterprise')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users (with RBAC)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id),
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    image TEXT,
    password TEXT, -- bcrypt hash for Credentials sign-in (null for OAuth-only users)
    role TEXT DEFAULT 'Operator' CHECK (role IN ('Super Admin', 'Workspace Owner', 'Agent Builder', 'Operator')),
    email_verified TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Agents (The BYOK Brains)
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    prompt_template TEXT NOT NULL DEFAULT 'You are a helpful NEXUS AI assistant.',
    provider TEXT NOT NULL DEFAULT 'gemini', -- 'gemini', 'groq', 'ollama', etc.
    model_name TEXT NOT NULL DEFAULT 'gemini-1.5-flash',
    type TEXT DEFAULT 'Custom',
    role TEXT DEFAULT 'Agent',
    encrypted_api_key TEXT, -- AES-256-GCM encrypted
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Paused', 'Offline')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Integrations (Channels)
CREATE TABLE IF NOT EXISTS integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'telegram', 'whatsapp', 'discord', etc.
    config JSONB NOT NULL DEFAULT '{}', -- Encrypted tokens/webhook secrets
    status TEXT DEFAULT 'Disconnected' CHECK (status IN ('Connected', 'Disconnected', 'Error')),
    last_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Conversations & Messages (Memory)
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    session_id TEXT,
    role TEXT NOT NULL CHECK (role IN ('system', 'user', 'assistant', 'tool')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Workflows (Visual Automation)
CREATE TABLE IF NOT EXISTS workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    nodes JSONB NOT NULL DEFAULT '[]',
    edges JSONB NOT NULL DEFAULT '[]',
    status TEXT DEFAULT 'Draft' CHECK (status IN ('Draft', 'Active', 'Inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Analytics & Usage
CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id),
    token_count INTEGER DEFAULT 0,
    cost_estimate DECIMAL(10, 5) DEFAULT 0, -- Platform cost tracking
    event_type TEXT, -- 'chat_message', 'tool_execution', etc.
    action TEXT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 8. Incremental migrations (safe to re-run on existing DBs)
--    Keeps previously provisioned databases aligned with the
--    columns used by the application server actions.
-- ============================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;

ALTER TABLE agents ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Custom';
ALTER TABLE agents ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Agent';
ALTER TABLE agents ALTER COLUMN prompt_template SET DEFAULT 'You are a helpful NEXUS AI assistant.';
ALTER TABLE agents ALTER COLUMN provider SET DEFAULT 'gemini';
ALTER TABLE agents ALTER COLUMN model_name SET DEFAULT 'gemini-1.5-flash';

ALTER TABLE messages ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES agents(id) ON DELETE SET NULL;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS session_id TEXT;

ALTER TABLE usage_logs ADD COLUMN IF NOT EXISTS action TEXT;
ALTER TABLE usage_logs ADD COLUMN IF NOT EXISTS details TEXT;
