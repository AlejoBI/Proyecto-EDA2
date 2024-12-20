import { createContext, useState, useContext, useEffect } from "react";
import appFirebase from "../firebase/credentials.js";
import { getFirestore, doc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
const fireStore = getFirestore(appFirebase);

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState(null);

  const getAllUsers = async () => {
    try {
      const usersCollection = await getDocs(collection(fireStore, "users"));
      const usersData = usersCollection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
      return usersData;
    } catch (error) {
      setErrors(error.message || "Error fetching users");
    }
  };

  const editUser = async (userId, updatedData) => {
    try {
      const userDocRef = doc(fireStore, "users", userId);
      await updateDoc(userDocRef, updatedData);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, ...updatedData } : user
        )
      );
    } catch (error) {
      setErrors(error.message || "Error updating user");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <AdminContext.Provider value={{ users, errors, getAllUsers, editUser }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
