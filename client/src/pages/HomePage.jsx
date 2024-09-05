import CustomLabelLanding from "../components/CustomLabelLanding";
import SearchServiceLanding from "../components/SearchServiceLanding";

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
            margin: "25px auto",
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
    </>
  );
};

export default HomePage;
