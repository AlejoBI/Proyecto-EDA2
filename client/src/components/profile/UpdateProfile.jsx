import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, Container, Row, Col, Image } from "react-bootstrap";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";
import { CountryCitySelector, ProfessionalAreaSelector, CustomToast } from "../index";

const UpdateProfile = () => {
  const { user, updateProfile } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("green");

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      username: user.username,
      lastName: user.lastName || "",
      phone: user.phone || "",
      email: user.email,
      age: user.age || 0,
      city: user.city || "",
      country: user.country || "",
      gender: user.gender || "",
      professionalArea: user.professionalArea || "",
      role: user.role,
    },
  });

  useEffect(() => {
    setValue("name", user.name);
    setValue("lastName", user.lastName || "");
    setValue("phone", user.phone || "");
    setValue("email", user.email);
    setValue("age", user.age || 0);
    setValue("city", user.city || "");
    setValue("country", user.country || "");
    setValue("gender", user.gender || "");
    setValue("professionalArea", user.professionalArea || "");
  }, [user, setValue]);

  const onSubmit = async (data) => {
    try {
      const res = await updateProfile(data);
      if (res && res.message) {
        setToastMessage(res.message);
        setToastColor("green");
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage(
        "Error: " + (error.response?.data?.error || error.message)
      );
      setToastColor("red");
      setShowToast(true);
    }
  };

  return (
    <>
      <CustomToast
        show={showToast}
        message={toastMessage}
        position={{ top: "0", right: "0" }}
        color={toastColor}
        duration={3000}
        onClose={() => setShowToast(false)}
      />
      {user.role === "customer" ? (
        <>
          <Container className="d-flex align-items-center justify-content-center">
            <Card className="shadow-lg rounded-5 profile-card-custom2">
              <Card.Body className="mx-3 my-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Container className="d-flex justify-content-center align-items-center">
                    <Row className="w-100">
                      <Col
                        md={3}
                        className="d-flex flex-column align-items-end info-profile-left"
                      >
                        <p className="title-custom">Name</p>
                        <input
                          type="text"
                          className="form-control"
                          {...register("name")}
                        />
                        <p className="title-custom">Gender</p>
                        <div className="radio-custom">
                          <label className="radio">
                            <input
                              type="radio"
                              value="Male"
                              className="form-check-input"
                              {...register("gender")}
                            />
                            {""} Male
                          </label>
                          <label className="radio">
                            <input
                              type="radio"
                              value="Female"
                              className="form-check-input"
                              {...register("gender")}
                            />
                            {""} Female
                          </label>
                        </div>
                        <CountryCitySelector register={register} />
                      </Col>
                      <Col
                        md={3}
                        className="d-flex flex-column align-items-end info-profile-center"
                      >
                        <p className="title-custom">Lastname</p>
                        <input
                          type="text"
                          className="form-control"
                          {...register("lastName")}
                        />
                        <p className="title-custom">Age</p>
                        <input
                          type="number"
                          min="18"
                          max="100"
                          step="1"
                          className="form-control"
                          {...register("age")}
                        />
                        <p className="title-custom">Phone</p>
                        <input
                          type="text"
                          className="form-control"
                          {...register("phone")}
                        />
                        <p className="title-custom">E-mail</p>
                        <input
                          type="text"
                          className="form-control"
                          {...register("email")}
                          readOnly
                        />
                      </Col>
                      <Col
                        md={3}
                        className="d-flex flex-column info-profile-right"
                      >
                        <Image src={logo} className="img-fluid" />
                        <p>{watch("username")}</p>
                        <button
                          className="btn btn-primary"
                          id="buttonLoginRegister"
                          type="submit"
                        >
                          Save
                        </button>
                      </Col>
                    </Row>
                  </Container>
                </form>
              </Card.Body>
            </Card>
          </Container>
        </>
      ) : (
        <>
          <Container className="d-flex align-items-center justify-content-center">
            <Card className="shadow-lg rounded-5 profile-card-custom2">
              <Card.Body className="mx-3 my-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Container className="d-flex justify-content-center align-items-center">
                    <Row className="w-100">
                      <Col
                        md={3}
                        className="d-flex flex-column align-items-end info-profile-left"
                      >
                        <p className="title-custom">Name</p>
                        <input
                          type="text"
                          className="form-control"
                          {...register("name")}
                        />
                        <p className="title-custom">Gender</p>
                        <div className="radio-custom">
                          <label className="radio">
                            <input
                              type="radio"
                              value="Male"
                              className="form-check-input"
                              {...register("gender")}
                            />
                            {""} Male
                          </label>
                          <label className="radio">
                            <input
                              type="radio"
                              value="Female"
                              className="form-check-input"
                              {...register("gender")}
                            />
                            {""} Female
                          </label>
                        </div>
                        <ProfessionalAreaSelector
                          register={register}
                          setValue={setValue}
                        />
                        <CountryCitySelector register={register} />
                      </Col>
                      <Col
                        md={3}
                        className="d-flex flex-column align-items-end info-profile-center"
                      >
                        <p className="title-custom">Lastname</p>
                        <input
                          type="text"
                          className="form-control"
                          {...register("lastName")}
                        />
                        <p className="title-custom">Age</p>
                        <input
                          type="number"
                          min="18"
                          max="100"
                          step="1"
                          className="form-control"
                          {...register("age")}
                        />
                        <p className="title-custom">Phone</p>
                        <input
                          type="text"
                          className="form-control"
                          {...register("phone")}
                        />
                        <p className="title-custom">E-mail</p>
                        <input
                          type="text"
                          className="form-control"
                          {...register("email")}
                          readOnly
                        />
                      </Col>
                      <Col
                        md={3}
                        className="d-flex flex-column info-profile-right"
                      >
                        <Image src={logo} className="img-fluid" />
                        <p>{watch("username")}</p>
                        <button
                          className="btn btn-primary"
                          id="buttonLoginRegister"
                          type="submit"
                        >
                          Save
                        </button>
                      </Col>
                    </Row>
                  </Container>
                </form>
              </Card.Body>
            </Card>
          </Container>
        </>
      )}
    </>
  );
};

export default UpdateProfile;
