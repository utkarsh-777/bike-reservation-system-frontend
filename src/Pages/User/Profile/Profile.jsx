import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { remove_user, user } from "../../../actions/userActions";
import Loader from "../../../Components/common/Loader/Loader";
import NavBar from "../../../Components/common/Navbar/NavBar";
import { getUsersSchema } from "../../../schemas/bikes.schema";
import {
  updateManagerUserProfileSchema,
  updateUserProfileSchema,
} from "../../../schemas/user.schema";
import {
  deleteManagerService,
  deleteUserService,
  getUserByIdService,
  updateManagerProfileService,
  updateUserProfileService,
} from "../../../service/apis";

const Profile = () => {
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();

  const [userData, setUserData] = useState(null);
  const [email, setEmail] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [password, setPassword] = useState(null);
  const [role, setRole] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const buttonCallback = useMemo(() => {
    if (buttonDisabled) {
      setButtonDisabled(false);
      return true;
    } else {
      return false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, fullName, password, role]);

  const getUserById = async () => {
    // eslint-disable-next-line eqeqeq
    if (userId == userState.id) {
      return userState;
    }
    const response = await getUserByIdService(userId);
    if (response?.response?.data?.message) {
      localStorage.clear();
      dispatch(remove_user());
      setTimeout(() => {
        navigate("/");
      }, 1000);
      return toast("You are not authorized!", { type: "error" });
    }
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
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState, userId]);

  const handleUpdate = async () => {
    try {
      let data = {};
      if (userState.role === "regular") {
        if (password !== null) {
          data = { ...data, password };
        }
        if (fullName !== userData?.fullName) {
          data = { ...data, fullName };
        }
        const { error, value } = updateUserProfileSchema.validate(data);
        if (error) {
          return toast(error.message, { type: "warning" });
        }
        const response = await updateUserProfileService(value);
        if (response.data.message) {
          return toast(response?.response?.data?.message, { type: "warning" });
        }
        dispatch(
          user({
            ...response.data,
            id: userState.id,
            reservations: userState.reservations,
          }),
        );
        return toast("Profile updated successfully!", { type: "default" });
      }

      if (email !== userData?.email) {
        data = { ...data, email: email.trim().toLowerCase() };
      }
      if (password !== null) {
        data = { ...data, password };
      }
      if (fullName !== userData?.fullName) {
        data = { ...data, fullName };
      }
      if (role !== userData?.role) {
        data = { ...data, role };
      }

      const { error, value } = updateManagerUserProfileSchema.validate(data);
      if (error) {
        return toast(error.message, { type: "info" });
      }
      const response = await updateManagerProfileService(userId, value);
      if (response?.data?.message) {
        return toast(response?.data?.message, { type: "warning" });
      }
      if (response.data.id === userState.id) {
        dispatch(
          user({
            ...response.data,
            reservations: userState.reservations,
          }),
        );
      } else {
        setUserData({
          ...response.data,
          reservations: userData.reservations,
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
      if (userState.role === "regular") {
        if (userState.email !== userData.email) {
          return toast("You are not authorized!", { type: "warning" });
        }

        const response = await deleteUserService();
        if (response.data.message) {
          return toast(response.data.message, { type: "warning" });
        }

        localStorage.clear();
        toast(response.data.success, { type: "info" });
        return setTimeout(() => {
          navigate("/");
          dispatch(remove_user());
        }, 1500);
      }

      const { error } = getUsersSchema.validate(userId);
      if (error) {
        return toast(error.message, { type: "error" });
      }
      const response = await deleteManagerService(userId);
      if (response.data.message) {
        return toast(response.data.message, { type: "warning" });
      }

      if (response.data.email === userState.email) {
        localStorage.clear();
        dispatch(remove_user());
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
      return toast("Error!", { type: "error" });
    }
  };

  const generateUserCard = (userData) => {
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
              />
            </li>
            <li className="list-group-item">
              <label>Email</label>
              <input
                type={"text"}
                className="form-control"
                value={email}
                disabled={userState.role !== "manager"}
                onChange={(e) => setEmail(e.target.value)}
              />
            </li>
            {userState.id === userData.id && (
              <li className="list-group-item">
                <label>Password</label>
                <input
                  type={"password"}
                  className="form-control"
                  value={password}
                  placeholder="Enter your new password..."
                  onChange={(e) => setPassword(e.target.value)}
                />
              </li>
            )}

            {userState.role === "manager" && (
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
            )}

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
              {userData.reservations && userData.reservations.length > 0 && (
                <h4 className="text-center mt-4">
                  {userData.email === userState.email
                    ? "Your"
                    : userData.fullName}{" "}
                  Bike Reservations
                </h4>
              )}
              <div className="overflow-auto mt-2" style={{ maxHeight: "60vh" }}>
                {userData.reservations &&
                  userData.reservations.map((reservation) =>
                    reservationCard(reservation),
                  )}
              </div>
            </li>
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
      <NavBar user={userState && userState} />
      <ToastContainer />
      <div className="container mt-4">
        {userData && userState ? (
          generateUserCard(
            userState.email === userData.email ? userState : userData,
          )
        ) : (
          <Loader color={"primary"} />
        )}
      </div>
    </div>
  );
};

export default Profile;
