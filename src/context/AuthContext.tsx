import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { loginUser, logoutUser, registerUser, loginAnonymously } from "../services/authService";

interface AuthState {
  user: User | null;
  loading: boolean;
  teamReady: boolean;
  studentName: string;
  teamName: string;
  yearLevel: string;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  completeTeamSetup: (studentName: string, teamName: string, yearLevel: string) => void;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  teamReady: false,
  studentName: "",
  teamName: "",
  yearLevel: "",
  login: async () => {},
  register: async () => {},
  loginAsGuest: async () => {},
  logout: async () => {},
  completeTeamSetup: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [teamReady, setTeamReady] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [yearLevel, setYearLevel] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setTeamReady(false);
        setStudentName("");
        setTeamName("");
        setYearLevel("");
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

  const completeTeamSetup = (name: string, team: string, year: string) => {
    setStudentName(name);
    setTeamName(team);
    setYearLevel(year);
    setTeamReady(true);
  };

  return (
    <AuthContext.Provider value={{ user, loading, teamReady, studentName, teamName, yearLevel, login, register, loginAsGuest, logout, completeTeamSetup }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
