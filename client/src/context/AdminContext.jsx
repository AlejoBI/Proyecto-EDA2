import { createContext, useState, useContext, useEffect } from "react";
import {
  createUserRequest,
  deleteUserRequest,
} from "../api/admin";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState(null);

  const createUser = async (user) => {
    try {
      const res = await createUserRequest(user);
      return res;
    } catch (error) {
      setErrors(error.response ? error.response.data : error.message);
    }
  };

  const deleteUser = async (user) => {
    try {
      const res = await deleteUserRequest(user);
      return res;
    } catch (error) {
      setErrors(error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <AdminContext.Provider
      value={{ users, errors, createUser, deleteUser }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};
