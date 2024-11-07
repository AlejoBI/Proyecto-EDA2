import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getAllUsers();
      const professionals = res.filter((user) => user.role === "professional");
      const validProfessionals = professionals.filter(
        (user) =>
          user.username?.trim() &&
          user.email?.trim() &&
          user.city?.trim() &&
          user.country?.trim() &&
          user.professionalArea?.trim()
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
    };
    fetchUsers();
  }, [getAllUsers]);

  useEffect(() => {
    applyFilters();
  }, [selectedCountry, selectedCity, selectedArea, selectedSkill]);

  const applyFilters = () => {
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
  };

  const handleStartChat = async (participantId) => {
    if (!isAuthenticated) return;
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
  };
};

export default useFreelancersList;
