import {
  CustomLabelLanding,
  SearchServiceLanding,
  TestimonialLanding,
  BecomePartLanding,
} from "../components/index";
import "../assets/css/LandingPage.css";
import TechnologyAndProgramming from "../assets/images/TechnologyAndProgramming.jpg";
import GraphicDesign from "../assets/images/GraphicDesign.jpg";
import VideoAndAnimation from "../assets/images/VideoAndAnimation.jpg";
import WritingAndTranslation from "../assets/images/WritingAndTranslation.jpg";
import DigitalMarketing from "../assets/images/DigitalMarketing.jpg";
import MusicAndAudio from "../assets/images/MusicAndAudio.jpg";

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
            img={TechnologyAndProgramming}
            numLabel="1"
            path = "freelancers"
          />
          <CustomLabelLanding
            text="Graphic Design"
            img={GraphicDesign}
            numLabel="2"
            path = "freelancers"
          />
          <CustomLabelLanding
            text="Video and Animation"
            img={VideoAndAnimation}
            numLabel="3"
            path = "freelancers"
          />
          <CustomLabelLanding
            text="Writing and Translation"
            img={WritingAndTranslation}
            numLabel="4"
            path = "freelancers"
          />
          <CustomLabelLanding
            text="Digital Marketing"
            img={DigitalMarketing}
            numLabel="5"
            path = "freelancers"
          />
          <CustomLabelLanding
            text="Music and Audio"
            img={MusicAndAudio}
            numLabel="6"
            path = "freelancers"
          />
        </div>
      </div>

      <div
        className="container d-flex flex-column align-items-center justify-content-center text-center"
        style={{ height: "35vh", color: "#520078" }}
      >
        <h2 className="fw-bold display-6">
          Discover the right expert for your needs
        </h2>
        <p className="fw-bold lead">
          Make your projects a reality with ease and smart solutions. Let’s
          bring your vision to life together!
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
