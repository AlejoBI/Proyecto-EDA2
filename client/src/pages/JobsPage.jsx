import React, { useState } from "react";
import { JobsList, CreateJob } from "../components/index";
import { Button, Container } from "react-bootstrap";

const JobsPage = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <nav className="p-2 m-2">
        <h1>Jobs</h1>
        <Button onClick={toggleModal}>Create Job</Button>
      </nav>
      <Container className="d-flex">
        <div className="ml-20-px f-1">
          <JobsList />
        </div>
      </Container>

      {showModal && <CreateJob show={showModal} handleClose={toggleModal} />}
    </>
  );
};

export default JobsPage;
