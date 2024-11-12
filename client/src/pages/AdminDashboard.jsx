import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Sidebar from "../components/AdminDashboard/SideBar";
import SearchBar from "../components/AdminDashboard/SearchBar";
import UserList from "../components/AdminDashboard/UserList";
import JobsList from "../components/jobs/JobsList";
import styles from "../../src/assets/css/AdminDashBoard.module.css";

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("freelancers");

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
            <>
              <UserList
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
    </Container>
  );
};

export default AdminDashboard;
