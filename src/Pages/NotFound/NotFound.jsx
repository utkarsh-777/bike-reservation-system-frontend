import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="text-center mt-4">
      <h1>404 - Not Found!</h1>
      <Link to="/home">Go Home</Link>
    </div>
  );
};

export default NotFound;
