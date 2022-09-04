import React from "react";
import { toast, ToastContainer } from "react-toastify";

const Pagination = (props) => {
  const generateClassName = (page) => {
    if (props.page === page) {
      return `page-item active`;
    } else {
      return `page-item`;
    }
  };

  const handlePageChange = (page) => {
    if (page < 1) {
      return toast("Already on Page 1", { type: "warning" });
    }

    if (page > props.totalPages) {
      return toast("Reached last page", { type: "info" });
    }
    props.setPage(page);
    props.func(page);
  };

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <nav aria-label="Page navigation example">
      <ToastContainer />
      <ul className="pagination justify-content-center">
        <li className="page-item">
          <button
            className="page-link"
            onClick={() => handlePageChange(props.page - 1)}
          >
            Previous
          </button>
        </li>
        {renderPages().map((page) => (
          <li key={page} className={generateClassName(page)}>
            <button
              className="page-link"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
        <li className="page-item">
          <button
            className="page-link"
            onClick={() => handlePageChange(props.page + 1)}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
