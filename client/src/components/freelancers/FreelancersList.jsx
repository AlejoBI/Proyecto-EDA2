import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Dropdown, Row, Col, Image } from "react-bootstrap";
import useParentComponentData from "../../hooks/useParentComponentData";
import useFreelancersList from "../../hooks/useFreelancersList";
import { CustomToast } from "../index";
import logo from "../../assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../assets/css/FreelancerPage.module.css";
import freeicon from "../../assets/images/freeicon.png";
import skillsicon from "../../assets/images/skillsicon.png";

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
    freelancersCount,
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

  const currenUserId = user ? user.id : null;

  return (
    <Container className={styles.freelancers_container}>
      <div className={styles.freelancers_filter}>
        <Image
          src={logo}
          alt="Logo"
          height="80"
          width="80"
          className="d-inline-block align-center d-block mx-auto"
        />
        <h3 className={styles.freelancer_text2}>Filter</h3>
        <Row className="mb-3">
          <Col>
            <Dropdown onSelect={handleCountryChange}>
              <Dropdown.Toggle className={styles.freelancer_toggle}>
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
              <Dropdown.Toggle className={styles.freelancer_toggle}>
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
              <Dropdown.Toggle className={styles.freelancer_toggle}>
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
      </div>
      <div className={styles.freelancers_list}>
        <div>
          <h4>
            Hello {user ? user.username : "new user"} 👋🏼, here you can find all
            the jobs or people you need.
          </h4>
          <div className={styles.freelancers_header}>
            <Image
              src={freeicon}
              alt="Freelancer Icon"
              height="80"
              width="80"
              className="d-inline-block align-center d-block"
            />
            <h4 className={styles.text_freelancer}>
              Freelancers: {freelancersCount}{" "}
            </h4>
            <Image
              src={skillsicon}
              alt="Skills Icon"
              height="80"
              width="80"
              className="d-inline-block align-center d-block"
            />
            <h4 className={styles.text_freelancer}>
              Skills: {/*skillsFreelancersCount.length*/}
            </h4>
          </div>
        </div>
        <section className={styles.freelancer}>
          {!filteredUsers.length ? (
            <p>No freelancers available</p>
          ) : (
            currentItems.map((userJ) => (
              <div key={userJ.id} className={styles.freelancer_card}>
                <h4
                  className={styles.freelancer_title + styles.freelancer_text}
                >
                  {userJ.username}
                </h4>
                <p className={styles.line}></p>
                <div>
                  <strong className={styles.freelancer_text}>Email:</strong>{" "}
                  {userJ.email}
                </div>
                <div>
                  <strong className={styles.freelancer_text}>City:</strong>{" "}
                  {userJ.city}
                </div>
                <div>
                  <strong className={styles.freelancer_text}>Country:</strong>{" "}
                  {userJ.country}
                </div>
                <div>
                  <strong className={styles.freelancer_text}>Area:</strong>{" "}
                  {userJ.professionalArea}
                </div>
                {userJ.skill && (
                  <div>
                    <label className={styles.skill_label}>
                      <h6 className={styles.skill_freelancer}>{userJ.skill}</h6>
                    </label>
                  </div>
                )}

                {isAuthenticated && userJ.id !== currenUserId && (
                  <Button
                    className={styles.freelancer_button}
                    onClick={() => handleStartChat(userJ.id)}
                  >
                    Iniciar Chat
                  </Button>
                )}
              </div>
            ))
          )}
        </section>

        <section>
          <Button
            className={styles.freelancer_button}
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            className={styles.freelancer_button}
            onClick={handleNextPage}
            disabled={
              currentPage === Math.ceil(filteredUsers.length / itemsPerPage)
            }
          >
            Next
          </Button>
        </section>
      </div>

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
