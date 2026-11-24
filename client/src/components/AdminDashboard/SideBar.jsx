import PropTypes from "prop-types";
import { Button, Image } from "react-bootstrap";
import logo from "../../assets/images/logo.png";
import styles from "../../assets/css/AdminDashBoard.module.css";

import { useAuth } from "../../hooks/useAuth.js";

const Sidebar = ({ setCurrentView, currentView }) => {
  const { logout } = useAuth();
  return (
    <aside className={styles.sidebar} aria-label="Admin navigation">
      <div className="logo">
        <Image
          src={logo}
          alt="Logo"
          height="80"
          width="80"
          className="d-inline-block align-center d-block mx-auto"
        />
        <h4>Admin workspace</h4>
      </div>
      <div className={styles.links}>
        <nav aria-label="Dashboard sections">
          <p className={styles.navLabel}>Workspace</p>
          <Button
            variant="primary"
            onClick={() => setCurrentView("freelancers")}
            className={currentView === "freelancers" ? styles.active : ""}
            aria-current={currentView === "freelancers" ? "page" : undefined}
          >
            Users
          </Button>
          <Button
            variant="primary"
            onClick={() => setCurrentView("jobs")}
            className={currentView === "jobs" ? styles.active : ""}
            aria-current={currentView === "jobs" ? "page" : undefined}
          >
            Jobs
          </Button>
          <Button variant="danger" onClick={() => logout()}>
            Logout
          </Button>
        </nav>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  setCurrentView: PropTypes.func.isRequired,
  currentView: PropTypes.oneOf(["freelancers", "jobs"]).isRequired,
};

export default Sidebar;
