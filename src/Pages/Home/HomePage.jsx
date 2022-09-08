import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../Components/common/Loader/Loader";
import Pagination from "../../Components/common/Pagination/Pagination";
import { UserContext } from "../../context/context";
import { getUserReservationsAPI } from "../../service/apis";
import RateReservation from "../../Components/RateReservation/RateReservation";

import "./HomePage.css";

const HomePage = () => {
  const { userState } = useContext(UserContext);
  const [userReservations, setUserReservations] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const getReservations = (page) => {
    try {
      getUserReservationsAPI(userState.id, page)
        .then((response) => {
          setUserReservations([...response.data[0]]);
          setTotalPages(Math.ceil(response.data[1] / 5));
          if (response.data.length === 0) {
            return toast("No reservations found!", { type: "warning" });
          }
        })
        .catch((error) => {
          return toast(error.response.data.message, { type: "error" });
        });
    } catch (error) {
      return toast(error.response.data.message, { type: "error" });
    }
  };

  useEffect(() => {
    userState.id && getReservations(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState]);

  return (
    <div>
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
                  <RateReservation
                    key={reservation.id}
                    reservation={reservation}
                    func={getReservations}
                    page={page}
                  />
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
