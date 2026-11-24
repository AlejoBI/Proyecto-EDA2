import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AdminContext from "./AdminContextInstance.js";
import appFirebase from "../firebase/credentials.js";
import { getFirestore, doc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
const fireStore = getFirestore(appFirebase);

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
      return [];
    }
  };

  const editUser = async (userId, updatedData) => {
    const userDocRef = doc(fireStore, "users", userId);
    await updateDoc(userDocRef, updatedData);

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, ...updatedData } : user
      )
    );
  };

  const deleteUser = async (userId) => {
    const userDocRef = doc(fireStore, "users", userId);
    await deleteDoc(userDocRef);
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <AdminContext.Provider value={{ users, errors, getAllUsers, editUser, deleteUser }}>
      {children}
    </AdminContext.Provider>
  );
};

AdminProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
