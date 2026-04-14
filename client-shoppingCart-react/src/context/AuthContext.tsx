import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { authApi, setToken, getToken } from "@/services/supabaseApi";

interface AuthContextType {
  isAuthenticated: boolean;
  userName: string | null;
  login: (userName: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());
  const [userName, setUserName] = useState<string | null>(localStorage.getItem("user_name"));

  const login = useCallback(async (uName: string, pass: string) => {
    try {
      const res = await authApi.login({ userName: uName, password: pass });
      
      setToken(res.token);
      setUserName(uName);
      setIsAuthenticated(true);
      localStorage.setItem("user_name", uName);
      
      // No need to reload - React will update automatically
    } catch (error) {
      console.error("Login context error:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setIsAuthenticated(false);
    setUserName(null);
    
    // חזרה לדף הבית וניקוי
    window.location.href = "/"; 
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};