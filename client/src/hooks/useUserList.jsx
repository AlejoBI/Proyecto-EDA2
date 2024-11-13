import { useState, useEffect } from "react";
import { useAdmin } from "../context/AdminContext";

const useUserList = () => {
  const { getAllUsers } = useAdmin();
  const [currentUsers, setCurrentUsers] = useState([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [professionalUsersCount, setProfessionalUsersCount] = useState(0);
  const [customerUsersCount, setCustomerUsersCount] = useState(0);
  const [adminUsersCount, setAdminUsersCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getAllUsers();
      setCurrentUsers(res);
      setTotalUsersCount(res.length);
      setProfessionalUsersCount(
        res.filter((user) => user.role === "professional").length
      );
      setCustomerUsersCount(
        res.filter((user) => user.role === "customer").length
      );
      setAdminUsersCount(res.filter((user) => user.role === "admin").length);
    };
    fetchUsers();
  }, [getAllUsers]);

  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  return {
    totalUsersCount,
    professionalUsersCount,
    customerUsersCount,
    adminUsersCount,
    currentUsers,
    showToast,
    toastMessage,
    setShowToast,
    toastType,
  };
};

export default useUserList;
