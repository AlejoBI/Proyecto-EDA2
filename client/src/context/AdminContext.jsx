import { createContext, useState, useContext, useEffect } from "react";
import { createUserRequest, deleteUserRequest } from "../api/admin";
import { getAllUsersRequest } from "../api/auth";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState(null);

  const createUser = async (user) => {
    try {
      const res = await createUserRequest(user);
      if (res && res.data) {
        setUsers((prevUsers) => [...prevUsers, res.data]);
      }
      return res;
    } catch (error) {
      setErrors(error.response ? error.response.data : error.message);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const res = await deleteUserRequest(userId);
      if (res && res.data) {
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
      }
      return res;
    } catch (error) {
      setErrors(error.response ? error.response.data : error.message);
    }
  };

  const getAllUsers = async () => {
    try {
        const res = await getAllUsersRequest();
        if (res && res.data) {
            console.log("Users fetched from API:", res.data); 
            setUsers(res.data);
        }
    } catch (error) {
        setErrors(error.response ? error.response.data : error.message);
    }
};

  useEffect(() => {
    getAllUsers();
  }, [users]);

  return (
    <AdminContext.Provider value={{ users, errors, createUser, deleteUser }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useUsers must be used within an AdminProvider");
  }
  return context;
};