import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { loginUser, logoutUser, registerUser, loginAnonymously } from "../services/authService";
import {
  getUserProfile,
  saveUserProfile,
  createTeam,
} from "../services/firestoreService";
import {
  upsertUserProfile,
  getUserProfileFromCache,
  clearUserProfile,
} from "../database/userRepository";
import { upsertTeam } from "../database/teamRepository";
import { syncPendingResults } from "../services/syncService";

interface AuthState {
  user: User | null;
  loading: boolean;
  teamReady: boolean;
  teamId: string;
  teamCode: string;
  teamName: string;
  yearLevel: string;
  memberNames: string[];
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  completeTeamSetup: (teamName: string, memberNames: string[], yearLevel: string) => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  teamReady: false,
  teamId: "",
  teamCode: "",
  teamName: "",
  yearLevel: "",
  memberNames: [],
  login: async () => {},
  register: async () => {},
  loginAsGuest: async () => {},
  logout: async () => {},
  completeTeamSetup: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [teamReady, setTeamReady] = useState(false);
  const [teamId, setTeamId] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [memberNames, setMemberNames] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        let resolved = false;

        // Primary: fetch from Firestore and cache locally
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile) {
            await upsertUserProfile({
              uid: firebaseUser.uid,
              memberNames: profile.memberNames,
              teamId: profile.teamId,
              teamName: profile.teamName,
              teamCode: profile.teamCode,
              yearLevel: profile.yearLevel ?? "",
              email: profile.email,
              isAnonymous: profile.isAnonymous,
              createdAt: profile.createdAt?.toDate?.()?.toISOString() ?? null,
              updatedAt: new Date().toISOString(),
            });
            setTeamName(profile.teamName);
            setTeamCode(profile.teamCode);
            setTeamId(profile.teamId);
            setYearLevel(profile.yearLevel ?? "");
            setMemberNames(profile.memberNames);
            setTeamReady(true);
            resolved = true;
          }
        } catch {
          // Firestore unreachable — fall through to SQLite cache
        }

        // Fallback: read from SQLite cache when offline
        if (!resolved) {
          const cached = await getUserProfileFromCache(firebaseUser.uid);
          if (cached && cached.teamId) {
            setTeamName(cached.teamName);
            setTeamCode(cached.teamCode);
            setTeamId(cached.teamId);
            setYearLevel(cached.yearLevel);
            setMemberNames(cached.memberNames);
            setTeamReady(true);
          }
        }

        // Retry any activity results that failed to sync previously
        syncPendingResults().catch(() => {});
      } else {
        setTeamReady(false);
        setTeamId("");
        setTeamCode("");
        setTeamName("");
        setYearLevel("");
        setMemberNames([]);
      }

      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await loginUser(email, password);
  };

  const register = async (email: string, password: string, name: string) => {
    await registerUser(email, password, name);
  };

  const loginAsGuest = async () => {
    await loginAnonymously();
  };

  const logout = async () => {
    await logoutUser();
  };

  const completeTeamSetup = async (team: string, members: string[], year: string) => {
    if (!user) return;

    const { teamId: newTeamId, teamCode: newTeamCode } = await createTeam(
      team,
      members,
      user.uid
    );

    await saveUserProfile(user.uid, {
      memberNames: members,
      teamId: newTeamId,
      teamName: team,
      teamCode: newTeamCode,
      yearLevel: year,
      email: user.email,
      isAnonymous: user.isAnonymous,
    });

    // Cache user profile and team locally
    const now = new Date().toISOString();
    await upsertUserProfile({
      uid: user.uid,
      memberNames: members,
      teamId: newTeamId,
      teamName: team,
      teamCode: newTeamCode,
      yearLevel: year,
      email: user.email,
      isAnonymous: user.isAnonymous,
      createdAt: now,
      updatedAt: now,
    });

    await upsertTeam({
      id: newTeamId,
      teamName: team,
      teamCode: newTeamCode,
      memberNames: members,
      memberUids: [user.uid],
      totalScore: 0,
      experimentsCompleted: 0,
      createdAt: now,
      createdBy: user.uid,
    });

    setTeamName(team);
    setTeamCode(newTeamCode);
    setTeamId(newTeamId);
    setYearLevel(year);
    setMemberNames(members);
    setTeamReady(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        teamReady,
        teamId,
        teamCode,
        teamName,
        yearLevel,
        memberNames,
        login,
        register,
        loginAsGuest,
        logout,
        completeTeamSetup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
