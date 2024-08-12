import { useEffect } from "react";
import { Toast } from "react-bootstrap";

const CustomToast = ({
  show,
  message,
  position,
  backgroundColor,
  color,
  duration,
  onClose,
}) => {
  const toastStyle = {
    position: "absolute",
    ...position,
    backgroundColor: backgroundColor || "red",
    color: color || "white",
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

export default CustomToast;
