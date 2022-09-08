import React, { useEffect, useMemo, useState } from "react";
import { useContext } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { remove_user, user } from "../../../actions/userActions";
import Loader from "../../../Components/common/Loader/Loader";
import Pagination from "../../../Components/common/Pagination/Pagination";
import { UserContext } from "../../../context/context";
import { getUsersSchema } from "../../../schemas/bikes.schema";
import { updateUserSchema } from "../../../schemas/user.schema";
import {
  getUserByIdAPI,
  getUserReservationsAPI,
  updateUserAPI,
  deleteUserAPI,
} from "../../../service/apis";

const Profile = () => {
  const { userState, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const { userId } = useParams();
  const [, setCookie] = useCookies(["user"]);

  const [userData, setUserData] = useState(null);
  const [email, setEmail] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [role, setRole] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [userReservations, setUserReservations] = useState(null);
  const getUserReservations = async (page, id = null) => {
    try {
      const response = await getUserReservationsAPI(
        id ? id : userData?.id,
        page,
      );
      setUserReservations(response.data[0]);
      setTotalPages(Math.ceil(response.data[1] / 5));
    } catch (error) {
      return toast(error.response.data.message, { type: "error" });
    }
  };

  const buttonCallback = useMemo(() => {
    if (buttonDisabled) {
      setButtonDisabled(false);
      return true;
    } else {
      return false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, fullName, role]);

  const getUserById = async () => {
    // eslint-disable-next-line eqeqeq
    if (userId == userState.id) {
      return userState;
    }
    const response = await getUserByIdAPI(userId);
    return response.data;
  };

  useEffect(() => {
    if (userState?.id) {
      getUserById()
        .then((data) => {
          setUserData(data);
          setEmail(data.email);
          setFullName(data.fullName);
          setRole(data.role);
          setButtonDisabled(true);
          return data;
        })
        .then((data) => {
          if (userState.role === "manager") {
            getUserReservations(1, data.id);
          }
        })
        .catch((error) => {
          localStorage.clear();
          dispatch(remove_user());
          setCookie("user", null);
          setTimeout(() => {
            navigate("/");
          }, 1000);
          return toast(error.response.data.message, { type: "error" });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState, userId]);

  const handleUpdate = async () => {
    try {
      let data = {};

      if (email !== userData?.email) {
        data = { ...data, email: email.trim().toLowerCase() };
      }
      if (fullName !== userData?.fullName) {
        data = { ...data, fullName };
      }
      if (role !== userData?.role) {
        data = { ...data, role };
      }

      const { error, value } = updateUserSchema.validate(data);
      if (error) {
        return toast(error.message, { type: "info" });
      }
      const response = await updateUserAPI(userId, value);
      if (response?.data?.message) {
        return toast(response?.data?.message, { type: "warning" });
      }
      if (response.data.id === userState.id) {
        setCookie("user", JSON.stringify(response.data));
        dispatch(
          user({
            ...response.data,
          }),
        );
      } else {
        setUserData({
          ...response.data,
        });
      }
      return toast("Updated Succesfully!", { type: "success" });
    } catch (error) {
      console.log(error);
      return toast(error?.response?.data?.message, { type: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = getUsersSchema.validate(userId);
      if (error) {
        return toast(error.message, { type: "error" });
      }
      const response = await deleteUserAPI(userId);
      if (response.data.message) {
        return toast(response.data.message, { type: "warning" });
      }

      if (response.data.email === userState.email) {
        localStorage.clear();
        dispatch(remove_user());
        setCookie("user", null);

        toast(response.data.success, { type: "success" });
        return setTimeout(() => {
          navigate("/");
        }, 1000);
      }

      if (response.data.success) {
        setTimeout(() => {
          navigate("/users");
        }, 1000);
        return toast(response.data.success, { type: "warning" });
      }
      return toast(`${response.data.fullName} deleted successfully!`);
    } catch (error) {
      console.log(error);
      return toast(error.response.data.message, { type: "error" });
    }
  };

  const generateUserCard = (userData, userRole) => {
    return (
      <div className="card bg-light">
        <div className="card-body">
          <div className="card-title text-center">
            <h4>
              <span className="text-primary">
                {userData.fullName} {userData.id === userState.id && "(You)"}
              </span>{" "}
            </h4>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <label>User ID</label>
              <input
                type={"text"}
                className="form-control"
                value={userData.id}
                disabled={true}
              />
            </li>
            <li className="list-group-item">
              <label>Full Name</label>
              <input
                type={"text"}
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={userRole === "regular"}
              />
            </li>
            <li className="list-group-item">
              <label>Email</label>
              <input
                type={"text"}
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={userRole === "regular"}
              />
            </li>

            {userRole === "manager" && (
              <>
                <li className="list-group-item">
                  <label>Role</label>
                  <select
                    onChange={(e) => setRole(e.target.value)}
                    className="form-select"
                    value={role}
                  >
                    <option value={"regular"}>Regular</option>
                    <option value={"manager"}>Manager</option>
                  </select>
                </li>
                <li className="list-group-item">
                  <div className="row">
                    <div className="col-12">
                      <div className="row">
                        <div className="col">
                          <button
                            disabled={buttonCallback}
                            className="btn btn-primary btn-md"
                            onClick={handleUpdate}
                            style={{ width: "100%" }}
                          >
                            Update
                          </button>
                        </div>
                        <div className="col">
                          <button
                            className="btn btn-danger btn-md"
                            onClick={handleDelete}
                            style={{ width: "100%" }}
                          >
                            Remove{" "}
                            {userData.email === userState.email
                              ? "(Yourself)"
                              : `${userData.fullName}`}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="list-group-item">
                  {userReservations && userReservations.length > 0 && (
                    <>
                      <h4 className="text-center mt-4">
                        {userData.email === userState.email
                          ? "Your"
                          : userData.fullName}{" "}
                        Bike Reservations
                      </h4>
                      <div className="mt-4">
                        <Pagination
                          page={page}
                          totalPages={totalPages}
                          setPage={setPage}
                          func={getUserReservations}
                        />
                      </div>
                    </>
                  )}
                  <div
                    className="overflow-auto mt-2"
                    style={{ maxHeight: "60vh" }}
                  >
                    {userReservations &&
                      userReservations.map((reservation) =>
                        reservationCard(reservation),
                      )}
                  </div>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    );
  };

  const reservationCard = (reservation) => {
    return (
      <div className="card mt-3">
        <div className="card-body">
          <div className="card-title text-primary text-center">
            <h5>Status: {reservation.status?.toUpperCase()}</h5>
          </div>
          <ul className="list-group list-group-flush text-center">
            <li className="list-group-item">
              Reservation ID: {reservation.id}
            </li>
            <li className="list-group-item">
              Reservation Bike ID:{" "}
              {reservation.bikeId ? reservation.bikeId : "None"}
            </li>
            <li className="list-group-item">
              Reservation Start Date: {reservation.reservationStartDate}
            </li>
            <li className="list-group-item">
              Reservation End Date: {reservation.reservationEndDate}
            </li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div>
      <ToastContainer />
      <div className="container mt-4">
        {userData && userState ? (
          generateUserCard(userData, userState?.role)
        ) : (
          <Loader color={"primary"} />
        )}
      </div>
    </div>
  );
};

export default Profile;
