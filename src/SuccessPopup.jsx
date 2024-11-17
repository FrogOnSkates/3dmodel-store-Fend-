import React from 'react';

export default function SuccessPopup({ message, onClose }) {
  return (
    <div className="success-popup">
      <div className="success-content">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
