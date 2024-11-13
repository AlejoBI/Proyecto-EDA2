import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ConfirmModal } from "../index";

const EditUserModal = ({ show, handleClose, handleConfirm, user }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        role: user.role || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveClick = () => {
    setShowConfirmModal(true);
  };

  const confirmSave = () => {
    handleConfirm(user.id, formData);
    setShowConfirmModal(false);
    handleClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group controlId="formRole" className="mt-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="customer">Customer</option>
                <option value="professional">Professional</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveClick}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {showConfirmModal && (
        <ConfirmModal
          show={showConfirmModal}
          handleClose={() => setShowConfirmModal(false)}
          handleConfirm={confirmSave}
          message="Are you sure you want to save these changes?"
        />
      )}
    </>
  );
};

export default EditUserModal;
