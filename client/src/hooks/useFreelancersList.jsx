import { useCallback, useState, useEffect } from "react";
import { useAuth } from "./useAuth.js";
import { useChat } from "./useChat.js";
import { useNavigate } from "react-router-dom";

const getErrorMessage = (error, fallback) => {
  try {
    const message = error?.message;
    return typeof message === "string" && message.trim() ? message : fallback;
  } catch {
    return fallback;
  }
};

const useFreelancersList = () => {
  const { getAllUsers, user, isAuthenticated } = useAuth();
  const { createChat } = useChat();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [freelancersCount, setFreelancersCount] = useState(0);
  const [skillsCount, setSkillsCount] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedArea, setSelectedArea] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState("All");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setErrors(null);
      try {
        const res = await getAllUsers();
        if (!Array.isArray(res)) {
          setErrors("Freelancers are currently unavailable.");
          setUsers([]);
          setFilteredUsers([]);
          setFreelancersCount(0);
          setSkillsCount(0);
          return;
        }
        const professionals = res.filter((user) => user.role === "professional");
        const validProfessionals = professionals.filter(
          (user) =>
            user.username?.trim() &&
            user.email?.trim() &&
            user.city?.trim() &&
            user.country?.trim() &&
            user.professionalArea?.trim() &&
            Array.isArray(user.skills)
        );
        setUsers(validProfessionals);
        setFilteredUsers(validProfessionals);
        setFreelancersCount(validProfessionals.length);

        const countSkills = [];

        validProfessionals.forEach((user) => {
          if (user.skills && Array.isArray(user.skills)) {
            user.skills.forEach((skill) => {
              if (!countSkills.includes(skill)) {
                countSkills.push(skill);
              }
            });
          }
        });

        setSkillsCount(countSkills?.length);
      } catch (error) {
        setErrors(getErrorMessage(error, "Freelancers are currently unavailable."));
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [getAllUsers]);

  const retryUsers = useCallback(() => {
    setLoading(true);
    setErrors(null);
    return getAllUsers().then((res) => {
      if (!Array.isArray(res)) throw new Error("Freelancers are currently unavailable.");
      const professionals = res.filter((candidate) => candidate.role === "professional" && candidate.username?.trim() && candidate.email?.trim() && candidate.city?.trim() && candidate.country?.trim() && candidate.professionalArea?.trim() && Array.isArray(candidate.skills));
      setUsers(professionals);
      setFreelancersCount(professionals.length);
      setSkillsCount(new Set(professionals.flatMap((candidate) => candidate.skills)).size);
      setLoading(false);
      return professionals;
    }).catch((error) => {
      setErrors(getErrorMessage(error, "Freelancers are currently unavailable."));
      setUsers([]);
      setLoading(false);
      return [];
    });
  }, [getAllUsers]);

  const applyFilters = useCallback(() => {
    let updatedList = users;
    if (selectedCountry !== "All") {
      updatedList = updatedList.filter(
        (user) => user.country === selectedCountry
      );
    }
    if (selectedCity !== "All") {
      updatedList = updatedList.filter((user) => user.city === selectedCity);
    }
    if (selectedArea !== "All") {
      updatedList = updatedList.filter(
        (user) => user.professionalArea === selectedArea
      );
    }
    if (selectedSkill !== "All") {
      updatedList = updatedList.filter((user) =>
        user.skills?.includes(selectedSkill)
      );
    }
    setFilteredUsers(updatedList);
  }, [users, selectedCountry, selectedCity, selectedArea, selectedSkill]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleStartChat = async (participantId) => {
    if (!isAuthenticated) return;
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

  const currentItems = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    users,
    user,
    isAuthenticated,
    currentPage,
    itemsPerPage,
    filteredUsers,
    selectedCountry,
    setSelectedCountry,
    selectedCity,
    setSelectedCity,
    selectedArea,
    setSelectedArea,
    selectedSkill,
    setSelectedSkill,
    showToast,
    setShowToast,
    toastMessage,
    toastType,
    currentItems,
    handleStartChat,
    setCurrentPage,
    freelancersCount,
    skillsCount,
    loading,
    errors,
    retryUsers,
  };
};

export default useFreelancersList;
