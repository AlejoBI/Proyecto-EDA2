import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  Sidebar,
  SearchBar,
  UserList,
  JobsList,
  ConfirmModal,
  CustomToast,
  EditUserModal,
} from "../components/index";
import styles from "../../src/assets/css/AdminDashBoard.module.css";
import { useJobs } from "../hooks/useJobs.js";
import { useAdmin } from "../hooks/useAdmin.js";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("freelancers");
  const { errors: jobError } = useJobs();
  const { errors: userError, editUser, deleteUser } = useAdmin();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    if (jobError) {
      showToastMessage(jobError, "error");
    }
  }, [jobError]);

  useEffect(() => {
    if (userError) {
      showToastMessage(userError, "error");
    }
  }, [userError]);

  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleEditUserClick = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleEditUser = async (userId, userData) => {
    try {
      await editUser(userId, userData);
      showToastMessage("User edited successfully", "success");
      return true;
    } catch {
      showToastMessage("Failed to edit user", "error");
      return false;
    }
  };

  const handleDeleteUserClick = (userId) => {
    setShowDeleteConfirm(userId);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      showToastMessage("User deleted successfully", "success");
      setShowDeleteConfirm(false);
    } catch {
      showToastMessage("Failed to delete user", "error");
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  return (
    <Container fluid className={styles.adminDashboard}>
      <Row className={styles.dashboardRow}>
        <Col xs={12} md={3} lg={2} className={styles.sidebarCol}>
          <Sidebar setCurrentView={setCurrentView} currentView={currentView} />
        </Col>
        <Col xs={12} md={9} lg={10} className={styles.contentCol}>
          <header className={styles.pageHeader}>
            <p className={styles.eyebrow}>Administration</p>
            <h1>{currentView === "freelancers" ? "Users" : "Jobs"}</h1>
            <p>Manage platform activity and accounts.</p>
          </header>
          {currentView === "freelancers" && (
            <>
              <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
              <UserList
                searchTerm={searchTerm}
                onEditUser={handleEditUserClick}
                onDeleteUser={handleDeleteUserClick}
              />
            </>
          )}
          {currentView === "jobs" && (
            <JobsList searchTerm={searchTerm} usoEsteFilter={false} />
          )}
        </Col>
      </Row>

      {showDeleteConfirm && (
        <ConfirmModal
          show={Boolean(showDeleteConfirm)}
          handleClose={() => setShowDeleteConfirm(false)}
          handleConfirm={() => handleDeleteUser(showDeleteConfirm)}
          message="Are you sure you want to delete this user?"
        />
      )}

      {showEditModal && (
        <EditUserModal
          show={showEditModal}
          handleClose={handleCloseEditModal}
          handleConfirm={handleEditUser}
          user={selectedUser}
        />
      )}

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

export default AdminDashboard;
