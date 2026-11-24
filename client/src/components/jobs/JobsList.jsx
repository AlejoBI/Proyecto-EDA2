import { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../hooks/useAuth.js";
import { CreateJob, EditJob, ConfirmModal, CustomToast } from "../index";
import { Container, Button, Dropdown, Row, Col, Image } from "react-bootstrap";
import useParentComponentData from "../../hooks/useParentComponentData";
import useJobsList from "../../hooks/useJobsList";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../assets/css/JobsPage.module.css";
import logo from "../../assets/images/logo.png";
import jobsicon from "../../assets/images/jobsicon.png";

const JobsList = ({usoEsteFilter = true}) => {
  const { countriesAndCities } = useParentComponentData();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    currentPage,
    itemsPerPage,
    selectedCountry,
    selectedCity,
    filteredJobs,
    currentJob,
    handleCountryChange,
    handleCityChange,
    handleNextPage,
    handlePreviousPage,
    handleEdit,
    handleDelete,
    confirmDelete,
    setCurrentJob,
    handleStartChat,
    toggleModal,
    showModal,
    showToast,
    setShowToast,
    toastMessage,
    toastType,
    JobsCount,
    usersJobsCount,
    loading,
    errors,
    retryJobs,
  } = useJobsList();

  const { user, isAuthenticated } = useAuth();
  const userId = user ? user.id : null;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container className={styles.jobs_container}>
      {usoEsteFilter && (
      <div className={styles.jobs_filter}>
        <Image
          src={logo}
          alt="Logo"
          height="80"
          width="80"
          className="d-inline-block align-center d-block mx-auto"
        />
        <h3 className={styles.job_text2}>Filter</h3>
        <Row className="mb-3">
          <Col>
            <Dropdown onSelect={handleCountryChange}>
              <Dropdown.Toggle className={styles.job_toggle} aria-label="Filter jobs by country">
                {selectedCountry === "All" ? "Select Country" : selectedCountry}
              </Dropdown.Toggle>
              <Dropdown.Menu className={styles.dropdown_menu}>
                <Dropdown.Item eventKey="All">All</Dropdown.Item>
                {Object.keys(countriesAndCities).map((country, index) => (
                  <Dropdown.Item key={index} eventKey={country}>
                    {country}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col>
            <Dropdown onSelect={handleCityChange}>
              <Dropdown.Toggle className={styles.job_toggle} aria-label="Filter jobs by city">
                {selectedCity === "All" ? "Select City" : selectedCity}
              </Dropdown.Toggle>
              <Dropdown.Menu className={styles.dropdown_menu}>
                <Dropdown.Item eventKey="All">All</Dropdown.Item>
                {selectedCountry === "All"
                  ? null
                  : countriesAndCities[selectedCountry]?.map((city, index) => (
                      <Dropdown.Item key={index} eventKey={city}>
                        {city}
                      </Dropdown.Item>
                    ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          {userId && user.role === "customer" && (
            <Col>
              <Button
                className={styles.job_toggle}
                onClick={toggleModal}
              >
                Create Job
              </Button>
              {showModal && (
                <CreateJob show={showModal} handleClose={toggleModal} />
              )}
            </Col>
          )}
        </Row>
      </div>)}
      <div className={styles.jobs_list}>
        <div>
          <h1 className={styles.page_title}>
            Hello {user ? user.username : "new user"} 👋🏼, here you can find all
            the jobs or people you need.
          </h1>
          <div className={styles.jobs_header}>
            <Image
              src={jobsicon}
              alt="Jobs Icon"
              height="80"
              width="80"
              className="d-inline-block align-center d-block"
            />
            <h4 className={styles.text_job}>
              Total Publications: {JobsCount}{" "}
            </h4>
            <Image
              src={jobsicon}
              alt="Jobs Icon"
              height="80"
              width="80"
              className="d-inline-block align-center d-block"
            />
            <h4 className={styles.text_job}>
              Publishers: {usersJobsCount.length}
            </h4>
          </div>
        </div>
        <section className={styles.job} aria-label="Available jobs">
          {loading ? <p className="ui-state--loading" role="status" aria-live="polite">Loading jobs…</p> : errors ? (
            <div className="ui-state--error" role="alert"><p>{errors}</p><Button className={styles.job_button} onClick={retryJobs}>Retry</Button></div>
          ) : !filteredJobs.length ? (
            <p className="ui-state--empty">No jobs available</p>
          ) : (
            currentItems.map((job) => (
              <div key={job.id} className={styles.job_card}>
                <h4 className={`${styles.job_title} ${styles.job_text}`}>
                  {job.title}
                </h4>
                <p className={styles.line}></p>
                <div>
                  <strong className={styles.job_text}>Company:</strong>{" "}
                  {job.company}
                </div>
                <div>
                  <strong className={styles.job_text}>Location:</strong>{" "}
                  {job.city}, {job.country}
                </div>
                <div>
                  <strong className={styles.job_text}>Salary:</strong>{" "}
                  {job.salary}
                </div>
                <details className={styles.details_job}>
                  <summary className={styles.job_text}>Details</summary>
                  <p className={styles.job_text}>{job.description}</p>
                </details>
                {isAuthenticated &&
                  user.role === "professional" &&
                  userId !== job.id_user && (
                    <Button
                    className={styles.job_button}
                      onClick={() => handleStartChat(job.id_user)}
                    >
                      Send a Message
                    </Button>
                  )}
                {userId &&
                  (job.id_user === userId || user.role === "admin") && (
                    <div className="m-1">
                      <Button
                        className={styles.job_button}
                        onClick={() => {
                          handleEdit(job);
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        className={styles.job_button}
                        onClick={() => {
                          handleDelete(job.id);
                          setShowDeleteConfirm(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
              </div>
            ))
          )}
        </section>

        {!loading && !errors && filteredJobs.length > 0 && <nav className={styles.pagination} aria-label="Job pages">
          <Button
            className={styles.job_button}
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            className={styles.job_button}
            onClick={handleNextPage}
            disabled={
              currentPage >= Math.ceil(filteredJobs.length / itemsPerPage)
            }
          >
            Next
          </Button>
        </nav>}

        {showEditModal && (
          <EditJob
            show={showEditModal}
            handleClose={() => {
              setShowEditModal(false);
              setCurrentJob(null); 
            }}
            job={currentJob}
          />
        )}
        {showDeleteConfirm && (
          <ConfirmModal
            show={showDeleteConfirm}
            handleClose={() => setShowDeleteConfirm(false)}
            handleConfirm={() => {
              confirmDelete();
              setShowDeleteConfirm(false);
            }}
            message="Are you sure you want to delete this job?"
          />
        )}
      </div>

      <CustomToast
        show={showToast}
        message={toastMessage}
        backgroundColor={toastType === "success" ? "green" : "red"}
        color="white"
        duration={3000}
        onClose={() => setShowToast(false)}
      />
    </Container>
  );
};

JobsList.propTypes = {
  usoEsteFilter: PropTypes.bool,
};

export default JobsList;
