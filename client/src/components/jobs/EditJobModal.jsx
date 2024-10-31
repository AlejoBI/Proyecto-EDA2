import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useJobs } from "../../context/JobsContext";
import { useAuth } from "../../context/AuthContext";
import { CustomToast, ConfirmModal } from "../index";
import { Modal, Button, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useParentComponentData from "../../hooks/useParentComponentData";

const EditJob = ({ show, handleClose, job }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { updateJob } = useJobs();
  const { isAuthenticated } = useAuth();
  const { countriesAndCities } = useParentComponentData();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("green");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (job) {
      setValue("title", job.title);
      setValue("description", job.description);
      setValue("company", job.company);
      setValue("salary", job.salary);
      setSelectedCountry(job.country || "");
      setSelectedCity(job.city || "");
    }
  }, [job, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    if (!selectedCountry || !selectedCity) {
      setToastMessage("Please select both country and city.");
      setToastColor("red");
      setShowToast(true);
      return;
    }

    const updatedJobData = {
      ...data,
      country: selectedCountry,
      city: selectedCity,
      id: job.id,
    };

    setPendingAction(() => () => handleUpdateJob(updatedJobData));
    setShowConfirm(true);
  });

  const handleUpdateJob = async (data) => {
    try {
      const res = await updateJob(data);
      if (res && res.message) {
        setToastMessage(res.message);
        setToastColor("green");
        setShowToast(true);
        handleClose();
      }
    } catch (error) {
      setToastMessage(
        "Error: " + (error.response?.data?.error || error.message)
      );
      setToastColor("red");
      setShowToast(true);
    }
  };

  const handleCancel = () => {
    setPendingAction(() => handleClose);
    setShowConfirm(true);
  };

  return (
    <>
      <CustomToast
        show={showToast}
        message={toastMessage}
        position={{ top: "0", right: "0" }}
        color={toastColor}
        duration={3000}
        onClose={() => setShowToast(false)}
      />

      <Modal show={show} onHide={handleCancel} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={onSubmit}>
            <h4>Title</h4>
            <input type="text" {...register("title", { required: true })} />
            {errors.title && <p className="text-danger">Title is required</p>}

            <h4>Description</h4>
            <textarea
              typeof="text"
              {...register("description", { required: true })}
              style={{ resize: "none", overflow: "hidden" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
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
                setSelectedCity("");
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

            <h4>City</h4>
            <Dropdown onSelect={setSelectedCity}>
              <Dropdown.Toggle variant="secondary">
                {selectedCity || "Select City"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {selectedCountry &&
                  countriesAndCities[selectedCountry]?.map((city, index) => (
                    <Dropdown.Item key={index} eventKey={city}>
                      {city}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
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
              Update Job
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
            ? "Are you sure you want to close without saving changes?"
            : "Are you sure you want to update this job?"
        }
      />
    </>
  );
};

export default EditJob;
