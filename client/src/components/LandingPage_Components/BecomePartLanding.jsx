import React from 'react';
import { Button } from 'react-bootstrap';

const BecomePartLanding = () => {
  return (
    <div className="container-become d-flex flex-column align-items-center justify-content-center text-center">
      <h2 className="fw-bold display-6">Become Part of the Freelance Revolution</h2>
      <p className="fs-4 mb-4">
        Eager to transform your ideas with the right freelancer? Connect with our vibrant
        community today and unlock a world full of talent and endless possibilities.
      </p>
      <div className="become-buttons d-flex justify-content-center">
        <Button href="/freelancers" className="btn-hire mx-2">
            Hire a Freelancer
        </Button>
        <Button href="/jobs" className="btn-work mx-2">
            Work as a Freelancer
        </Button>
      </div>
    </div>
  );
};

export default BecomePartLanding;
