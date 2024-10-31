import { useState, useEffect } from "react";
import { useJobs } from "../context/JobsContext";
import { useAuth } from "../context/AuthContext";
import { createChatRequest } from "../api/chat";
import { useNavigate } from "react-router-dom";

const useJobsList = () => {
  const { jobs, deleteJob } = useJobs();
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [currentJob, setCurrentJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const navigate = useNavigate();

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedCountry, selectedCity, jobs]);

  const applyFilters = () => {
    let updatedList = jobs;

    if (selectedCountry !== "All") {
      updatedList = updatedList.filter(
        (job) => job.country && job.country === selectedCountry
      );
    }

    if (selectedCity !== "All") {
      updatedList = updatedList.filter(
        (job) => job.city && job.city === selectedCity
      );
    }

    setFilteredJobs(updatedList);
    setCurrentPage(1); // Reiniciar a la primera página después de aplicar los filtros
  };

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setSelectedCity("All"); // Resetear ciudad al cambiar de país
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredJobs.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleEdit = (job) => {
    setCurrentJob(job); // Establecer el trabajo actual
  };

  const handleDelete = (jobId) => {
    setCurrentJob({ id: jobId }); // Establecer el trabajo actual con solo su ID
  };

  const confirmDelete = async (setToast, setShowDeleteConfirm) => {
    try {
      const res = await deleteJob(currentJob);
      if (res && res.message) {
        setToast({ message: res.message, color: "green", show: true });
        setShowDeleteConfirm(false); // Cerrar el modal al confirmar la eliminación
      }
    } catch (error) {
      setToast({
        message: "Error: " + (error.response?.data?.error || error.message),
        color: "red",
        show: true,
      });
    }
  };

  const handleStartChat = async (participantId) => {
    try {
      const response = await createChatRequest({
        userId: user.id,
        participantId,
      });
      setToastMessage("Chat iniciado con éxito, redirigiendo...");
      setToastType("success");
      setTimeout(() => {
        navigate("/user/chat");
      }, 3000);
    } catch (error) {
      setToastMessage("Error al iniciar el chat");
      setToastType("error");
    } finally {
      setShowToast(true);
    }
  };

  return {
    currentPage,
    itemsPerPage,
    selectedCountry,
    selectedCity,
    filteredJobs,
    currentJob,
    handleCountryChange,
    handleCityChange,
    handleNextPage,
    handlePreviousPage,
    handleEdit,
    handleDelete,
    confirmDelete,
    setCurrentJob,
    handleStartChat,
    toggleModal,
    showModal,
    showToast,
    setShowToast,
    toastMessage,
    toastType,
  };
};

export default useJobsList;
