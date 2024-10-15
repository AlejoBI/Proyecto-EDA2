import React, { useState, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import { useJobs } from "../../context/JobsContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CustomToast, ConfirmModal } from "../index";
import { Modal, Button } from "react-bootstrap";

const CreateJob = ({ show, handleClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createJob, errors: jobsErrors } = useJobs();
  const { isAuthenticated } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("green");
  const [showConfirm, setShowConfirm] = useState(false); // Estado para el modal de confirmación
  const [pendingAction, setPendingAction] = useState(null); // Acción pendiente de confirmar

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = handleSubmit(async (data) => {
    setPendingAction(() => () => handleCreateJob(data)); // Guardar acción pendiente
    setShowConfirm(true);
  });

  const handleCreateJob = async (data) => {
    try {
      const res = await createJob(data);
      if (res && res.message) {
        setShowToast(true);
        setToastMessage(res.message);
        setToastColor("green");
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
    setPendingAction(() => handleClose); // Guardar acción pendiente para cerrar sin guardar
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
          <Modal.Title>Create Job</Modal.Title>
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

            <h4>Location</h4>
            <input type="text" {...register("location", { required: true })} />
            {errors.location && (
              <p className="text-danger">Location is required</p>
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
