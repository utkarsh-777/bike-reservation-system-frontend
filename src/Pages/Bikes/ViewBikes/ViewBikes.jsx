import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import Axios from "../../../axios";
import NavBar from "../../../Components/common/Navbar/NavBar";
import DateTimeRangeView from "../../../Components/DateTimeRangeView/DateTimeRangeView";
import { XCircleFill, CheckCircleFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { reservation_dates } from "../../../actions/userActions";
import Pagination from "../../../Components/common/Pagination/Pagination";
import Loader from "../../../Components/common/Loader/Loader";
import moment from "moment";
import { filterBikesSchema } from "../../../schemas/bikes.schema";

const ViewBikes = () => {
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [bikesByFilter, setBikesByFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const [model, setModel] = useState();
  const [color, setColor] = useState();
  const [location, setLocation] = useState();
  const [minimumAverageRating, setMinimumAverageRating] = useState(0);

  const [bikesByFilterPage, setBikesByFilterPage] = useState(1);

  useEffect(() => {
    try {
      let start = moment().add(5, "minutes");
      let end = moment(start).add(1, "days").subtract(1, "seconds");
      setStartDate(start._d);
      setEndDate(end._d);
      setSelectedDate(
        start._d.toLocaleString() + " TO " + end._d.toLocaleString(),
      );
      let data = {
        reservationStartDate: start._d,
        reservationEndDate: end._d,
        page: 1,
      };
      setLoading(true);
      dispatch(reservation_dates(data));
      Axios.get(
        `/user/filter-bikes?reservationStartDate=${start._d.toLocaleString()}&reservationEndDate=${end._d.toLocaleString()}&page=1`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        },
      )
        .then((bikes) => {
          if (bikes.data.length === 0) {
            toast("No bikes!", { type: "warning" });
          }
          if (bikes.data.resultedBikes.length === 0) {
            toast("No bikes available!", { type: "info" });
          }
          setBikesByFilter(bikes.data.resultedBikes);
          setTotalPages(bikes.data.total_pages);
          setLoading(false);
        })
        .catch((error) => {
          return toast(error.response.data.message, { type: "error" });
        });
    } catch (error) {
      return toast("Error getting bikes", { type: "error" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBikesByFilter = (page, ob = "notclear") => {
    try {
      let data = {};
      let reservationStartDate = null;
      let reservationEndDate = null;
      let pg = 1;
      if (ob === "clear") {
        let start = moment().add(5, "minutes");
        let end = moment(start).add(1, "days").subtract(1, "seconds");
        reservationStartDate = start;
        reservationEndDate = end;
        data = {
          reservationStartDate: start._d,
          reservationEndDate: end._d,
          page: 1,
        };
        setStartDate(start._d);
        setEndDate(end._d);
        setSelectedDate(
          start._d.toLocaleString() + " TO " + end._d.toLocaleString(),
        );
      } else {
        pg = page;
        reservationStartDate = new Date(startDate);
        reservationEndDate = new Date(endDate);
        data = {
          reservationStartDate: startDate,
          reservationEndDate: endDate,
          page,
          model,
          color,
          location,
          minAvgRating: minimumAverageRating,
        };
      }

      const { error, value } = filterBikesSchema.validate({
        ...data,
      });

      if (error) {
        return toast(error.message, { type: "warning" });
      }
      setLoading(true);
      let requestString = `/user/filter-bikes?reservationStartDate=${reservationStartDate.toLocaleString()}&reservationEndDate=${reservationEndDate.toLocaleString()}&page=${pg}`;
      if (value.model) {
        requestString += `&model=${value.model}`;
      }
      if (value.color) {
        requestString += `&color=${value.color}`;
      }
      if (value.location) {
        requestString += `&location=${value.location}`;
      }

      if (value.minAvgRating !== undefined) {
        requestString += `&minAvgRating=${value.minAvgRating}`;
      }
      Axios.get(requestString, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((response) => {
          if (response.data.message) {
            setLoading(false);
            return toast(response.data.message, { type: "info" });
          }
          if (response.data.resultedBikes.length === 0) {
            toast("No bikes available!", { type: "info" });
          }
          setBikesByFilter(response.data.resultedBikes);
          setTotalPages(response.data.total_pages);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          return toast(error.response.data.message, { type: "error" });
        });
    } catch (error) {
      console.log(error);
      return toast("Error in filtering bikes!", { type: "error" });
    }
  };

  const clearFilters = () => {
    setModel();
    setColor();
    setLocation();
    setMinimumAverageRating(0);
    getBikesByFilter(1, "clear");
    return toast("Cleared all filters!", { type: "info" });
  };

  const bikeCard = (bike) => {
    return (
      <div
        key={bike.id}
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/reserve/${bike.id}`)}
        className="card mt-3 floatCard"
      >
        <div className="card-body">
          <div className="card-title text-primary text-center">
            <h5>{bike.model}</h5>
          </div>
          <ul className="list-group list-group-flush text-center">
            <li className="list-group-item">Bike ID: {bike.id}</li>
            <li className="list-group-item">
              Bike Available:{" "}
              {bike.isAvailable ? (
                <CheckCircleFill className="text-success" size={25} />
              ) : (
                <XCircleFill color="danger" size={25} />
              )}
            </li>
            <li className="list-group-item">Color: {bike.color}</li>
            <li className="list-group-item">
              Average Rating: {bike.avgRating.toFixed(1)}
            </li>
            <li className="list-group-item">Location: {bike.location}</li>
          </ul>
        </div>
      </div>
    );
  };

  const handleChangeInput = (value, setState) => {
    return value ? setState(value) : setState();
  };

  return (
    <div>
      <ToastContainer />
      <NavBar user={userState} />
      <div className="container mt-4">
        <div className="text-center mb-4">
          <h3>View Bikes</h3>
          {userState && userState.role === "manager" && (
            <div className="row">
              <div className="col">
                <button
                  className="btn btn-sm btn-primary p-2 mt-1"
                  onClick={() => navigate("/bikes")}
                >
                  View All Bikes
                </button>
              </div>
              <div className="col">
                <button
                  className="btn btn-sm btn-primary p-2 mt-1"
                  onClick={() => navigate("/add/bikes")}
                >
                  Add Bikes
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="row">
          <div className="col-md border p-2 bg-light m-1">
            <h5 className="mt-1">Filter By Date and Time:</h5>
            <DateTimeRangeView
              startDate={startDate}
              endDate={endDate}
              selectedDate={selectedDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              setSelectedDate={setSelectedDate}
            />

            <h5 className="mt-4">Filter By :</h5>
            <label className="mt-2">Model</label>
            <input
              type={"text"}
              placeholder="Model"
              className="form-control"
              onChange={(e) => handleChangeInput(e.target.value, setModel)}
              value={model ? model : ""}
            />
            <label>Colour</label>
            <input
              type={"text"}
              placeholder="Colour"
              className="form-control"
              onChange={(e) => handleChangeInput(e.target.value, setColor)}
              value={color ? color : ""}
            />
            <label>Location</label>
            <input
              type={"text"}
              placeholder="Location"
              className="form-control"
              onChange={(e) => handleChangeInput(e.target.value, setLocation)}
              value={location ? location : ""}
            />
            <label>Minimum average rating</label>
            <input
              type={"number"}
              placeholder="Minimum average rating"
              className="form-control"
              min={0}
              max={5}
              value={minimumAverageRating}
              onChange={(e) => setMinimumAverageRating(e.target.value)}
            />

            <button
              className="btn btn-secondary mt-3"
              style={{ width: "100%" }}
              onClick={() => getBikesByFilter(1)}
            >
              View
            </button>
            <br />
            <button
              style={{ width: "100%" }}
              className="btn btn-primary mt-2"
              onClick={() => clearFilters()}
            >
              Clear Filter
            </button>
          </div>
          <div className="col-md border p-2 bg-light m-1">
            {bikesByFilter.length > 0 && (
              <div className="container text-center mt-4">
                <Pagination
                  page={bikesByFilterPage}
                  totalPages={totalPages}
                  setPage={setBikesByFilterPage}
                  func={getBikesByFilter}
                />
              </div>
            )}
            <div className="overflow-auto mt-2" style={{ maxHeight: "60vh" }}>
              {!loading ? (
                <>
                  {bikesByFilter.length > 0 ? (
                    <div>{bikesByFilter.map((bike) => bikeCard(bike))}</div>
                  ) : (
                    <div
                      className="text-center mt-3 p-2 border"
                      style={{ background: "white" }}
                    >
                      No Bikes Available
                    </div>
                  )}
                </>
              ) : (
                <Loader color={"primary"} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBikes;