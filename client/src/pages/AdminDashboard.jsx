import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Sidebar from "../components/AdminDashboard/SideBar";
import SearchBar from "../components/AdminDashboard/SearchBar";
import UserList from "../components/AdminDashboard/UserList";
import JobsList from "../components/jobs/JobsList";
import CreateUser from "../components/AdminDashboard/CreateUserModal";
import styles from "../../src/assets/css/AdminDashBoard.module.css";
import { AdminProvider } from "../context/AdminContext";
import { Footer } from "../components";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("freelancers");
  const [showCreateUser, setShowCreateUser] = useState(false);

  const handleCreateUser = () => {
    setShowCreateUser(true);
  };

  const handleCloseCreateUser = () => {
    setShowCreateUser(false);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <AdminProvider>
      <Container fluid className={styles.adminDashboard}>
        <Row>
          <Col md={2} className={styles.sidebarCol}>
            <Sidebar setCurrentView={setCurrentView} currentView={currentView} />
          </Col>
          <Col md={10} className={styles.contentCol}>
            <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
            {currentView === "freelancers" && (
              <>
                <div className={styles.headerActions}>
                  <Button className={styles.job_toggle} onClick={handleCreateUser}>
                    Create User
                  </Button>
                  {showCreateUser && (
                    <CreateUser show={showCreateUser} handleClose={handleCloseCreateUser} />
                  )}
                </div>
                <UserList
                  onCreateUser={handleCreateUser}
                  onEditUser={(user) => console.log("Edit user", user)}
                  onDeleteUser={(userId) => console.log("Delete user", userId)}
                />
              </>
            )}
            {currentView === "jobs" && (
              <JobsList searchTerm={searchTerm} usoEsteFilter={false} />
            )}
          </Col>
        </Row>
        <Footer />
      </Container>
    </AdminProvider>
  );
};

export default AdminDashboard;