import React from "react";

const Pagination = (props) => {
  const generateClassName = (page) => {
    if (props.page === page) {
      return `btn page-link bg-primary text-light`;
    } else {
      return `btn page-link`;
    }
  };

  const handlePageChange = (page) => {
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
      <ul className="pagination justify-content-center">
        <li className="page-item">
          <button
            className="btn page-link"
            onClick={() => handlePageChange(props.page - 1)}
            disabled={props.page === 1}
          >
            Previous
          </button>
        </li>
        {renderPages().map((page) => (
          <li key={page} className="page-item">
            <button
              onClick={() => handlePageChange(page)}
              className={generateClassName(page)}
            >
              {page}
            </button>
          </li>
        ))}
        <li className="page-item">
          <button
            className="btn page-link"
            onClick={() => handlePageChange(props.page + 1)}
            disabled={props.page === props.totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
