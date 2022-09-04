import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "../../axios";
import Loader from "../../Components/common/Loader/Loader";
import NavBar from "../../Components/common/Navbar/NavBar";
import {
  EyeFill,
  EyeSlashFill,
  StarFill,
  XCircleFill,
} from "react-bootstrap-icons";
import { toast, ToastContainer } from "react-toastify";
import Modal from "react-modal";
import { reservations } from "../../actions/userActions";
import {
  cancelReservationSchema,
  rateReservationSchema,
} from "../../schemas/rateReservation.schema";

const RateReservation = () => {
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState();
  const [reviewToggle, setReviewToggle] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");

  const getReservationData = () => {
    Axios.get(`/user/get-user-reservation-id/${reservationId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((reservation) => {
        if (reservation.data.message) {
          return console.log(reservation.data.message);
        }
        setReservation(reservation.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (userState && userState.email) {
      getReservationData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState]);

  const getStatus = (status) => {
    if (status === "cancel") {
      return <span className="text-danger">{status.toUpperCase()}</span>;
    } else if (status === "upcoming") {
      return <span className="text-warning">{status.toUpperCase()}</span>;
    } else {
      return <span className="text-success">{status.toUpperCase()}</span>;
    }
  };

  const rateReview = () => {
    try {
      const { error, value } = rateReservationSchema.validate({
        reservationId,
        comment,
        rating,
      });

      if (error) {
        return toast(error.message, { type: "info" });
      }

      Axios.post(
        `/user/rate-reservation/${reservationId}`,
        {
          comment: value?.comment,
          rating: value?.rating,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      )
        .then((response) => {
          getReservationData();
          setOpenModal(false);
          return toast(response.data.message, { type: "default" });
        })
        .catch((error) => {
          console.log(error);
          return toast(error.response.data.message, { type: "error" });
        });
    } catch (error) {
      console.log(error);
      return toast(error.response.data.message, { type: "error" });
    }
  };

  const cancelReservation = () => {
    try {
      const { error } = cancelReservationSchema.validate(reservationId);
      if (error) {
        return toast(error.message, { type: "error" });
      }
      Axios.patch(
        `/user/cancel-reservation/${reservationId}`,
        {},
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        },
      )
        .then(async (response) => {
          setTimeout(() => {
            navigate("/reservations");
          }, 1500);
          await Axios.get(`/user/get-all-user-reservations`, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }).then((response) => {
            dispatch(reservations(response.data));
          });
          return toast(response.data.message, { type: "default" });
        })
        .catch((error) => {
          console.log(error);
          return toast(error.response.data.message, { type: "info" });
        });
    } catch (error) {
      console.log(error);
      return toast(error.response.data.message, { type: "error" });
    }
  };

  const handleSetRating = (rating) => {
    if (!(rating < 0) && !(rating > 5)) {
      setRating(rating);
    }
  };

  return (
    <div>
      <NavBar user={userState} />
      <ToastContainer />
      {reservation ? (
        <div className="container mt-4">
          <div className="card">
            <div className="card-body">
              <div className="card-title">
                <div className="row">
                  <div>
                    <h5>Status: {getStatus(reservation.status)}</h5>
                  </div>
                </div>
                <div className="row">
                  <div>
                    {reservation.status !== "cancel" && (
                      <button
                        onClick={cancelReservation}
                        className="btn btn-outline-danger"
                      >
                        Cancel Reservation
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  Reservation ID: {reservation.id}
                </li>
                <li className="list-group-item">
                  Bike Booked ID:{" "}
                  {reservation.bikeId ? reservation.bikeId : "None"}
                </li>
                <li className="list-group-item">
                  Reservation Start Date: {reservation.reservationStartDate}
                </li>
                <li className="list-group-item">
                  Reservation End Date: {reservation.reservationEndDate}
                </li>
                <li className="list-group-item">
                  <button
                    onClick={() => navigate(`/reserve/${reservation.bikeId}`)}
                    className="btn btn-sm btn-outline-success"
                  >
                    View Booked Bike
                  </button>
                </li>
                <li className="list-group-item">
                  {reservation.review && (
                    <>
                      {!reviewToggle ? (
                        <EyeFill
                          style={{ cursor: "pointer" }}
                          color="royalblue"
                          size={25}
                          onClick={() => setReviewToggle(!reviewToggle)}
                        />
                      ) : (
                        <>
                          <EyeSlashFill
                            style={{ cursor: "pointer" }}
                            color="royalblue"
                            size={25}
                            onClick={() => setReviewToggle(!reviewToggle)}
                          />
                          <div className="card mt-2">
                            <div className="card-body">
                              <div className="card-title"></div>
                              <p>Comment: {reservation.review.comment}</p>
                              <p>Rating: {reservation.review.rating}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </li>
              </ul>
              {reservation.status === "active" && !reservation.review && (
                <div>
                  <button
                    onClick={() => setOpenModal(true)}
                    className="btn btn-outline-warning"
                  >
                    <StarFill />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <Loader color={"primary"} />
        </div>
      )}

      <Modal
        isOpen={openModal}
        onRequestClose={() => setOpenModal(false)}
        contentLabel="Review Reservation"
      >
        <div style={{ display: "flex" }}>
          <div>
            <h4>Review Reservation</h4>
          </div>
          <div style={{ marginLeft: "73vw" }}>
            <XCircleFill
              className="text-danger"
              size={30}
              style={{ cursor: "pointer" }}
              onClick={() => setOpenModal(false)}
            />
          </div>
        </div>
        <div className="mt-3"></div>
        <label>Comment</label>
        <input
          type={"text"}
          value={comment}
          className="form-control"
          onChange={(e) => setComment(e.target.value)}
        />
        <label>Rating</label>
        <input
          type={"number"}
          value={rating}
          className="form-control"
          onChange={(e) => handleSetRating(e.target.value)}
          max={5}
          min={0}
        />
        <button onClick={rateReview} className="btn btn-outline-danger mt-3">
          Confirm
        </button>
        <button
          onClick={() => setOpenModal(false)}
          className="btn btn-outline-success mt-3"
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </button>
      </Modal>
    </div>
  );
};

export default RateReservation;
