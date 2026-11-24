import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
      <section className="not-found-page">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link className="ui-button" to="/">Return home</Link>
      </section>
    );
  }
  
  export default NotFoundPage;
