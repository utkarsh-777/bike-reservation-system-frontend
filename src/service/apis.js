import { toast } from "react-toastify";
import Axios from "../axios";

export const getUserService = async (token, navigate) => {
  try {
    const response = await Axios.get(`/user`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return response;
  } catch (error) {
    console.log(error.response.data.message);
    toast(error.response.data.message, { type: "warning" });
    localStorage.clear();
    return setTimeout(() => {
      navigate("/");
    }, 1000);
  }
};

export const getUserByIdService = async (userId) => {
  try {
    const response = await Axios.get(`/manager/get-user-id/${userId}`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateUserProfileService = async (data) => {
  try {
    const response = await Axios.patch(`/user/update-user-profile`, data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateManagerProfileService = async (userId, data) => {
  try {
    const response = Axios.patch(`/manager/update-user/${userId}`, data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteUserService = async () => {
  try {
    const response = await Axios.delete(`/user/delete-user`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteManagerService = async (userId) => {
  try {
    const response = await Axios.delete(`/manager/delete-user/${userId}`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    });
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getAllUsersService = async (page) => {
  try {
    const response = await Axios.get(
      `/manager/get-user-with-reservations/${page}`,
      {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      },
    );
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};
