import React, { useEffect, useState } from "react";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Axios from "../../../axios";
import NavBar from "../../../Components/common/Navbar/NavBar";
import DateTimeRangeView from "../../../Components/DateTimeRangeView/DateTimeRangeView";
import Modal from "react-modal";
import {
  remove_reservation_dates,
  reservations,
} from "../../../actions/userActions";
import {
  reserveBikeSchema,
  updateBikeSchema,
} from "../../../schemas/bikes.schema";

const ReserveBike = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const { bikeId } = useParams();
  const [startDate, setStartDate] = useState(
    userState.reservationDates.reservationStartDate,
  );
  const [endDate, setEndDate] = useState(
    userState.reservationDates.reservationEndDate,
  );
  const [selectedDate, setSelectedDate] = useState(
    userState.reservationDates.reservationStartDate
      ? userState.reservationDates.reservationStartDate.toLocaleString() +
          " TO " +
          userState.reservationDates.reservationEndDate.toLocaleString()
      : null,
  );
  const [bike, setBike] = useState(null);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = React.useState(false);

  const [updateModel, setUpdateModel] = useState(null);
  const [updateColor, setUpdateColor] = useState(null);
  const [updateLocation, setUpdateLocation] = useState(null);
  const [updateIsAvailable, setUpdateIsAvailable] = useState(null);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    try {
      if (userState.role) {
        const requestString =
          userState.role === "regular"
            ? `/user/get-bike/${bikeId}`
            : `/manager/get-bike/${bikeId}`;

        Axios.get(requestString, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
          .then((bike) => {
            setBike(bike.data);
            setUpdateModel(bike.data.model);
            setUpdateColor(bike.data.color);
            setUpdateLocation(bike.data.location);
            setUpdateIsAvailable(bike.data.isAvailable);
          })
          .catch((err) => console.log(err));
      }
    } catch (error) {
      console.log(error);
      return toast("Error!", { type: "error" });
    }
    return () => {
      dispatch(remove_reservation_dates());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState.role]);

  const reserveBike = () => {
    try {
      const sd = new Date(startDate);
      const ed = new Date(endDate);

      const { error, value } = reserveBikeSchema.validate({
        bikeId,
        reservationStartDate: sd.toLocaleString(),
        reservationEndDate: ed.toLocaleString(),
      });

      if (error) {
        return toast(error.message, { type: "info" });
      }

      Axios.patch(
        `/user/reserve-bike/${bikeId}`,
        { ...value },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      )
        .then(async (response) => {
          if (response.data.message) {
            return toast(response.data.message, { type: "info" });
          }
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
          return toast(response.data.success, { type: "default" });
        })
        .catch((err) => {
          return toast(err.response.data.message, { type: "error" });
        });
    } catch (error) {
      console.log(error);
      return toast("Error", { type: "error" });
    }
  };

  const removeBike = () => {
    setDeleteModalIsOpen(true);
  };

  const updateBike = () => {
    openModal();
  };

  const getBikeData = async () => {
    const bikeData = await Axios.get(`/user/get-bike/${bikeId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    setBike(bikeData.data);
  };

  const deleteBike = () => {
    try {
      Axios.delete(`/manager/delete-bike/${bikeId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => {
          setTimeout(() => {
            navigate("/home");
          }, 1000);
          return toast(response.data.message, { type: "default" });
        })
        .catch((err) => {
          console.log(err);
          return toast(err.response.data.message, { type: "error" });
        });
    } catch (error) {
      console.log(error);
      return toast(error.response.data.message, { type: "error" });
    }
  };

  const handleUpdateBike = () => {
    try {
      const data = {
        bikeId,
        model: updateModel?.toUpperCase(),
        color: updateColor,
        location: updateLocation,
        isAvailable: updateIsAvailable,
      };

      const { error, value } = updateBikeSchema.validate(data);
      if (error) {
        return toast(error.message, { type: "info" });
      }

      Axios.put(
        `/manager/update-bike/${bikeId}`,
        {
          model: value?.model,
          color: value?.color,
          location: value?.location,
          isAvailable: value?.isAvailable,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      )
        .then(async (response) => {
          if (response.data.message) {
            return toast(response.data.message, { type: "error" });
          }
          if (response.data.id) {
            await getBikeData();
            closeModal();
            return toast("Updated successfully!", { type: "default" });
          }
        })
        .catch((err) => {
          console.log(err);
          return toast("Error", { type: "error" });
        });
    } catch (error) {
      console.log(error);
      return toast("Error", { type: "error" });
    }
  };

  return (
    <div>
      <NavBar user={userState} />
      <ToastContainer />
      <div className="text-center mt-4 mb-4">
        <h4>
          <span className="text-primary">{bike && bike.model}</span>
        </h4>
      </div>
      <div className="container">
        <label>Reserve {bike && bike.model}</label>
        <div className="mt-2">
          <DateTimeRangeView
            startDate={startDate}
            endDate={endDate}
            selectedDate={selectedDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setSelectedDate={setSelectedDate}
            func={reserveBike}
            text={"Reserve"}
          />
        </div>
        {bike && (
          <div className="mt-5">
            <h6>Details of bike</h6>
            <ul className="list-group list-group-flush border">
              <li className="list-group-item">Color: {bike.color}</li>
              <li className="list-group-item">Location: {bike.location}</li>
              <li className="list-group-item">
                Bike Available:{" "}
                {bike.isAvailable ? (
                  <CheckCircleFill className="text-success" size={25} />
                ) : (
                  <XCircleFill color="danger" size={25} />
                )}
              </li>
              <li className="list-group-item">
                Average Rating: {bike.avgRating.toFixed(1)} / 5
              </li>
            </ul>
          </div>
        )}
        {userState && userState.role === "manager" && (
          <div className="mt-4">
            <h6>Previous Reservations for {bike && bike.model}</h6>
            <div
              className="overflow-auto mt-2 border p-2"
              style={{ maxHeight: "50vh" }}
            >
              {bike && bike.reservations ? (
                <>
                  {bike.reservations.length > 0 ? (
                    <>
                      {bike.reservations.map((reservation) => (
                        <div className="card">
                          <div className="card-body">
                            <h6 class="card-title">
                              Status: {reservation.status.toUpperCase()}
                            </h6>
                            <ul className="list-group list-group-flush">
                              <li className="list-group-item">
                                Reservation ID: {reservation.id}
                              </li>
                              <li className="list-group-item">
                                User ID:{" "}
                                {reservation.userId
                                  ? reservation.userId
                                  : "None"}
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
                      ))}
                    </>
                  ) : (
                    <h6>No reservations!</h6>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
            <div class="d-grid gap-2 mt-4 mb-5">
              <button className="btn btn-outline-primary" onClick={updateBike}>
                Update Bike
              </button>
              <button className="btn btn-outline-danger" onClick={removeBike}>
                Remove Bike
              </button>
            </div>
          </div>
        )}

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Update Modal"
        >
          <div style={{ display: "flex" }}>
            <div>
              <h4>
                Update{" "}
                <span className="text-primary">{bike && bike.model}</span>
              </h4>
            </div>
            <div style={{ marginLeft: "69vw" }}>
              <XCircleFill
                className="text-danger"
                size={30}
                style={{ cursor: "pointer" }}
                onClick={closeModal}
              />
            </div>
          </div>

          {bike && (
            <div className="mt-4">
              <label>Model</label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Model"
                value={updateModel}
                onChange={(e) => setUpdateModel(e.target.value)}
              />
              <label>Color</label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Color"
                value={updateColor}
                onChange={(e) => setUpdateColor(e.target.value)}
              />
              <label>Location</label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Location"
                value={updateLocation}
                onChange={(e) => setUpdateLocation(e.target.value)}
              />
              <label className="mt-2 mb-2">Admin Bike Availability</label>
              <br />
              <div className="row">
                <div className="col-1">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckChecked"
                    style={{ height: "2rem", width: "2rem" }}
                    checked={updateIsAvailable}
                    onClick={(e) => setUpdateIsAvailable(!updateIsAvailable)}
                  />
                </div>
                <div className="col-11">
                  <input
                    type={"text"}
                    className="form-control"
                    placeholder="Availability"
                    value={updateIsAvailable ? "Available" : "Not available"}
                  />
                </div>
              </div>
              <br />
              <div
                onClick={handleUpdateBike}
                className="btn btn-outline-primary mt-2"
              >
                Update
              </div>
            </div>
          )}
        </Modal>

        <Modal
          isOpen={deleteModalIsOpen}
          onRequestClose={() => setDeleteModalIsOpen(false)}
          contentLabel="Update Modal"
        >
          <div style={{ display: "flex" }}>
            <div>
              <h4>
                Confirm delete <br />
                <span className="text-primary">{bike && bike.model}</span> ?
              </h4>
            </div>
            <div style={{ marginLeft: "73vw" }}>
              <XCircleFill
                className="text-danger"
                size={30}
                style={{ cursor: "pointer" }}
                onClick={() => setDeleteModalIsOpen(false)}
              />
            </div>
          </div>
          <div className="mt-3"></div>
          <button onClick={deleteBike} className="btn btn-outline-danger m-2">
            Confirm
          </button>
          <button
            onClick={() => setDeleteModalIsOpen(false)}
            className="btn btn-outline-success m-2"
          >
            Cancel
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default ReserveBike;
