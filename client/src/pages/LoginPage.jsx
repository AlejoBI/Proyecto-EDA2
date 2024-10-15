import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"; // Used for form validation in React
import { useNavigate, Link } from "react-router-dom";

import { Form, Button, Container, Card, Image } from "react-bootstrap";
import logoImage from "../assets/logo.png"; 

import { useAuth } from "../context/AuthContext"; 
import { CustomToast } from "../components/index"; 

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const { signin, isAuthenticated, errors: signinErrors } = useAuth();
  const navigate = useNavigate(); // Create a navigate function to redirect the user
  const [showToast, setShowToast] = useState(false); // Create a state to show the toast message

  useEffect(() => {
    // Redirect to the home page if the user is authenticated
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  const onSubmit = handleSubmit((data) => {
    signin(data); // Call the signin function from the AuthContext file
  });

  useEffect(() => {
    // Show the toast message if there are errors
    if (signinErrors) {
      setShowToast(true);
    }
  }, [signinErrors]);

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 min-vw-100 bg-gradient-custom">
      <CustomToast
        show={showToast}
        message={signinErrors && signinErrors.message}
        position={{ top: "0", right: "0" }}
        duration={3000} // 3000 ms = 3 segundos
        onClose={() => setShowToast(false)}
      />
      <Card className="shadow-lg rounded-5 w-50 h-50 d-flex justify-content-center align-items-center">
        <Card.Body className="mx-3 my-5 w-50 h-50">
          <div className="d-flex justify-content-end">
            <Button variant="link" href="/" className="p-0">
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
              className="img-fluid"
              style={{ width: "80px", height: "80px" }}
            />
            <h2 className="h4">Sign in</h2>
            <p className="mt-3 text-center">
              Don't you have an account? <Link to="/register" id="linkText">Sign up</Link>
            </p>
          </div>

          <Container className="d-flex justify-content-center align-items-center">
            <Button
            className="w-100 border"
            id="buttonGoogleLoginRegister">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-google"
                viewBox="0 0 16 16"
              >
                <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
              </svg>
              <strong> Sign in with Google</strong>
            </Button>
          </Container>

          <div className="divider">OR</div>

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                {...register("email", { required: true })}
              />
              {errors.email && <p className="text-danger">Email is required</p>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <p className="text-danger">Password is required</p>
              )}
            </Form.Group>
            <div className="d-flex justify-content-end m-2">
              <Link to="/register" id="linkText">Forget your password</Link>
            </div>
            <Button variant="primary" type="submit" className="w-100" id="buttonLoginRegister">Login</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginPage;
