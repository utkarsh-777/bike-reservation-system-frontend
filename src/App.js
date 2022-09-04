import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import HomePage from "./Pages/Home/HomePage";
import LoginPage from "./Pages/Auth/LoginPage/LoginPage";
import SignupPage from "./Pages/Auth/SignupPage/SignupPage";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { user } from "./actions/userActions";

import AddBikes from "./Pages/Bikes/AddBikes/AddBikes";
import ViewBikes from "./Pages/Bikes/ViewBikes/ViewBikes";
import Profile from "./Pages/User/Profile/Profile";
import Users from "./Pages/User/Users/Users";
import RateReservation from "./Pages/RateReservation/RateReservation";
import ReserveBike from "./Pages/Bikes/ReserveBikes/ReserveBikes";
import NotFound from "./Pages/NotFound/NotFound";
import Bikes from "./Pages/Bikes/AllBikes/Bikes";
import { getUserService } from "./service/apis";

const Routing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const getUser = async (token) => {
    const response = await getUserService(token, navigate);
    if (response.data.message) {
      navigate("/");
      localStorage.clear();
      return toast(response.data.message, { type: "warning" });
    }
    dispatch(user(response.data));
    if (window.location.origin + "/" === window.location.href) {
      return navigate("/home");
    }
    return;
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUser(token);
    } else {
      localStorage.clear();
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Routes>
      <Route exact path="/" element={<LoginPage />} />
      <Route exact path="/signup" element={<SignupPage />} />
      <Route exact path="/reservations" element={<HomePage />} />
      <Route exact path="/reserve/:bikeId" element={<ReserveBike />} />
      <Route exact path="/home" element={<ViewBikes />} />
      <Route exact path="/profile/:userId" element={<Profile />} />
      <Route
        exact
        path="/rate-reservation/:reservationId"
        element={<RateReservation />}
      />
      {userState && userState.role === "manager" && (
        <>
          <Route exact path="/add/:addEntity" element={<AddBikes />} />
          <Route exact path="/users" element={<Users />} />
          <Route exact path="/bikes" element={<Bikes />} />
        </>
      )}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <Routing />
    </Router>
  );
};

export default App;
