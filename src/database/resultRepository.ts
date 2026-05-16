import { getDb } from "./sqlite";
import { encrypt, decrypt } from "../utils/encryption";

export interface LocalActivityResult {
  id: string;
  firestoreId: string | null;
  uid: string;
  teamId: string;
  activityId: string;
  activityName: string;
  score: number;
  rating: number;
  reflection: string;
  sensorSummary: Record<string, string>;
  videoUrls: string[];
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
  const encReflection = await encrypt(result.reflection);
  await db.runAsync(
    `INSERT INTO activity_results
     (id, uid, team_id, activity_id, activity_name, score, rating, reflection, sensor_summary, video_urls, completed_at, synced)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    [
      id,
      result.uid,
      result.teamId,
      result.activityId,
      result.activityName,
      result.score,
      result.rating,
      encReflection,
      JSON.stringify(result.sensorSummary),
      JSON.stringify(result.videoUrls),
      result.completedAt,
    ]
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
  return Promise.all(rows.map(rowToResult));
}

export async function getResultsByTeam(teamId: string): Promise<LocalActivityResult[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    `SELECT * FROM activity_results WHERE team_id = ? ORDER BY completed_at DESC`,
    [teamId]
  );
  return Promise.all(rows.map(rowToResult));
}

function parseSensorSummary(raw: unknown): Record<string, string> {
  try { return JSON.parse(raw as string); } catch { return {}; }
}

async function rowToResult(row: Record<string, unknown>): Promise<LocalActivityResult> {
  let videoUrls: string[] = [];
  try {
    videoUrls = JSON.parse((row.video_urls as string | null) ?? "[]");
  } catch {}

  const rawReflection = (row.reflection as string | null) ?? "";
  const reflection = rawReflection ? await decrypt(rawReflection) : "";

  return {
    id: row.id as string,
    firestoreId: (row.firestore_id as string | null) ?? null,
    uid: row.uid as string,
    teamId: row.team_id as string,
    activityId: row.activity_id as string,
    activityName: row.activity_name as string,
    score: row.score as number,
    rating: (row.rating as number | null) ?? 0,
    reflection,
    sensorSummary: parseSensorSummary(row.sensor_summary),
    videoUrls,
    completedAt: row.completed_at as string,
    synced: row.synced === 1,
    syncError: (row.sync_error as string | null) ?? null,
  };
}
