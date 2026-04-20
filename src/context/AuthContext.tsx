import React, { createContext, useContext, useEffect, useState } from "react";

// Minimal user shape matching Firebase's User fields we actually use
interface MockUser {
  displayName: string | null;
  email: string | null;
}

interface AuthState {
  user: MockUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mirrors the async nature of Firebase's onAuthStateChanged so the
    // navigator is fully mounted before any redirect fires.
    setLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    setUser({ displayName: email.split("@")[0] || "Student", email });
  };

  const register = async (email: string, _password: string, name: string) => {
    setUser({ displayName: name, email });
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// ── TODO: swap mock above for real Firebase auth when ready ──────────────────
// import { User, onAuthStateChanged } from "firebase/auth";
// import { auth } from "../config/firebase";
// import { loginUser, logoutUser, registerUser } from "../services/authService";
