import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../../context/context";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Footer from "../../../Components/common/Footer/Footer";
import Loader from "../../../Components/common/Loader/Loader";
import signup from "../../../images/signup.png";
import Axios from "../../../axios";
import { user } from "../../../actions/userActions";
import {
  emailSchema,
  fullNameSchema,
  signUpPasswordSchema,
  signUpSchema,
} from "../../../schemas/auth.schema";
import { useCookies } from "react-cookie";

const Signup = () => {
  const [, setCookie] = useCookies(["user"]);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [fullNameValid, setFullNameValid] = useState(false);
  const [fullName, setFullName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);

  const handleSubmit = async () => {
    try {
      const data = { fullName, email: email?.toLowerCase(), password };
      const { error, value } = signUpSchema.validate(data);

      if (error) {
        return toast(error.message, { type: "info" });
      }

      setLoading(true);
      const response = await Axios.post("/user/signup", { ...value });
      if (response.data.token) {
        setTimeout(() => {
          navigate("/home");
        }, 2000);
        setLoading(false);
        localStorage.setItem("token", response.data.token);
        dispatch(user(response.data.user));
        setCookie("user", JSON.stringify(response.data.user));
        return toast("Signup successfull!", { type: "success" });
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

  const validatePassword = (password) => {
    const { error } = signUpPasswordSchema.validate(password);
    return error === undefined;
  };

  const validateEmail = (email) => {
    const { error } = emailSchema.validate(email);
    return error === undefined;
  };

  const handleFullName = (fullName) => {
    setFullName(fullName);
    const { error } = fullNameSchema.validate(fullName);
    setFullNameValid(error === undefined);
  };

  return (
    <div>
      <ToastContainer />
      <section className="vh-100">
        <div className="container-fluid h-custom">
          <div className="text-center p-2 mt-4">
            <h2>Signup</h2>
          </div>

          <div className="row d-flex justify-content-center align-items-center h-100 mt-5">
            <div className="col-md-9 col-lg-6 text-center mb-md-0 mb-4 col-xl-5">
              <img
                src={signup}
                className="img-fluid"
                style={{ width: "20rem" }}
                alt="SampleImage"
              />
            </div>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <form>
                <div className="form-outline mb-3">
                  <label className="form-label" htmlFor="form3Example1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="form3Example1"
                    value={fullName}
                    className="form-control form-control-lg"
                    placeholder="Enter Name"
                    style={{
                      border: !fullNameValid
                        ? "2px solid red"
                        : "2px solid green",
                    }}
                    onChange={(e) => handleFullName(e.target.value)}
                  />
                </div>

                <label className="form-label" htmlFor="form3Example3">
                  Email address
                </label>
                <div className="form-outline mb-4">
                  <input
                    type="email"
                    onChange={(e) => handleChangeEmail(e.target.value)}
                    value={email}
                    id="form3Example3"
                    className="form-control form-control-lg"
                    placeholder="Enter a valid email address"
                    style={{
                      border: !emailValid ? "2px solid red" : "2px solid green",
                    }}
                  />
                </div>

                <div className="form-outline mb-3">
                  <label className="form-label" htmlFor="form3Example4">
                    Password
                  </label>
                  <input
                    type="password"
                    id="form3Example4"
                    className="form-control form-control-lg"
                    placeholder="Enter password"
                    value={password}
                    style={{
                      border: !passwordValid
                        ? "2px solid red"
                        : "2px solid green",
                    }}
                    onChange={(e) => handleChangePassword(e.target.value)}
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
                    {loading ? <Loader /> : "Signup"}
                  </button>
                  <p className="small fw-bold mt-2 pt-1 mb-0">
                    Already have an account?{" "}
                    <Link to="/" className="link-danger">
                      Login
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

export default Signup;
