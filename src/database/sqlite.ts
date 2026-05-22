import * as SQLite from "expo-sqlite";
import { CREATE_TABLES_SQL } from "./schema";

let _db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (_db) return _db;
  _db = await SQLite.openDatabaseAsync("stemm_lab.db");
  await _db.execAsync(CREATE_TABLES_SQL);
  await runMigrations(_db);
  return _db;
}

async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version");
  const version = row?.user_version ?? 0;

  if (version < 2) {
    try {
      await db.execAsync(
        "ALTER TABLE activity_results ADD COLUMN video_urls TEXT NOT NULL DEFAULT '[]'"
      );
    } catch {
      // Column already exists — safe to ignore
    }
    await db.execAsync("PRAGMA user_version = 2");
  }

  if (version < 3) {
    try {
      await db.execAsync(
        "ALTER TABLE activity_results ADD COLUMN rating INTEGER NOT NULL DEFAULT 0"
      );
    } catch {}
    try {
      await db.execAsync(
        "ALTER TABLE activity_results ADD COLUMN reflection TEXT NOT NULL DEFAULT ''"
      );
    } catch {}
    await db.execAsync("PRAGMA user_version = 3");
  }

  if (version < 4) {
    try {
      await db.execAsync(
        "ALTER TABLE activity_results ADD COLUMN sensor_summary TEXT NOT NULL DEFAULT '{}'"
      );
    } catch {}
    await db.execAsync("PRAGMA user_version = 4");
  }
}
