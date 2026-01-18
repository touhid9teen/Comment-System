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
        if (response.data.success && response.data.data) {
          setState({
            user: response.data.data,
            token: null, // Correct: Token is handled by session cookies
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
