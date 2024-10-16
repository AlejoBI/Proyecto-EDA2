import { Card } from "react-bootstrap";

const CustomLabelLanding = ({ text, img, numLabel }) => {
  return (
    <Card
      style={{ width: "12rem", borderRadius: "10%" }}
      id={`cardLanding${numLabel}`}
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
