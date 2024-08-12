import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"; // Used for form validation in React
import { useNavigate } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { useAuth } from "../context/AuthContext"; // Import the useAuth function from the AuthContext file
import CustomToast from "../components/CustomToast"; // Import the CustomToast component

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signup, isAuthenticated, errors: RegisterErrors } = useAuth(); // Call the useAuth function to get the signup function
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false); // Create a state to show the toast message

  useEffect(() => {
    // Redirect to the home page if the user is authenticated
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  const onSubmit = handleSubmit(async (values) => {
    signup(values); // Call the signup function with the form values
  });

  useEffect(() => { 
    // Show the toast message if there are errors
    if (RegisterErrors) {
      setShowToast(true);
    }
  }, [RegisterErrors]);

  return (
    <div className="container">
      <CustomToast
        show={showToast}
        message={RegisterErrors && RegisterErrors.message}
        position={{ top: 0, right: 0 }}
        duration={2000} // 2000 ms = 2 segundos
        onClose={() => setShowToast(false)}
      />
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control // Input field for username
            type="text"
            placeholder="Enter username"
            {...register("username", { required: true })} // Register the input for validation with react-hook-form
          />
          {errors.username && (
            <p style={{ color: "red" }}>Username is required</p>
          )}
        </Form.Group>
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
          Register
        </Button>
      </Form>
    </div>
  );
}

export default RegisterPage;
