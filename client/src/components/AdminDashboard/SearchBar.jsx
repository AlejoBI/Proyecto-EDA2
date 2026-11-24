import PropTypes from "prop-types";
import { InputGroup, Form, Button } from "react-bootstrap";
import styles from "../../assets/css/AdminDashBoard.module.css";

const SearchBar = ({ searchTerm, handleSearch }) => {
  const onInputChange = (e) => {
    handleSearch(e.target.value);
  };

  return (
    <InputGroup className={`${styles['search-bar']} mb-3`}>
      <Form.Control
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={onInputChange}
      />
      <Button variant="outline-secondary" onClick={() => handleSearch(searchTerm)}>
        Search
      </Button>
    </InputGroup>
  );
};

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

export default SearchBar;
