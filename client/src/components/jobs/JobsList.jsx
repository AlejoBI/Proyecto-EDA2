import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { CreateJob, EditJob, ConfirmModal, CustomToast } from "../index";
import { Container, Button, Dropdown, Row, Col, Image } from "react-bootstrap";
import useParentComponentData from "../../hooks/useParentComponentData";
import useJobsList from "../../hooks/useJobsList";
import logo from "../../assets/logo.png";

const JobsList = () => {
  const { countriesAndCities } = useParentComponentData();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
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
  } = useJobsList();

  const { user, isAuthenticated } = useAuth();
  const userId = user ? user.id : null;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container className="jobs-container">
      <div className="jobs-filter">
        <Image
          src={logo}
          alt="Logo"
          height="80"
          width="80"
          className="d-inline-block align-center d-block mx-auto"
        />
        <h3 className="job-text">Filter</h3>
        {/* Filtros */}
        <Row className="mb-3">
          <Col>
            <Dropdown onSelect={handleCountryChange}>
              <Dropdown.Toggle
                className="country-selector"
                style={{
                  backgroundColor: "var(--morado)",
                  border: "none",
                  width: "90%",
                }}
              >
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
              <Dropdown.Toggle
                className="city-selector"
                style={{
                  backgroundColor: "var(--morado)",
                  border: "none",
                  width: "90%",
                }}
              >
                {selectedCity === "All" ? "Select City" : selectedCity}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="All">All</Dropdown.Item>
                {selectedCountry === "All"
                  ? null
                  : countriesAndCities[selectedCountry]?.map((city, index) => (
                      <Dropdown.Item key={index} eventKey={city}>
                        {city}
                      </Dropdown.Item>
                    ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          {user.role === "customer" && (
            <Col>
              <Button
                className="city-selector"
                style={{
                  backgroundColor: "var(--morado)",
                  border: "none",
                  width: "90%",
                }}
                onClick={toggleModal}
              >
                Create Job
              </Button>
              {showModal && (
                <CreateJob show={showModal} handleClose={toggleModal} />
              )}
            </Col>
          )}
        </Row>
      </div>
      <div className="jobs-list">
        <h1>List of Jobs</h1>
        {/* Lista de Trabajos */}
        <section className="job">
          {!filteredJobs.length ? (
            <p>No jobs available</p>
          ) : (
            currentItems.map((job) => (
              <div key={job.id} className="job-card p-2">
                <h4 className="job-title job-text">{job.title}</h4>
                <p className="line"></p>
                <div>
                  <strong className="job-text">Company:</strong> {job.company}
                </div>
                <div>
                  <strong className="job-text">Location:</strong> {job.city},{" "}
                  {job.country}
                </div>
                <div>
                  <strong className="job-text">Salary:</strong> {job.salary}
                </div>
                <details className="details-job">
                  <summary className="job-text">Details</summary>
                  <p className="job-text">{job.description}</p>
                </details>
                {isAuthenticated && user.role === "professional" && (
                  <Button
                    variant="primary"
                    onClick={() => handleStartChat(job.id_user)}
                  >
                    Iniciar Chat
                  </Button>
                )}
                {userId && (job.id_user === userId || user.role === "admin") && (
                  <div className="m-1">
                    <Button
                      className="m-2"
                      style={{
                        backgroundColor: "var(--morado)",
                        border: "none",
                        width: "10%",
                      }}
                      variant="primary"
                      onClick={() => {
                        handleEdit(job);
                        setShowEditModal(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      className="m-2"
                      style={{
                        backgroundColor: "var(--morado)",
                        border: "none",
                        width: "10%",
                      }}
                      variant="danger"
                      onClick={() => {
                        handleDelete(job.id);
                        setShowDeleteConfirm(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </section>

        {/* Paginación */}
        <section>
          <Button
            className="nextPrevButtons m-2"
            style={{ backgroundColor: "var(--morado)", border: "none" }}
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            className="nextPrevButtons m-2"
            style={{ backgroundColor: "var(--morado)", border: "none" }}
            onClick={handleNextPage}
            disabled={
              currentPage === Math.ceil(filteredJobs.length / itemsPerPage)
            }
          >
            Next
          </Button>
        </section>

        {showEditModal && (
          <EditJob
            show={showEditModal}
            handleClose={() => {
              setShowEditModal(false);
              setCurrentJob(null); // Limpiar el trabajo actual al cerrar
            }}
            job={currentJob}
          />
        )}
        {showDeleteConfirm && (
          <ConfirmModal
            show={showDeleteConfirm}
            handleClose={() => setShowDeleteConfirm(false)}
            onConfirm={() => {
              confirmDelete(setToast, setShowDeleteConfirm);
            }}
            message="Are you sure you want to delete this job?"
          />
        )}
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

export default JobsList;
