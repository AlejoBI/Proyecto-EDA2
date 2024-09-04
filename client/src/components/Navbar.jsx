import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from 'react-bootstrap/Button';
import Image from "react-bootstrap/Image";
import { useAuth } from "../context/AuthContext";

function NavigationMenu() {
  const { isAuthenticated, logout, user } = useAuth();
  const tittle = user ? `${user.username}` : "Home";

  return (
    <Navbar style={{ backgroundColor: "#8306AD", padding: '1% 10%', width: '87%',  height: '5%', margin: '25px auto', borderRadius: "30px"}} variant="dark" expand="lg">
      
      <Container>
        <Navbar.Brand href="/">Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-dark-example" />
        <Navbar.Collapse id="navbar-dark-example">
          <Nav className="me-auto">
            <Nav.Link href="/support">Support</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
          </Nav>
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
                <Button href="/login" style={{ backgroundColor: "#520078", borderColor: "#520078", marginRight: "10px"}}>
                  Login
                </Button>
                <Button href="/register" style={{ backgroundColor: "#520078", borderColor: "#520078" }}>
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
