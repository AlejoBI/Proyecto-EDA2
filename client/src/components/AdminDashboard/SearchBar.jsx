import React from "react";
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

export default SearchBar;