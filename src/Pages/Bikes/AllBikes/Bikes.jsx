import React, { useEffect, useState } from "react";
import Pagination from "../../../Components/common/Pagination/Pagination";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Axios from "../../../axios";
import Loader from "../../../Components/common/Loader/Loader";
import NavBar from "../../../Components/common/Navbar/NavBar";
import { getUsersSchema } from "../../../schemas/bikes.schema";

const Bikes = () => {
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const [bikes, setBikes] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const getBikes = (page) => {
    try {
      const { error, value } = getUsersSchema.validate(page);
      if (error) {
        return toast(error.message, { type: "error" });
      }
      Axios.get(`/manager/get-all-bikes/${value}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }).then((response) => {
        setBikes(response.data[0]);
        setTotalPages(Math.ceil(response.data[1] / 5));
      });
    } catch (error) {
      console.log(error);
      return toast(error.response.data.message, { type: "error" });
    }
  };

  useEffect(() => {
    getBikes(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bikeCard = (bike) => {
    return (
      <div
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
              Currently Available:{" "}
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
  return (
    <>
      <NavBar user={userState} />
      <h4 className="text-center mt-4">All Bikes</h4>
      <div style={{ marginTop: "20px" }}></div>
      <Pagination
        page={page}
        totalPages={totalPages}
        setPage={setPage}
        func={getBikes}
      />
      <div
        className="overflow-auto mt-2 container"
        style={{ maxHeight: "80vh" }}
      >
        {bikes ? (
          <>
            {bikes.length > 0 ? (
              <>{bikes.map((bike) => bikeCard(bike))}</>
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
    </>
  );
};

export default Bikes;
