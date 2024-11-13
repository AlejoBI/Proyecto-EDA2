import React, { useState } from "react";
import { Container, Button, Row, Col, Image } from "react-bootstrap";
import styles from "../../assets/css/AdminDashBoard.module.css";
import useUserList from "../../hooks/useUserList";
import userIcon from "../../assets/images/user-interface.png";
import professionalIcon from "../../assets/images/jobsicon.png";
import customerIcon from "../../assets/images/edificios.png";
import adminIcon from "../../assets/images/admin.png";
import { CustomToast, EditUserModal } from "../index";

const UserList = ({ searchTerm, onEditUser }) => {
  const {
    totalUsersCount,
    professionalUsersCount,
    customerUsersCount,
    adminUsersCount,
    currentUsers,
    showToast,
    toastMessage,
    toastType,
    setShowToast,
  } = useUserList();

  const [expandedUserId, setExpandedUserId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const toggleDetails = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  const filteredUsers = currentUsers.filter(
    (user) =>
      (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setShowEditModal(true);
    onEditUser(user);
  };

  return (
    <Container className={styles.userContainer}>
      {/* Encabezado de estadísticas */}
      <div className={styles.statsHeader}>
        <div className={styles.statItem}>
          <Image src={userIcon} alt="Total Users Icon" height="80" width="80" />
          <h4 className={styles.textStat}>Total Users: {totalUsersCount}</h4>
        </div>
        <div className={styles.statItem}>
          <Image src={professionalIcon} alt="Freelancers Users Icon" height="80" width="80" />
          <h4 className={styles.textStat}>Freelancers Users: {professionalUsersCount}</h4>
        </div>
        <div className={styles.statItem}>
          <Image src={customerIcon} alt="Customer Users Icon" height="80" width="80" />
          <h4 className={styles.textStat}>Customer Users: {customerUsersCount}</h4>
        </div>
        <div className={styles.statItem}>
          <Image src={adminIcon} alt="Admin Users Icon" height="80" width="80" />
          <h4 className={styles.textStat}>Admin Users: {adminUsersCount}</h4>
        </div>
      </div>

      {filteredUsers.map((user) => (
        <div className={styles.userCard} key={user.id}>
          <Row className={styles.userRow}>
            <Col>{user.username}</Col>
            <Col>{user.email}</Col>
            <Col>{user.role}</Col>
            <Col>
              <Button onClick={() => toggleDetails(user.id)}>Details</Button>
            </Col>
            <Col>
              <Button variant="warning" onClick={() => handleEditClick(user)}>
                Edit
              </Button>
            </Col>
          </Row>

          {expandedUserId === user.id && (
            <div className={styles.userDetails}>
              <p><strong>Full name:</strong> {user.name +" "+ user.lastName}</p>
              <p><strong>Location:</strong> {user.country +", "+user.city}</p>
            </div>
          )}
        </div>
      ))}

      {showEditModal && (
        <EditUserModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          handleConfirm={() => {}}
          user={currentUser}
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

export default UserList;
