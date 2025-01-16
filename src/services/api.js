import axios from 'axios';

const BASE_URL = 'https://66b1f8e71ca8ad33d4f5f63e.mockapi.io';

export const api = axios.create({
  baseURL: BASE_URL,
});

export const getCampers = async (params = {}) => {
  const response = await api.get('/campers', { params });
  return response.data;
};

export const getCamperById = async (id) => {
  const response = await api.get(`/campers/${id}`);
  return response.data;
};
