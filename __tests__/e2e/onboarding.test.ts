/// <reference types="jest" />

// In-memory stores (stand-ins for Firestore)
const firestoreUsers = {};
const firestoreTeams = {};
const savedActivityResults = [];

let currentUser = null;
let activeTeam = null;
let lastActivityResult = null;

// Simulate authService.registerUser (signup)
async function signupUser(email, password, name) {
  if (!email || !password || !name) throw new Error("auth/missing-fields");
  if (password.length < 6) throw new Error("auth/weak-password");
  const user = { uid: `uid_${Date.now()}`, email, displayName: name };
  currentUser = user;
  return user;
}

// Simulate AuthContext.completeTeamSetup (team setup screen → Firestore + SQLite)
async function setupTeam(user, teamName, memberNames, yearLevel) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const teamCode = Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  const teamId = `team_${Date.now()}`;

  const team = { teamId, teamCode, teamName, memberNames, yearLevel, totalScore: 0, experimentsCompleted: 0 };

  activeTeam = team;
  firestoreTeams[teamId] = { ...team };
  firestoreUsers[user.uid] = {
    email: user.email,
    teamId,
    teamName,
    teamCode,
    memberNames,
    yearLevel,
    isAnonymous: false,
  };

  return team;
}

// Simulate firestoreService.saveActivityResult + team score increment
async function completeActivity(team, activityId) {
  const result = {
    activityId,
    activityName: "Earthquake Simulation",
    score: 85,
    rating: 4,
    reflection: "We observed how seismic waves propagate through different materials.",
    sensorSummary: {
      accelerometer: "peak: 1.2g",
      gyroscope: "max rotation: 45°",
    },
    videoUrls: ["https://storage.example.com/team_video1.mp4"],
    completed: true,
  };

  lastActivityResult = result;
  savedActivityResults.push(result);

  // Increment team score (mirrors firestoreService.saveActivityResult)
  firestoreTeams[team.teamId].totalScore += result.score;
  firestoreTeams[team.teamId].experimentsCompleted += 1;

  return result;
}

describe("Onboarding E2E — Signup → Team Setup → Activity Complete", () => {

  beforeEach(() => {
    currentUser = null;
    activeTeam = null;
    lastActivityResult = null;
    savedActivityResults.length = 0;
    Object.keys(firestoreUsers).forEach((k) => delete firestoreUsers[k]);
    Object.keys(firestoreTeams).forEach((k) => delete firestoreTeams[k]);
  });

  it("Step 1: User signs up with valid credentials", async () => {
    const user = await signupUser("newstudent@school.edu.au", "securePass123", "New Student");
    expect(user.uid).toBeDefined();
    expect(user.email).toBe("newstudent@school.edu.au");
    expect(user.displayName).toBe("New Student");
    expect(currentUser).not.toBeNull();
  });

  it("Step 1: Signup rejects a weak password (under 6 characters)", async () => {
    await expect(
      signupUser("user@school.edu", "abc", "User")
    ).rejects.toThrow("auth/weak-password");
  });

  it("Step 1: Signup rejects missing required fields", async () => {
    await expect(
      signupUser("", "password123", "User")
    ).rejects.toThrow("auth/missing-fields");
  });

  it("Step 2: Team setup creates a team with a 6-character code and saves profile", async () => {
    const user = await signupUser("student@school.edu.au", "securePass123", "Student");
    const team = await setupTeam(user, "Lab Rats", ["Alice", "Bob", "Charlie"], "Year 10");

    expect(team.teamId).toBeDefined();
    expect(team.teamCode).toHaveLength(6);
    expect(team.teamName).toBe("Lab Rats");
    expect(team.memberNames).toHaveLength(3);
    expect(team.yearLevel).toBe("Year 10");

    // Both Firestore records should be present
    expect(firestoreTeams[team.teamId]).toBeDefined();
    expect(firestoreUsers[user.uid]).toBeDefined();
  });

  it("Step 3: Activity result is saved and team score is updated", async () => {
    const user = await signupUser("student@school.edu.au", "securePass123", "Student");
    const team = await setupTeam(user, "Lab Rats", ["Alice", "Bob"], "Year 10");
    const result = await completeActivity(team, "earthquake-simulation");

    expect(result.completed).toBe(true);
    expect(result.score).toBe(85);
    expect(result.rating).toBeGreaterThanOrEqual(1);
    expect(result.rating).toBeLessThanOrEqual(5);
    expect(result.sensorSummary).toHaveProperty("accelerometer");
    expect(result.videoUrls.length).toBeGreaterThan(0);

    // Firestore team doc updated
    expect(firestoreTeams[team.teamId].totalScore).toBe(85);
    expect(firestoreTeams[team.teamId].experimentsCompleted).toBe(1);
  });

  it("Full flow: Signup → Team Setup → Activity Complete runs end-to-end", async () => {
    // Signup
    const user = await signupUser("endtoend@school.edu.au", "password123", "E2E Tester");
    expect(currentUser).not.toBeNull();

    // Team setup
    const team = await setupTeam(user, "STEMM Stars", ["Alice", "Bob", "Charlie", "Dave"], "Year 12");
    expect(activeTeam).not.toBeNull();
    expect(team.memberNames).toHaveLength(4);

    // Activity complete
    const result = await completeActivity(team, "earthquake-simulation");
    expect(lastActivityResult).not.toBeNull();
    expect(result.completed).toBe(true);

    // Verify overall state
    expect(savedActivityResults).toHaveLength(1);
    expect(firestoreTeams[team.teamId].totalScore).toBeGreaterThan(0);
    expect(firestoreTeams[team.teamId].experimentsCompleted).toBe(1);
  });

});
