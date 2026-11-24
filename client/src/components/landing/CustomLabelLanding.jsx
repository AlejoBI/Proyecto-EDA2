import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const CustomLabelLanding = ({ text, img, numLabel, path }) => {
  return (
    <Card
      as={Link}
      to={`/${path}`}
      className="home-category-card ui-card"
      style={{ width: "12rem", borderRadius: "10%" }}
      id={`cardLanding${numLabel}`}
    >
      <Card.Body>
        <Card.Title>{text}</Card.Title>
      </Card.Body>
      <Card.Img
        variant="down"
        src={img}
        alt={text}
        width="240"
        height="160"
        loading="lazy"
        decoding="async"
        className="home-category-image"
        style={{ borderRadius: "10%" }}
      />
    </Card>
  );
};

CustomLabelLanding.propTypes = {
  text: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  numLabel: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default CustomLabelLanding;
