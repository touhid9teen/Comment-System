import {
  createContext,
  useContext,
  useState,
  useEffect,
  type FC,
  type ReactNode,
} from "react";
import api from "../config/axios";
import type { AuthState, User } from "../types";
import { API_ENDPOINTS } from "../config/api";

interface AuthContextType extends AuthState {
  setAuth: (auth: AuthState) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get<{ success: boolean; data: User }>(
          API_ENDPOINTS.AUTH.PROFILE,
        );

        console.log("Profile Data:", response.data);
        // Check if token comes with profile (sometimes used instead of just cookies)
        const responseData = response.data as any; // Cast to access potential dynamic fields
        const token = responseData.token || responseData.data?.token;

        if (response.data.success && response.data.data) {
          // If we received a token, set it in defaults (handling hybrid cookie/token auth)
          if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          }

          setState({
            user: response.data.data,
            token: token || null,
            isAuthenticated: true,
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const setAuth = (auth: AuthState) => {
    setState(auth);
  };

  const logout = async () => {
    try {
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        setAuth,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
