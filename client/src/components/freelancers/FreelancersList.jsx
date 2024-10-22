import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Container, Button } from "react-bootstrap";

const FreelancersList = () => {
  const { getAllUsers } = useAuth();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Número de elementos por página

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getAllUsers();
      const professionals = res.filter((user) => user.role === "professional");
      setUsers(professionals);
    };
    fetchUsers();
  }, []);

  // Calcular los índices de inicio y fin
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(users.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Container>
      <h1>Freelancers</h1>
      {!users.length ? (
        <p>No freelancers available</p>
      ) : (
        <ul>
          {currentItems.map((user) => (
            <li key={user.id}>
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
            </li>
          ))}
        </ul>
      )}
      <section>
        <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Anterior
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(users.length / itemsPerPage)}
        >
          Siguiente
        </Button>
      </section>
    </Container>
  );
};

export default FreelancersList;
