export const SCHEMA_VERSION = 4;

export const CREATE_TABLES_SQL = `
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS user_profile (
  uid              TEXT PRIMARY KEY,
  member_names     TEXT NOT NULL DEFAULT '[]',
  team_id          TEXT NOT NULL DEFAULT '',
  team_name        TEXT NOT NULL DEFAULT '',
  team_code        TEXT NOT NULL DEFAULT '',
  year_level       TEXT NOT NULL DEFAULT '',
  email            TEXT,
  is_anonymous     INTEGER NOT NULL DEFAULT 0,
  created_at       TEXT,
  updated_at       TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS teams (
  id                     TEXT PRIMARY KEY,
  team_name              TEXT NOT NULL,
  team_code              TEXT NOT NULL,
  member_names           TEXT NOT NULL DEFAULT '[]',
  member_uids            TEXT NOT NULL DEFAULT '[]',
  total_score            INTEGER NOT NULL DEFAULT 0,
  experiments_completed  INTEGER NOT NULL DEFAULT 0,
  created_at             TEXT,
  created_by             TEXT,
  cached_at              TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS activity_results (
  id            TEXT PRIMARY KEY,
  firestore_id  TEXT,
  uid           TEXT NOT NULL,
  team_id       TEXT NOT NULL,
  activity_id   TEXT NOT NULL,
  activity_name TEXT NOT NULL,
  score         INTEGER NOT NULL,
  completed_at  TEXT NOT NULL,
  synced        INTEGER NOT NULL DEFAULT 0,
  sync_error    TEXT
);

CREATE TABLE IF NOT EXISTS leaderboard_cache (
  team_id               TEXT PRIMARY KEY,
  rank                  INTEGER NOT NULL,
  team_name             TEXT NOT NULL,
  team_code             TEXT NOT NULL,
  total_score           INTEGER NOT NULL,
  experiments_completed INTEGER NOT NULL,
  cached_at             TEXT NOT NULL
);
`;
