import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Axios from "../../../axios";
import NavBar from "../../../Components/common/Navbar/NavBar";
import {
  emailSchema,
  fullNameSchema,
  signUpPasswordSchema,
} from "../../../schemas/auth.schema";
import {
  addBikeSchema,
  addUserSchema,
  colorSchema,
  locationSchema,
  modelSchema,
} from "../../../schemas/bikes.schema";

const AddBikes = () => {
  const userState = useSelector((state) => state.user);
  const { addEntity } = useParams();
  const [model, setModel] = useState();
  const [color, setColor] = useState();
  const [location, setLocation] = useState();
  const [role, setRole] = useState("regular");
  const [availability, setAvailability] = useState(false);
  const navigate = useNavigate();

  const handleAddEntity = async () => {
    try {
      if (addEntity === "bikes") {
        const { error, value } = addBikeSchema.validate({
          model: model?.toUpperCase(),
          color: color,
          location,
          isAvailableAdmin: availability,
        });

        if (error) {
          return toast(error.message, { type: "info" });
        }

        Axios.post(`/manager/add-bike`, value, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
          .then((response) => {
            if (response.data.id) {
              setTimeout(() => {
                navigate("/bikes");
              }, 1500);
              return toast(`${value?.model} added successfully!`, {
                type: "success",
              });
            }
            return toast(response.data.message, { type: "default" });
          })
          .catch((err) => {
            console.log(err);
            return toast("Error!", { type: "error" });
          });
      } else {
        const data = {
          fullName: model,
          email: color?.toLowerCase(),
          password: location,
          role: role,
        };

        const { error, value } = addUserSchema.validate(data);
        if (error) {
          return toast(error.message, { type: "info" });
        }

        const response = await Axios.post("/manager/add-user", value, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        if (response.data.user) {
          setTimeout(() => {
            navigate("/users");
          }, 1500);
          return toast(`Succesfully added ${model}`, { type: "info" });
        }
        return toast(response.data.message, { type: "error" });
      }
    } catch (error) {
      console.log(error);
      return toast(error.response.data.message, { type: "error" });
    }
  };

  const generateStyle = (schema, value) => {
    const { error } = schema.validate(value);
    if (error === undefined) {
      return { border: "2px solid green" };
    }
    return { border: "2px solid red" };
  };

  return (
    <div>
      <ToastContainer />
      <NavBar user={userState} />
      <div className="container mt-4">
        <h4>Add {addEntity === "bikes" ? "Bikes" : "Users"}</h4>
        <label className="mt-4" htmlFor="input1">
          {addEntity === "bikes" ? "Model" : "Full Name"}
        </label>
        <input
          title="input1"
          className="form-control"
          type={"text"}
          style={generateStyle(
            addEntity === "bikes" ? modelSchema : fullNameSchema,
            model,
          )}
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder={addEntity === "bikes" ? "Model" : "Full Name"}
        />
        <label htmlFor="input2">
          {addEntity === "bikes" ? "Colour" : "Email"}
        </label>
        <input
          title="input2"
          className="form-control"
          type={addEntity === "bikes" ? "text" : "email"}
          value={color}
          style={generateStyle(
            addEntity === "bikes" ? colorSchema : emailSchema,
            color,
          )}
          placeholder={addEntity === "bikes" ? "Colour" : "Email"}
          onChange={(e) => setColor(e.target.value)}
        />
        <label htmlFor="input3">
          {addEntity === "bikes" ? "Location" : "Password"}
        </label>
        <input
          title="input3"
          className="form-control"
          type={addEntity === "bikes" ? "text" : "password"}
          value={location}
          style={generateStyle(
            addEntity === "bikes" ? locationSchema : signUpPasswordSchema,
            location,
          )}
          placeholder={addEntity === "bikes" ? "Location" : "Password"}
          onChange={(e) => setLocation(e.target.value)}
        />
        {addEntity === "users" ? (
          <div className="form-outline mb-3">
            <label className="form-label" htmlFor="form3Example4">
              Role
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              onChange={(e) => setRole(e.target.value)}
            >
              <option selected value="regular">
                REGULAR
              </option>
              <option value="manager">MANAGER</option>
            </select>
          </div>
        ) : (
          <div className="form-outline mb-3">
            <label className="form-label" htmlFor="input4">
              Availability
            </label>
            <div className="row">
              <div className="col-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  title="input4"
                  style={{ height: "2rem", width: "2rem" }}
                  checked={availability}
                  onClick={(e) => setAvailability(!availability)}
                />
              </div>
              <div className="col-11">
                <input
                  type={"text"}
                  className="form-control"
                  placeholder="Availability"
                  value={availability ? "Available" : "Not available"}
                />
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleAddEntity}
          className="btn btn-outline-primary mt-3"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddBikes;
