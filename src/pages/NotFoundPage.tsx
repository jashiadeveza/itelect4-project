import { Link } from "react-router";
import "../App.css";

export default function NotFoundPage() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>The page you requested does not exist.</p>
      <p>
        Return to <Link to="/">home</Link>.
      </p>
    </div>
  );
}
