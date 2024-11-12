import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "../context/JobsContext";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

const useJobsList = () => {
  const { jobs, deleteJob } = useJobs();
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
    setCurrentPage(1); 
  };

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
      await createChat({
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
    JobsCount,
    setJobsCount,
    usersJobsCount,
  };
};

export default useJobsList;
