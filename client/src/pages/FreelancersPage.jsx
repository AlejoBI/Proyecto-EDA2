import React from "react";
import { FreelancersList } from "../components/index";
import { Container } from "react-bootstrap";

const FreelancersPage = () => {
  return (
    <>
      <nav>
        <h1>Freelancers</h1>
      </nav>
      <Container>
        <FreelancersList />
      </Container>
    </>
  );
};

export default FreelancersPage;
