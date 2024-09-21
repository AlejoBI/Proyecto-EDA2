import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from 'react-bootstrap/Button';
import Image from "react-bootstrap/Image";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

function NavigationMenu() {
  const { isAuthenticated, logout, user } = useAuth();
  const tittle = user ? `${user.username}` : "Home";

  return (
    <Navbar style={{ backgroundColor: "#8306AD", padding: '0.3% 8%', width: '87%', height: '5%', margin: '25px auto', borderRadius: "40px", fontFamily: 'Inter'}} variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Image src={logo} alt="Logo" height="70" className="d-inline-block align-top" />
            <span style={{ marginLeft: '10px', fontWeight: 'bold'}}>Taskeria</span>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-dark-example" />
        <Navbar.Collapse id="navbar-dark-example">
          <div style={{ display: "flex", justifyContent: "flex-start", width: '100%', paddingLeft: '28%'}}>
            <Nav className="me-auto">
              <Nav.Link href="/" style={{ color: 'white' }}>Inicio</Nav.Link>
              <Nav.Link href="/freelancers" style={{ color: 'white' }}>Freelancers</Nav.Link>
              <Nav.Link href="/trabajos" style={{ color: 'white' }}>Trabajos</Nav.Link>
            </Nav>
          </div>
          <Nav style={{ justifyContent: "flex-end" }}>
            {isAuthenticated ? (
              <>
                <NavDropdown title={tittle} id="navbarScrollingDropdown">
                  <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    href="/"
                    onClick={() => {
                      logout();
                    }}
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Button href="/login" style={{ backgroundColor: "#520078", borderColor: "#520078", marginRight: "10px", fontWeight: "bold" }}>
                  Login
                </Button>
                <Button href="/register" style={{ backgroundColor: "#520078", borderColor: "#520078", fontWeight: "bold" }}>
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationMenu;
