import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Dropdown, Row, Col } from "react-bootstrap";
import useParentComponentData from "../../hooks/useParentComponentData";
import useFreelancersList from "../../hooks/useFreelancersList";
import CustomToast from "../CustomToast";

const FreelancersList = () => {
  const navigate = useNavigate();
  const {
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
    showToast,
    setShowToast,
    toastMessage,
    toastType,
    currentItems,
    handleStartChat,
    setCurrentPage,
  } = useFreelancersList(navigate);

  const { countriesAndCities, professionalAreas } = useParentComponentData();

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setSelectedCity("All");
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

  const currenUserId = user.id;

  return (
    <Container>
      <h1>Freelancers</h1>
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

      {!filteredUsers.length ? (
        <p>No freelancers available</p>
      ) : (
        <ul>
          {currentItems.map((userJ) => (
            <li key={userJ.id}>
              <p>
                <strong>Username:</strong> {userJ.username}
              </p>
              <p>
                <strong>Email:</strong> {userJ.email}
              </p>
              <p>
                <strong>City:</strong> {userJ.city}
              </p>
              <p>
                <strong>Country:</strong> {userJ.country}
              </p>
              <p>
                <strong>Area:</strong> {userJ.professionalArea}
              </p>
              {isAuthenticated && userJ.id !== currenUserId && (
                <Button
                  variant="primary"
                  onClick={() => handleStartChat(userJ.id)}
                >
                  Iniciar Chat
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}

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

      <CustomToast
        show={showToast}
        message={toastMessage}
        backgroundColor={toastType === "success" ? "green" : "red"}
        color="white"
        duration={3000}
        onClose={() => setShowToast(false)}
      />
    </Container>
  );
};

export default FreelancersList;
