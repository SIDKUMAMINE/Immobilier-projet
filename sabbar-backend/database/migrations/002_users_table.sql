-- Migration: Créer la table users pour l'authentification
-- Date: 2026-02-15

-- Créer la table users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    agency_name VARCHAR(255),
    
    -- Métadonnées
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    
    -- Index pour les requêtes fréquentes
    CONSTRAINT email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Créer les index
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Créer la table refresh_tokens pour les tokens JWT
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_expiry CHECK (expires_at > CURRENT_TIMESTAMP)
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- Ajouter des colonnes user_id aux tables existantes pour le lien agent/annonces
ALTER TABLE properties ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Activer Row Level Security (optionnel, pour plus de sécurité)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;

-- Politique RLS : Chaque utilisateur ne voit que ses données
CREATE POLICY "Users can view own data" ON users
    FOR SELECT
    USING (auth.uid() = id);