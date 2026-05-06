import { useAuth } from "../context/AuthContext";
import { insertResult } from "../database/resultRepository";
import { syncPendingResults } from "../services/syncService";
import type { SubmitPayload } from "../components/Conducttab";

export function useActivitySubmit(activityId: string, activityName: string) {
  const { user, teamId } = useAuth();

  return async (payload: SubmitPayload): Promise<void> => {
    if (!user || !teamId) return;

    const score =
      50 +
      Math.min(payload.videos.length * 5, 15) +
      (payload.gps ? 10 : 0) +
      payload.rating * 5;

    // Write to SQLite immediately — survives network failure or app crash
    await insertResult({
      uid: user.uid,
      teamId,
      activityId,
      activityName,
      score,
      completedAt: new Date().toISOString(),
    });

    // Sync to Firestore in the background — never blocks the UI
    syncPendingResults().catch(() => {});
  };
}
