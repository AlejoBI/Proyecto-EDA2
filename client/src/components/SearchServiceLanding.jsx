import SearchBar from "./SearchBar";
import searchImage from "../assets/imageCanva.png";
import { Container, Image } from "react-bootstrap";

const SearchServiceLanding = () => {
  return (
    <Container className="mb-3 w-87 h-auto d-flex align-items-center search-container-custom">
      <div className="w-40 h-100 align-items-center m-4 text-search">
        <h1>Quickly discover the perfect freelance service for your needs</h1>
        <p>Find the perfect freelance services for your business</p>
        <SearchBar />
      </div>
      <div className="w-60 image-search">
        <Image src={searchImage} className="img-fluid" />
      </div>
    </Container>
  );
};

export default SearchServiceLanding;
