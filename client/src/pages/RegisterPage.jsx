import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Link } from "react-router-dom";

import { Form, Button, Container, Card, Image, Alert } from "react-bootstrap";
import logoImage from "../assets/images/logo.png";

import { useAuth } from "../hooks/useAuth.js";
import { CustomToast } from "../components/index";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {
    isAuthenticated,
    errors: registerErrors,
    signup,
    authStatus,
    loading,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (isAuthenticated && location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const onSubmit = handleSubmit((values) => signup(values));
  const authReady = authStatus === "ready" && !loading;

  useEffect(() => {
    if (registerErrors) {
      setShowToast(true);
    }
  }, [registerErrors]);

  return (
    <main className="auth-page"><Container className="d-flex align-items-center justify-content-center bg-gradient-custom">
      <CustomToast
        show={showToast}
        message={registerErrors ? registerErrors : ""}
        position={{ top: 0, right: 0 }}
        duration={3000} // 3000 ms = 3 segundos
        onClose={() => setShowToast(false)}
      />
      <Card className="shadow-lg rounded-5 w-50 h-50 d-flex justify-content-center align-items-center">
        <Card.Body className="mx-3 my-5 w-50 h-50">
          <div className="d-flex justify-content-end">
            <Button variant="link" href="/" className="p-0" aria-label="Close sign up">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                className="bi bi-x"
                viewBox="0 0 16 16"
              >
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
              </svg>
            </Button>
          </div>
          <div className="text-center mb-4">
            <Image
              src={logoImage}
              alt="Freelance platform logo"
              className="img-fluid"
              style={{ width: "80px", height: "80px" }}
            />
            <h2 className="h4">Sign up</h2>
            <p>
              Do you already have an account?{" "}
              <Link to="/login" id="linkText">
                Sign in
              </Link>
            </p>
          </div>

          {authStatus === "unavailable" && <Alert variant="warning" role="alert">
              Registration is currently unavailable. Please try again later.
          </Alert>}

          <div className="divider">OR</div>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                className="ui-input"
                type="text"
                placeholder="Enter username"
                {...register("username", { required: true })} 
              />
              {errors.username && (
                <p style={{ color: "red" }}>Username is required</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                className="ui-input"
                type="email"
                placeholder="Enter email"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p style={{ color: "red" }}>Email is required</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                className="ui-input"
                type="password"
                placeholder="Password"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <p style={{ color: "red" }}>Password is required</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicRole">
              <Form.Label>Role</Form.Label>
              <Form.Select className="ui-input" {...register("role", { required: true })}>
                <option value="customer">Customer</option>
                <option value="professional">Professional</option>
              </Form.Select>
              {errors.role && <p style={{ color: "red" }}>Role is required</p>}
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              id="buttonLoginRegister"
              disabled={!authReady}
            >
              Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container></main>
  );
}

export default RegisterPage;
