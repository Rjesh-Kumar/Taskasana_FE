import { Spinner } from "react-bootstrap";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-5">
      <Spinner animation="border" variant="primary" />
      <div className="mt-3 text-muted">{text}</div>
    </div>
  );
}
