import { Image, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import logoImage from "../assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../assets/css/Footer.module.css";
import useParentComponentData from "../hooks/useParentComponentData";
import { ScrollToTop } from "../hooks/ScrollToTop";

const Footer = () => {
  const { tableData } = useParentComponentData();

  return (
    <div className={styles.footer_custom}>
      <div style={{ padding: "2% 7%" }}>
        <Table
          className={styles.style_table}
          collapse
        >
          <thead>
            <tr>
              <th>
                <div onClick={ScrollToTop} className={styles.image_footer} style={{ cursor: "pointer" }}>
                  <Image
                    src={logoImage}
                    className={styles.logo_footer}
                    alt="Logo"
                  />
                  <h4 className={styles.text_table}>Taskeria</h4>
                </div>
              </th>
              <th className={styles.text_table}>Categories</th>
              <th className={styles.text_table}>Help</th>
              <th className={styles.text_table}>Community</th>
              <th className={styles.text_table}>Company</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td></td>
                <td>
                  {row.categories && (
                    <Link to="/register" className={styles.style_table2}>
                      {row.categories}
                    </Link>
                  )}
                </td>
                <td>
                  {row.help && (
                    <Link to="/login" className={styles.style_table2}>
                      {row.help}
                    </Link>
                  )}
                </td>
                <td>
                  {row.community && (
                    <Link to="/register" className={styles.style_table2}>
                      {row.community}
                    </Link>
                  )}
                </td>
                <td>
                  {row.company && (
                    <Link to="/register" className={styles.style_table2}>
                      {row.company}
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div
        className={styles.footer_bottom}
      >
        <div className={styles.bottom_left}>
          <p className="px-3">Privacy Policy</p>
          <p className="px-3">Terms of Use</p>
          <p className="px-3">Sales and Refunds</p>
          <p className="px-3">Legal</p>
        </div>
        <div className={styles.bottom_right}>
          <p className="px-3">© 2024 Taskeria. All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
