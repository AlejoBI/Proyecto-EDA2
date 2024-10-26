import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row, Image, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import profileImage from "../../assets/logo.png"; 
import { capitalizeFirstLetter } from "../../hooks/CapitalizeFirstLetter";
import { CustomToast, UpdateProfile } from "../index";
import "../../assets/css/ProfilePage.css"; 

const ProfileInformation = () => {
  const { user, updateProfile } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("green");

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      username: user.username,
      lastName: user.lastName || "",
      phone: user.phone || "",
      email: user.email,
      age: user.age || 0,
      city: user.city || "",
      country: user.country || "",
      gender: user.gender || "",
    },
  });

  const [updateInformation, setUpdateInformation] = useState(false);

  useEffect(() => {
    setValue("name", user.name);
    setValue("lastName", user.lastName || "");
    setValue("phone", user.phone || "");
    setValue("email", user.email);
    setValue("age", user.age || 0);
    setValue("city", user.city || "");
    setValue("country", user.country || "");
    setValue("gender", user.gender || "");
  }, [user, setValue]);

  return (
    <>
      {!updateInformation ? (
        <>
          <Container className="d-flex align-items-center justify-content-center">
            <CustomToast
              show={showToast}
              message={toastMessage}
              position={{ top: "0", right: "0" }}
              color={toastColor}
              duration={3000}
              onClose={() => setShowToast(false)}
            />
            <Card className="profile-card shadow-lg rounded-5">
              <Card.Body>
                <Container className="d-flex flex-column align-items-center">
                  <Image
                    src={profileImage}
                    roundedCircle
                    className="profile-image mb-3"
                  />
                  <h2 className="profile-name">{`${user.username}, ${
                    user.age ?? 0
                  }`}</h2>
                  <h5 className="profile-role text-muted">
                    {capitalizeFirstLetter(user.role)}
                  </h5>
                  <p className="profile-location">{`${user.city ?? "City"}, ${
                    user.country ?? "Country"
                  }`}</p>

                  {/* Botones de acción */}
                  <Row className="my-3">
                    <Col className="text-center">
                      <Button
                        variant="primary"
                        className="me-2"
                        id="buttonLoginRegister"
                      >
                        Jobs
                      </Button>
                      <Button
                        className="outline-primary"
                        id="buttonLoginRegister"
                        onClick={() => setUpdateInformation(true)}
                      >
                        Update Information
                      </Button>
                    </Col>
                  </Row>

                  {/* Información adicional */}
                  <div className="profile-details">
                    <p>
                      <strong>Full Name:</strong>{" "}
                      {`${user.name} ${user.lastName}`}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {user.phone}
                    </p>
                  </div>

                  {/* Botón para actualizar información */}
                </Container>
              </Card.Body>
            </Card>
          </Container>
        </>
      ) : (
        <>
          <Container>
            {updateInformation && (
              <Container>
                <UpdateProfile />
              </Container>
            )}
          </Container>
        </>
      )}
    </>
  );
};
export default ProfileInformation;
