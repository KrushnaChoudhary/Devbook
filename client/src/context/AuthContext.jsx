import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // Load token from localStorage initially
  const [userToken, setUserToken] = useState(
    localStorage.getItem("token") || null
  );

  // Logged-in user's profile (id, name, username, etc.)
  const [user, setUser] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);

  // Fetch the current user's profile using the stored token
  const fetchCurrentUser = async () => {
    try {
      const { data } = await API.get("/users/me");

      setUser(data);
    } catch (error) {
      console.log("Failed to load current user:", error);

      // Token invalid/expired - log the user out
      localStorage.removeItem("token");

      setUserToken(null);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  // Whenever the token changes, refresh the current user
  useEffect(() => {
    if (userToken) {
      fetchCurrentUser();
    } else {
      setUser(null);
      setAuthLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userToken]);

  // Login
  const login = (token) => {

    localStorage.setItem("token", token);

    setUserToken(token);
  };

  // Logout
  const logout = () => {

    localStorage.removeItem("token");

    setUserToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        user,
        authLoading,
        login,
        logout,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
