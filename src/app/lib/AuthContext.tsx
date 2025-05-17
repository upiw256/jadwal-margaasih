import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  authToken: string | null;
  user: any | null;
  loginUser: (token: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const userData = await AsyncStorage.getItem("user");
        if (token && userData) {
          setAuthToken(token);
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Failed to load auth data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthData();
  }, []);

  const loginUser = async (token: string, user: any) => {
    setAuthToken(token);
    setUser(user);
    try {
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Failed to save auth data", error);
    }
  };

  const logout = async () => {
    setAuthToken(null);
    setUser(null);
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("user");
    } catch (error) {
      console.error("Failed to remove auth data", error);
    }
  };

  const isLoggedIn = !!authToken;

  return (
    <AuthContext.Provider
      value={{ authToken, user, loginUser, logout, isLoggedIn, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam AuthProvider");
  }
  return context;
};
