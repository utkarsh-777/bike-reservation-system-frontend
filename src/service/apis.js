import Axios from "../axios";
import { getHeaders } from "../util";

export const commonAPI = async (requestString) => {
  const response = await Axios.get(requestString, getHeaders());
  return response;
};

export const getBikeReservationsAPI = async (bikeId, page) => {
  const response = await Axios.get(
    `/reservation/bike/${bikeId}/${page}`,
    getHeaders(),
  );
  return response;
};

export const reserveBikeAPI = async (data) => {
  const response = await Axios.post(`/reservation`, { ...data }, getHeaders());
  return response;
};

export const getUserReservationsAPI = async (userId, page) => {
  const response = await Axios.get(
    `/reservation/user/${userId}/${page}`,
    getHeaders(),
  );
  return response;
};

export const getAllUsersAPI = async (page) => {
  const response = await Axios.get(`/user?page=${page}`, getHeaders());
  return response;
};

export const addBikeAPI = async (data) => {
  const response = await Axios.post("/bike", { ...data }, getHeaders());
  return response;
};

export const addUserAPI = async (data) => {
  const response = await Axios.post("/user", { ...data }, getHeaders());
  return response;
};

export const getAllBikesAPI = async (page) => {
  const response = await Axios.get(`/bike/all/${page}`, getHeaders());
  return response;
};

export const updateBikeAPI = async (id, data) => {
  const response = await Axios.put(`/bike/${id}`, { ...data }, getHeaders());
  return response;
};

export const deleteBikeAPI = async (id) => {
  const response = await Axios.delete(`/bike/${id}`, getHeaders());
  return response;
};

export const getBikeAPI = async (id) => {
  const response = await Axios.get(`/bike/${id}`, getHeaders());
  return response;
};

export const rateReservationAPI = async (id, data) => {
  const response = await Axios.patch(
    `/reservation/${id}/rate`,
    { ...data },
    getHeaders(),
  );
  return response;
};

export const cancelReservationAPI = async (id) => {
  const response = await Axios.patch(
    `/reservation/${id}/cancel`,
    {},
    getHeaders(),
  );
  return response;
};

export const getUserByIdAPI = async (id) => {
  const response = await Axios.get(`/user/${id}`, getHeaders());
  return response;
};

export const updateUserAPI = async (id, data) => {
  const response = await Axios.put(`/user/${id}`, { ...data }, getHeaders());
  return response;
};

export const deleteUserAPI = async (id) => {
  const response = await Axios.delete(`/user/${id}`, getHeaders());
  return response;
};
