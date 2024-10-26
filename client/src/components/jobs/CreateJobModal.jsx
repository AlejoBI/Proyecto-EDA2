import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useJobs } from "../../context/JobsContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "../index";
import { Modal, Button, Dropdown } from "react-bootstrap";
import useParentComponentData from "../../hooks/useParentComponentData";

const CreateJob = ({ show, handleClose }) => {
  const { countriesAndCities } = useParentComponentData();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Para establecer valores del formulario
  } = useForm();

  const { createJob } = useJobs();
  const { isAuthenticated } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false); // Estado para el modal de confirmación
  const [pendingAction, setPendingAction] = useState(null); // Acción pendiente de confirmar
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = handleSubmit(async (data) => {
    if (!selectedCountry || !selectedCity) {
      return; // Detener el envío si no se seleccionan país o ciudad
    }
    data.country = selectedCountry;
    data.city = selectedCity;
    setPendingAction(() => () => handleCreateJob(data)); // Guardar acción pendiente
    setShowConfirm(true);
  });

  const handleCreateJob = async (data) => {
    try {
      const res = await createJob(data);
      if (res && res.message) {
        handleClose();
      }
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  const handleCancel = () => {
    setPendingAction(() => handleClose); // Guardar acción pendiente para cerrar sin guardar
    setShowConfirm(true);
  };

  return (
    <>
      <Modal show={show} onHide={handleCancel} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Create Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={onSubmit}>
            <h4>Title</h4>
            <input type="text" {...register("title", { required: true })} />
            {errors.title && <p className="text-danger">Title is required</p>}

            <h4>Description</h4>
            <textarea
              {...register("description", { required: true })}
              style={{ resize: "none", overflow: "hidden" }}
            ></textarea>
            {errors.description && (
              <p className="text-danger">Description is required</p>
            )}

            <h4>Company</h4>
            <input type="text" {...register("company", { required: true })} />
            {errors.company && (
              <p className="text-danger">Company is required</p>
            )}

            <h4>Country</h4>
            <Dropdown
              onSelect={(country) => {
                setSelectedCountry(country);
                setSelectedCity(""); // Resetear ciudad al cambiar de país
              }}
            >
              <Dropdown.Toggle variant="secondary">
                {selectedCountry || "Select Country"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {Object.keys(countriesAndCities).map((country, index) => (
                  <Dropdown.Item key={index} eventKey={country}>
                    {country}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            {errors.country && (
              <p className="text-danger">Country is required</p>
            )}

            <h4>City</h4>
            <Dropdown onSelect={setSelectedCity}>
              <Dropdown.Toggle variant="secondary">
                {selectedCity || "Select City"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {selectedCountry
                  ? countriesAndCities[selectedCountry]?.map((city, index) => (
                      <Dropdown.Item key={index} eventKey={city}>
                        {city}
                      </Dropdown.Item>
                    ))
                  : null}
              </Dropdown.Menu>
            </Dropdown>
            {errors.city && <p className="text-danger">City is required</p>}
            {(!selectedCountry || !selectedCity) && (
              <p className="text-danger">Both country and city are required</p>
            )}

            <h4>Salary</h4>
            <input type="number" {...register("salary", { required: true })} />
            {errors.salary && <p className="text-danger">Salary is required</p>}

            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Job
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <ConfirmModal
        show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={() => {
          setShowConfirm(false);
          pendingAction();
        }}
        message={
          pendingAction === handleClose
            ? "Are you sure you want to close without creating the job?"
            : "Are you sure you want to create this job?"
        }
      />
    </>
  );
};

export default CreateJob;
