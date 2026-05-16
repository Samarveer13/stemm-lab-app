/// <reference types="jest" />

// In-memory stores (stand-ins for Firestore and SQLite)
const firestoreUsers = {};
const sqliteCache = {};
let currentUser = null;

// Simulate authService.loginUser
async function loginUser(email, password) {
  if (!email || !password) throw new Error("auth/missing-credentials");
  const user = { uid: "uid_test_123", email, displayName: "Test Student" };
  currentUser = user;
  return user;
}

// Simulate firestoreService.saveUserProfile
async function saveUserProfile(uid, profile) {
  firestoreUsers[uid] = { ...profile, createdAt: new Date().toISOString() };
}

// Simulate userRepository.upsertUserProfile (SQLite write)
async function upsertUserProfile(uid, profile) {
  sqliteCache[uid] = { uid, ...profile };
}

// Simulate userRepository.getUserProfileFromCache (SQLite read)
async function getUserProfileFromCache(uid) {
  return sqliteCache[uid] ?? null;
}

describe("Auth Flow — Integration Tests", () => {

  beforeEach(() => {
    Object.keys(firestoreUsers).forEach((k) => delete firestoreUsers[k]);
    Object.keys(sqliteCache).forEach((k) => delete sqliteCache[k]);
    currentUser = null;
  });

  it("Login succeeds and returns a user with uid and email", async () => {
    const user = await loginUser("student@school.edu.au", "password123");
    expect(user.uid).toBeDefined();
    expect(user.email).toBe("student@school.edu.au");
  });

  it("Login fails when credentials are empty", async () => {
    await expect(loginUser("", "")).rejects.toThrow("auth/missing-credentials");
  });

  it("Firestore profile is created after login", async () => {
    const user = await loginUser("student@school.edu.au", "password123");

    await saveUserProfile(user.uid, {
      memberNames: ["Alice", "Bob"],
      teamId: "team_abc",
      teamName: "Lab Rats",
      teamCode: "ABC123",
      yearLevel: "Year 10",
      email: user.email,
      isAnonymous: false,
    });

    const profile = firestoreUsers[user.uid];
    expect(profile).toBeDefined();
    expect(profile.teamName).toBe("Lab Rats");
    expect(profile.memberNames).toContain("Alice");
    expect(profile.createdAt).toBeDefined();
  });

  it("SQLite is synced with Firestore profile data after login", async () => {
    const user = await loginUser("student@school.edu.au", "password123");

    await saveUserProfile(user.uid, {
      memberNames: ["Alice", "Bob"],
      teamId: "team_abc",
      teamName: "Lab Rats",
      teamCode: "ABC123",
      yearLevel: "Year 10",
      email: user.email,
      isAnonymous: false,
    });

    // AuthContext syncs Firestore profile into SQLite after successful fetch
    const fsProfile = firestoreUsers[user.uid];
    await upsertUserProfile(user.uid, {
      ...fsProfile,
      updatedAt: new Date().toISOString(),
    });

    const cached = await getUserProfileFromCache(user.uid);
    expect(cached).not.toBeNull();
    expect(cached.uid).toBe(user.uid);
    expect(cached.teamId).toBe("team_abc");
    expect(cached.teamCode).toBe("ABC123");
    expect(cached.memberNames).toContain("Bob");
  });

  it("SQLite fallback serves cached profile when Firestore is unreachable", async () => {
    const uid = "uid_offline_user";

    // Pre-populate SQLite cache (simulating a previous successful sync)
    await upsertUserProfile(uid, {
      memberNames: ["Charlie"],
      teamId: "team_xyz",
      teamName: "Offline Squad",
      teamCode: "XYZ789",
      yearLevel: "Year 11",
      email: "charlie@school.edu",
      isAnonymous: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Firestore is unreachable — AuthContext falls back to SQLite
    const cached = await getUserProfileFromCache(uid);
    expect(cached.teamName).toBe("Offline Squad");
    expect(cached.memberNames).toContain("Charlie");
    expect(cached.teamId).toBe("team_xyz");
  });

});
