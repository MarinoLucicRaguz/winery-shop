import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

const Modal = ({ message, onClose }) => {
  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;
