import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row, Image, Button, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import profileImage from "../../assets/logo.png";
import { capitalizeFirstLetter } from "../../hooks/CapitalizeFirstLetter";
import { UpdateProfile } from "../index";
import styles from "../../assets/css/ProfilePage.module.css";

const ProfileInformation = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

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

    if (
      user.role === "professional" &&
      (!user.name ||
        !user.lastName ||
        !user.phone ||
        !user.city ||
        !user.country)
    ) {
      setShowModal(true);
    }
  }, [user, setValue]);

  return (
    <>
      {!updateInformation ? (
        <>
          <Container className="d-flex align-items-center justify-content-center">
            <Card className={styles.profile_card}>
              <Card.Body>
                <Container className="d-flex flex-column align-items-center">
                  <Image
                    src={profileImage}
                    roundedCircle
                    className={styles.profile_image}
                  />
                  <h2 className={styles.profile_name}>{`${user.username}, ${
                    user.age ?? 0
                  }`}</h2>
                  <h5 className={styles.profile_role}>
                    {capitalizeFirstLetter(user.role)}
                  </h5>
                  <p className={styles.profile_location}>{`${user.city ?? "City"}, ${
                    user.country ?? "Country"
                  }`}</p>

                  {/* Botones de acción */}
                  <Row className="my-3">
                    <Col className="text-center">
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
                  <div className={styles.profile_details}>
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

          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Complete Your Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                To be eligible for job offers, please ensure all your profile
                information is filled out completely.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
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
