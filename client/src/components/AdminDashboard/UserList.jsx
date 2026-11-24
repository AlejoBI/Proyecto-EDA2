import { useState } from "react";
import PropTypes from "prop-types";
import { Container, Button, Row, Col, Image } from "react-bootstrap";
import styles from "../../assets/css/AdminDashBoard.module.css";
import useUserList from "../../hooks/useUserList";
import userIcon from "../../assets/images/user-interface.png";
import professionalIcon from "../../assets/images/jobsicon.png";
import customerIcon from "../../assets/images/edificios.png";
import adminIcon from "../../assets/images/admin.png";

const UserList = ({ searchTerm, onEditUser, onDeleteUser }) => {
  const {
    totalUsersCount,
    professionalUsersCount,
    customerUsersCount,
    adminUsersCount,
    currentUsers,
  } = useUserList();

  const [expandedUserId, setExpandedUserId] = useState(null);

  const toggleDetails = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  const filteredUsers = currentUsers.filter(
    (user) =>
      (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditClick = (user) => {
    onEditUser(user);
  };

  return (
    <Container fluid className={styles.userContainer}>
      {/* Encabezado de estadísticas */}
      <section className={styles.statsHeader} aria-label="User statistics">
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
      </section>

      {filteredUsers.length === 0 ? (
        <div className={styles.emptyState} role="status">
          <h2>{currentUsers.length ? "No matching users" : "No users yet"}</h2>
          <p>{currentUsers.length ? "Try a different name or email." : "User accounts will appear here when available."}</p>
        </div>
      ) : filteredUsers.map((user) => (
        <div className={styles.userCard} key={user.id}>
          <Row className={styles.userRow}>
            <Col xs={12} md>{user.username}</Col>
            <Col xs={12} md>{user.email}</Col>
            <Col xs={12} md><span className={styles.roleBadge}>{user.role}</span></Col>
            <Col>
              <Button aria-expanded={expandedUserId === user.id} onClick={() => toggleDetails(user.id)}>Details</Button>
            </Col>
            <Col>
              <Button variant="warning" onClick={() => handleEditClick(user)}>
                Edit
              </Button>
            </Col>
            <Col>
              <Button variant="danger" aria-label={`Delete ${user.username}`} onClick={() => onDeleteUser(user.id)}>
                Delete
              </Button>
            </Col>
          </Row>

          {expandedUserId === user.id && (
            <div className={styles.userDetails}>
              <p><strong>Full name:</strong> {(user.name || "") + " " + (user.lastName || "")}</p>
              <p><strong>Location:</strong> {(user.country || "") + ", " + (user.city || "")}</p>
            </div>
          )}
        </div>
      ))}

    </Container>
  );
};

UserList.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onEditUser: PropTypes.func.isRequired,
  onDeleteUser: PropTypes.func.isRequired,
};

export default UserList;
