import { getPendingResults, markSynced, markSyncFailed } from "../database/resultRepository";
import { syncActivityResult } from "./firestoreService";

let _running = false;

export async function syncPendingResults(): Promise<void> {
  if (_running) return;
  _running = true;
  try {
    const pending = await getPendingResults();
    for (const result of pending) {
      try {
        const firestoreId = await syncActivityResult({
          uid: result.uid,
          teamId: result.teamId,
          activityId: result.activityId,
          activityName: result.activityName,
          score: result.score,
          rating: result.rating,
          reflection: result.reflection,
          sensorSummary: result.sensorSummary,
          videoUrls: result.videoUrls,
        });
        await markSynced(result.id, firestoreId);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        await markSyncFailed(result.id, message);
      }
    }
  } finally {
    _running = false;
  }
}
