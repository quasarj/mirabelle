import React, { useEffect } from "react";

function Toast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "black",
        color: "white",
        padding: "10px 20px",
        borderRadius: "8px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
        zIndex: 1000,
      }}
    >
      {message}
    </div>
  );
}

export default Toast;
