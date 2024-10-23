import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Container, Button, Dropdown, Row, Col } from "react-bootstrap";
import useParentComponentData from "../../hooks/useParentComponentData";

const FreelancersList = () => {
  const { getAllUsers } = useAuth();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Número de elementos por página
  const [filteredUsers, setFilteredUsers] = useState([]); // Lista de freelancers filtrados
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedArea, setSelectedArea] = useState("All");

  const { countriesAndCities, professionalAreas } = useParentComponentData();

  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getAllUsers();
      const professionals = res.filter((user) => user.role === "professional");

      // Filtrar los usuarios que tienen todas las propiedades requeridas
      const validProfessionals = professionals.filter(
        (user) =>
          user.username?.trim() &&
          user.email?.trim() &&
          user.city?.trim() &&
          user.country?.trim() &&
          user.professionalArea?.trim()
      );

      // Extraer valores únicos para los filtros
      const uniqueCountries = [
        "All",
        ...new Set(validProfessionals.map((user) => user.country)),
      ];

      setUsers(validProfessionals);
      setFilteredUsers(validProfessionals); // Inicialmente mostrar todos
      setCities(uniqueCountries); // Cambié esto para ajustar correctamente las ciudades
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedCountry, selectedCity, selectedArea]);

  // Calcular los índices de inicio y fin para la paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

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

    setFilteredUsers(updatedList);
  };

  // Funciones para manejar los cambios de los dropdowns
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setSelectedCity("All"); // Resetear ciudad al cambiar de país
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
  };

  const handleAreaChange = (area) => {
    setSelectedArea(area);
  };

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

  return (
    <Container>
      <h1>Freelancers</h1>
      {/* Filtros */}
      <Row className="mb-3">
        <Col>
          <Dropdown onSelect={handleCountryChange}>
            <Dropdown.Toggle variant="secondary">
              {selectedCountry === "All" ? "Select Country" : selectedCountry}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="All">All</Dropdown.Item>
              {Object.keys(countriesAndCities).map((country, index) => (
                <Dropdown.Item key={index} eventKey={country}>
                  {country}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col>
          <Dropdown onSelect={handleCityChange}>
            <Dropdown.Toggle variant="secondary">
              {selectedCity === "All" ? "Select City" : selectedCity}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="All">All</Dropdown.Item>
              {selectedCountry === "All" ? (
                <Dropdown.Item disabled>No cities available</Dropdown.Item>
              ) : countriesAndCities[selectedCountry]?.length > 0 ? (
                countriesAndCities[selectedCountry].map((city, index) => (
                  <Dropdown.Item key={index} eventKey={city}>
                    {city}
                  </Dropdown.Item>
                ))
              ) : (
                <Dropdown.Item disabled>No cities available</Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col>
          <Dropdown onSelect={handleAreaChange}>
            <Dropdown.Toggle variant="secondary">
              {selectedArea === "All" ? "Select Area" : selectedArea}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="All">All</Dropdown.Item>
              {professionalAreas.map((area, index) => (
                <Dropdown.Item key={index} eventKey={area}>
                  {area}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {/* Lista de Freelancers */}
      {!filteredUsers.length ? (
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
                <strong>City:</strong> {user.city}
              </p>
              <p>
                <strong>Country:</strong> {user.country}
              </p>
              <p>
                <strong>Area:</strong> {user.professionalArea}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Paginación */}
      <section>
        <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={
            currentPage === Math.ceil(filteredUsers.length / itemsPerPage)
          }
        >
          Next
        </Button>
      </section>
    </Container>
  );
};

export default FreelancersList;
