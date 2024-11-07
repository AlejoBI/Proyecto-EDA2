import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAdmin} from "../../context/AdminContext";
import { Modal, Button, Dropdown } from "react-bootstrap";
import { ConfirmModal } from "../index";
import styles from "../../assets/css/AdminDashBoard.module.css";

const CreateUser = ({ show, handleClose }) => {
  const { createUser } = useAdmin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [selectedRole, setSelectedRole] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const onSubmit = handleSubmit(async (data) => {
    if (!selectedRole) return;

    data.role = selectedRole;
    
    setPendingAction(() => () => handleCreateUser(data));
    setShowConfirm(true);
  });

  const handleCreateUser = async (data) => {
    try {
      const res = await createUser(data);
      if (res && res.message) {
        handleClose();
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleCancel = () => {
    setPendingAction(() => handleClose);
    setShowConfirm(true);
  };

  return (
    <>
      <Modal show={show} onHide={handleCancel} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={onSubmit} className={styles.formContainer}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Username</label>
              <input
                type="text"
                {...register("username", { required: true })}
                className={styles.inputField}
              />
              {errors.username && <p className={styles.errorText}>Username is required</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                {...register("email", { required: true })}
                className={styles.inputField}
              />
              {errors.email && <p className={styles.errorText}>Email is required</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                {...register("password", { required: true })}
                className={styles.inputField}
              />
              {errors.password && <p className={styles.errorText}>Password is required</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Role</label>
              <Dropdown onSelect={setSelectedRole}>
                <Dropdown.Toggle variant="secondary">
                  {selectedRole || "Select Role"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="admin">Admin</Dropdown.Item>
                  <Dropdown.Item eventKey="professional">Freelancer</Dropdown.Item>
                  <Dropdown.Item eventKey="customer">Customer</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {!selectedRole && <p className={styles.errorText}>Role is required</p>}
            </div>

            <Button variant="secondary" onClick={handleCancel} className={styles.cancelButton}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" className={styles.submitButton}>
              Create User
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
            ? "Are you sure you want to close without creating the user?"
            : "Are you sure you want to create this user?"
        }
      />
    </>
  );
};

export default CreateUser;