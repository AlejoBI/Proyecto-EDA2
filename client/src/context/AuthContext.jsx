import { createContext, useState, useContext, useEffect } from "react";

import {
  checkAuthRequest,
  registerRequest,
  loginRequest,
  logoutRequest,
} from "../api/auth"; // Import the request functions from the auth file

export const AuthContext = createContext(); // Create a context for the authentication

export const AuthProvider = ({ children }) => {
  // Create a provider to wrap the application
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [errors, setErrors] = useState(null);

  const signup = async (user) => {
    // Create a signup function to register a user
    try {
      const res = await registerRequest(user); // Call the registerRequest function with the form values
      setUser(res);
      setIsAuthenticated(true);
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  const signin = async (user) => {
    // Create a signin function to log in a user
    try {
      const res = await loginRequest(user); // Call the loginRequest function with the form values
      setUser(res);
      setIsAuthenticated(true);
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  const logout = async () => {
    // Create a logout function to log out a user
    await logoutRequest();
    setUser(null);
    setIsAuthenticated(null);
  };

  useEffect(() => {
    async function checkLogin() {
      console.log("Checking login: " + isAuthenticated);
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
    }
    checkLogin();
  }, []);

  return (
    // Return the AuthContext.Provider with the signup function and user state
    <AuthContext.Provider
      value={{ signup, signin, logout, user, isAuthenticated, errors }}
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
