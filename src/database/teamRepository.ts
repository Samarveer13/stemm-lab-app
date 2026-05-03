import { getDb } from "./sqlite";
import type { LeaderboardEntry } from "../services/firestoreService";

const LEADERBOARD_TTL_MS = 5 * 60 * 1000; // 5 minutes

export interface CachedTeam {
  id: string;
  teamName: string;
  teamCode: string;
  memberNames: string[];
  memberUids: string[];
  totalScore: number;
  experimentsCompleted: number;
  createdAt: string | null;
  createdBy: string | null;
  cachedAt: string;
}

// ── Teams ─────────────────────────────────────────────────────────────────────

export async function upsertTeam(team: Omit<CachedTeam, "cachedAt">): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO teams
     (id, team_name, team_code, member_names, member_uids, total_score, experiments_completed, created_at, created_by, cached_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       team_name             = excluded.team_name,
       team_code             = excluded.team_code,
       member_names          = excluded.member_names,
       member_uids           = excluded.member_uids,
       total_score           = excluded.total_score,
       experiments_completed = excluded.experiments_completed,
       cached_at             = excluded.cached_at`,
    [
      team.id,
      team.teamName,
      team.teamCode,
      JSON.stringify(team.memberNames),
      JSON.stringify(team.memberUids),
      team.totalScore,
      team.experimentsCompleted,
      team.createdAt,
      team.createdBy,
      new Date().toISOString(),
    ]
  );
}

export async function getTeamById(id: string): Promise<CachedTeam | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Record<string, unknown>>(
    `SELECT * FROM teams WHERE id = ?`,
    [id]
  );
  return row ? rowToTeam(row) : null;
}

// ── Leaderboard cache ─────────────────────────────────────────────────────────

export async function upsertLeaderboard(entries: LeaderboardEntry[]): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM leaderboard_cache`);
  const now = new Date().toISOString();
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    await db.runAsync(
      `INSERT INTO leaderboard_cache
       (team_id, rank, team_name, team_code, total_score, experiments_completed, cached_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [e.id, i + 1, e.teamName, e.teamCode, e.totalScore, e.experimentsCompleted, now]
    );
  }
}

export async function getCachedLeaderboard(): Promise<{
  entries: LeaderboardEntry[];
  stale: boolean;
} | null> {
  const db = await getDb();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM leaderboard_cache ORDER BY rank ASC`
  );
  if (rows.length === 0) return null;
  const cachedAt = new Date(rows[0].cached_at as string).getTime();
  const stale = Date.now() - cachedAt > LEADERBOARD_TTL_MS;
  return {
    entries: rows.map((r) => ({
      id: r.team_id as string,
      teamName: r.team_name as string,
      teamCode: r.team_code as string,
      totalScore: r.total_score as number,
      experimentsCompleted: r.experiments_completed as number,
    })),
    stale,
  };
}

// ── Internal ──────────────────────────────────────────────────────────────────

function rowToTeam(row: Record<string, unknown>): CachedTeam {
  return {
    id: row.id as string,
    teamName: row.team_name as string,
    teamCode: row.team_code as string,
    memberNames: JSON.parse(row.member_names as string),
    memberUids: JSON.parse(row.member_uids as string),
    totalScore: row.total_score as number,
    experimentsCompleted: row.experiments_completed as number,
    createdAt: (row.created_at as string | null) ?? null,
    createdBy: (row.created_by as string | null) ?? null,
    cachedAt: row.cached_at as string,
  };
}
