import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; 
import { useUsers } from "../context/UsersContext";

const useUsersList = () => {
  const { users } = useUsers(); 
  const { user } = useAuth(); 

  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [professionalUsersCount, setProfessionalUsersCount] = useState(0);
  const [customerUsersCount, setCustomerUsersCount] = useState(0);
  const [adminUsersCount, setAdminUsersCount] = useState(0);

  useEffect(() => {
    if (users) {
      setTotalUsersCount(users.length);

      const professionalCount = users.filter(user => user.role === 'professional').length;
      const customerCount = users.filter(user => user.role === 'customer').length;
      const adminCount = users.filter(user => user.role === 'admin').length;

      setProfessionalUsersCount(professionalCount);
      setCustomerUsersCount(customerCount);
      setAdminUsersCount(adminCount);
    }
  }, [users]);

  return {
    totalUsersCount,
    professionalUsersCount,
    customerUsersCount,
    adminUsersCount,
    user,
  };
};

export default useUsersList;