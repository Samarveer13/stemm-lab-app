import React, { createContext, useContext, useEffect, useState } from "react";

interface MockUser {
  displayName: string | null;
  email: string | null;
}

interface AuthState {
  user: MockUser | null;
  loading: boolean;
  teamReady: boolean;
  studentName: string;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  completeTeamSetup: (studentName: string) => void;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  teamReady: false,
  studentName: "",
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  completeTeamSetup: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [teamReady, setTeamReady] = useState(false);
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    // Mirrors the async nature of Firebase's onAuthStateChanged so the
    // navigator is fully mounted before any redirect fires.
    setLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    setTeamReady(false);
    setStudentName("");
    setUser({ displayName: email.split("@")[0] || "Student", email });
  };

  const register = async (email: string, _password: string, name: string) => {
    setTeamReady(false);
    setStudentName("");
    setUser({ displayName: name, email });
  };

  const logout = async () => {
    setTeamReady(false);
    setStudentName("");
    setUser(null);
  };

  const completeTeamSetup = (name: string) => {
    setStudentName(name);
    setTeamReady(true);
  };

  return (
    <AuthContext.Provider value={{ user, loading, teamReady, studentName, login, register, logout, completeTeamSetup }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// ── TODO: swap mock above for real Firebase auth when ready ──────────────────
// import { User, onAuthStateChanged } from "firebase/auth";
// import { auth } from "../config/firebase";
// import { loginUser, logoutUser, registerUser } from "../services/authService";
