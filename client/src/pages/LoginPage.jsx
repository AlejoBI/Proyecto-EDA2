import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"; // Used for form validation in React
import { useNavigate, Link } from "react-router-dom";

import { Form, Button } from "react-bootstrap";

import { useAuth } from "../context/AuthContext"; // Import the useAuth function from the AuthContext file
import CustomToast from "../components/CustomToast"; // Import the CustomToast component

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
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
    <div className="container">
      <h1>Login</h1>
      <CustomToast
        show={showToast}
        message={signinErrors && signinErrors.message}
        position={{ top: 0, right: 0 }}
        duration={3000} // 3000 ms = 3 segundos
        onClose={() => setShowToast(false)}
      />
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            {...register("email", { required: true })}
          />
          {errors.email && <p style={{ color: "red" }}>Email is required</p>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
          />
          {errors.password && (
            <p style={{ color: "red" }}>Password is required</p>
          )}
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
      <p>
        Don't you have an account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  );
}

export default LoginPage;
