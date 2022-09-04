import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import login from "../../../images/login.png";
import Footer from "../../../Components/common/Footer/Footer";
import Loader from "../../../Components/common/Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Axios from "../../../axios";
import { user } from "../../../actions/userActions";
import {
  emailSchema,
  loginSchema,
  passwordSchema,
} from "../../../schemas/auth.schema";

const LoginPage = () => {
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const data = { email: email?.toLowerCase(), password };
      const { error, value } = loginSchema.validate(data);

      if (error) {
        console.log(error);
        return toast(error.message, { type: "info" });
      }
      setLoading(true);
      const response = await Axios.post("/auth/login", {
        data: { ...value, email: value.email?.toLowerCase() },
      });

      if (response.data.token) {
        setLoading(false);
        localStorage.setItem("token", response.data.token);
        dispatch(user(response.data.user));
        setTimeout(() => {
          navigate("/home");
        }, 1500);
        return toast("Login successfull!", {
          type: "success",
        });
      } else {
        setLoading(false);
        return toast(response.data.message, { type: "error" });
      }
    } catch (error) {
      setLoading(false);
      return toast(error.response.data.message, { type: "error" });
    }
  };

  const handleChangeEmail = (email) => {
    setEmail(email);
    setEmailValid(validateEmail(email));
  };

  const handleChangePassword = (password) => {
    setPassword(password);
    setPasswordValid(validatePassword(password));
  };

  const validateEmail = (email) => {
    const { error } = emailSchema.validate(email);
    return error === undefined;
  };

  const validatePassword = (password) => {
    const { error } = passwordSchema.validate(password);
    return error === undefined;
  };

  return (
    <div>
      <ToastContainer />
      <section className="vh-100">
        <div className="container-fluid h-custom">
          <div className="text-center p-2 mt-4">
            <h2>Login</h2>
          </div>

          <div className="row d-flex justify-content-center align-items-center h-100 mt-5">
            <div className="col-md-9 text-center mb-md-0 mb-4 col-lg-6 col-xl-5">
              <img
                src={login}
                className="img-fluid"
                style={{ width: "15rem" }}
                alt="SampleImage"
              />
            </div>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <form>
                <label className="form-label" htmlFor="form3Example3">
                  Email address
                </label>
                <div className="form-outline mb-4">
                  {emailValid ? (
                    <input
                      type="email"
                      onChange={(e) => handleChangeEmail(e.target.value)}
                      value={email}
                      id="form3Example3"
                      className="form-control form-control-lg"
                      placeholder="Enter a valid email address"
                      style={{ border: "2px solid green" }}
                    />
                  ) : (
                    <input
                      type="email"
                      onChange={(e) => handleChangeEmail(e.target.value)}
                      value={email}
                      id="form3Example3"
                      className="form-control form-control-lg"
                      placeholder="Enter a valid email address"
                      style={{ border: "2px solid red" }}
                    />
                  )}
                </div>

                <div className="form-outline mb-3">
                  <label className="form-label" htmlFor="form3Example4">
                    Password
                  </label>
                  <input
                    type="password"
                    id="form3Example4"
                    value={password}
                    className="form-control form-control-lg"
                    placeholder="Enter password"
                    onChange={(e) => handleChangePassword(e.target.value)}
                    style={{
                      border: passwordValid
                        ? "2px solid green"
                        : "2px solid red",
                    }}
                  />
                </div>

                <div className="text-center text-lg-start mt-4 pt-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    style={{
                      paddingLeft: "2.5rem",
                      paddingRight: "2.5rem",
                      width: "10rem",
                      height: "3.5rem",
                    }}
                    onClick={handleSubmit}
                  >
                    {loading ? <Loader /> : "Login"}
                  </button>
                  <p className="small fw-bold mt-2 pt-1 mb-0">
                    Don't have an account?{" "}
                    <Link to="/signup" className="link-danger">
                      Register
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </div>
  );
};

export default LoginPage;
