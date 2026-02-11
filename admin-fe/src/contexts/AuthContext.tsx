import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type {
  AuthContextType,
  AuthResponseType,
} from "./types/AuthContextTypes";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const apiURL = import.meta.env.VITE_API_URL;
  const [authResponse, setAuthResponse] = useState<AuthResponseType | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(false);
    };
    initializeAuth();
  }, []);

  // const
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${apiURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data: AuthResponseType = await response.json();

      if (!response.ok) {
        throw new Error(data.message || response.statusText);
      }
      
      if (!data.data.roles.includes("ADMIN")) {
        throw new Error("Username or Password is incorrect.")
      }
      setAuthResponse(data);
      return true;
    } catch (error: any) {
      setAuthResponse(null);
      throw error;
    }
  };

  const refreshToken = async (): Promise<AuthResponseType | null> => {
    try {
      const response = await fetch(`${apiURL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data: AuthResponseType = await response.json();

      if (!response.ok) {
        throw new Error(data.message || response.statusText);
      }

      setAuthResponse(data);
      return data;
    } catch (error: any) {
      toast.error(error.message || "Session expired. Please log in again.");
      return null;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch(`${apiURL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error: any) {
      toast.error(error.message || "Session expired. Please log in again.");
    } finally {
      setAuthResponse(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authResponse,
        login,
        refreshToken,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
