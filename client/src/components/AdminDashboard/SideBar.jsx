import PropTypes from "prop-types";
import { Button, Image } from "react-bootstrap";
import logo from "../../assets/images/logo.png";
import styles from "../../assets/css/AdminDashBoard.module.css";

import { useAuth } from "../../hooks/useAuth.js";

const Sidebar = ({ setCurrentView, currentView }) => {
  const { logout } = useAuth();
  return (
    <div className={styles.sidebar}>
      <div className="logo">
        <Image
          src={logo}
          alt="Logo"
          height="80"
          width="80"
          className="d-inline-block align-center d-block mx-auto"
        />
        <h4>AdminDashboard</h4>
      </div>
      <div className={styles.links}>
        <ul>
          <p className="spann">Lists</p>
          <Button
            variant="primary"
            onClick={() => setCurrentView("freelancers")}
            className={currentView === "freelancers" ? styles.active : ""}
          >
            Users
          </Button>
          <Button
            variant="primary"
            onClick={() => setCurrentView("jobs")}
            className={currentView === "jobs" ? styles.active : ""}
          >
            Jobs
          </Button>
          <Button variant="danger" onClick={() => logout()}>
            Logout
          </Button>
        </ul>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  setCurrentView: PropTypes.func.isRequired,
  currentView: PropTypes.oneOf(["freelancers", "jobs"]).isRequired,
};

export default Sidebar;
