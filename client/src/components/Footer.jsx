import { Image, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import logoImage from "../assets/logo.png";

import { ScrollToTop } from "../hooks/ScrollToTop";

const Footer = () => {
  return (
    <>
      <div className="w-100 h-auto justify-content-space-between d-flex footer-custom">
        <div style={{ padding: "2% 7%" }}>
          <Table
            id="style-table"
            style={{ borderCollapse: "collapse", width: "100%" }}
          >
            <thead>
              <tr id="style-table">
                <th id="style-table">
                  <div onClick={ScrollToTop} style={{ cursor: "pointer" }}>
                    <Image
                      src={logoImage}
                      className="img-fluid"
                      style={{ width: "80px", height: "80px" }}
                    />
                    Taskeria
                  </div>
                </th>
                <th id="style-table">Categories</th>
                <th id="style-table">Help</th>
                <th id="style-table">Community</th>
                <th id="style-table">Company</th>
              </tr>
            </thead>
            <tbody>
              <tr id="style-table">
                <td id="style-table"></td>
                <td id="style-table">
                  <Link to="/register" id="style-table2">
                    Technology and Programming
                  </Link>
                </td>
                <td id="style-table">
                  <Link to="/login" id="style-table2">
                    Help and Support
                  </Link>
                </td>
                <td id="style-table">
                  <Link to="/register" id="style-table2">
                    Academy
                  </Link>
                </td>
                <td id="style-table">
                  <Link to="/register" id="style-table2">
                    About Us
                  </Link>
                </td>
              </tr>
              <tr id="style-table">
                <td id="style-table"></td>
                <td id="style-table">
                  <Link to="/register" id="style-table2">
                    Graphic Design
                  </Link>
                </td>
                <td id="style-table">
                  <Link to="/register" id="style-table2">
                    Trust and Security
                  </Link>
                </td>
                <td id="style-table">
                  <Link to="/register" id="style-table2">
                    Blog
                  </Link>
                </td>
                <td id="style-table">
                  <Link to="/register" id="style-table2">
                    Careers
                  </Link>
                </td>
              </tr>
              <tr id="style-table">
                <td id="style-table"></td>
                <td id="style-table">
                  <Link to="/register" id="style-table2">
                    Video and Animation
                  </Link>
                </td>
                <td id="style-table">
                  <Link to="/register" id="style-table2">
                    Quality Guide
                  </Link>
                </td>
                <td id="style-table">
                  <Link to="/register" id="style-table2">
                    Themes
                  </Link>
                </td>
                <td id="style-table">
                  <Link to="/register" id="style-table2">
                    FAQs
                  </Link>
                </td>
              </tr>
              <tr id="style-table">
                <td id="style-table"></td>
                <td id="style-table">
                  <Link to="/register" id="style-table2">
                    Writing and Translation
                  </Link>
                </td>
                <td id="style-table">
                  <Link to="/register" id="style-table2">
                    Taskeria Guides
                  </Link>
                </td>
                <td id="style-table">
                  <Link to="/register" id="style-table2">
                    Hosting
                  </Link>
                </td>
                <td id="style-table">
                  <Link to="/register" id="style-table2">
                    Teams
                  </Link>
                </td>
              </tr>
              <tr id="style-table">
                <td id="style-table"></td>
                <td id="style-table">
                  <Link to="/register" id="style-table2">
                    Digital Marketing
                  </Link>
                </td>
                <td id="style-table"></td>
                <td id="style-table">
                  <Link to="/register" id="style-table2">
                    Developers
                  </Link>
                </td>
                <td id="style-table">
                  <Link to="/register" id="style-table2">
                    Contact Us
                  </Link>
                </td>
              </tr>
              <tr id="style-table">
                <td id="style-table"></td>
                <td id="style-table">
                  <Link to="/register" id="style-table2">
                    Music and Audio
                  </Link>
                </td>
                <td id="style-table"></td>
                <td id="style-table">
                  <Link to="/register" id="style-table2">
                    Support
                  </Link>
                </td>
                <td id="style-table"></td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginTop: "20px",
            margin: "0 1%",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "start",
            }}
          >
            <p className="px-3">Privacy Policy</p>
            <p className="px-3">Terms of Use</p>
            <p className="px-3">Sales and Refunds</p>
            <p className="px-3">Legal</p>
          </div>
          <div style={{ justifyContent: "end" }}>
            <p className="px-3">© 2024 Taskeria. All rights reserved</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
