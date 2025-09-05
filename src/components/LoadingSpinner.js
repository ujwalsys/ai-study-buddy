import React from 'react';

const LoadingSpinner = ({ message = "Generating questions..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p className="loading-text">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;