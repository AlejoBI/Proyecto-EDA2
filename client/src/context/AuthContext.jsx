import { createContext, useState, useContext } from "react";

import { registerRequest } from "../api/auth";

export const AuthContext = createContext(); // Create a context for the authentication

export const useAuth = () => { // Create a custom hook to use the AuthContext
  const context = useContext(AuthContext);
  if (!context) { 
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context; 
};

export const AuthProvider = ({ children }) => { // Create a provider to wrap the application
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState(null);

  const signup = async (user) => { // Create a signup function to register a user
    try {
      const res = await registerRequest(user); // Call the registerRequest function with the form values
      setUser(res);
      setIsAuthenticated(true);
    } catch (error) {
      setErrors(error.response.data);
    }
  };

  return ( // Return the AuthContext.Provider with the signup function and user state
    <AuthContext.Provider value={{ signup, user, isAuthenticated, errors }}>
      {children} 
    </AuthContext.Provider>
  );
};
