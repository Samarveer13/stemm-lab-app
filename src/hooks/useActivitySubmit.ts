import { useAuth } from "../context/AuthContext";
import { saveActivityResult } from "../services/firestoreService";
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

    await saveActivityResult({ uid: user.uid, teamId, activityId, activityName, score });
  };
}
