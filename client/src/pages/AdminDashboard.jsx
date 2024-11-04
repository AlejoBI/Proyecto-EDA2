import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../components/AdminDashboard/SideBar";
import SearchBar from "../components/AdminDashboard/SearchBar";
import UserList from "../components/AdminDashboard/UserList";
import UpdateProfile from "../components/profile/UpdateProfile";
import JobsList from "../components/jobs/JobsList";
import styles from "../../src/assets/css/AdminDashBoard.module.css";
import { Footer } from "../components";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("freelancers");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const handleEditUser = (user) => {
    setUserToEdit(user);
    setShowEditProfile(true);
  };

  const handleCloseEdit = () => {
    setShowEditProfile(false);
    setUserToEdit(null);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <Container fluid className={styles.adminDashboard}>
      <Row>
        <Col md={2} className={styles.sidebarCol}>
          <Sidebar setCurrentView={setCurrentView} currentView={currentView} />
        </Col>
        <Col md={10} className={styles.contentCol}>
          <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
          {currentView === "freelancers" && (
            <UserList
              searchTerm={searchTerm}
              onCreateUser={() => console.log("Create user")}
              onEditUser={handleEditUser} // Aquí se pasa la función de edición
              onDeleteUser={(userId) => console.log("Delete user", userId)}
            />
          )}
          {currentView === "jobs" && (
            <JobsList searchTerm={searchTerm} usoEsteFilter={false} />
          )}
        </Col>
      </Row>
      <Footer />
      
      {showEditProfile && ( // Mueve esto dentro del return
        <UpdateProfile user={userToEdit} onClose={handleCloseEdit} />
      )}
    </Container>
  );
};

export default AdminDashboard;