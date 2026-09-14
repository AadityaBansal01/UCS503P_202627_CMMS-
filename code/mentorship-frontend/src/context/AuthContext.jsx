import { createContext, useContext, useMemo, useState } from "react";
import { loginUser as loginRequest, getErrorMessage } from "../services/api";

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("mentorshipUser"));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("mentorshipToken"));
  const [user, setUser] = useState(readStoredUser);

  const login = async (credentials) => {
    const response = await loginRequest(credentials);
    const authToken = response.data?.token;
    const authUser = response.data?.user;

    if (!authToken || !authUser) {
      throw new Error("Login response did not include authentication details.");
    }

    localStorage.setItem("mentorshipToken", authToken);
    localStorage.setItem("mentorshipUser", JSON.stringify(authUser));
    setToken(authToken);
    setUser(authUser);
    return authUser;
  };

  const logout = () => {
    localStorage.removeItem("mentorshipToken");
    localStorage.removeItem("mentorshipUser");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      role: user?.role,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
      getErrorMessage,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

