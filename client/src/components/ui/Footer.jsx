import { Image, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import logoImage from "../../assets/images/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../../assets/css/Footer.module.css";
import useParentComponentData from "../../hooks/useParentComponentData";
import { ScrollToTop } from "../../hooks/ScrollToTop";

const Footer = () => {
  const { tableData } = useParentComponentData();

  return (
    <div className={styles.footer_custom}>
      <div style={{ padding: "2% 7%" }}>
        <div className={styles.mobile_footer}>
          <button type="button" onClick={ScrollToTop} className={styles.mobile_brand} aria-label="Scroll to top">
            <Image src={logoImage} className={styles.logo_footer} alt="" />
            <span>Taskeria</span>
          </button>
          <div className={styles.mobile_groups}>
            {[
              ["Categories", "categories"],
              ["Help", "help"],
              ["Community", "community"],
              ["Company", "company"],
            ].map(([heading, key]) => (
              <section key={key} className={styles.mobile_group}>
                <h2 className={styles.mobile_heading}>{heading}</h2>
                <ul>
                  {tableData.filter((row) => row[key]).map((row, index) => (
                    <li key={`${key}-${index}`}><Link to="/freelancers" className={styles.style_table2}>{row[key]}</Link></li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
        <div className={styles.table_scroll}>
          <Table className={styles.style_table}>
            <thead>
            <tr>
              <th>
                <button type="button" onClick={ScrollToTop} className={styles.image_footer} aria-label="Scroll to top">
                  <Image
                    src={logoImage}
                    className={styles.logo_footer}
                    alt="Logo"
                  />
                  <h4 className={styles.text_table}>Taskeria</h4>
                </button>
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
                    <Link to="/freelancers" className={styles.style_table2}>
                      {row.categories}
                    </Link>
                  )}
                </td>
                <td>
                  {row.help && (
                    <Link to="/freelancers" className={styles.style_table2}>
                      {row.help}
                    </Link>
                  )}
                </td>
                <td>
                  {row.community && (
                    <Link to="/freelancers" className={styles.style_table2}>
                      {row.community}
                    </Link>
                  )}
                </td>
                <td>
                  {row.company && (
                    <Link to="/freelancers" className={styles.style_table2}>
                      {row.company}
                    </Link>
                  )}
                </td>
              </tr>
            ))}
            </tbody>
          </Table>
        </div>
      </div>
      <div className={styles.footer_bottom}>
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
