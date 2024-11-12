import { Form, InputGroup, Image } from "react-bootstrap";
import searchImage from "../../assets/images/search.png";

const SearchBar = () => {
  return (
    <InputGroup className="mb-3" style={{ width: "50%" }}>
      <Form.Control
        placeholder="Search a service"
        aria-label="Search a service"
        aria-describedby="basic-addon1"
      />
      <InputGroup.Text id="basic-addon1">
        <Image
          src={searchImage}
          className="img-fluid"
          style={{ width: "20px", height: "20px" }}
        />
      </InputGroup.Text>
    </InputGroup>
  );
};

export default SearchBar;
