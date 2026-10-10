import { createContext, useContext, useState } from "react";
import { login as loginRequest } from "../services/auth.service";

const AuthContext = createContext(null);
const STORAGE_KEY = "oddi_admin_token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));

  async function login(email, password) {
    const result = await loginRequest(email, password);
    localStorage.setItem(STORAGE_KEY, result.token);
    setToken(result.token);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
  }

  const value = { token, login, logout, isAuthenticated: Boolean(token) };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return context;
}
