-- Création de la table difficulty_level
CREATE TABLE IF NOT EXISTS difficulty_level (
    id_difficulty SERIAL PRIMARY KEY,
    level VARCHAR(50) NOT NULL UNIQUE CHECK (
        level IN ('Facile', 'Moyen', 'Difficile')
    )
);

-- Insertion des niveaux de difficulté
INSERT INTO difficulty_level (level) VALUES 
('Facile'), 
('Moyen'), 
('Difficile')
ON CONFLICT (level) DO NOTHING;

-- Création de la table mot_pendu
CREATE TABLE IF NOT EXISTS mot_pendu (
    id_mot SERIAL PRIMARY KEY,
    mot VARCHAR(50) NOT NULL UNIQUE CHECK (LENGTH(mot) > 1),
    id_difficulty INTEGER NOT NULL REFERENCES difficulty_level ON DELETE CASCADE
);

-- Création de la table player
CREATE TABLE IF NOT EXISTS player (
    id_player SERIAL PRIMARY KEY,
    pseudo VARCHAR(50) NOT NULL UNIQUE CHECK (LENGTH(pseudo) > 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table score
CREATE TABLE IF NOT EXISTS score (
    id_score SERIAL PRIMARY KEY,
    id_player INTEGER NOT NULL REFERENCES player ON DELETE CASCADE,
    id_mot INTEGER NOT NULL REFERENCES mot_pendu ON DELETE CASCADE,
    score_player INTEGER NOT NULL CHECK (score_player >= 0),
    date_partie TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nb_essaie INTEGER NOT NULL CHECK (nb_essaie > 0),
    nb_lettres INTEGER NOT NULL CHECK (nb_lettres > 0),
    statut VARCHAR(50) NOT NULL CHECK (
        statut IN ('Gagnée', 'Perdue', 'En cours')
    )
);
