import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CustomLabelLanding = ({ text, img, numLabel, path }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${path}`);
  };

  return (
    <Card
      style={{ width: "12rem", borderRadius: "10%" }}
      id={`cardLanding${numLabel}`}
      onClick={() => {
        handleClick();
      }}
    >
      <Card.Body>
        <Card.Title>{text}</Card.Title>
      </Card.Body>
      <Card.Img
        variant="down"
        src={img}
        style={{
          margin: "10%",
          borderRadius: "10%",
        }}
      />
    </Card>
  );
};

export default CustomLabelLanding;
