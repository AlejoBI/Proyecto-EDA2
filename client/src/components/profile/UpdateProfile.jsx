import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, Container, Row, Col, Image } from "react-bootstrap";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";
import {
  CountryCitySelector,
  ProfessionalAreaSelector,
  CustomToast,
} from "../index";
import styles from "../../assets/css/ProfilePage.module.css";

const UpdateProfile = () => {
  const { user, updateProfile } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("green");
  const [profileImage, setProfileImage] = useState(user.profileImage || logo);

  const { register, handleSubmit, setValue, watch, getValues } = useForm({
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
      skills: user.skills || [],
      role: user.role,
      profileImage: user.profileImage || logo,
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
    setValue("skills", user.skills || []);
    setValue("profileImage", user.profileImage || logo);
  }, [user, setValue]);

  const onSubmit = async (data) => {
    try {
      const updatedData = { ...data, profileImage };
      const res = await updateProfile(updatedData);
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

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
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
            <Card className={styles.profile_card_custom}>
              <Card.Body className="mx-3 my-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Container className="d-flex justify-content-center align-items-center">
                    <Row className="w-100">
                      <Col md={3} className={styles.info_profile_left}>
                        <p className={styles.title_custom}>Name</p>
                        <input
                          type="text"
                          className="form-control"
                          {...register("name")}
                        />
                        <p className={styles.title_custom}>Gender</p>
                        <div className={styles.radio_custom}>
                          <label className={styles.radio}>
                            <input
                              type="radio"
                              value="Male"
                              className="form-check-input"
                              {...register("gender")}
                            />
                            {""} Male
                          </label>
                          <label className={styles.radio}>
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
                      <Col md={3} className={styles.info_profile_center}>
                        <p className={styles.title_custom}>Lastname</p>
                        <input
                          type="text"
                          className="form-control"
                          {...register("lastName")}
                        />
                        <p className={styles.title_custom}>Age</p>
                        <input
                          type="number"
                          min="18"
                          max="100"
                          step="1"
                          className="form-control"
                          {...register("age")}
                        />
                        <p className={styles.title_custom}>Phone</p>
                        <input
                          type="text"
                          className="form-control"
                          {...register("phone")}
                        />
                        <p className={styles.title_custom}>E-mail</p>
                        <input
                          type="text"
                          className="form-control"
                          {...register("email")}
                          readOnly
                        />
                      </Col>
                      <Col md={3} className={styles.info_profile_right}>
                        <div className={styles.circular_image_container}>
                          <Image
                            src={profileImage}
                            className={styles.circular_image} // Clase circular
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              document.getElementById("imageUpload").click()
                            }
                          />
                        </div>
                        <input
                          type="file"
                          id="imageUpload"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleImageChange}
                        />
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
            <Card className={styles.profile_card_custom2}>
              <Card.Body className="mx-3 my-5">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Container className="d-flex justify-content-center align-items-center">
                    <Row className="w-100">
                      <Col md={3} className={styles.info_profile_left}>
                        <p className={styles.title_custom}>Name</p>
                        <input
                          type="text"
                          className="form-control"
                          {...register("name")}
                        />
                        <CountryCitySelector register={register} />
                        <p className={styles.title_custom}>Gender</p>
                        <div className={styles.radio_custom}>
                          <label className={styles.radio}>
                            <input
                              type="radio"
                              value="Male"
                              className="form-check-input"
                              {...register("gender")}
                            />
                            {""} Male
                          </label>
                          <label className={styles.radio}>
                            <input
                              type="radio"
                              value="Female"
                              className="form-check-input"
                              {...register("gender")}
                            />
                            {""} Female
                          </label>
                        </div>
                      </Col>
                      <Col md={3} className={styles.info_profile_center}>
                        <p className={styles.title_custom}>Lastname</p>
                        <input
                          type="text"
                          className="form-control"
                          {...register("lastName")}
                        />
                        <p className={styles.title_custom}>Age</p>
                        <input
                          type="number"
                          min="18"
                          max="100"
                          step="1"
                          className="form-control"
                          {...register("age")}
                        />
                        <p className={styles.title_custom}>Phone</p>
                        <input
                          type="text"
                          className="form-control"
                          {...register("phone")}
                        />
                        <p className={styles.title_custom}>E-mail</p>
                        <input
                          type="text"
                          className="form-control"
                          {...register("email")}
                          readOnly
                        />
                      </Col>
                      <Col className={styles.info_profile_center_right}>
                        <ProfessionalAreaSelector
                          register={register}
                          setValue={setValue}
                          getValues={getValues} // Pass getValues here
                        />
                      </Col>
                      <Col md={3} className={styles.info_profile_right}>
                        <div className={styles.circular_image_container}>
                          <Image
                            src={profileImage}
                            className={styles.circular_image} // Clase circular
                            onClick={() =>
                              document.getElementById("imageUpload").click()
                            }
                          />
                        </div>
                        <input
                          type="file"
                          id="imageUpload"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleImageChange}
                        />
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
