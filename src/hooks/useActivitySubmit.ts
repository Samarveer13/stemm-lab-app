import { useAuth } from "../context/AuthContext";
import { insertResult } from "../database/resultRepository";
import { syncPendingResults } from "../services/syncService";
import { uploadVideo } from "../services/storageService";
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

    const videoUrls = await uploadVideos(payload.videos, user.uid, activityId);

    await insertResult({
      uid: user.uid,
      teamId,
      activityId,
      activityName,
      score,
      rating: payload.rating,
      reflection: payload.reflection,
      sensorSummary: payload.sensorSummary,
      videoUrls,
      completedAt: new Date().toISOString(),
    });

    syncPendingResults().catch(() => {});
  };
}

async function uploadVideos(
  videos: SubmitPayload["videos"],
  uid: string,
  activityId: string
): Promise<string[]> {
  const urls: string[] = [];
  for (const slot of videos) {
    if (!slot.uri) continue;
    try {
      const path = `videos/${uid}/${activityId}/${Date.now()}_${slot.id}`;
      const url = await uploadVideo(slot.uri, path);
      urls.push(url);
    } catch {
      // Skip failed uploads — result still saves without that video
    }
  }
  return urls;
}
