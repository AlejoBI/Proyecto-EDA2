import { useMemo } from "react";
import { Container, Nav, Navbar, NavDropdown, Button, Image } from "react-bootstrap";
import logo from "../../assets/images/logo.png";
import { useAuth } from "../../context/AuthContext";
import styles from "../../assets/css/NavigationMenu.module.css";

const NavigationMenu = () => {
  const { isAuthenticated, logout, user, loading } = useAuth();
  const title = user ? `${user.username}` : "Home";

  const navLinks = useMemo(() => (
    <Nav className="me-auto">
      <Nav.Link href="/" className={styles.link}>Home</Nav.Link>
      <Nav.Link href="/freelancers" className={styles.link}>Freelancers</Nav.Link>
      <Nav.Link href="/jobs" className={styles.link}>Jobs</Nav.Link>
    </Nav>
  ), []);

  const authButtons = useMemo(() => {
    if (loading) {
      return null;
    }
    return isAuthenticated ? (
      <NavDropdown title={title} id="navbarScrollingDropdown">
        <NavDropdown.Item href="/user/profile">Profile</NavDropdown.Item>
        <NavDropdown.Item href="/user/chat">Chats</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="/" onClick={logout}>Logout</NavDropdown.Item>
      </NavDropdown>
    ) : (
      <>
        <Button
          href="/login"
          className={styles.loginButton}
        >
          Login
        </Button>
        <Button
          href="/register"
          className={styles.registerButton}
        >
          Register
        </Button>
      </>
    );
  }, [isAuthenticated, title, logout, loading]);

  return (
    <Navbar
      className={styles.navbar}
      variant="dark"
      expand="lg"
    >
      <Container>
        <Navbar.Brand href="/">
          <div className={styles.brandContainer}>
            <Image src={logo} alt="Logo" height="70" className="d-inline-block align-top" />
            <span className={styles.brandText}>Taskeria</span>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-dark-example" />
        <Navbar.Collapse id="navbar-dark-example">
          <div className={styles.navLinksContainer}>
            {navLinks}
          </div>
          <Nav className={styles.authButtons}>
            {authButtons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationMenu;
