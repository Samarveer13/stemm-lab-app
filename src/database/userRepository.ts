import { getDb } from "./sqlite";
import { encrypt, decrypt, encryptNullable, decryptNullable } from "../utils/encryption";

export interface CachedUserProfile {
  uid: string;
  memberNames: string[];
  teamId: string;
  teamName: string;
  teamCode: string;
  yearLevel: string;
  email: string | null;
  isAnonymous: boolean;
  createdAt: string | null;
  updatedAt: string;
}

export async function upsertUserProfile(profile: CachedUserProfile): Promise<void> {
  const db = await getDb();

  const [encEmail, encMemberNames, encTeamCode] = await Promise.all([
    encryptNullable(profile.email),
    encrypt(JSON.stringify(profile.memberNames)),
    encrypt(profile.teamCode),
  ]);

  await db.runAsync(
    `INSERT INTO user_profile
     (uid, member_names, team_id, team_name, team_code, year_level, email, is_anonymous, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(uid) DO UPDATE SET
       member_names  = excluded.member_names,
       team_id       = excluded.team_id,
       team_name     = excluded.team_name,
       team_code     = excluded.team_code,
       year_level    = excluded.year_level,
       email         = excluded.email,
       is_anonymous  = excluded.is_anonymous,
       updated_at    = excluded.updated_at`,
    [
      profile.uid,
      encMemberNames,
      profile.teamId,
      profile.teamName,
      encTeamCode,
      profile.yearLevel,
      encEmail,
      profile.isAnonymous ? 1 : 0,
      profile.createdAt,
      profile.updatedAt,
    ]
  );
}

export async function getUserProfileFromCache(uid: string): Promise<CachedUserProfile | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<Record<string, unknown>>(
    `SELECT * FROM user_profile WHERE uid = ?`,
    [uid]
  );
  if (!row) return null;

  const [memberNames, teamCode, email] = await Promise.all([
    decrypt(row.member_names as string).then((s) => JSON.parse(s) as string[]),
    decrypt(row.team_code as string),
    decryptNullable((row.email as string | null) ?? null),
  ]);

  return {
    uid: row.uid as string,
    memberNames,
    teamId: row.team_id as string,
    teamName: row.team_name as string,
    teamCode,
    yearLevel: row.year_level as string,
    email,
    isAnonymous: row.is_anonymous === 1,
    createdAt: (row.created_at as string | null) ?? null,
    updatedAt: row.updated_at as string,
  };
}

export async function clearUserProfile(uid: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM user_profile WHERE uid = ?`, [uid]);
}
