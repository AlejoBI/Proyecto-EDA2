import React from "react";
import { FreelancersList } from "../components/index";
import { Container } from "react-bootstrap";

const FreelancersPage = () => {
  return (
    <>
      <Container>
        <FreelancersList />
      </Container>
    </>
  );
};

export default FreelancersPage;
