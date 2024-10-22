import { createContext, useState, useContext, useEffect } from "react";

import {
  checkAuthRequest,
  registerRequest,
  loginRequest,
  logoutRequest,
  profileRequest,
  updateProfileRequest
} from "../api/auth"; // Import the request functions from the auth file

export const AuthContext = createContext(); 

export const AuthProvider = ({ children }) => {
  // Create a provider to wrap the application
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (user) => {
    // Create a signup function to register a user
    try {
      const res = await registerRequest(user); // Call the registerRequest function with the form values
      setUser(res);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      setErrors(error.response ? error.response.data : error.message);
    }
  };

  const signin = async (user) => {
    // Create a signin function to log in a user
    try {
      const res = await loginRequest(user); // Call the loginRequest function with the form values
      setUser(res);
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      setErrors(error.response ? error.response.data : error.message);
      setLoading(false); 
    }
  };

  const logout = async () => {
    // Create a logout function to log out a user
    setLoading(true); 
    await logoutRequest();
    setUser(null);
    setIsAuthenticated(null);
    setLoading(false); 
  };

  const profile = async () => {
    // Create a profile function to get the user profile
    setLoading(true); 
    try {
      const res = await profileRequest();
      setUser(res);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
    }
    setLoading(false); 
  }

  const updateProfile = async (user) => {
    // Create a function to update the user profile
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
  }

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
      value={{ signup, signin, logout, profile, updateProfile, user, isAuthenticated, errors, loading }}
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
