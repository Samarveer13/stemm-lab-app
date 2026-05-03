import { getDb } from "./sqlite";

export interface LocalActivityResult {
  id: string;
  firestoreId: string | null;
  uid: string;
  teamId: string;
  activityId: string;
  activityName: string;
  score: number;
  completedAt: string;
  synced: boolean;
  syncError: string | null;
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function insertResult(
  result: Omit<LocalActivityResult, "id" | "firestoreId" | "synced" | "syncError">
): Promise<string> {
  const db = await getDb();
  const id = makeId();
  await db.runAsync(
    `INSERT INTO activity_results
     (id, uid, team_id, activity_id, activity_name, score, completed_at, synced)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
    [id, result.uid, result.teamId, result.activityId, result.activityName, result.score, result.completedAt]
  );
  return id;
}

export async function markSynced(localId: string, firestoreId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE activity_results SET synced = 1, firestore_id = ?, sync_error = NULL WHERE id = ?`,
    [firestoreId, localId]
  );
}

export async function markSyncFailed(localId: string, error: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE activity_results SET sync_error = ? WHERE id = ?`,
    [error, localId]
  );
}

export async function getPendingResults(): Promise<LocalActivityResult[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM activity_results WHERE synced = 0 ORDER BY completed_at ASC`
  );
  return rows.map(rowToResult);
}

export async function getResultsByTeam(teamId: string): Promise<LocalActivityResult[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM activity_results WHERE team_id = ? ORDER BY completed_at DESC`,
    [teamId]
  );
  return rows.map(rowToResult);
}

function rowToResult(row: Record<string, unknown>): LocalActivityResult {
  return {
    id: row.id as string,
    firestoreId: (row.firestore_id as string | null) ?? null,
    uid: row.uid as string,
    teamId: row.team_id as string,
    activityId: row.activity_id as string,
    activityName: row.activity_name as string,
    score: row.score as number,
    completedAt: row.completed_at as string,
    synced: row.synced === 1,
    syncError: (row.sync_error as string | null) ?? null,
  };
}
