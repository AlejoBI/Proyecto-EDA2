import { useEffect } from "react";
import PropTypes from "prop-types";
import { Toast } from "react-bootstrap";

const CustomToast = ({
  show,
  message,
  position = { top: "20px", right: "20px" },
  backgroundColor = "red",
  color = "white",
  duration = 3000,
  onClose,
}) => {
  const toastStyle = {
    position: "fixed",
    zIndex: 9999,
    ...position,
    backgroundColor,
    color,
    padding: "8px 16px",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  };

  useEffect(() => {
    if (show && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <Toast show={show} style={toastStyle} onClose={onClose}>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
};

CustomToast.propTypes = {
  show: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  position: PropTypes.shape({
    top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    right: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  duration: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

export default CustomToast;
