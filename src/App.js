import React, { useEffect, useReducer, useContext } from "react";
import { useCookies } from "react-cookie";
import { initialState, reducer } from "./context/reducer";
import { UserContext } from "./context/context";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import HomePage from "./Pages/Home/HomePage";
import LoginPage from "./Pages/Auth/LoginPage/LoginPage";
import SignupPage from "./Pages/Auth/SignupPage/SignupPage";
import { remove_user, user } from "./actions/userActions";

import AddBikes from "./Pages/Bikes/AddBikes/AddBikes";
import ViewBikes from "./Pages/Bikes/ViewBikes/ViewBikes";
import Profile from "./Pages/User/Profile/Profile";
import Users from "./Pages/User/Users/Users";
import ReserveBike from "./Pages/Bikes/ReserveBikes/ReserveBikes";
import NotFound from "./Pages/NotFound/NotFound";
import Bikes from "./Pages/Bikes/AllBikes/Bikes";
import NavBar from "./Components/common/Navbar/NavBar";

const Routing = () => {
  const [cookie, setCookie] = useCookies(["user"]);
  const { userState, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    const userData = cookie?.user;
    if (userData) {
      dispatch(user(userData));
    } else {
      setCookie("user", null);
      localStorage.clear();
      dispatch(remove_user());
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {window.location.origin + "/" !== window.location.href &&
        window.location.pathname !== "/signup" && <NavBar />}
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route exact path="/signup" element={<SignupPage />} />
        <Route exact path="/reservations" element={<HomePage />} />
        <Route exact path="/reserve/:bikeId" element={<ReserveBike />} />
        <Route exact path="/home" element={<ViewBikes />} />
        <Route exact path="/profile/:userId" element={<Profile />} />
        {userState && userState.role === "manager" && (
          <>
            <Route exact path="/add/:addEntity" element={<AddBikes />} />
            <Route exact path="/users" element={<Users />} />
            <Route exact path="/bikes" element={<Bikes />} />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  const [userState, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ userState, dispatch }}>
      <Router>
        <Routing />
      </Router>
    </UserContext.Provider>
  );
};

export default App;
