import { useState, useEffect } from "react";
import { useUsers } from "../context/AdminContext";

const useUsersList = (searchTerm) => {
  const { users, deleteUser } = useUsers();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [professionalUsersCount, setProfessionalUsersCount] = useState(0);
  const [customerUsersCount, setCustomerUsersCount] = useState(0);
  const [adminUsersCount, setAdminUsersCount] = useState(0);

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  useEffect(() => {
    console.log("Users from context:", users); // Verificar contenido de users

    if (users) {
      setTotalUsersCount(users.length);

      // Contar usuarios por rol
      const professionalCount = users.filter((user) => user.role === "professional").length;
      const customerCount = users.filter((user) => user.role === "customer").length;
      const adminCount = users.filter((user) => user.role === "admin").length;

      setProfessionalUsersCount(professionalCount);
      setCustomerUsersCount(customerCount);
      setAdminUsersCount(adminCount);

      // Aplicar filtro de búsqueda
      const filtered = users.filter((user) =>
        user.name?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
      );
      setFilteredUsers(filtered);
      console.log("Filtered users:", filtered); // Verificar resultados filtrados
    }
  }, [users, searchTerm]);

  // Restablecer a la primera página cuando cambie el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Paginación de los usuarios filtrados
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  console.log("Current users for display:", currentUsers); // Verificar usuarios actuales para la página

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredUsers.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user); // Establecer usuario actual para edición
  };

  const handleDelete = (userId) => {
    setCurrentUser({ id: userId }); // Almacenar ID de usuario para eliminación
  };

  const confirmDelete = async (setToast, setShowDeleteConfirm) => {
    if (!currentUser) return; // Evita problemas si currentUser es nulo

    try {
      await deleteUser(currentUser.id); // Llamar a deleteUser con el ID
      setToast({ message: "User deleted successfully", color: "green", show: true });
      setShowDeleteConfirm(false); // Cerrar modal al confirmar eliminación
    } catch (error) {
      setToast({
        message: "Error: " + (error.response?.data?.error || error.message),
        color: "red",
        show: true,
      });
    }
  };

  return {
    totalUsersCount,
    professionalUsersCount,
    customerUsersCount,
    adminUsersCount,
    toggleModal,
    showModal,
    showToast,
    setShowToast,
    toastMessage,
    currentUsers,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleNextPage,
    handlePreviousPage,
    currentPage,
  };
};

export default useUsersList;