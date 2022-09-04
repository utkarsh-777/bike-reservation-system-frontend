import React from "react";

const Loader = ({ color }) => {
  const generateClassName = () => {
    return `spinner-border text-${color}`;
  };
  return (
    <div className="text-center">
      <div className={generateClassName()} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
