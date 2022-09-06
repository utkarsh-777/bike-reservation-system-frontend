import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Axios from "../../axios";
import Loader from "../../Components/common/Loader/Loader";
import NavBar from "../../Components/common/Navbar/NavBar";
import Pagination from "../../Components/common/Pagination/Pagination";
import "./HomePage.css";

const HomePage = () => {
  const userState = useSelector((state) => state.user);
  const [userReservations, setUserReservations] = useState(null);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const getReservations = (page) => {
    try {
      Axios.get(`/user/get-user-reservations/${page}`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      }).then((response) => {
        setUserReservations(response.data[0]);
        setTotalPages(Math.ceil(response.data[1] / 5));
        if (response.data.length === 0) {
          return toast("No reservations found!", { type: "warning" });
        }
      });
    } catch (error) {
      console.log(error);
      return toast(error.response.data.message, { type: "error" });
    }
  };
  useEffect(() => {
    getReservations(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatus = (status) => {
    if (status === "cancel") {
      return <span className="text-danger">{status.toUpperCase()}</span>;
    } else if (status === "upcoming") {
      return <span className="text-warning">{status.toUpperCase()}</span>;
    } else {
      return <span className="text-success">{status.toUpperCase()}</span>;
    }
  };
  return (
    <div>
      <NavBar user={userState} />
      <ToastContainer />
      <div className="text-center mt-4">
        <h2 className="text-primary">
          {userState &&
            userState.fullName &&
            `${userState.fullName}'s Reservations`}
        </h2>
      </div>
      <div className="border">
        {userReservations && userReservations.length > 0 && (
          <div className="container">
            <div style={{ marginTop: "20px" }}>
              <Pagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
                func={getReservations}
              />
            </div>
          </div>
        )}
        {userReservations ? (
          <>
            {userReservations.length > 0 ? (
              <div className="mb-4">
                {userReservations.map((reservation) => (
                  <div className="container mt-4 mb-2">
                    <div
                      onClick={() =>
                        navigate(`/rate-reservation/${reservation.id}`)
                      }
                      className="card floatCard"
                    >
                      <div className="card-body">
                        <h5 class="card-title">
                          Status: {getStatus(reservation.status)}
                        </h5>
                        <ul className="list-group list-group-flush floatCard">
                          <li className="list-group-item">
                            Reservation ID: {reservation.id}
                          </li>
                          <li className="list-group-item">
                            User ID:{" "}
                            {reservation.userId ? reservation.userId : "None"}
                          </li>
                          <li className="list-group-item">
                            Reservation Start Date:{" "}
                            {reservation.reservationStartDate}
                          </li>
                          <li className="list-group-item">
                            Reservation End Date:{" "}
                            {reservation.reservationEndDate}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className="text-center mt-5 text-danger"
                style={{ minHeight: "80vh" }}
              >
                <h3>No Reservations!</h3>
              </div>
            )}
          </>
        ) : (
          <Loader color={"primary"} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
