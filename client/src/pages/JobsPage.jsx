import { JobsList } from "../components/index";
import { Container } from "react-bootstrap";
import "../assets/css/JobsPage.css";

const JobsPage = () => {
  return (
    <>
      <Container className="d-flex">
        <div className="ml-20-px f-1">
          <JobsList />
        </div>
      </Container>
    </>
  );
};

export default JobsPage;
