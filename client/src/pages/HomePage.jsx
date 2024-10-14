import { CustomLabelLanding, SearchServiceLanding } from "../components/index";

import paginaweb from "../assets/paginaweb.jpg";
import TestimonialLanding from "../components/TestimonialLanding";
import BecomePartLanding from "../components/BecomePartLanding";

const HomePage = () => {
  return (
    <>
      <div className="container">
        <SearchServiceLanding />
      </div>

      <div className="container">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            margin: "50px auto",
          }}
        >
          <CustomLabelLanding
            text="Technology and Programming"
            img={paginaweb}
            numLabel="1"
          />
          <CustomLabelLanding
            text="Graphic Design"
            img={paginaweb}
            numLabel="2"
          />
          <CustomLabelLanding
            text="Video and Animation"
            img={paginaweb}
            numLabel="3"
          />
          <CustomLabelLanding
            text="Writing and Translation"
            img={paginaweb}
            numLabel="4"
          />
          <CustomLabelLanding
            text="Digital Marketing"
            img={paginaweb}
            numLabel="5"
          />
          <CustomLabelLanding
            text="Music and Audio"
            img={paginaweb}
            numLabel="6"
          />
        </div>
      </div>

      <div className="container d-flex flex-column align-items-center justify-content-center text-center" style={{ height: '35vh', color: '#520078' }}>
        <h2 className="fw-bold display-6">
          Discover the right expert for your needs
        </h2>
        <p className="fw-bold lead">
        Make your projects a reality with ease and smart solutions. Let’s bring your vision to life together!
        </p>
      </div>

      <div className="container">
        <TestimonialLanding />
      </div>

      <div className="container">
        <BecomePartLanding />
      </div>
    </>
  );
};

export default HomePage;
