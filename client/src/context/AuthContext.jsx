import { createContext, useState, useContext, useEffect } from "react";

import {
  checkAuthRequest,
  registerRequest,
  loginRequest,
  logoutRequest,
  getAllUsersRequest,
  profileRequest,
  updateProfileRequest,
} from "../api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      setUser(res);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      setErrors(error.response ? error.response.data : error.message);
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      setUser(res);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      setErrors(error.response ? error.response.data : error.message);
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await logoutRequest();
    setUser(null);
    setIsAuthenticated(null);
    setLoading(false);
  };

  const getAllUsers = async () => {
    try {
      const res = await getAllUsersRequest();
      return res;
    } catch (error) {
      setErrors(error.response ? error.response.data : error.message);
    }
  };

  const profile = async () => {
    setLoading(true);
    try {
      const res = await profileRequest();
      setUser(res);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  const updateProfile = async (user) => {
    setLoading(true);
    try {
      console.log("Guardado", user);
      const res = await updateProfileRequest(user);
      setUser(res);
      return "Perfil actualizado";
    } catch (error) {
      setErrors(error.response ? error.response.data : error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    async function checkLogin() {
      setLoading(true);
      try {
        const res = await checkAuthRequest();
        if (res) {
          setUser(res);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
      setLoading(false);
    }
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        logout,
        getAllUsers,
        profile,
        updateProfile,
        user,
        isAuthenticated,
        errors,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  // Create a custom hook to use the AuthContext
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
