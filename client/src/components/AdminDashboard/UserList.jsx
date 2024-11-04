import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Image } from "react-bootstrap";
import styles from "../../assets/css/AdminDashBoard.module.css";
import { getAllUsersRequest } from "../../api/auth";

// Imágenes de iconos
import userIcon from "../../assets/images/user-interface.png";
import professionalIcon from "../../assets/images/jobsicon.png";
import customerIcon from "../../assets/images/edificios.png";
import adminIcon from "../../assets/images/admin.png";

const UserList = ({ searchTerm, onDeleteUser, onEditUser, onCreateUser }) => {
  const [userList, setUserList] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [professionalUsersCount, setProfessionalUsersCount] = useState(0);
  const [customerUsersCount, setCustomerUsersCount] = useState(0);
  const [adminUsersCount, setAdminUsersCount] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsersRequest();
        setUserList(response);
        countUsersByRole(response); // Llama a la función para contar los roles
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const countUsersByRole = (users) => {
    setTotalUsersCount(users.length); // Total de usuarios

    const professionalCount = users.filter(user => user.role === 'professional').length;
    const customerCount = users.filter(user => user.role === 'customer').length;
    const adminCount = users.filter(user => user.role === 'admin').length;

    setProfessionalUsersCount(professionalCount);
    setCustomerUsersCount(customerCount);
    setAdminUsersCount(adminCount);
  };

  const filteredUsers = userList.filter((user) =>
    user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Image src={professionalIcon} alt="Professional Users Icon" height="80" width="80" />
          <h4 className={styles.textStat}>Professional Users: {professionalUsersCount}</h4>
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

      {filteredUsers.map((user) => (
        <div key={user.id} className={styles.userCard}>
          <div className={styles.userInfo} onClick={() => toggleDetails(user.id)}>
            <h5 className={styles.userName}>{user.name}</h5>
            <Button variant="link" className={styles.detailsButton}>
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
            <Button variant="warning" onClick={() => onEditUser(user)}>
              Edit
            </Button>
            <Button variant="danger" onClick={() => onDeleteUser(user.id)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </Container>
  );
};

export default UserList;