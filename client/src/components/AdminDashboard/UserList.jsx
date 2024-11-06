import React, { useState } from "react";
import { Container, Button, Row, Col, Image } from "react-bootstrap";
import styles from "../../assets/css/AdminDashBoard.module.css";
import useUsersList from "../../hooks/useUserList";
import userIcon from "../../assets/images/user-interface.png";
import professionalIcon from "../../assets/images/jobsicon.png";
import customerIcon from "../../assets/images/edificios.png";
import adminIcon from "../../assets/images/admin.png";

const UserList = ({ onCreateUser }) => {
  const {
    totalUsersCount,
    professionalUsersCount,
    customerUsersCount,
    adminUsersCount,
    currentUsers,
    handleEdit,
    handleDelete,
    showToast,
    toastMessage,
    setShowToast,
  } = useUsersList();

  const [expandedUserId, setExpandedUserId] = useState(null);

  const toggleDetails = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
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

      {/* Lista de usuarios */}
      <div className={styles.userHeader}>
        <h4 className={styles.userHeading}>Users List</h4>
        <Button variant="success" onClick={onCreateUser}>
          Create User
        </Button>
      </div>

      {currentUsers.map((user) => (
        <div key={user.id} className={styles.userCard}>
          <div className={styles.userInfo}>
            <h5 className={styles.userName}>{user.name}</h5>
            <Button variant="link" className={styles.detailsButton} onClick={() => toggleDetails(user.id)}>
              {expandedUserId === user.id ? "Hide details" : "Show details"}
            </Button>
          </div>

          {expandedUserId === user.id && (
            <Row className={styles.userDetails}>
              <Col md={6}>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Age:</strong> {user.age}</p>
                <p><strong>City:</strong> {user.city}</p>
              </Col>
              <Col md={6}>
                <p><strong>Country:</strong> {user.country}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>Professional Area:</strong> {user.professionalArea}</p>
                <p><strong>Skill:</strong> {user.skill}</p>
              </Col>
            </Row>
          )}

          <div className={styles.userActions}>
            <Button variant="warning" onClick={() => handleEdit(user)}>
              Edit
            </Button>
            <Button variant="danger" onClick={() => handleDelete(user.id)}>
              Delete
            </Button>
          </div>
        </div>
      ))}

      {/* Toast Notification */}
      {showToast && (
        <div className={`toast ${toastType}`}>
          {toastMessage}
          <button onClick={() => setShowToast(false)}>Close</button>
        </div>
      )}
    </Container>
  );
};

export default UserList;