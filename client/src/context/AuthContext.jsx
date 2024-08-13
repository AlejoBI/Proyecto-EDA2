import { createContext, useState, useContext, useEffect } from "react";

import { registerRequest, loginRequest, verifyTokenRequest } from "../api/auth"; // Import the request functions from the auth file

import Cookies from "js-cookie";
import { set } from "mongoose";

export const AuthContext = createContext(); // Create a context for the authentication

export const useAuth = () => {
  // Create a custom hook to use the AuthContext
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Create a provider to wrap the application
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get();

      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return setUser(null);
      }

        try {
          const res = await verifyTokenRequest(cookies.token);
          if (!res.data){
            setIsAuthenticated(false);
            setLoading(false);
            return;
          }

          setIsAuthenticated(true);
          setUser(res.data);
          setLoading(false);
        } catch (error) {
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
        }
      }
    checkLogin();
  }, []);

  return (
    // Return the AuthContext.Provider with the signup function and user state
    <AuthContext.Provider
      value={{ signup, signin, loading, user, isAuthenticated, errors }}
    >
      {children}
    </AuthContext.Provider>
  );
};
