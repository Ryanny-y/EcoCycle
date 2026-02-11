import useAuth from "@/contexts/AuthContext";
import { useCallback } from "react";

const useAuthFetch = () => {
  const apiURL = import.meta.env.VITE_API_URL;
  const { authResponse, refreshToken, logout } = useAuth();

  const authFetch = useCallback(  
    async (url: string, options: RequestInit &  { raw?: boolean } = {}) => {
      let token = authResponse?.data.accessToken;

      const headers = {
        ...(options.headers || {}),
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }

      if (!options.raw && !(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }

      try {
        let response = await fetch(`${apiURL}/${url}`, {
          ...options,
          headers,
          "credentials": 'include'
        });

        if (response.status === 401) {
          try {
            const newTokens = await refreshToken();
            token = newTokens?.data.accessToken;

            const retryHeaders = {
              ...(options.headers || {}),
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }

            response = await fetch(`${apiURL}/${url}`, {
              ...options,
              headers: retryHeaders,
              "credentials": "include"
            })
          } catch (refreshErr: any) {
            console.log(refreshErr);
            logout();
            throw refreshErr;
          }
        }

        if (options.raw) return response;
        
        const data = await response.json();
        
        if(!response.ok) {
          throw new Error(data?.message || response.statusText);
        }

        return data;
      } catch (error: any) {
        throw error;
      }

  }, [apiURL, authResponse?.data.accessToken, refreshToken, logout]);

  return authFetch;
};

export default useAuthFetch;