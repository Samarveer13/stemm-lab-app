import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  addDoc,
  arrayUnion,
  increment,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

// ── Types ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  memberNames: string[];
  teamId: string;
  teamName: string;
  teamCode: string;
  yearLevel: string;
  email: string | null;
  isAnonymous: boolean;
  createdAt: Timestamp;
}

export interface Team {
  teamName: string;
  teamCode: string;
  memberNames: string[];
  memberUids: string[];
  totalScore: number;
  experimentsCompleted: number;
  createdAt: Timestamp;
  createdBy: string;
}

export interface ActivityResult {
  uid: string;
  teamId: string;
  activityId: string;
  activityName: string;
  score: number;
  rating: number;
  reflection: string;
  sensorSummary: Record<string, string>;
  videoUrls: string[];
  completedAt: Timestamp;
}

export interface LeaderboardEntry {
  id: string;
  teamName: string;
  teamCode: string;
  totalScore: number;
  experimentsCompleted: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateTeamCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// ── User ─────────────────────────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function saveUserProfile(
  uid: string,
  profile: Omit<UserProfile, "createdAt">
) {
  await setDoc(doc(db, "users", uid), { ...profile, createdAt: serverTimestamp() });
}

// ── Teams ─────────────────────────────────────────────────────────────────────

export async function createTeam(
  teamName: string,
  memberNames: string[],
  createdBy: string
): Promise<{ teamId: string; teamCode: string }> {
  const teamCode = generateTeamCode();
  const ref = await addDoc(collection(db, "teams"), {
    teamName,
    teamCode,
    memberNames,
    memberUids: [createdBy],
    totalScore: 0,
    experimentsCompleted: 0,
    createdAt: serverTimestamp(),
    createdBy,
  });
  return { teamId: ref.id, teamCode };
}

export async function joinTeam(teamId: string, uid: string): Promise<void> {
  await updateDoc(doc(db, "teams", teamId), { memberUids: arrayUnion(uid) });
}

export async function getTeam(teamId: string): Promise<Team | null> {
  const snap = await getDoc(doc(db, "teams", teamId));
  return snap.exists() ? (snap.data() as Team) : null;
}

export async function findTeamByName(
  teamName: string
): Promise<{ id: string; data: Team } | null> {
  const q = query(collection(db, "teams"), where("teamName", "==", teamName));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, data: d.data() as Team };
}

export async function getLeaderboard(limitCount = 10): Promise<LeaderboardEntry[]> {
  const q = query(
    collection(db, "teams"),
    orderBy("totalScore", "desc"),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as Team;
    return {
      id: d.id,
      teamName: data.teamName,
      teamCode: data.teamCode,
      totalScore: data.totalScore,
      experimentsCompleted: data.experimentsCompleted,
    };
  });
}

// ── Activity Results ──────────────────────────────────────────────────────────

// Used by syncService — returns the new Firestore doc ID
export async function syncActivityResult(
  result: Omit<ActivityResult, "completedAt">
): Promise<string> {
  const ref = await addDoc(collection(db, "activityResults"), {
    ...result,
    completedAt: serverTimestamp(),
  });
  await updateDoc(doc(db, "teams", result.teamId), {
    totalScore: increment(result.score),
    experimentsCompleted: increment(1),
  });
  return ref.id;
}

// ── Leaderboard with SQLite cache ─────────────────────────────────────────────

export async function getLeaderboardWithCache(limitCount = 10): Promise<LeaderboardEntry[]> {
  const { getCachedLeaderboard, upsertLeaderboard } = await import(
    "../database/teamRepository"
  );

  const cached = await getCachedLeaderboard();
  if (cached && !cached.stale) return cached.entries;

  try {
    const entries = await getLeaderboard(limitCount);
    await upsertLeaderboard(entries);
    return entries;
  } catch {
    // Offline — serve stale cache rather than nothing
    return cached?.entries ?? [];
  }
}
