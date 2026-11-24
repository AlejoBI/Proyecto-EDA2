import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AdminContext from "./AdminContextInstance.js";
import { getFirebaseServices } from "../firebase/firebaseServices.js";
import { doc, deleteDoc, collection, getDocs, updateDoc } from "firebase/firestore";

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState(null);
  const getAllUsers = async () => {
    try {
      const { fireStore } = await getFirebaseServices();
      const result = await getDocs(collection(fireStore, "users"));
      const data = result.docs.map((item) => ({ id: item.id, ...item.data() }));
      setUsers(data);
      return data;
    } catch (error) { setErrors(error.message || "Error fetching users"); return []; }
  };
  const editUser = async (userId, updatedData) => {
    const { fireStore } = await getFirebaseServices();
    await updateDoc(doc(fireStore, "users", userId), updatedData);
    setUsers((previous) => previous.map((user) => user.id === userId ? { ...user, ...updatedData } : user));
  };
  const deleteUser = async (userId) => {
    const { fireStore } = await getFirebaseServices();
    await deleteDoc(doc(fireStore, "users", userId));
    setUsers((previous) => previous.filter((user) => user.id !== userId));
  };
  useEffect(() => { getAllUsers(); }, []);
  return <AdminContext.Provider value={{ users, errors, getAllUsers, editUser, deleteUser }}>{children}</AdminContext.Provider>;
};
AdminProvider.propTypes = { children: PropTypes.node.isRequired };
export default AdminProvider;
