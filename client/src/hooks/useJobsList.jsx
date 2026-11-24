import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "./useJobs.js";
import { useAuth } from "./useAuth.js";
import { useChat } from "./useChat.js";

const getErrorMessage = (error, fallback) => {
  try {
    const message = error?.message;
    return typeof message === "string" && message.trim() ? message : fallback;
  } catch {
    return fallback;
  }
};

const useJobsList = () => {
  const { jobs, loading, errors, getAllJobs, deleteJob } = useJobs();
  const { user } = useAuth();
  const { createChat } = useChat();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [JobsCount, setJobsCount] = useState(jobs ? jobs.length : 0);
  const [usersJobsCount, setUsersJobsCount] = useState([]);
  const [currentJob, setCurrentJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const navigate = useNavigate();

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  const applyFilters = useCallback(() => {
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
    setCurrentPage(1); 
  }, [jobs, selectedCountry, selectedCity]);

  useEffect(() => {
    applyFilters();
    setJobsCount(jobs.length);

    const uniqueCustomerIds = [];

    jobs.forEach((job) => {
      if (!uniqueCustomerIds.includes(job.id_user)) {
        uniqueCustomerIds.push(job.id_user);
      }
    });

    setUsersJobsCount(uniqueCustomerIds);
  }, [applyFilters, jobs]);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setSelectedCity("All"); 
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
    setCurrentJob(job); 
  };

  const handleDelete = (jobId) => {
    setCurrentJob(jobId);
  };

  const confirmDelete = async () => {
    try {
      const res = await deleteJob(currentJob);
      if (res && res.message) {
        setToastMessage(res.message);
        setToastType("success");
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage(
        "Error: " + (error.response?.data?.error || error.message)
      );
      setToastType("error");
      setShowToast(true);
    }
  };

  const handleStartChat = async (participantId) => {
    try {
      const result = await createChat({
        userId: user.id,
        participantId,
      });
      if (!result?.chatId) throw new Error("Error al iniciar el chat");
      setToastMessage("Chat iniciado con éxito, redirigiendo...");
      setToastType("success");
      setTimeout(() => {
        navigate("/user/chat");
      }, 3000);
    } catch (error) {
      setToastMessage(getErrorMessage(error, "Error al iniciar el chat"));
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
    JobsCount,
    setJobsCount,
    usersJobsCount,
    loading,
    errors,
    retryJobs: getAllJobs,
  };
};

export default useJobsList;
