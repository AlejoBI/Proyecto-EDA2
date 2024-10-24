import React, { useState, useEffect } from "react";
import { useJobs } from "../../context/JobsContext";
import { useAuth } from "../../context/AuthContext";
import { EditJob, ConfirmModal, CustomToast } from "../index";
import { Container, Button, Dropdown, Row, Col } from "react-bootstrap";
import useParentComponentData from "../../hooks/useParentComponentData";

const JobsList = () => {
  const { countriesAndCities } = useParentComponentData();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("green");
  const [currentJob, setCurrentJob] = useState(null);
  const { user } = useAuth(); // Obtener el usuario autenticado
  const { jobs, deleteJob } = useJobs(); // Obtener los trabajos del contexto

  const userId = user ? user.id : null;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Número de elementos por página

  // Estado para los filtros
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  // Calcular los índices de inicio y fin para la paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    applyFilters();
  }, [selectedCountry, selectedCity, jobs]); // Aplicar filtros cuando cambian los datos

  const applyFilters = () => {
    let updatedList = jobs;

    if (selectedCountry !== "All") {
      updatedList = updatedList.filter(
        (job) => job.location && job.location.country === selectedCountry
      );
    }

    if (selectedCity !== "All") {
      updatedList = updatedList.filter(
        (job) => job.location && job.location.city === selectedCity
      );
    }

    setFilteredJobs(updatedList);
    setCurrentPage(1); // Reiniciar a la primera página después de aplicar los filtros
  };

  // Funciones para manejar los cambios de los dropdowns
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
    setShowEditModal(true); // Mostrar el modal de edición
  };

  const handleDelete = (jobId) => {
    setCurrentJob({ id: jobId }); // Establecer el trabajo actual con solo su ID
    setShowDeleteConfirm(true); // Mostrar el modal de confirmación de eliminación
  };

  const confirmDelete = async () => {
    try {
      const res = await deleteJob(currentJob);
      if (res && res.message) {
        setToastColor("green");
        setToastMessage(res.message);
        setShowToast(true);
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      setToastMessage(
        "Error: " + (error.response?.data?.error || error.message)
      );
      setToastColor("red");
      setShowToast(true);
    }
  };

  return (
    <Container>
      <h1>List of Jobs</h1>

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
      </Row>

      {/* Lista de Trabajos */}
      <section>
        {!filteredJobs.length ? (
          <p>No jobs available</p>
        ) : (
          currentItems.map((job) => (
            <div key={job.id} className="p-2">
              <h4>{job.title}</h4>
              <div>
                <strong>Company:</strong> {job.company}
              </div>
              <div>
                <strong>Location:</strong> {job.city},{" "}
                {job.country}
              </div>
              <div>
                <strong>Salary:</strong> {job.salary}
              </div>
              <details>
                <summary>Details</summary>
                <p>{job.description}</p>
              </details>
              {userId && job.id_user === userId && (
                <div className="m-1">
                  <Button variant="primary" onClick={() => handleEdit(job)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(job.id)}>
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
        <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <Button
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
          onHide={() => setShowEditModal(false)}
          job={currentJob}
        />
      )}
      {showDeleteConfirm && (
        <ConfirmModal
          show={showDeleteConfirm}
          onHide={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this job?"
        />
      )}
      {showToast && (
        <CustomToast
          show={showToast}
          onClose={() => setShowToast(false)}
          message={toastMessage}
          color={toastColor}
        />
      )}
    </Container>
  );
};

export default JobsList;
