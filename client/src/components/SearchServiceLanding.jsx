import SearchBar from "./SearchBar";
import searchImage from "../assets/imageCanva.png";
import { Image } from "react-bootstrap";

const SearchServiceLanding = () => {
    return (
      <div className="mb-3" style={{backgroundColor: '#8306AD', padding: '2% 7%', width: '87%', height: 'auto', margin: '25px auto', justifyContent: 'space-between', alignItems: 'center', borderRadius: '50px', display: 'flex'}}>
        <div style={{width: '40%', height: '100%', color: 'white', alignItems: 'center'}}>
        <h1>Quickly discover the perfect freelance service for your needs</h1>
        <p>Find the perfect freelance services for your business</p>
        <SearchBar />
        </div>
        <div style={{width: '60%', margin: '2%'}}>
          <Image
            src={searchImage}
            className="img-fluid"
            style={{ width: "", height: ""}}
          />
        </div>
      </div>
      
    );
  }
  
export default SearchServiceLanding;
  